#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.env.PLUGIN_ROOT || process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, "..");
const skillPath = path.join(root, "skills", "engineer", "SKILL.md");

function skillBody() {
  return fs.readFileSync(skillPath, "utf8").replace(/^---[\s\S]*?---\s*/, "").trim();
}

function instructions() {
  return [
    "ENGINEER DISCIPLINE ACTIVE",
    "",
    `Apply Engineer to every engineering task. If the complete skill at "${skillPath}" has not been loaded in this agent context, read it before acting. Then load only the references relevant to the task.`,
    "Start with the simplest established approach that fully meets the requirement. Add complexity only to address a named material limitation.",
    "Use external research when an unresolved judgment is consequential, unfamiliar, contested, scientifically material, or uncertain enough that stronger evidence could change the decision. Match research depth to consequence and uncertainty.",
    "Prefer established practice when it satisfies the requirement. Depart when an explicit requirement or material evidence justifies the change, and increase the validation burden with novelty and consequence.",
    "Engineer governs engineering semantics, evidence, conventionality, quality, risk, and defensibility. Ponytail governs implementation economy. Writer governs natural-language expression without changing the engineering meaning."
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
  const skill = skillBody();
  const required = [
    /Apply this discipline to every engineering item, decision, and action\./,
    /The user does not need to invoke or name this skill\./,
    /Produce the best engineering result/,
    /Every added abstraction, dependency, method, metric, agent, or workflow layer must address a named material limitation\./,
    /Use external research when an unresolved judgment is consequential, unfamiliar, contested, scientifically material, or uncertain enough/,
    /established standing and relevant track record of the venue and contributors/,
    /Depart from established practice when/,
    /Ponytail governs source-code implementation and implementation economy\./,
    /Writer governs every natural-language surface\./
  ];

  for (const rule of required) {
    if (!rule.test(skill)) throw new Error(`The required Engineer rule is missing: ${rule}.`);
  }
  if (!instructions().includes(skillPath)) throw new Error("The hook omits the Engineer skill route.");
  if (!instructions().includes("has not been loaded in this agent context")) throw new Error("The hook omits context-aware skill loading.");
  if (instructions().length > 3000) throw new Error("The hook context is too large.");
  if (/\[TODO:/.test(skill)) throw new Error("The skill contains a TODO placeholder.");
  process.stdout.write("The Engineer hook checks passed.\n");
}

const command = process.argv[2];

if (command === "test") {
  selfTest();
} else if (command === "inject") {
  emit(process.argv[3] || "SessionStart");
} else {
  process.stderr.write("Usage: engineer hook test | inject <event>\n");
  process.exitCode = 2;
}
