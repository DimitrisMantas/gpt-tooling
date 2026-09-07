#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const evaluator = require("./eval");

const root = path.join(__dirname, "..");
const ponytail = path.join(root, "plugins", "ponytail");

function testFiles(directory) {
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".test.js")).sort();
  if (!files.length) throw new Error(`No tests found in ${directory}.`);
  return files.map((file) => path.join(directory, file));
}

function passed(report) {
  return report.status === "completed"
    && report.mechanical.length === report.expectedMechanical.length
    && report.expectedMechanical.every((name, index) => report.mechanical[index]?.name === name && report.mechanical[index].pass === true)
    && report.behavioral?.status === "completed"
    && report.behavioral.cases.length === report.expectedBehavioral.length
    && report.expectedBehavioral.every((id, index) => report.behavioral.cases[index]?.id === id && report.behavioral.cases[index].pass === true);
}

function selfTest() {
  const assert = require("assert/strict");
  const report = {
    status: "completed", expectedMechanical: ["check"], expectedBehavioral: ["case"],
    mechanical: [{ name: "check", pass: true }], behavioral: { status: "completed", cases: [{ id: "case", pass: true }] }
  };
  assert.equal(passed(report), true);
  for (const value of [false, null]) {
    report.behavioral.cases[0].pass = value;
    assert.equal(passed(report), false);
  }
  report.behavioral.cases = [];
  assert.equal(passed(report), false);
  report.behavioral.cases = [{ id: "wrong-case", pass: true }];
  assert.equal(passed(report), false);
  report.behavioral.cases[0].id = "case";
  report.mechanical[0].pass = false;
  assert.equal(passed(report), false);
  report.mechanical[0].pass = true;
  report.status = "running";
  assert.equal(passed(report), false);
}

function resumeReport(reportPath) {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  if (report.status !== "error") throw new Error("Only an interrupted test report can be continued.");
  const directory = path.dirname(reportPath);
  const checkpoints = fs.readdirSync(directory).filter((file) => /^\d{4}.*\.json$/.test(file));
  if (checkpoints.length !== 1) throw new Error("The test report does not identify exactly one behavioral checkpoint.");
  const checkpointPath = path.join(directory, checkpoints[0]);
  try {
    report.behavioral = evaluator.resumeSuite(checkpointPath);
    report.status = "completed";
    delete report.error;
  } catch (error) {
    report.status = "error";
    report.error = error.message;
    report.behavioral = JSON.parse(fs.readFileSync(checkpointPath, "utf8"));
  }
  report.pass = passed(report);
  fs.writeFileSync(`${reportPath}.tmp`, `${JSON.stringify(report, null, 2)}\n`);
  fs.renameSync(`${reportPath}.tmp`, reportPath);
  const checked = [...report.mechanical, ...(report.behavioral?.cases || [])];
  const passCount = checked.filter((item) => item.pass === true).length;
  const failCount = checked.filter((item) => item.pass === false).length;
  const incomplete = report.expectedMechanical.length + report.expectedBehavioral.length - passCount - failCount;
  process.stdout.write(`${report.pass ? "PASS" : "FAIL"}: continued suite; ${passCount} passed, ${failCount} failed, ${incomplete} incomplete.\n`);
  process.stdout.write(`Test record: ${reportPath}\n`);
  if (!report.pass) process.exitCode = 1;
  return report;
}

