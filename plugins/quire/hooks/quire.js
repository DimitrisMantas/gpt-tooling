#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const root = process.env.PLUGIN_ROOT || process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, "..");
const dataDir = process.env.PLUGIN_DATA || process.env.CLAUDE_PLUGIN_DATA || path.join(os.tmpdir(), "quire");
const statePath = path.join(dataDir, "mode");
const skillPath = path.join(root, "skills", "quire", "SKILL.md");
const technicalPath = path.join(root, "skills", "quire", "references", "technical.md");
const modes = new Set(["auto", "standard", "technical"]);
const labels = { auto: "Automatic", standard: "Standard", technical: "Technical" };

function normalizeMode(mode) {
  const value = String(mode || "").trim().toLowerCase();
  return modes.has(value) ? value : "auto";
}

function readMode() {
  try {
    return normalizeMode(fs.readFileSync(statePath, "utf8"));
  } catch {
    return "auto";
  }
}

function writeMode(mode) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(statePath, mode, "utf8");
}

function instructions(mode) {
  const route = mode === "technical"
    ? `Use the Technical branch. If the extension at "${technicalPath}" has not been loaded in this agent context, read it before drafting.`
    : mode === "standard"
      ? "Use the Standard branch. Suppress automatic Technical routing until the mode changes."
      : `Select the branch from the artifact's function. Load the extension at "${technicalPath}" only for substantive scientific, research, empirical, methodological, or evidence-bearing technical work, or when technical reporting conventions govern the artifact.`;
  return [
    `Quire is active in ${labels[mode]} mode.`,
    "",
    `If the complete Quire skill at "${skillPath}" has not been loaded in this agent context, read it before producing substantive natural-language output.`,
    route,
    "Apply the same core writing principles across natural-language surfaces. Adapt structure, density, context, and final checks to the medium, audience, and operational purpose.",
    "Plinth governs technical meaning and decisions. Ponytail governs source-code implementation. Quire governs faithful natural-language expression."
  ].join("\n");
}

function emit(event, mode) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext: instructions(mode)
    }
  }));
}

function promptMode(prompt) {
  const normalized = String(prompt || "").trim().toLowerCase().replace(/[.!?]+$/, "");
  const selector = normalized.match(/\$quire-(auto|standard|technical)\b/);
  if (selector) return normalizeMode(selector[1]);
  const command = normalized.match(/^(?:[/@$]quire|quire)(?:\s+(auto|standard|technical))?$/);
  return command ? normalizeMode(command[1] || readMode()) : null;
}

function selectorMetadata(name, label) {
  const skill = path.join(root, "skills", name, "SKILL.md");
  const metadata = path.join(root, "skills", name, "agents", "openai.yaml");
  if (!fs.existsSync(skill) || !fs.existsSync(metadata)) throw new Error(`The ${label} selector is missing.`);
  const yaml = fs.readFileSync(metadata, "utf8");
  if (!yaml.includes(`display_name: "${label}"`) || !yaml.includes("allow_implicit_invocation: false")) {
    throw new Error(`The ${label} selector metadata is invalid.`);
  }
}

function selfTest() {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, ".codex-plugin", "plugin.json"), "utf8"));
  const hooks = JSON.parse(fs.readFileSync(path.join(root, "hooks", "hooks.json"), "utf8"));
  if (manifest.name !== "quire") throw new Error("The Quire manifest name is invalid.");
  if (!fs.existsSync(skillPath) || !fs.existsSync(technicalPath)) throw new Error("A required Quire policy file is missing.");
  if (normalizeMode("standard") !== "standard" || normalizeMode("unsupported") !== "auto") throw new Error("Mode normalization is invalid.");
  for (const mode of modes) {
    const context = instructions(mode);
    if (!context.includes(skillPath)) throw new Error(`The ${labels[mode]} mode omits the Quire skill route.`);
    if (context.length > 2000) throw new Error(`The ${labels[mode]} mode context is too large.`);
  }
  if (instructions("standard").includes(technicalPath)) throw new Error("Standard mode does not suppress the Technical route.");
  if (!instructions("technical").includes(technicalPath) || !instructions("auto").includes(technicalPath)) throw new Error("A Technical route is missing.");
  if (instructions("technical").includes(fs.readFileSync(technicalPath, "utf8").slice(0, 120))) throw new Error("The hook injects the Technical reference instead of routing to it.");
  if (promptMode("/quire auto") !== "auto" || promptMode("/quire standard") !== "standard" || promptMode("quire technical") !== "technical" || promptMode("$quire-auto") !== "auto" || promptMode("$quire-standard") !== "standard" || promptMode("$quire-technical") !== "technical" || promptMode("write a report") !== null) {
    throw new Error("Quire mode parsing is invalid.");
  }
  selectorMetadata("quire-auto", "Automatic");
  selectorMetadata("quire-standard", "Standard");
  selectorMetadata("quire-technical", "Technical");
  for (const event of ["SessionStart", "SubagentStart", "UserPromptSubmit"]) {
    if (!hooks.hooks[event]) throw new Error(`The ${event} hook is missing.`);
  }
  process.stdout.write("The Quire hook checks passed.\n");
}

const command = process.argv[2];

if (command === "test") {
  selfTest();
} else if (command === "inject") {
  emit(process.argv[3] || "SessionStart", readMode());
} else if (command === "prompt") {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { input += chunk; });
  process.stdin.on("end", () => {
    try {
      const payload = JSON.parse(input.replace(/^\uFEFF/, ""));
      const mode = promptMode(payload.prompt);
      if (!mode) return process.stdout.write("{}");
      writeMode(mode);
      emit("UserPromptSubmit", mode);
    } catch {
      process.stdout.write("{}");
    }
  });
} else {
  process.stderr.write("Usage: quire hook test | inject <event> | prompt\n");
  process.exitCode = 2;
}
