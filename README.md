# Engineering Partner

Engineering Partner is a Codex plugin and standalone skill for general-purpose and task-specific engineering work. It changes how Codex frames problems, selects methods, teaches consequential concepts, gathers evidence, diagnoses failures, and reviews important work. It does not replace a dedicated coding-style skill or a dedicated writing skill.

Version 1.3.0 adds an explicit null-result policy, source-of-truth precedence, settled-decision preservation, project-convention precedence, custom-method sanity checks, material-threshold provenance, reproducibility-versus-stability guidance, external-test quarantine, semantic boundary checks, and stricter local review scope.

The package uses a short governing skill, progressive-disclosure references, one compact session hook, and three optional read-only reviewer profiles. This structure keeps persistent context small and loads detailed guidance only when the task needs it.

## Intended operating model

Use GPT-5.6 Sol with High reasoning for the main Codex session when the work involves consequential engineering judgement, unfamiliar methodology, experimental design, difficult diagnosis, or review. The optional reviewer profiles use `model = "gpt-5.6"` and `model_reasoning_effort = "high"`.

Engineering Partner uses these defaults:

- It treats the current requirement and current project artifacts as the source of truth before prior chat or model memory.
- It starts from repository facts and established practice before it invents a method.
- It translates informal symptoms into established technical problem classes.
- It teaches at consequential decision boundaries and automates routine work between those boundaries.
- It uses engineering fitness for purpose as the normal correctness standard.
- It applies explicit requests for proof, exactness, exhaustive search, or optimization literally to the requested object.
- It accepts clean or null results when no material action is justified. `None` is allowed when an interface naturally represents null that way, but ordinary agent communication uses natural technical prose rather than required status tokens.
- It derives metrics, diagnostics, experiments, and review work from material evidence obligations instead of fixed counts.
- It preserves accepted decisions until a requirement changes or new material evidence invalidates them.
- It prefers deterministic checks and encoded invariants over agent opinion.
- It uses independent agents only for distinct material review axes or consequential uncertain claims.
- It stops when remaining uncertainty cannot change the current engineering action.

## Package layout

```text
engineering-partner-v1.3.0-audited/
├── .codex-plugin/
│   └── plugin.json
├── README.md
├── hooks/
│   ├── hooks.json
│   └── session_start.py
├── skills/
│   └── engineering-partner/
│       ├── SKILL.md
│       └── references/
│           ├── authoring-and-composition.md
│           ├── diagnosis-and-review.md
│           ├── evidence-and-empirical-work.md
│           └── methods-and-teaching.md
├── codex-agents/
│   ├── claim_validator.toml
│   ├── implementation_reviewer.toml
│   └── methodology_reviewer.toml
├── scripts/
│   └── install_agents.py
└── evals/
    └── BEHAVIORAL_EVALS.md
```

The plugin manifest points only to the bundled skill. Codex automatically discovers `hooks/hooks.json` at the plugin root, so the manifest does not repeat that path.

## Null-result policy

The package explicitly treats a clean or null result as successful completion when it is the correct engineering outcome. It does not require a literal keyword for that state unless a machine-readable workflow needs one.

Examples include:

- A review finds no material defect.
- A search finds no clear precedent.
- A comparison shows no material difference.
- A diagnosis finds no justified change from the available evidence.
- The current implementation is already fit for purpose.

The package distinguishes a true clean result from unresolved uncertainty. Reviewers state the result naturally. They explain missing evidence when a material concern cannot be settled. `None` remains available only when the surrounding interface naturally represents a null result that way.

## Install the plugin

For local development, use the built-in OpenAI plugin-creator workflow to add this folder to a personal or repository marketplace. Review the generated marketplace entry, install the plugin from that local source, and test it in a new Codex session.

Codex does not automatically trust hooks that arrive through a plugin. Review and trust the bundled hook definition if you want the session policy to load. The hook only emits static developer context. It does not read or modify project files.

