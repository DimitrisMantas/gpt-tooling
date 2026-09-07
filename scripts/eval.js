#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const casesPath = path.join(root, "evals", "cases.json");
const model = process.env.GPT_TOOLING_EVAL_MODEL || "gpt-5.6-sol";
const reasoningEffort = "high";
const requiredCoverage = ["judgment", "evidence", "verification", "teaching", "software", "implementation", "hardware", "writing", "composition", "scope"];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", windowsHide: true, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `${command} failed`).trim());
  return result.stdout.trim();
}

function codexCommand(windowsPaths) {
  if (process.platform !== "win32" && !windowsPaths) return { command: "codex", prefix: [] };
  const paths = windowsPaths || run("where.exe", ["codex"]).split(/\r?\n/).filter(Boolean);
  const executable = paths.find((file) => /\.(?:exe|com)$/i.test(file));
  if (executable) return { command: executable, prefix: [] };
  const commandShim = paths.find((file) => /\.cmd$/i.test(file));
  const entrypoint = commandShim && path.join(path.dirname(commandShim), "node_modules", "@openai", "codex", "bin", "codex.js");
  if (!entrypoint || !fs.existsSync(entrypoint)) throw new Error("The Codex command requires a native executable or an npm installation.");
  // Windows PowerShell pipelines can replace non-ASCII prompt bytes; invoke the npm entrypoint directly.
  return { command: process.execPath, prefix: [entrypoint] };
}

function cases() {
  const items = JSON.parse(fs.readFileSync(casesPath, "utf8"));
  if (!Array.isArray(items) || !items.length) throw new Error("The behavioral suite is empty.");
  const ids = new Set();
  for (const item of items) {
    if (!item.id || ids.has(item.id) || !item.prompt || !Array.isArray(item.criteria) || !item.criteria.length || !Array.isArray(item.covers) || !item.covers.length || item.covers.some((area) => !requiredCoverage.includes(area))) {
      throw new Error(`The behavioral case is invalid: ${item.id || "unnamed"}.`);
    }
    for (const check of item.checks || []) {
      if (check.type !== "paragraph-count" || !Number.isInteger(check.equals) || check.equals < 1 || !check.description) {
        throw new Error(`The deterministic check is invalid: ${item.id}.`);
      }
    }
    ids.add(item.id);
  }
  for (const area of requiredCoverage) {
    if (!items.some((item) => item.covers.includes(area))) throw new Error(`The behavioral suite does not cover ${area}.`);
  }
  return items;
}

function execArguments(output, schema, cwd, clean) {
  const args = ["exec"];
  if (clean) args.push("--ignore-user-config", "--ignore-rules", "--disable", "hooks", "--disable", "plugins", "--config", "project_doc_max_bytes=0");
  args.push(
    "--ephemeral",
    "--skip-git-repo-check",
    "--sandbox",
    "read-only",
    "--model",
    model,
    "--config",
    `model_reasoning_effort=\"${reasoningEffort}\"`,
    "--cd",
    cwd,
    "--output-last-message",
    output
  );
  if (schema) args.push("--output-schema", schema);
  return args;
}

function execCodex(prompt, output, schema, cwd, clean = false) {
  const cli = codexCommand();
  const args = [...cli.prefix, ...execArguments(output, schema, cwd, clean)];
  run(cli.command, args, { cwd, input: prompt });
  return fs.readFileSync(output, "utf8").trim();
}

function manifestVersion(name) {
  return JSON.parse(fs.readFileSync(path.join(root, "plugins", name, ".codex-plugin", "plugin.json"), "utf8")).version;
}

function deterministicChecks(item, output) {
  return (item.checks || []).map((check) => {
    const actual = output.trim().split(/\r?\n[ \t]*\r?\n+/).filter((paragraph) => paragraph.trim()).length;
    return {
      type: check.type,
      description: check.description,
      expected: check.equals,
      actual,
      pass: actual === check.equals
    };
  });
}

