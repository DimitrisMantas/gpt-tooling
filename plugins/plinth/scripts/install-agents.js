#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "codex-agents");
const targetDir = path.join(os.homedir(), ".codex", "agents");

function install(source, target, force, write = console.log) {
  fs.mkdirSync(target, { recursive: true });

  for (const name of fs.readdirSync(source).filter((file) => file.endsWith(".toml")).sort()) {
    const destination = path.join(target, name);
    if (fs.existsSync(destination) && !force) {
      write(`The existing agent profile was not replaced: ${destination}.`);
      continue;
    }

    fs.copyFileSync(path.join(source, name), destination);
    write(`The agent profile was installed: ${destination}.`);
  }
}

function selfTest() {
  const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), "plinth-"));
  const target = path.join(temporaryDir, "agents");

  try {
    install(sourceDir, target, false, () => {});
    const expected = fs.readdirSync(sourceDir).filter((file) => file.endsWith(".toml")).sort();
    const actual = fs.readdirSync(target).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("The installer omitted a profile.");

    const sentinel = "existing profile\n";
    fs.writeFileSync(path.join(target, expected[0]), sentinel);
    install(sourceDir, target, false, () => {});
    if (fs.readFileSync(path.join(target, expected[0]), "utf8") !== sentinel) {
      throw new Error("The installer replaced a profile without --force.");
    }

    install(sourceDir, target, true, () => {});
    if (fs.readFileSync(path.join(target, expected[0]), "utf8") === sentinel) {
      throw new Error("The installer did not replace a profile with --force.");
    }
  } finally {
    fs.rmSync(temporaryDir, { recursive: true, force: true });
  }

  process.stdout.write("Agent installer checks passed.\n");
}

const args = process.argv.slice(2);

if (args.includes("--help")) {
  process.stdout.write("Usage: node scripts/install-agents.js [--force]\n");
} else if (args.length === 1 && args[0] === "test") {
  selfTest();
} else if (args.every((arg) => arg === "--force") && args.length <= 1) {
  install(sourceDir, targetDir, args.includes("--force"));
} else {
  process.stderr.write("Usage: node scripts/install-agents.js [--force]\n");
  process.exitCode = 2;
}
