# GPT Tooling

My personal engineering tooling: a coordinated Codex product for sound judgment, economical implementation, and clear technical communication.

Capable models can reason broadly, write substantial code, and produce polished documents. Those strengths also create predictable failure modes: solving a larger problem than requested, treating plausible methodology as established fact, adding machinery before proving its value, or turning a simple result into an oversized report. GPT Tooling addresses those failure modes through three coordinated responsibilities.

## Modules

| Module | Responsibility | Guiding question |
| --- | --- | --- |
| [Plinth](plugins/plinth/README.md) | Requirements, technical semantics, methodology, evidence, risk, decisions, review, and verification | What is technically defensible? |
| [Ponytail](plugins/ponytail/README.md) | Source-code form, reuse, dependency restraint, abstraction restraint, and the minimum correct diff | How little code should exist? |
| [Quire](plugins/quire/README.md) | Natural-language expression, organization, readability, terminology, genre conventions, and faithful presentation | How should the accepted meaning be communicated? |

The modules cooperate through an explicit authority model:

1. Plinth establishes the requirement, evidence obligation, accepted technical meaning, and verification boundary.
2. Ponytail implements that meaning with the smallest sound change that fits the project.
3. Quire expresses the result without inventing or weakening technical content.
4. Direct checks support material success claims before the work is called complete.

This division keeps the policies independently maintainable. It also prevents code minimalism from silently weakening a requirement and prevents a writing pass from manufacturing methodology, metrics, certainty, or a more positive result.

These are cooperating responsibilities, not required sequential passes. Implementation constraints, diagnostics, and ambiguities feed back into Plinth's engineering decision; Ponytail and Quire then preserve the resolved contract. Mechanical tools check selected conditions without acquiring authority over the requirement.

## Design principles

- Prefer conventional, legible solutions when they satisfy the requirement. Complexity must answer a named material limitation.
- Match research depth to consequence, uncertainty, novelty, and the chance that stronger evidence would change the decision.
- Use the authority appropriate to the question: project artifacts for current project behavior, current specifications for external semantics, and applicable methodological evidence for scientific claims.
- Resolve inspectable facts before asking the user. Ask consequential decisions in dependency order and accompany them with a recommendation.
- Treat technical feedback as a claim to evaluate against the project, not as an instruction conferred by reviewer status.
- Preserve null, mixed, negative, and unresolved results. The toolkit does not create findings merely to produce output.
- Prefer the most direct practical evidence for a success claim. State what remains unverified when direct verification is unavailable.
- Promote observed, generalizable agent failures into policy and behavioral regression tests. Avoid speculative process.

The policies are general-purpose. They cover software, systems, hardware, numerical work, data, models, experiments, operations, and technical documents without naming a particular project, model, dataset, or domain workflow.

The [software policy](plugins/plinth/skills/plinth/references/software.md) adds contracts, types, cohesion, repository ownership, notebooks, and artifact lifecycles within Plinth. Its [Python companion](plugins/plinth/skills/plinth/references/python.md) supplies an optional uv/Ruff/BasedPyright/WPS/pytest profile for authorized Python tooling work. General policy remains language- and model-independent; Codex packaging and the measured evaluation model remain explicit implementation choices. See the [extension review](docs/software-extension-review.md) for requirement coverage, source corrections, and validation limits.

## Installation

### Requirements

- Codex with local plugin support
- Node.js
- Git when installing from a clone

Clone GPT Tooling with its pinned Ponytail module, then run the installer:

```bash
git clone --recurse-submodules https://github.com/DimitrisMantas/gpt-tooling.git
cd gpt-tooling
node scripts/install.js
```

The installer:

1. initializes and verifies the pinned Ponytail submodule;
2. validates the local marketplace and plugin manifests;
3. registers this checkout as the `gpt-tooling` marketplace;
4. applies the reviewed GPT Tooling compatibility patch to the installable Ponytail copy;
5. installs Plinth, Quire, and Ponytail from that marketplace;
6. restores the source submodule when the patch was applied temporarily;
7. verifies that all three modules were installed from this checkout.

