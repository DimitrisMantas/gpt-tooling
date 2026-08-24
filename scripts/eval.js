#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const casesPath = path.join(root, "evals", "cases.json");
const model = "gpt-5.6";
const reasoningEffort = "high";
const tiers = ["smoke", "core", "extended"];
const expectedCounts = { smoke: 13, core: 19, extended: 21 };

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", windowsHide: true, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `${command} failed`).trim());
  return result.stdout.trim();
}

function codexCommand() {
  if (process.platform !== "win32") return { command: "codex", prefix: [] };
  const paths = run("where.exe", ["codex"]).split(/\r?\n/).filter(Boolean);
  const executable = paths.find((file) => /\.(?:exe|com)$/i.test(file));
  if (executable) return { command: executable, prefix: [] };
  const commandShim = paths.find((file) => /\.cmd$/i.test(file));
  const powerShellShim = commandShim && commandShim.replace(/\.cmd$/i, ".ps1");
  if (!powerShellShim || !fs.existsSync(powerShellShim)) throw new Error("The Codex command could not be resolved.");
  return { command: "powershell.exe", prefix: ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", powerShellShim] };
}

function cases() {
  const items = JSON.parse(fs.readFileSync(casesPath, "utf8"));
  if (!Array.isArray(items) || !items.length) throw new Error("The behavioral suite is empty.");
  const ids = new Set();
  for (const item of items) {
    if (!item.id || ids.has(item.id) || !tiers.includes(item.tier) || !item.prompt || !Array.isArray(item.criteria) || !item.criteria.length) {
      throw new Error(`The behavioral case is invalid: ${item.id || "unnamed"}.`);
    }
    for (const check of item.checks || []) {
      if (check.type !== "paragraph-count" || !Number.isInteger(check.equals) || check.equals < 1 || !check.description) {
        throw new Error(`The deterministic check is invalid: ${item.id}.`);
      }
    }
    ids.add(item.id);
  }
  for (const tier of tiers) {
    const actual = selectTier(items, tier).length;
    if (actual !== expectedCounts[tier]) throw new Error(`The ${tier} suite contains ${actual} cases; expected ${expectedCounts[tier]}.`);
  }
  return items;
}

function selectTier(items, tier) {
  const maximum = tiers.indexOf(tier);
  return items.filter((item) => tiers.indexOf(item.tier) <= maximum);
}

function selectCases(items, selector = "core") {
  if (tiers.includes(selector)) return selectTier(items, selector);
  const selected = items.find((item) => item.id === selector);
  if (!selected) throw new Error(`The behavioral suite or case does not exist: ${selector}.`);
  return [selected];
}

function execArguments(output, schema, cwd, clean) {
  const args = ["exec"];
  if (clean) args.push("--ignore-user-config", "--ignore-rules", "--disable", "hooks", "--disable", "plugins");
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
  const args = [...cli.prefix, ...execArguments(output, schema, cwd, clean), prompt];
  run(cli.command, args, { cwd });
  return fs.readFileSync(output, "utf8").trim();
}

function manifestVersion(name) {
  return JSON.parse(fs.readFileSync(path.join(root, "plugins", name, ".codex-plugin", "plugin.json"), "utf8")).version;
}

function requireInstalledToolkit() {
  const cli = codexCommand();
  const raw = run(cli.command, [...cli.prefix, "plugin", "list", "--available", "--json"]);
  const installed = JSON.parse(raw).installed;
  for (const name of ["plinth", "quire", "ponytail"]) {
    if (!installed.some((plugin) => plugin.name === name && plugin.marketplaceName === "gpt-tooling")) {
      throw new Error(`Install ${name} from the gpt-tooling marketplace before running behavioral evaluations.`);
    }
  }
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

function runSuite(selector = "core") {
  requireInstalledToolkit();
  const selected = selectCases(cases(), selector);
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

  const records = [];
  try {
    for (const item of selected) {
      const responsePath = path.join(temporary, `${item.id}-response.txt`);
      const graderPath = path.join(temporary, `${item.id}-grader.json`);
      const output = execCodex(item.prompt, responsePath, null, temporary);
      const checks = deterministicChecks(item, output);
      const gradingPrompt = [
        "Evaluate the candidate response against every semantic criterion below.",
        "Return pass only when all criteria are materially satisfied. Judge behavior and meaning, not exact wording.",
        "Mechanically observable requirements are evaluated separately and are intentionally omitted from these criteria.",
        "",
        `Prompt:\n${item.prompt}`,
        "",
        `Semantic criteria:\n${item.criteria.map((criterion) => `- ${criterion}`).join("\n")}`,
        "",
        `Candidate response:\n${output}`
      ].join("\n");
      const rawGrade = execCodex(gradingPrompt, graderPath, schema, temporary, true);
      const semanticGrade = JSON.parse(rawGrade);
      const pass = semanticGrade.pass && checks.every((check) => check.pass);
      records.push({
        id: item.id,
        tier: item.tier,
        prompt: item.prompt,
        semanticCriteria: item.criteria,
        output,
        deterministicChecks: checks,
        semanticGrader: {
          model,
          reasoningEffort,
          cleanContext: true,
          ignoredUserConfig: true,
          disabledFeatures: ["hooks", "plugins"],
          prompt: gradingPrompt,
          ...semanticGrade
        },
        pass
      });
      process.stdout.write(`${pass ? "PASS" : "FAIL"}: ${item.id}\n`);
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = path.join(root, "dist", "evals", `${stamp}.json`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify({
    createdAt: new Date().toISOString(),
    selection: selector,
    model,
    reasoningEffort,
    graderIsolation: {
      ignoredUserConfig: true,
      ignoredRules: true,
      disabledFeatures: ["hooks", "plugins"]
    },
    toolkit: {
      plinth: manifestVersion("plinth"),
      quire: manifestVersion("quire"),
      ponytailCommit: "2ed6c52c9d7e5e56942508591085fd45dea277d3"
    },
    cases: records
  }, null, 2)}\n`, "utf8");
  process.stdout.write(`The evaluation record was written to ${outputPath}.\n`);
  if (records.some((record) => !record.pass)) process.exitCode = 1;
}

function selfTest() {
  const items = cases();
  const paragraphCase = items.find((item) => item.id === "ponytail-does-not-govern-prose");
  if (!deterministicChecks(paragraphCase, "One.\n\nTwo.\n\nThree.\n\nFour.")[0].pass) throw new Error("The paragraph-count check rejected valid output.");
  if (deterministicChecks(paragraphCase, "One.\n\nTwo.\n\nThree.")[0].pass) throw new Error("The paragraph-count check accepted invalid output.");
  const cleanArgs = execArguments("output", "schema", root, true);
  for (const argument of ["--ignore-user-config", "--ignore-rules", "hooks", "plugins"]) {
    if (!cleanArgs.includes(argument)) throw new Error(`The clean grader context omits ${argument}.`);
  }
  const cli = codexCommand();
  run(cli.command, [...cli.prefix, "--version"]);
  process.stdout.write("The behavioral evaluation runner checks passed.\n");
}

const command = process.argv[2];
if (command === "test" && process.argv.length === 3) selfTest();
else if (command === "run" && process.argv.length <= 4) runSuite(process.argv[3]);
else {
  process.stderr.write("Usage: node scripts/eval.js test | run [smoke|core|extended|case-id]\n");
  process.exitCode = 2;
}

