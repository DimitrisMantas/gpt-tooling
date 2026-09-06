#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const patchPath = path.join(root, "patches", "ponytail-gpt-tooling.patch");
const defaultPonytail = path.join(root, "plugins", "ponytail");
const files = [
  ".codex-plugin/plugin.json",
  "hooks/ponytail-instructions.js",
  "hooks/ponytail-runtime.js",
  "skills/ponytail/SKILL.md",
  "tests/hooks.test.js"
];

function git(args, cwd, allowFailure = false) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) throw new Error((result.stderr || result.stdout || "Git failed.").trim());
  return result;
}

function patched(ponytail) {
  const manifest = JSON.parse(fs.readFileSync(path.join(ponytail, ".codex-plugin", "plugin.json"), "utf8"));
  const skill = fs.readFileSync(path.join(ponytail, "skills", "ponytail", "SKILL.md"), "utf8");
  const fallback = fs.readFileSync(path.join(ponytail, "hooks", "ponytail-instructions.js"), "utf8");
  const runtime = fs.readFileSync(path.join(ponytail, "hooks", "ponytail-runtime.js"), "utf8");
  return manifest.version === "4.9.0+gpt-tooling.1"
    && !skill.includes("Code first. Then at most three short lines")
    && !fallback.includes("Code first. Then at most three short lines")
    && !runtime.includes("systemMessage: `PONYTAIL:");
}

function apply(ponytail = defaultPonytail) {
  if (patched(ponytail)) return false;
  const check = git(["apply", "--check", patchPath], ponytail, true);
  if (check.status !== 0) throw new Error((check.stderr || "The Ponytail compatibility patch does not apply cleanly.").trim());
  git(["apply", patchPath], ponytail);
  if (!patched(ponytail)) throw new Error("The Ponytail compatibility patch did not establish the composition boundary.");
  return true;
}

function reverse(ponytail = defaultPonytail) {
  if (!patched(ponytail)) return false;
  const check = git(["apply", "--reverse", "--check", patchPath], ponytail, true);
  if (check.status !== 0) throw new Error((check.stderr || "The Ponytail compatibility patch cannot be reversed cleanly.").trim());
  git(["apply", "--reverse", patchPath], ponytail);
  return true;
}

function selfTest() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "gpt-tooling-ponytail-"));
  try {
    for (const name of files) {
      const destination = path.join(temporary, name);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(path.join(defaultPonytail, name), destination);
    }
    if (patched(temporary)) {
      if (apply(temporary) || !patched(temporary)) throw new Error("The compatibility patch is not idempotent.");
    } else {
      if (!apply(temporary) || !patched(temporary)) throw new Error("The compatibility patch was not applied in the test copy.");
      if (apply(temporary)) throw new Error("The compatibility patch is not idempotent.");
      if (!reverse(temporary) || patched(temporary)) throw new Error("The compatibility patch was not reversed in the test copy.");
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
  process.stdout.write("The Ponytail compatibility checks passed.\n");
}

if (require.main === module) {
  if (process.argv[2] === "test") selfTest();
  else {
    process.stderr.write("Usage: node scripts/prepare-ponytail.js test\n");
    process.exitCode = 2;
  }
}

module.exports = { apply, patched, reverse };