function main() {
  const outputRoot = path.join(root, "dist", "tests");
  fs.mkdirSync(outputRoot, { recursive: true });
  const directory = fs.mkdtempSync(path.join(outputRoot, `${new Date().toISOString().replace(/[:.]/g, "-")}-`));
  const node = process.execPath;
  const tasks = [
    ["suite-gate", node, ["-e", "require('./scripts/test').selfTest()"]],
    ["plinth-hooks", node, ["plugins/plinth/hooks/plinth.js", "test"]],
    ["quire-hooks", node, ["plugins/quire/hooks/quire.js", "test"]],
    ["reviewer-profiles", node, ["plugins/plinth/scripts/install-agents.js", "test"]],
    ["ponytail-compatibility", node, ["scripts/prepare-ponytail.js", "test"]],
    ["installer", node, ["scripts/install.js", "test"]],
    ["evaluation-runner", node, ["scripts/eval.js", "test"]],
    ["python-profile", "uv", ["run", "--script", "plugins/plinth/scripts/check-python-profile.py"]],
    ["ponytail-rules", node, ["scripts/check-rule-copies.js"], ponytail],
    ["ponytail-versions", node, ["scripts/check-versions.js"], ponytail],
    ["ponytail-runtime", "uv", ["run", "--no-project", "--python", "3.12", "--with", "pandas", node, "--test", "--test-reporter=tap", ...testFiles(path.join(ponytail, "tests"))], ponytail],
    ["ponytail-pi", node, ["--test", "--test-reporter=tap", ...testFiles(path.join(ponytail, "pi-extension", "test"))], ponytail],
    ["ponytail-mcp", node, ["--test", "--test-reporter=tap", ...testFiles(path.join(ponytail, "ponytail-mcp", "test"))], ponytail],
    ["ponytail-line-count", node, ["benchmarks/loc.test.js"], ponytail],
    ["ponytail-correctness", "uv", ["run", "--no-project", "--python", "3.12", "--with", "pandas", node, "benchmarks/correctness.test.js"], ponytail],
    ["release-roundtrip", node, ["scripts/release.js", "test"]]
  ];
  const report = {
    createdAt: new Date().toISOString(), status: "running", pass: false,
    runtime: { node: process.version, platform: process.platform, arch: process.arch },
    expectedMechanical: tasks.map(([name]) => name),
    expectedBehavioral: evaluator.cases().map((item) => item.id),
    mechanical: [], behavioral: null
  };
  const reportPath = path.join(directory, "report.json");
  function save() {
    fs.writeFileSync(`${reportPath}.tmp`, `${JSON.stringify(report, null, 2)}\n`);
    fs.renameSync(`${reportPath}.tmp`, reportPath);
  }
  save();
  process.stdout.write(`Test record: ${reportPath}\n`);
  const env = { ...process.env };
  for (const name of ["PLUGIN_ROOT", "CLAUDE_PLUGIN_ROOT", "PLUGIN_DATA", "CLAUDE_PLUGIN_DATA"]) delete env[name];
  for (const [name, command, args, cwd = root] of tasks) {
    const logPath = path.join(directory, `${name}.log`);
    const descriptor = fs.openSync(logPath, "w");
    let result;
    try {
      result = spawnSync(command, args, { cwd, env, windowsHide: true, stdio: ["ignore", descriptor, descriptor] });
    } finally {
      fs.closeSync(descriptor);
    }
    report.mechanical.push({ name, command, args, pass: !result.error && result.status === 0, exitCode: result.status, error: result.error?.message, logPath });
    save();
    process.stdout.write(`${report.mechanical.at(-1).pass ? "PASS" : "FAIL"}: ${name}\n`);
  }
  try {
    report.behavioral = evaluator.runSuite(directory);
    report.status = "completed";
  } catch (error) {
    report.status = "error";
    report.error = error.message;
    const checkpoint = fs.readdirSync(directory).find((file) => /^\d{4}.*\.json$/.test(file));
    if (checkpoint) report.behavioral = JSON.parse(fs.readFileSync(path.join(directory, checkpoint), "utf8"));
  }
  report.pass = passed(report);
  save();
  const checked = [...report.mechanical, ...(report.behavioral?.cases || [])];
  const passCount = checked.filter((item) => item.pass === true).length;
  const failCount = checked.filter((item) => item.pass === false).length;
  const incomplete = tasks.length + report.expectedBehavioral.length - passCount - failCount;
  process.stdout.write(`${report.pass ? "PASS" : "FAIL"}: complete suite; ${passCount} passed, ${failCount} failed, ${incomplete} incomplete. Mechanical entries are check groups; behavioral entries are cases.\n`);
  process.stdout.write(`Test record: ${reportPath}\n`);
  if (!report.pass) process.exitCode = 1;
}

if (require.main === module) {
  if (process.argv.length === 2) main();
  else {
    process.stderr.write("Usage: node scripts/test.js\n");
    process.exitCode = 2;
  }
}

module.exports = { selfTest, resumeReport };