function localPolicy(temporary) {
  const destination = path.join(temporary, "toolkit");
  for (const name of ["plinth", "quire"]) {
    fs.cpSync(path.join(root, "plugins", name, "skills"), path.join(destination, name, "skills"), { recursive: true });
  }
  const ponytail = path.join(destination, "ponytail");
  for (const file of [".codex-plugin/plugin.json", "hooks/ponytail-instructions.js", "hooks/ponytail-runtime.js", "skills/ponytail/SKILL.md", "tests/hooks.test.js"]) {
    const target = path.join(ponytail, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, "plugins", "ponytail", file), target);
  }
  require("./prepare-ponytail.js").apply(ponytail);
  const hashes = {};
  for (const file of fs.readdirSync(destination, { recursive: true }).sort()) {
    const target = path.join(destination, file);
    if (fs.statSync(target).isFile()) hashes[file] = require("crypto").createHash("sha256").update(fs.readFileSync(target)).digest("hex");
  }
  const policyFiles = Object.keys(hashes).filter((file) => {
    const relative = file.replaceAll("\\", "/");
    return /^(plinth|quire)\/skills\/\1\/(SKILL\.md|references\/.*\.md)$/.test(relative)
      || relative === "ponytail/skills/ponytail/SKILL.md";
  });
  const prompt = [
    "Apply the complete local toolkit policy snapshot supplied below. These skills and references have already been loaded in this context; no file read is needed to load them. This evaluation tests policy composition, not discovery. Apply only task-relevant guidance. Quire starts in Automatic mode; honor an explicit mode in the task.",
    ...policyFiles.map((file) => `\nPolicy file: ${file}\n${fs.readFileSync(path.join(destination, file), "utf8")}`),
    "\nEnd of policy snapshot. Task follows:\n"
  ].join("\n");
  return { prompt, hashes };
}

function runSuite(outputDirectory, execute = execCodex, resumePath) {
  const selected = cases();
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "gpt-tooling-eval-"));
  const schema = path.join(temporary, "grader-schema.json");
  fs.writeFileSync(schema, JSON.stringify({
    type: "object",
    additionalProperties: false,
    required: ["pass", "rationale"],
    properties: {
      pass: { type: "boolean" },
      rationale: { type: "string" }
    }
  }), "utf8");

  const resumed = resumePath ? JSON.parse(fs.readFileSync(resumePath, "utf8")) : null;
  const records = resumed?.cases || [];
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = resumePath || path.join(outputDirectory, `${stamp}.json`);
  const report = resumed || {
    createdAt: new Date().toISOString(),
    selectedCases: selected.map((item) => item.id),
    status: "running",
    model,
    reasoningEffort,
    graderIsolation: {
      ignoredUserConfig: true,
      ignoredRules: true,
      agentDocumentByteLimit: 0,
      disabledFeatures: ["hooks", "plugins"]
    },
    toolkit: {
      plinth: manifestVersion("plinth"),
      quire: manifestVersion("quire"),
      ponytailCommit: "2ed6c52c9d7e5e56942508591085fd45dea277d3"
    },
    cases: records,
    graderChecks: []
  };
  if (resumed) {
    if (report.model !== model || report.reasoningEffort !== reasoningEffort || JSON.stringify(report.selectedCases) !== JSON.stringify(selected.map((item) => item.id))) {
      throw new Error("The checkpoint does not match the current behavioral suite configuration.");
    }
    if (records.some((record, index) => record.id !== selected[index]?.id) || records.slice(0, -1).some((record) => record.pass === null)) {
      throw new Error("The checkpoint case sequence is invalid.");
    }
    report.status = "running";
    delete report.error;
    report.resumedAt = [...(report.resumedAt || []), new Date().toISOString()];
  }
  function save() {
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(`${outputPath}.tmp`, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    fs.renameSync(`${outputPath}.tmp`, outputPath);
  }
  let policy;
  try {
    policy = localPolicy(temporary);
    if (resumed && JSON.stringify(report.candidatePolicy?.hashes) !== JSON.stringify(policy.hashes)) {
      throw new Error("The local policy changed after the checkpoint; continuing would mix policy versions.");
    }
    report.candidatePolicy = { source: "local-snapshot", delivery: "inline-stdin", hooksEnabled: false, hashes: policy.hashes };
    save();
    for (const [name, response, expected] of report.graderChecks.length ? [] : [
      ["supported", "The two quantities changed together; causation is not established.", true],
      ["unsupported", "The observation proves that the first quantity caused the second to change.", false]
    ]) {
      const prompt = `Judge this candidate against the criterion: preserve the observation that two quantities changed together without asserting causation. Return pass only if the candidate satisfies it. Candidate: ${response}`;
      const grade = JSON.parse(execute(prompt, path.join(temporary, `grader-${name}.json`), schema, temporary, true));
      report.graderChecks.push({ name, prompt, expected, grade, pass: grade.pass === expected && typeof grade.rationale === "string" });
      save();
    }
    if (report.graderChecks.some((check) => !check.pass)) throw new Error("The semantic grader failed its known-answer checks; behavioral results cannot establish a passing suite.");
    for (const [index, item] of selected.entries()) {
      let record = records[index];
      if (record && record.pass !== null) continue;
      report.activeCase = item.id;
      save();
      const graderPath = path.join(temporary, `${item.id}-grader.json`);
      if (!record) {
        const responsePath = path.join(temporary, `${item.id}-response.txt`);
        const output = execute(policy.prompt + item.prompt, responsePath, null, temporary, true);
        record = {
          id: item.id,
          covers: item.covers,
          prompt: item.prompt,
          semanticCriteria: item.criteria,
          output,
          deterministicChecks: deterministicChecks(item, output),
          pass: null
        };
        records.push(record);
        save();
      }
      const gradingPrompt = [
        "Evaluate the candidate response against every semantic criterion below.",
        "Return pass only when all criteria are materially satisfied. Judge behavior and meaning, not exact wording.",
        "Mechanically observable requirements are evaluated separately and are intentionally omitted from these criteria.",
        "Assess substantive compliance in context. Do not require stock phrases, a particular section order, or extra explanation unless the task or criterion requires that information. Organizing headings and conditional suggestions are not factual claims that work occurred. Return fail for a material omission or contradiction, and explain it specifically.",
        "",
        `Prompt:\n${item.prompt}`,
        "",
        `Semantic criteria:\n${item.criteria.map((criterion) => `- ${criterion}`).join("\n")}`,
        "",
        `Candidate response:\n${record.output}`
      ].join("\n");
      const rawGrade = execute(gradingPrompt, graderPath, schema, temporary, true);
      const semanticGrade = JSON.parse(rawGrade);
      if (typeof semanticGrade?.pass !== "boolean" || typeof semanticGrade.rationale !== "string") {
        throw new Error(`The semantic grade is invalid: ${item.id}.`);
      }
      const pass = semanticGrade.pass && record.deterministicChecks.every((check) => check.pass);
      Object.assign(record, {
        semanticGrader: {
          model,
          reasoningEffort,
          cleanContext: true,
          ignoredUserConfig: true,
          agentDocumentByteLimit: 0,
          disabledFeatures: ["hooks", "plugins"],
          prompt: gradingPrompt,
          ...semanticGrade
        },
        pass
      });
      save();
      process.stdout.write(`${pass ? "PASS" : "FAIL"}: ${item.id}\n`);
    }
    report.status = "completed";
    delete report.activeCase;
    save();
  } catch (error) {
    report.status = "error";
    report.error = error.message;
    save();
    throw error;
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
    if (fs.existsSync(outputPath)) process.stdout.write(`The evaluation record was written to ${outputPath}.\n`);
  }
  return { ...report, outputPath, pass: records.length === selected.length && records.every((record) => record.pass === true) };
}