Review and trust the bundled hooks after installation, then start a new Codex thread so the session and subagent policies load from a clean context.

For persistent candidate testing, install from an extracted release archive. Its Ponytail source already contains the compatibility patch. A marketplace refresh against a Git checkout can select the raw upstream submodule again after the installer restores it; a distinct cache version does not change that source-selection behavior.

### Updating a local installation

After editing Plinth or Quire in an already registered checkout, refresh their Codex cachebusters and reinstall them:

```bash
node scripts/install.js update
```

This command changes only the local Plinth and Quire manifest cachebusters. It confirms that the `gpt-tooling` marketplace points to the current checkout, reinstalls both plugins, verifies their marketplace identity, and prompts you to start a new thread. It checks that Ponytail is at the reviewed pinned commit without changing the submodule checkout.

## Using GPT Tooling

Plinth, Ponytail, and Quire are designed to remain active without repeated invocation. Ordinary requests can be written naturally:

```text
Diagnose why this data pipeline produces different row counts on two machines.
Implement the accepted fix and verify the original failing case.
Turn the accepted design and measurements into a concise validation report.
```

Quire exposes three mode selectors in the skill UI:

| UI label | Skill | Command | Behavior |
| --- | --- | --- | --- |
| Automatic | `$quire-auto` | `/quire auto` | Selects Standard or Technical from the artifact's function |
| Standard | `$quire-standard` | `/quire standard` | Forces ordinary and operational writing, including technical subject matter that does not require the Technical extension |
| Technical | `$quire-technical` | `/quire technical` | Forces Standard plus the technical and scientific extension |

Automatic mode routes by purpose rather than by nouns. A business report or report-parser error stays Standard. A research paper, methodological review, validation report, or evidence-bearing technical document uses the Technical extension.

## Plinth agents

Plinth includes bounded profiles for methods, code, and claim review. They are optional because reviewer topology should follow the material failure modes of the task. See the [Plinth agent guide](plugins/plinth/codex-agents/README.md), then install them when you want the profiles available in your Codex agent directory:

```bash
node plugins/plinth/scripts/install-agents.js
```

The parent agent retains synthesis and decision ownership. Reviewers communicate findings and evidence in ordinary technical prose, accept clean results, and do not create recursive review hierarchies.

## Repository layout

```text
.
├── .agents/plugins/marketplace.json
├── plugins/
│   ├── plinth/
│   ├── ponytail/
│   └── quire/
├── evals/cases.json
├── patches/ponytail-gpt-tooling.patch
├── scripts/
│   ├── eval.js
│   ├── install.js
│   ├── prepare-ponytail.js
│   └── release.js
├── .gitattributes
├── .gitmodules
└── README.md
```

Plinth and Quire each contain their own manifest, hooks, skill policy, progressive references, documentation, and behavioral checks. Ponytail remains an upstream Git submodule so the toolkit can pin a reviewed dependency without silently drifting its code.

The pinned upstream Ponytail release contains an output-length directive and a Codex warning banner that overlap Quire's authority over natural-language form. The tracked compatibility patch removes those two conflicts from the installed and released copy and identifies it as `4.9.0+gpt-tooling.1` so Codex cannot reuse an unpatched `4.9.0` cache entry. It preserves Ponytail's implementation ladder, root-cause rule, safety boundaries, and verification requirement. The patch is applied reproducibly and tested against the exact pinned commit.

## Verification

Run the bundled mechanical checks from the repository root:

```bash
node plugins/plinth/hooks/plinth.js test
node plugins/plinth/scripts/install-agents.js test
node plugins/quire/hooks/quire.js test
node scripts/prepare-ponytail.js test
node scripts/install.js test
node scripts/eval.js test
node scripts/release.js test
```

Verify the optional Python profile separately with uv. This uses a temporary directory and pinned script dependencies; it does not configure this repository as a Python project:

