# Engineer

Engineer is an always-on, general-purpose engineering discipline for Codex. It produces the best result available while keeping engineering items, decisions, and actions conventional, evidence-grounded, reviewable, and defensible.

Engineer applies to software, architecture, systems, hardware, interfaces, models, methods, estimates, experiments, operations, validation, and reviews. It remains domain-agnostic.

Version 2.0.0 renames Engineering Partner to Engineer and makes the three-plugin authority model explicit. The pre-rename 1.4.0 package is preserved in repository commit `f87bbcf`.

## Operating model

- Authority follows the question. Current requirements govern intent, project artifacts govern current behavior, current specifications govern external semantics, and applicable methodological evidence governs scientific claims.
- Inspectable facts are resolved before the user is asked to decide. Multiple decisions are resolved in dependency order.
- The simplest established solution that satisfies the requirement is the baseline. Added complexity must address a named material limitation.
- External research is used when unresolved judgment is consequential, unfamiliar, contested, scientifically material, or uncertain enough that stronger evidence could change the decision.
- Source weight reflects applicability, methods, review and publication process, established standing and relevant track record, independent support, transparency, conflicts, currency, and correction status.
- Departures from established practice require a material reason. Their validation and rollback burden increases with novelty and consequence.
- Metrics, diagnostics, experiments, agents, and reviews exist only to meet material evidence obligations.
- Clean, null, mixed, and unresolved results remain distinct and valid.
- Direct evidence supports material success claims.
- Deterministic checks and encoded invariants precede agent judgment when a condition is mechanically testable.
- Autonomous loops and durable goals require externally legible completion criteria.

## Authority boundaries

Engineer owns requirements, technical semantics, accepted design, methodology, evidence obligations, statistical interpretation, engineering decisions, uncertainty and claim boundaries, accepted limitations, review, and verification.

Ponytail owns source-code implementation, reuse, dependency restraint, abstraction restraint, root-cause fixes, and the smallest correct diff. It can expose an implementation constraint but cannot redefine an accepted requirement or method.

Writer owns natural-language expression, document organization, readability, terminology consistency, genre conventions, and faithful presentation. It can identify a technical-content gap but cannot invent an analysis, metric, experiment, limitation, or methodological conclusion.

## Package layout

```text
engineer/
├── .codex-plugin/plugin.json
├── hooks/
│   ├── engineer.js
│   └── hooks.json
├── skills/engineer/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── references/
├── codex-agents/
├── scripts/install-agents.js
└── evals/BEHAVIORAL_EVALS.md
```

Codex discovers `hooks/hooks.json` at the plugin root. The hook loads the complete skill once per agent context when needed, emits compact developer context, and does not inspect or modify project files.

Use the repository's coordinated installer to install Engineer with Writer and the pinned Ponytail dependency. Codex does not automatically trust plugin hooks, so review and trust each hook before use.

The three read-only custom-agent profiles remain optional because plugin manifests do not install user agent profiles. Install them from this directory with:

```bash
node scripts/install-agents.js
```

Use `--force` only when you intend to replace profiles with the same filenames. Dispatch only the reviewer whose independent failure mode is material to the current task.

## Verify changes

```bash
node hooks/engineer.js test
node scripts/install-agents.js test
```

Run `evals/BEHAVIORAL_EVALS.md` on representative engineering, software, empirical, and data-intensive tasks. Add persistent policy only for an observed recurring or consequential failure that existing rules cannot address cleanly.