function resumeSuite(checkpointPath, execute = execCodex) {
  return runSuite(path.dirname(checkpointPath), execute, checkpointPath);
}

function selfTest() {
  const items = cases();
  const paragraphCase = items.find((item) => item.id === "ponytail-does-not-govern-prose");
  if (!deterministicChecks(paragraphCase, "One.\n\nTwo.\n\nThree.\n\nFour.")[0].pass) throw new Error("The paragraph-count check rejected valid output.");
  if (deterministicChecks(paragraphCase, "One.\n\nTwo.\n\nThree.")[0].pass) throw new Error("The paragraph-count check accepted invalid output.");
  const cleanArgs = execArguments("output", "schema", root, true);
  for (const argument of ["--ignore-user-config", "--ignore-rules", "hooks", "plugins", "project_doc_max_bytes=0"]) {
    if (!cleanArgs.includes(argument)) throw new Error(`The clean grader context omits ${argument}.`);
  }
  const cli = codexCommand();
  run(cli.command, [...cli.prefix, "--version"]);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "gpt-tooling-policy-test-"));
  try {
    const policy = localPolicy(temporary);
    if (!Object.keys(policy.hashes).some((file) => file.endsWith("software.md"))) throw new Error("The local policy snapshot omits software policy.");
    for (const heading of ["# Plinth: Software", "# Plinth: Python", "# Ponytail", "# Quire"]) {
      if (!policy.prompt.includes(heading)) throw new Error(`The inline policy snapshot omits ${heading}.`);
    }
    const assert = require("assert/strict");
    const npmRoot = path.join(temporary, "npm with spaces");
    const entrypoint = path.join(npmRoot, "node_modules", "@openai", "codex", "bin", "codex.js");
    fs.mkdirSync(path.dirname(entrypoint), { recursive: true });
    fs.writeFileSync(entrypoint, "process.stdin.pipe(process.stdout);\n");
    const shim = codexCommand([path.join(npmRoot, "codex.cmd")]);
    const unicode = "measurement ±1 ms; change −2 ms; περιοχή; report’s evidence";
    assert.equal(run(shim.command, shim.prefix, { input: unicode }), unicode);
    assert.deepEqual(codexCommand(["codex.exe"]), { command: "codex.exe", prefix: [] });
    const outputDirectory = path.join(temporary, "results");
    process.stdout.write("Checking evaluation records with synthetic responses and grades.\n");
    let calls = 0;
    assert.throws(() => runSuite(outputDirectory, (prompt, _output, schema) => {
      if (prompt.startsWith("Judge this candidate")) return JSON.stringify({ pass: !prompt.includes("Candidate: The observation proves"), rationale: "Test grade" });
      calls += 1;
      if (calls === 4) {
        const checkpoint = JSON.parse(fs.readFileSync(path.join(outputDirectory, fs.readdirSync(outputDirectory)[0]), "utf8"));
        assert.equal(checkpoint.status, "running");
        assert.equal(checkpoint.cases[1].output, "Test response.");
        assert.equal(checkpoint.cases[1].pass, null);
        return '{"pass":"false","rationale":"Invalid boolean"}';
      }
      return schema ? '{"pass":true,"rationale":"Test grade"}' : "Test response.";
    }), /semantic grade is invalid/);
    const report = JSON.parse(fs.readFileSync(path.join(outputDirectory, fs.readdirSync(outputDirectory)[0]), "utf8"));
    assert.equal(report.status, "error");
    assert.equal(report.selectedCases.length, items.length);
    assert.equal(report.cases.length, 2);
    assert.equal(report.cases[0].pass, true);
    assert.equal(report.cases[1].pass, null);
    assert.equal(report.cases[1].output, "Test response.");
    assert.equal(report.activeCase, report.cases[1].id);
    assert.match(report.error, /semantic grade is invalid/);
    assert.ok(report.candidatePolicy.hashes);
    const resumedResult = resumeSuite(path.join(outputDirectory, fs.readdirSync(outputDirectory)[0]), (prompt, _output, schema) => {
      if (prompt.startsWith("Judge this candidate")) return JSON.stringify({ pass: !prompt.includes("Candidate: The observation proves"), rationale: "Test grade" });
      return schema ? '{"pass":true,"rationale":"Test grade"}' : "One.\n\nTwo.\n\nThree.\n\nFour.";
    });
    assert.equal(resumedResult.status, "completed");
    assert.equal(resumedResult.cases.length, items.length);
    assert.equal(resumedResult.cases.every((item) => item.pass === true), true);
    assert.equal(resumedResult.resumedAt.length, 1);
    const completedDirectory = path.join(temporary, "completed");
    const completeResult = runSuite(completedDirectory, (prompt, _output, schema) => {
      if (prompt.startsWith("Judge this candidate")) return JSON.stringify({ pass: !prompt.includes("Candidate: The observation proves"), rationale: "Test grade" });
      return schema ? '{"pass":true,"rationale":"Test grade"}' : "One.\n\nTwo.\n\nThree.\n\nFour.";
    });
    const completed = JSON.parse(fs.readFileSync(path.join(completedDirectory, fs.readdirSync(completedDirectory)[0]), "utf8"));
    assert.equal(completed.status, "completed");
    assert.equal(completed.activeCase, undefined);
    assert.equal(completed.cases[0].pass, true);
    assert.equal(completed.cases.length, items.length);
    assert.equal(completeResult.pass, true);
    assert.equal(completed.graderChecks.length, 2);
    assert.throws(() => runSuite(path.join(temporary, "bad-grader"), () => '{"pass":true,"rationale":"Always accepts"}'), /known-answer checks/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
  process.stdout.write("The behavioral evaluation runner checks passed.\n");
}

if (require.main === module) {
  if (process.argv[2] === "test" && process.argv.length === 3) selfTest();
  else {
    process.stderr.write("Run the complete test suite with: node scripts/test.js\n");
    process.exitCode = 2;
  }
}

module.exports = { runSuite, resumeSuite, selfTest, cases };
