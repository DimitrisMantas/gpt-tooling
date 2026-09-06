#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.env.PLUGIN_ROOT || process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, "..");
const skillPath = path.join(root, "skills", "plinth", "SKILL.md");

function skillBody() {
  return fs.readFileSync(skillPath, "utf8").replace(/^---[\s\S]*?---\s*/, "").trim();
}

function instructions() {
  return [
    "Plinth is active.",
    "",
    `Apply Plinth to every engineering task. If the complete skill at "${skillPath}" has not been loaded in this agent context, read it before acting. Then load only the references relevant to the task.`,
    "Start with the simplest established approach that fully meets the requirement. Add complexity only to address a named material limitation.",
    "Use external research when an unresolved judgment is consequential, unfamiliar, contested, scientifically material, or uncertain enough that stronger evidence could change the decision. Match research depth to consequence and uncertainty.",
    "Prefer established practice when it satisfies the requirement. Depart when an explicit requirement or material evidence justifies the change, and increase the validation burden with novelty and consequence.",
    "Plinth governs engineering semantics, evidence, conventionality, quality, risk, and defensibility. Ponytail governs implementation economy. Quire governs natural-language expression without changing the engineering meaning."
  ].join("\n");
}

function emit(event) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext: instructions()
    }
  }));
}

function selfTest() {
  const source = fs.readFileSync(skillPath, "utf8");
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!frontmatter || !/^name:\s*plinth\s*$/m.test(frontmatter[1])) throw new Error("The Plinth skill front matter is invalid.");

  const references = ["decisions.md", "evidence.md", "verification.md", "integration.md", "software.md", "python.md"];
  for (const name of references) {
    if (!fs.existsSync(path.join(root, "skills", "plinth", "references", name))) throw new Error(`The Plinth reference is missing: ${name}.`);
  }
  for (const name of ["pyproject.toml", ".flake8"]) {
    if (!fs.existsSync(path.join(root, "skills", "plinth", "assets", "python", name))) throw new Error(`The Python profile asset is missing: ${name}.`);
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(root, ".codex-plugin", "plugin.json"), "utf8"));
  const hooks = JSON.parse(fs.readFileSync(path.join(root, "hooks", "hooks.json"), "utf8"));
  const metadata = fs.readFileSync(path.join(root, "skills", "plinth", "agents", "openai.yaml"), "utf8");
  if (manifest.name !== "plinth" || !manifest.skills || !manifest.interface) throw new Error("The Plinth manifest is invalid.");
  if (!metadata.includes('display_name: "Plinth"') || !metadata.includes("allow_implicit_invocation: true")) throw new Error("The Plinth skill metadata is invalid.");
  for (const event of ["SessionStart", "SubagentStart"]) {
    if (!hooks.hooks[event]) throw new Error(`The ${event} hook is missing.`);
    const route = hooks.hooks[event][0]?.hooks?.[0];
    if (route?.type !== "command" || !route.command?.includes("plinth.js") || !route.command.includes(`inject ${event}`)) {
      throw new Error(`The ${event} hook route is invalid.`);
    }
    const output = JSON.parse(require("child_process").execFileSync(process.execPath, [__filename, "inject", event], { encoding: "utf8" }));
    if (output.hookSpecificOutput?.hookEventName !== event || typeof output.hookSpecificOutput?.additionalContext !== "string") {
      throw new Error(`The ${event} hook output is invalid.`);
    }
  }

  const context = instructions();
  if (!context.includes(skillPath)) throw new Error("The hook omits the Plinth skill route.");
  if (context.length > 3000) throw new Error("The hook context is too large.");
  if (/\b(?:TODO|TBD|PLACEHOLDER)\b/i.test(skillBody())) throw new Error("The skill contains a placeholder.");
  process.stdout.write("The Plinth hook checks passed.\n");
}

const command = process.argv[2];

if (command === "test") {
  selfTest();
} else if (command === "inject") {
  emit(process.argv[3] || "SessionStart");
} else {
  process.stderr.write("Usage: plinth hook test | inject <event>\n");
  process.exitCode = 2;
}
