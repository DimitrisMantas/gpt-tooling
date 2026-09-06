#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "codex-agents");
const targetDir = path.join(os.homedir(), ".codex", "agents");
const supportedEfforts = new Set(["low", "medium", "high", "xhigh", "max", "ultra"]);

function scalar(source, key) {
  const match = source.match(new RegExp(`^${key}\\s*=\\s*"([^"]*)"\\s*$`, "m"));
  return match && match[1];
}

function readProfile(file) {
  const source = fs.readFileSync(file, "utf8");
  const instructions = source.match(/^developer_instructions\s*=\s*"""([\s\S]*?)"""\s*$/m);
  return {
    file,
    name: scalar(source, "name"),
    description: scalar(source, "description"),
    model: scalar(source, "model"),
    effort: scalar(source, "model_reasoning_effort"),
    sandbox: scalar(source, "sandbox_mode"),
    instructions: instructions && instructions[1].trim()
  };
}

function profiles(source) {
  const files = fs.readdirSync(source).filter((file) => file.endsWith(".toml")).sort();
  const parsed = files.map((file) => readProfile(path.join(source, file)));
  const names = new Set();

  for (const profile of parsed) {
    const stem = path.basename(profile.file, ".toml");
    if (!profile.name || !/^[a-z][a-z0-9_]*$/.test(profile.name)) throw new Error(`The agent name is invalid: ${profile.file}.`);
    if (profile.name !== stem) throw new Error(`The agent filename must match its name: ${profile.file}.`);
    if (names.has(profile.name)) throw new Error(`The agent name is duplicated: ${profile.name}.`);
    if (!profile.description || !profile.instructions) throw new Error(`The agent profile is incomplete: ${profile.file}.`);
    if (!supportedEfforts.has(profile.effort)) throw new Error(`The agent reasoning effort is unsupported: ${profile.effort}.`);
    if (profile.sandbox !== "read-only") throw new Error(`The agent must use the read-only sandbox: ${profile.name}.`);
    names.add(profile.name);
  }

  return parsed;
}

function install(source, target, force, write = console.log) {
  const validated = profiles(source);
  fs.mkdirSync(target, { recursive: true });

  for (const profile of validated) {
    const name = path.basename(profile.file);
    const destination = path.join(target, name);
    if (fs.existsSync(destination) && !force) {
      write(`The existing agent profile was not replaced: ${destination}.`);
      continue;
    }

    fs.copyFileSync(profile.file, destination);
    write(`The agent profile was installed: ${destination}.`);
  }
}

function selfTest() {
  const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), "plinth-"));
  const target = path.join(temporaryDir, "agents");

  try {
    const validated = profiles(sourceDir);
    if (validated.some((profile) => profile.model !== null)) throw new Error("Bundled reviewers must inherit model selection.");
    const expectedNames = ["plinth_claims", "plinth_code", "plinth_methods"];
    if (JSON.stringify(validated.map((profile) => profile.name)) !== JSON.stringify(expectedNames)) {
      throw new Error("The expected Plinth agent profiles are not present.");
    }
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