```bash
uv run --script plugins/plinth/scripts/check-python-profile.py
```

After installing the current checkout, run the executable behavioral suite to exercise a small set of representative cross-module regressions:

```bash
node scripts/eval.js run smoke
node scripts/eval.js run core
node scripts/eval.js run extended
node scripts/eval.js run clean-review-null-result
```

`run` defaults to the Core suite. Smoke contains 13 must-never-regress cases, Core contains 19 independent contract cases, and Extended contains 24 cases, including software contracts, language independence, and typing-versus-runtime boundaries. A named case runs by itself. One semantic grading call follows each candidate response, so complete Smoke, Core, and Extended runs use 26, 38, and 48 Codex executions respectively. The default evaluation model is `gpt-5.6-sol`; set `GPT_TOOLING_EVAL_MODEL` to choose another available model. Results record the actual selection.

Use `node scripts/eval.js run-local <case-id-or-suite>` to evaluate a snapshot of the current checkout without reinstalling plugins. It copies the local policies, applies the existing Ponytail compatibility patch, records content hashes, and supplies the complete policies through stdin to a clean candidate context. This tests policy composition; the installed `run` path remains the check for plugin discovery and lifecycle activation. For example, run `software-contract-before-lint`, `software-agnostic-repository`, or `python-contract-and-prose` locally while developing the extension.

Each semantic result is graded in a separate Codex context that ignores user configuration and execution rules, disables hooks and plugins, and sets the AGENTS.md byte limit to zero. The same isolation settings apply to local-snapshot candidates. Mechanically observable requirements, such as an exact paragraph count, use deterministic checks instead of model judgment. Each run records the selected suite, model, reasoning effort, prompt, candidate output, semantic criteria, deterministic results, grader isolation, and grader decision under `dist/evals/`. The reference scenario catalogs remain in:

- [Plinth behavior](plugins/plinth/evals/behavior.md)
- [Quire behavior](plugins/quire/evals/behavior.md)

Evaluation records are saved before candidate execution, after each response, and after each grade. A record distinguishes a running, completed, or errored execution and lists all selected cases. An ungraded response has `pass: null`; an execution error retains completed results and the failing case. A completed execution can still contain failed behavioral cases. These checkpoints preserve collected evidence when a later call fails; they do not resume an interrupted run.

The mechanical checks protect manifests, hook contracts, routes, selector metadata, context budgets, agent-profile semantics, dependency compatibility, installer behavior, and evaluation failure records. The installer check verifies the existing Ponytail pin without initializing or updating the submodule. The behavioral suites protect policy outcomes without coupling them to exact prose.

## Release packaging

Create a distributable archive from a clean branch whose commits match its configured upstream:

```bash
node scripts/release.js
```

The release builder verifies the Ponytail pin, assembles a `gpt-tooling/` directory from tracked Git content, applies the compatibility patch, excludes all Git metadata, runs the mechanical checks, creates `dist/gpt-tooling.zip`, extracts it into a fresh temporary directory, and runs the checks again against the extracted artifact. Use `node scripts/release.js test` to exercise assembly and validation without requiring a clean, synchronized release branch or writing an archive.

## Hook and data behavior

Plinth and Quire use `SessionStart` and `SubagentStart` hooks to reactivate concise routing context. Quire also uses `UserPromptSubmit` for explicit mode changes. It stores only the selected mode in the plugin data directory. The hooks do not perform network requests or inject their complete reference files into every prompt.

## Manual

- [Plinth manual](plugins/plinth/README.md)
- [Quire manual](plugins/quire/README.md)
- [Ponytail manual](plugins/ponytail/README.md)
- [OpenAI skill documentation](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI plugin documentation](https://developers.openai.com/plugins/build/plugins)
- [OpenAI hook documentation](https://learn.chatgpt.com/docs/hooks)

## License

The repository's original work is available under the [MIT License](LICENSE). Ponytail remains governed by its upstream license.
