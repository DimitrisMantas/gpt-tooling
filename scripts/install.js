#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const marketplacePath = path.join(root, ".agents", "plugins", "marketplace.json");
const marketplaceName = "personal-engineering-tooling";
const plugins = ["plinth", "quire", "ponytail"];
const predecessors = ["engineering", "engineering-partner", "engineer", "writing", "writer"];
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
  const executable = paths.find(file => /\.(?:exe|com)$/i.test(file));
  if (executable) return run(executable, args);
  const commandShim = paths.find(file => /\.cmd$/i.test(file));
  const powerShellShim = commandShim && commandShim.replace(/\.cmd$/i, ".ps1");
  if (!powerShellShim || !fs.existsSync(powerShellShim)) throw new Error("The Codex command could not be resolved to a Windows executable or PowerShell shim.");
  return run("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", powerShellShim, ...args]);
}

function verifyFiles() {
  const marketplace = readJson(marketplacePath);
  if (marketplace.name !== marketplaceName) throw new Error("The marketplace name is invalid.");
  for (const name of plugins) {
    const entry = marketplace.plugins.find(plugin => plugin.name === name);
    if (!entry || entry.source.path !== `./plugins/${name}`) throw new Error(`The ${name} marketplace entry is invalid.`);
    const manifest = readJson(path.join(root, "plugins", name, ".codex-plugin", "plugin.json"));
    if (manifest.name !== name) throw new Error(`The ${name} plugin manifest is invalid.`);
  }
}

function initializePonytail() {
  const manifest = path.join(root, "plugins", "ponytail", ".codex-plugin", "plugin.json");
  if (fs.existsSync(path.join(root, ".git"))) {
    run("git", ["submodule", "update", "--init", "--recursive", "--", "plugins/ponytail"]);
    const actual = run("git", ["-C", path.join(root, "plugins", "ponytail"), "rev-parse", "HEAD"]);
    if (actual !== ponytailCommit) throw new Error(`Ponytail is at ${actual}; expected ${ponytailCommit}.`);
  } else if (!fs.existsSync(manifest)) {
    throw new Error("This source archive does not contain the pinned Ponytail plugin. Use a complete release archive or clone with submodules.");
  }
  const ponytail = readJson(manifest);
  if (ponytail.name !== "ponytail" || ponytail.version !== "4.9.0") throw new Error("The bundled Ponytail manifest does not match the pinned dependency.");
}

function addMarketplace() {
  const marketplaces = JSON.parse(runCodex(["plugin", "marketplace", "list", "--json"])).marketplaces;
  const existing = marketplaces.find(marketplace => marketplace.name === marketplaceName);
  if (existing && !samePath(existing.root, root)) {
    throw new Error(`The ${marketplaceName} marketplace already points to ${existing.root}. Remove that source before installing this checkout.`);
  }
  if (!existing) runCodex(["plugin", "marketplace", "add", root, "--json"]);
}

function installPlugins() {
  for (const name of plugins) runCodex(["plugin", "add", `${name}@${marketplaceName}`, "--json"]);
  const installed = JSON.parse(runCodex(["plugin", "list", "--available", "--json"])).installed;
  for (const name of plugins) {
    if (!installed.some(plugin => plugin.name === name && plugin.marketplaceName === marketplaceName)) {
      throw new Error(`${name} was not installed from ${marketplaceName}.`);
    }
  }
  const duplicates = installed.filter(plugin => predecessors.includes(plugin.name) || (plugins.includes(plugin.name) && plugin.marketplaceName !== marketplaceName));
  if (duplicates.length) {
    process.stdout.write(`The toolkit is installed. Disable or remove these predecessor or duplicate plugins before starting a new thread: ${duplicates.map(plugin => plugin.pluginId).join(", ")}.\n`);
  } else {
    process.stdout.write("The personal engineering toolkit is installed. Review and trust its hooks, then start a new thread.\n");
  }
}

function selfTest() {
  initializePonytail();
  verifyFiles();
  JSON.parse(runCodex(["plugin", "marketplace", "list", "--json"]));
  process.stdout.write("The personal engineering toolkit installer checks passed.\n");
}

if (process.argv[2] === "test") {
  selfTest();
} else if (process.argv.length === 2) {
  initializePonytail();
  verifyFiles();
  addMarketplace();
  installPlugins();
} else {
  process.stderr.write("Usage: node scripts/install.js [test]\n");
  process.exitCode = 2;
}
