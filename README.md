# Engineering Partner

Engineering Partner is an always-on, general-purpose engineering discipline for Codex. It evolves the installed Engineering skill and hook without changing their aim: produce the best result available while making every engineering item, decision, and action as standard, evidence-grounded, reviewable, and defensible as possible.

The package adds progressive guidance for method selection, teaching, empirical work, diagnosis, review, and skill composition. It remains domain-agnostic. The same policy applies to software, architecture, systems, hardware, interfaces, models, methods, estimates, experiments, operations, validation, and reviews.

Version 1.4.0 aligns the package with the installed Engineering, Ponytail, and Writing packages. It expands the policy from consequential work to all engineering work, restores the complete skill in parent sessions and subagents, uses typed authority and proportionate research, controls complexity through a material-need test, removes duplicated specialist policy, and generalizes the behavioral evaluations.

## Operating model

Engineering Partner uses these defaults:

- Authority follows the question. Current requirements govern project intent, project artifacts govern current behavior, current specifications govern external semantics, and applicable methodological evidence governs scientific claims.
- Inspectable facts are resolved before the user is asked to make a decision.
- Informal symptoms are translated into established technical problem classes.
- The simplest established solution that satisfies the requirement is the baseline. Every added abstraction, dependency, method, metric, agent, or workflow layer must address a named material limitation.
- External research is used when an unresolved judgment is consequential, unfamiliar, contested, scientifically material, or uncertain enough that stronger evidence could change the decision. Research depth follows consequence and uncertainty.
- Source weight reflects applicability, methods, review and publication process, established standing and relevant track record, independent support, transparency, conflicts, currency, and correction status. Reputation and uptake remain supporting signals.
- Departures from established practice require a material reason from requirements or evidence. Their validation and rollback burden increases with novelty and consequence.
- The user receives a recommendation and the conceptual bridge needed to own material decisions.
- Engineering fitness for purpose is the default correctness standard. Explicit requests for proof, exactness, exhaustive search, optimization, or a specified tolerance apply literally to the requested object.
- Metrics, diagnostics, experiments, and reviews exist only to meet material evidence obligations.
- Clean and null results are valid. Insufficient evidence remains distinct from a clean result.
- Deterministic checks and encoded invariants precede agent judgment when a condition is mechanically testable.
- Accepted decisions remain settled until requirements or material evidence change.
- Independent reviewers address distinct material risks. They do not act as votes.
- Work stops when remaining uncertainty cannot change the next engineering action.

## Package layout

```text
engineering-partner/
├── .codex-plugin/
│   └── plugin.json
├── README.md
├── hooks/
│   ├── engineering-partner.js
│   └── hooks.json
├── skills/
│   └── engineering-partner/
│       ├── SKILL.md
│       ├── agents/
│       │   └── openai.yaml
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
│   └── install-agents.js
└── evals/
    └── BEHAVIORAL_EVALS.md
```

Codex discovers `hooks/hooks.json` at the plugin root. The hook uses the Node.js runtime already used by the installed Engineering, Ponytail, and Writing hooks. It loads the complete skill once per agent context when needed, emits only developer context, and does not inspect or modify project files.

## Install the plugin or skill

Use the OpenAI plugin-creator workflow to add this folder to a personal or repository marketplace, then install it from that local source. Review and trust the hook definition if you want automatic activation. Plugin hooks are not trusted automatically.

For a standalone installation, copy `skills/engineering-partner/` to the applicable skills directory. A user installation can live at `$HOME/.agents/skills/engineering-partner/`; a repository installation can live under the repository's `.agents/skills/` hierarchy.

Keep repository-specific instructions and navigation in `AGENTS.md`. Do not copy this reusable policy into a large global instruction file.

## Install optional reviewer profiles

The three read-only Codex custom-agent profiles are separate because the plugin manifest does not install user agent profiles. Install them with:

```bash
node scripts/install-agents.js
```

Use `--force` only when you intend to replace profiles with the same filenames.

The bundled profiles currently use `gpt-5.6` with high reasoning:

- `methodology_reviewer` tests one material scientific, statistical, experimental, analytical, or evaluation concern.
- `implementation_reviewer` tests the implementation against the accepted requirement and invariants.
- `claim_validator` checks one consequential uncertain finding or claim.

Dispatch only the role whose failure mode is material to the task. The parent agent retains responsibility for the objective, constraints, synthesis, teaching, and user escalation.

## Compose with Engineering, Ponytail, and Writing

Engineering Partner and the installed Engineering skill share the same purpose. If both are active, apply the more specific Engineering Partner guidance without weakening the installed Engineering discipline.

Ponytail governs code and coding decisions: implementation economy, reuse, dependency and abstraction restraint, root-cause fixes, and the smallest correct diff. Engineering Partner governs the engineering requirement, semantics, accepted design, evidence, conventionality, quality, risk, teaching, and defensibility.

Writing governs every natural-language surface. Its scientific extension applies to papers, reports, literature reviews, and written reviews. Engineering Partner retains ownership of technical meaning, terminology, evidence boundaries, claim strength, and material limitations.

All applicable skills can operate together. Explicit user instructions and project requirements take precedence. The package delegates specialist concerns instead of duplicating the complete Ponytail or Writing policy.

## Maintain and evaluate the package

Run the hook self-check after policy changes:

```bash
node hooks/engineering-partner.js test
```

Run the optional-agent installer self-check without modifying the user agent directory:

```bash
node scripts/install-agents.js test
```

Run the scenarios in `evals/BEHAVIORAL_EVALS.md` on representative general engineering, software, empirical, and spatial or data-intensive tasks. Compare behavior before and after prompt changes. Preserve task success, evidence quality, teaching, null-result integrity, action boundaries, and scope discipline.

Keep the hook compact and the skill discoverable. Add persistent policy only for a demonstrated behavioral gap that the existing governing skill or references cannot address.

The review basis and date are recorded in `skills/engineering-partner/references/authoring-and-composition.md`.
