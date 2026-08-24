#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const root = process.env.PLUGIN_ROOT || process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, "..");
const dataDir = process.env.PLUGIN_DATA || process.env.CLAUDE_PLUGIN_DATA || path.join(os.tmpdir(), "writer");
const statePath = path.join(dataDir, "mode");
const skillPath = path.join(root, "skills", "writer", "SKILL.md");
const technicalPath = path.join(root, "skills", "writer", "references", "technical-writing.md");
const modes = new Set(["auto", "base", "technical"]);

function normalizeMode(mode) {
  const value = String(mode || "").trim().toLowerCase();
  if (value === "everyday") return "base";
  if (value === "scientific") return "technical";
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
    ? `Use the technical branch. If the extension at "${technicalPath}" has not been loaded in this agent context, read it before drafting.`
    : mode === "base"
      ? "Use the base branch. Suppress automatic technical routing until the mode changes."
      : `Select the branch from the artifact's function. Load the extension at "${technicalPath}" only for substantive scientific, research, empirical, methodological, or evidence-bearing technical work, or when technical reporting conventions govern the artifact.`;
  return [
    `WRITER POLICY ACTIVE | mode: ${mode}`,
    "",
    `If the complete Writer skill at "${skillPath}" has not been loaded in this agent context, read it before producing substantive natural-language output.`,
    route,
    "Apply the same core writing principles across natural-language surfaces. Adapt structure, density, context, and final checks to the medium, audience, and operational purpose.",
    "Engineer governs technical meaning and decisions. Ponytail governs source-code implementation. Writer governs faithful natural-language expression."
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
  const match = normalized.match(/^(?:[/@$]writer|writer)(?:\s+(auto|base|technical))?$/);
  return match ? normalizeMode(match[1] || readMode()) : null;
}

function selfTest() {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, ".codex-plugin", "plugin.json"), "utf8"));
  const hooks = JSON.parse(fs.readFileSync(path.join(root, "hooks", "hooks.json"), "utf8"));
  if (manifest.name !== "writer") throw new Error("The Writer manifest name is invalid.");
  if (!fs.existsSync(skillPath) || !fs.existsSync(technicalPath)) throw new Error("A required Writer policy file is missing.");
  if (normalizeMode("everyday") !== "base" || normalizeMode("scientific") !== "technical") throw new Error("Legacy mode migration is invalid.");
  for (const mode of modes) {
    const context = instructions(mode);
    if (!context.includes(skillPath)) throw new Error(`The ${mode} mode omits the Writer skill route.`);
    if (context.length > 2000) throw new Error(`The ${mode} mode context is too large.`);
  }
  if (instructions("base").includes(technicalPath)) throw new Error("Base mode does not suppress the technical route.");
  if (!instructions("technical").includes(technicalPath) || !instructions("auto").includes(technicalPath)) throw new Error("A technical route is missing.");
  if (instructions("technical").includes(fs.readFileSync(technicalPath, "utf8").slice(0, 120))) throw new Error("The hook injects the technical reference instead of routing to it.");
  if (promptMode("/writer base") !== "base" || promptMode("writer technical") !== "technical" || promptMode("write a report") !== null) throw new Error("Writer mode parsing is invalid.");
  for (const event of ["SessionStart", "SubagentStart", "UserPromptSubmit"]) {
    if (!hooks.hooks[event]) throw new Error(`The ${event} hook is missing.`);
  }
  process.stdout.write("The Writer hook checks passed.\n");
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
  process.stderr.write("Usage: writer hook test | inject <event> | prompt\n");
  process.exitCode = 2;
}