If you want only the standalone skill, copy `skills/engineering-partner/` to an appropriate `.agents/skills/` location. A user-level installation can live under `$HOME/.agents/skills/engineering-partner/`. A repository-specific installation can live under the repository's `.agents/skills/` hierarchy.

Do not copy the full skill into a large global `AGENTS.md`. Use `AGENTS.md` for repository-specific requirements and navigation. Keep detailed reusable policy in the skill references.

## Install the optional reviewer profiles

The plugin format does not bundle Codex custom agent profiles as a plugin component, so the three profiles are provided separately. Install them with:

```bash
python scripts/install_agents.py
```

Use `--force` only when you intend to replace profiles with the same filenames.

The profiles are read-only and use GPT-5.6 High reasoning:

- `methodology_reviewer` checks scientific, statistical, experimental, analytical, and evaluation validity.
- `implementation_reviewer` checks the implementation against the agreed requirement and invariants.
- `claim_validator` checks one consequential uncertain reviewer finding or technical claim and explains whether the evidence supports it, contradicts it, or remains insufficient.

Do not dispatch all three by default. The parent agent should use only the reviewer whose failure mode is material to the current task.

## Compose with Ponytail Full and the writing skill

Keep Ponytail Full and the user's dedicated writing skill installed as separate specialists. Engineering Partner is the cross-cutting orchestration layer. It owns problem formulation, methodological grounding, evidence, technical semantics, decision ownership, and review policy.

For implementation work, apply Ponytail Full after the engineering requirement and accepted design are clear. Ponytail should minimize the implementation by reusing the codebase, the standard library, native platform capabilities, and existing dependencies before new code or abstractions are added. It can surface an implementation constraint that changes the engineering trade-off, but it should not silently redefine an accepted requirement or methodology.

For prose artifacts, apply the user's writing skill to the final expression, structure, and artifact-specific style. Engineering Partner continues to govern technical terminology, evidence fidelity, claim strength, and material limitations. A writing pass must not change the technical meaning merely to improve the prose.

The same task can use all three layers. The orchestrator should delegate concerns rather than reproduce the full rules of one skill inside another. Explicit user instructions and project requirements take precedence over generic skill defaults.

Engineering Partner retains a short Ponytail-compatible fallback policy for environments where Ponytail Full is unavailable. It does not duplicate the complete Ponytail skill.

The baseline prose policy uses direct US English, sentence-case headings, consistent terminology, active constructions when natural, and full prose sentences. It also uses Wikipedia's `Signs of AI writing` page as an editorial anti-pattern checklist and applies ASD-STE100-inspired clarity principles without claiming formal ASD-STE100 compliance.

## Interagent communication

The package does not impose a private mini-protocol on the orchestrator and its subagents. Agents communicate in ordinary technical prose by default. Structured fields, exact status words, or machine-readable objects are appropriate only when a downstream tool must parse the response or when the workflow branches mechanically on that state.

The orchestrator should synthesize the meaning of reviewer and validator responses rather than depend on magic tokens. A reviewer can simply say that it found no material issues. A validator can explain that the evidence supports a claim, contradicts it, or does not yet settle it. Literal `None` is acceptable only when the surrounding interface already uses a null value naturally.

## Maintain and evaluate the package

OpenAI's current GPT-5.6 guidance favors lean prompts, clear autonomy boundaries, and representative evaluations. Do not add another persistent rule, hook, agent, or reference file because it seems prudent in isolation. Add it when an observed failure demonstrates a gap that the existing package cannot address cleanly.

Run the behavioral scenarios in `evals/BEHAVIORAL_EVALS.md` when you change the skill or hook policy. Compare representative tasks before and after the change. Preserve task success, necessary evidence, teaching quality, null-result integrity, and scope discipline while reducing redundant context and output.

The source list and review date are recorded in `skills/engineering-partner/references/authoring-and-composition.md`.
