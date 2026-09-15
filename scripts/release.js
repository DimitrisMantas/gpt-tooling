#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const ponytailCompatibility = require("./prepare-ponytail");

const root = path.join(__dirname, "..");
const ponytailSource = path.join(root, "plugins", "ponytail");
const ponytailCommit = "2ed6c52c9d7e5e56942508591085fd45dea277d3";

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `${command} failed`).trim());
  return result.stdout.trim();
}

function lines(value) {
  return value.split(/\r?\n/).filter(Boolean);
}

function copyTracked(sourceRoot, destinationRoot, names) {
  for (const name of names) {
    const source = path.join(sourceRoot, name);
    const destination = path.join(destinationRoot, name);
    if (!fs.existsSync(source)) continue;
    if (!fs.statSync(source).isFile()) continue;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
}

function rootFiles() {
  return lines(run("git", ["ls-files", "--cached", "--others", "--exclude-standard"]))
    .filter((name) => name !== "plugins/ponytail" && !name.startsWith("plugins/ponytail/"));
}

function ponytailFiles() {
  return lines(run("git", ["ls-files"], ponytailSource));
}

function assertReleaseState() {
  if (run("git", ["status", "--porcelain"])) throw new Error("Release creation requires a clean worktree.");
  const ponytailHead = run("git", ["-C", ponytailSource, "rev-parse", "HEAD"]);
  if (ponytailHead !== ponytailCommit) throw new Error(`Ponytail is at ${ponytailHead}; expected ${ponytailCommit}.`);
  if (run("git", ["-C", ponytailSource, "status", "--porcelain"])) throw new Error("The Ponytail submodule is not clean.");
  const upstream = run("git", ["rev-parse", "--symbolic-full-name", "@{upstream}"]);
  const [behind, ahead] = run("git", ["rev-list", "--left-right", "--count", "@{upstream}...HEAD"]).split(/\s+/).map(Number);
  if (behind || ahead) throw new Error(`Release creation requires the branch and its upstream to match. Behind: ${behind}; ahead: ${ahead}.`);
  const parsed = upstream.match(/^refs\/remotes\/([^/]+)\/(.+)$/);
  if (!parsed) throw new Error(`The upstream reference cannot be resolved to a remote branch: ${upstream}.`);
  const remoteHead = run("git", ["ls-remote", "--exit-code", parsed[1], `refs/heads/${parsed[2]}`]).split(/\s+/)[0];
  const rootHead = run("git", ["rev-parse", "HEAD"]);
  if (remoteHead !== rootHead) throw new Error("Release creation requires HEAD to be present on the configured remote branch.");
}

function assemble(destination) {
  fs.mkdirSync(destination, { recursive: true });
  copyTracked(root, destination, rootFiles());
  copyTracked(ponytailSource, path.join(destination, "plugins", "ponytail"), ponytailFiles());
  ponytailCompatibility.apply(path.join(destination, "plugins", "ponytail"));
}

function walk(directory) {
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    found.push(file);
    if (entry.isDirectory()) found.push(...walk(file));
  }
  return found;
}

function validate(destination) {
  const files = walk(destination);
  if (files.some((file) => path.basename(file) === ".git")) throw new Error("The assembled release contains Git metadata.");
  const required = [
    ".agents/plugins/marketplace.json",
    "plugins/plinth/.codex-plugin/plugin.json",
    "plugins/quire/.codex-plugin/plugin.json",
    "plugins/ponytail/.codex-plugin/plugin.json",
    "scripts/install.js"
  ];
  for (const name of required) {
    if (!fs.existsSync(path.join(destination, name))) throw new Error(`The assembled release is missing ${name}.`);
  }
  for (const file of files.filter((name) => name.endsWith(".json"))) JSON.parse(fs.readFileSync(file, "utf8"));
  const checks = [
    ["node", ["-e", "require('./scripts/test').selfTest()"]],
    ["node", ["plugins/plinth/hooks/plinth.js", "test"]],
    ["node", ["plugins/plinth/scripts/install-agents.js", "test"]],
    ["node", ["plugins/quire/hooks/quire.js", "test"]],
    ["node", ["scripts/prepare-ponytail.js", "test"]],
    ["node", ["scripts/install.js", "test"]],
    ["node", ["scripts/eval.js", "test"]],
    ["node", ["plugins/ponytail/tests/hooks.test.js"]]
  ];
  for (const [command, args] of checks) run(command, args, destination);
}

function createArchive(stage, output) {
  run("git", ["init", "--quiet"], stage);
  run("git", ["add", "--all"], stage);
  run("git", ["-c", "user.name=GPT Tooling", "-c", "user.email=gpt-tooling@invalid", "commit", "--quiet", "-m", "Assemble release"], stage);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  run("git", ["archive", "--format=zip", "--prefix=gpt-tooling/", `--output=${output}`, "HEAD"], stage);

  const listing = lines(run("tar", ["-tf", output]));
  if (!listing.length || listing.some((name) => !name.startsWith("gpt-tooling/") || /(^|\/)\.git(?:\/|$)/.test(name))) {
    throw new Error("The release archive layout is invalid.");
  }

  const verification = fs.mkdtempSync(path.join(os.tmpdir(), "gpt-tooling-archive-"));
  try {
    run("tar", ["-xf", output, "-C", verification]);
    validate(path.join(verification, "gpt-tooling"));
  } finally {
    fs.rmSync(verification, { recursive: true, force: true });
  }
}

function main(testOnly) {
  if (testOnly && !fs.existsSync(path.join(root, ".git"))) {
    validate(root);
    process.stdout.write("The extracted release product checks passed.\n");
    return;
  }
  if (!testOnly) assertReleaseState();
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "gpt-tooling-release-"));
  const stage = path.join(temporary, "gpt-tooling");
  try {
    assemble(stage);
    validate(stage);
    if (testOnly) {
      createArchive(stage, path.join(temporary, "gpt-tooling.zip"));
      process.stdout.write("The release assembly and archive checks passed.\n");
    }
    else {
      const output = path.join(root, "dist", "gpt-tooling.zip");
      createArchive(stage, output);
      process.stdout.write(`The release archive was created: ${output}.\n`);
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

if (process.argv.length === 2) main(false);
else if (process.argv.length === 3 && process.argv[2] === "test") main(true);
else {
  process.stderr.write("Usage: node scripts/release.js [test]\n");
  process.exitCode = 2;
}
