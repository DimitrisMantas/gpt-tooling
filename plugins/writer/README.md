# Writer

Writer is an always-on Codex writing plugin for every natural-language surface that is not source-code syntax. It applies common clarity and fidelity principles across responses, documents, comments, logs, diagnostics, interface text, and interagent communication while adapting their realization to the medium and audience.

Version 1.0.0 began with an exact import of the installed Writing package `0.1.0+codex.20260808223114`, then renamed the plugin and applied the routing, scope, authority, provenance, and validation refinements documented in this repository.

Writer has three persistent modes:

- `auto` selects the branch from the artifact's function.
- `base` forces the base writing standard.
- `technical` forces the base standard plus the technical and scientific extension.

Use `/writer auto`, `/writer base`, or `/writer technical` to change the mode. Automatic routing uses technical mode for substantive scientific, research, empirical, methodological, or evidence-bearing technical work and for artifacts governed by technical reporting conventions. Artifact nouns alone do not determine the branch.

Engineer governs technical meaning, methodology, evidence obligations, claim strength, accepted limitations, decisions, review, and verification. Writer can identify a technical-content gap but cannot invent an analysis, metric, experiment, limitation, or conclusion. Ponytail governs source-code implementation and implementation economy.

## Package layout

```text
writer/
├── .codex-plugin/plugin.json
├── hooks/
│   ├── hooks.json
│   └── writer.js
├── skills/writer/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── references/technical-writing.md
└── evals/BEHAVIORAL_EVALS.md
```

The hook injects a compact route at session and subagent start. It does not inject the technical reference into each matching prompt. `UserPromptSubmit` handles explicit mode changes only.

Run the mechanical check with:

```bash
node hooks/writer.js test
```

Use the repository's coordinated installer to install Writer with Engineer and the pinned Ponytail dependency.
