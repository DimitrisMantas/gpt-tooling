#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const ponytailCompatibility = require("./prepare-ponytail");

const root = path.join(__dirname, "..");
const marketplacePath = path.join(root, ".agents", "plugins", "marketplace.json");
const marketplaceName = "gpt-tooling";
const plugins = ["plinth", "quire", "ponytail"];
const localPlugins = ["plinth", "quire"];
const ponytailPath = path.join(root, "plugins", "ponytail");
const ponytailCommit = "2ed6c52c9d7e5e56942508591085fd45dea277d3";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", windowsHide: true, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `${command} failed`).trim());
  return result.stdout.trim();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function samePath(left, right) {
  const paths = [path.resolve(left), path.resolve(right)];
  return process.platform === "win32" ? paths[0].toLowerCase() === paths[1].toLowerCase() : paths[0] === paths[1];
}

function runCodex(args) {
  if (process.platform !== "win32") return run("codex", args);
  const paths = run("where.exe", ["codex"]).split(/\r?\n/).filter(Boolean);
  const executable = paths.find((file) => /\.(?:exe|com)$/i.test(file));
  if (executable) return run(executable, args);
  const commandShim = paths.find((file) => /\.cmd$/i.test(file));
  const entrypoint = commandShim && path.join(path.dirname(commandShim), "node_modules", "@openai", "codex", "bin", "codex.js");
  if (!entrypoint || !fs.existsSync(entrypoint)) throw new Error("The Codex command requires a native executable or an npm installation.");
  return run(process.execPath, [entrypoint, ...args]);
}

function verifyFiles() {
  const marketplace = readJson(marketplacePath);
  if (marketplace.name !== marketplaceName) throw new Error("The marketplace name is invalid.");
  for (const name of plugins) {
    const entry = marketplace.plugins.find((plugin) => plugin.name === name);
    if (!entry || entry.source.path !== `./plugins/${name}`) throw new Error(`The ${name} marketplace entry is invalid.`);
    const manifest = readJson(path.join(root, "plugins", name, ".codex-plugin", "plugin.json"));
    if (manifest.name !== name) throw new Error(`The ${name} plugin manifest is invalid.`);
  }
}

function verifyPonytail(initialize = false, execute = run) {
  const manifest = path.join(ponytailPath, ".codex-plugin", "plugin.json");
  if (fs.existsSync(path.join(root, ".git"))) {
    if (initialize) execute("git", ["submodule", "update", "--init", "--recursive", "--", "plugins/ponytail"]);
    const actual = execute("git", ["-C", ponytailPath, "rev-parse", "HEAD"]);
    if (actual !== ponytailCommit) throw new Error(`Ponytail is at ${actual}; expected ${ponytailCommit}.`);
  } else if (!fs.existsSync(manifest)) {
    throw new Error("This source archive does not contain the pinned Ponytail plugin. Use a complete release archive or clone with submodules.");
  }
  if (readJson(manifest).name !== "ponytail") throw new Error("The bundled Ponytail manifest does not match the pinned dependency.");
}

function marketplaces() {
  return JSON.parse(runCodex(["plugin", "marketplace", "list", "--json"])).marketplaces;
}

function addMarketplace() {
  const existing = marketplaces().find((marketplace) => marketplace.name === marketplaceName);
  if (existing && !samePath(existing.root, root)) {
    throw new Error(`The ${marketplaceName} marketplace already points to ${existing.root}. Remove that source before installing this checkout.`);
  }
  if (!existing) runCodex(["plugin", "marketplace", "add", root, "--json"]);
  const registered = marketplaces().find((marketplace) => marketplace.name === marketplaceName);
  if (!registered || !samePath(registered.root, root)) throw new Error(`The ${marketplaceName} marketplace does not point to this checkout.`);
}

function verifyInstalled(names) {
  const installed = JSON.parse(runCodex(["plugin", "list", "--json"])).installed;
  for (const name of names) {
    if (!installed.some((plugin) => plugin.name === name && plugin.marketplaceName === marketplaceName)) {
      throw new Error(`${name} was not installed from ${marketplaceName}.`);
    }
  }
}

function installPlugins(names) {
  for (const name of names) runCodex(["plugin", "add", `${name}@${marketplaceName}`, "--json"]);
  verifyInstalled(names);
}

function cachebuster(version, date = new Date()) {
  const base = String(version).split("+")[0];
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(base)) throw new Error(`The plugin version is not valid semantic versioning: ${version}.`);
  const stamp = date.toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
  return `${base}+codex.local-${stamp}`;
}

function refreshCachebusters(date = new Date()) {
  for (const name of localPlugins) {
    const file = path.join(root, "plugins", name, ".codex-plugin", "plugin.json");
    const manifest = readJson(file);
    manifest.version = cachebuster(manifest.version, date);
    fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }
}

function initialInstall() {
  verifyPonytail(true);
  verifyFiles();
  addMarketplace();
  const applied = ponytailCompatibility.apply(ponytailPath);
  try {
    installPlugins(plugins);
  } finally {
    if (applied) ponytailCompatibility.reverse(ponytailPath);
  }
  process.stdout.write("GPT Tooling is installed. Review and trust its hooks, then start a new thread.\n");
}

function updateLocalPlugins() {
  verifyPonytail();
  verifyFiles();
  addMarketplace();
  refreshCachebusters();
  installPlugins(localPlugins);
  process.stdout.write("Plinth and Quire were updated from this checkout. Start a new thread to load the updated policies.\n");
}

function selfTest() {
  verifyPonytail();
  verifyFiles();
  if (fs.existsSync(path.join(root, ".git"))) {
    const assert = require("assert/strict");
    const calls = [];
    verifyPonytail(false, (command, args) => {
      calls.push([command, args]);
      return ponytailCommit;
    });
    assert.deepEqual(calls, [["git", ["-C", ponytailPath, "rev-parse", "HEAD"]]]);
    assert.throws(() => verifyPonytail(false, () => "wrong-commit"), /expected/);
  }
  const fixed = new Date("2026-08-24T13:01:00.000Z");
  if (cachebuster("1.2.3", fixed) !== "1.2.3+codex.local-20260824-130100") throw new Error("Cachebuster creation is invalid.");
  if (cachebuster("1.2.3+old", fixed) !== "1.2.3+codex.local-20260824-130100") throw new Error("Cachebuster replacement is invalid.");
  JSON.parse(runCodex(["plugin", "marketplace", "list", "--json"]));
  process.stdout.write("The GPT Tooling installer checks passed.\n");
}

const command = process.argv[2];

if (!command) initialInstall();
else if (command === "test") selfTest();
else if (command === "update") updateLocalPlugins();
else {
  process.stderr.write("Usage: node scripts/install.js [test|update]\n");
  process.exitCode = 2;
}
