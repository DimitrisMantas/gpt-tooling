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

Run the complete suite from the repository root:

```bash
node scripts/test.js
```

The suite requires Node.js, Git, uv, an authenticated Codex CLI, and the initialized Ponytail submodule. It runs every mechanical check group, the upstream Ponytail tests, the Python companion checks, release assembly and extraction checks, and every behavioral case. Python tooling is optional for adoption but mandatory to verify its supported companion profile. There are no tiers or case selectors. Every expected result must pass; a failure, execution error, or incomplete case makes the command fail. Results from different runs are never combined into a passing result.

| Responsibility | Coverage |
| --- | --- |
| Integration | Manifests, hook events, mode persistence, selector parsing, reviewer restrictions, installer behavior, Unicode transport, compatibility patch, and release roundtrip |
| Ponytail | Rule and version consistency, runtime, Pi extension, MCP instructions, line-count examples, and correctness examples |
| Engineering | Conventional methods, proportional evidence, decision order, scope, direct verification, review feedback, and completion conditions |
| Planning | Initial alignment, progressive clarification across turns, answer incorporation, and stopping when requirements are sufficient |
| Software and hardware | Shared fixes, existing capabilities, trust boundaries, interface semantics, calibration, and the optional Python type/runtime profile |
| Teaching | New concepts, demonstrated expertise, mixed knowledge, requested depth, requested brevity, and correction after a follow-up |
| Writing and composition | Mode selection, technical meaning, uncertainty, null results, interagent prose, and module authority |

Behavioral cases in [evals/cases.json](evals/cases.json) check general outcomes rather than stock phrases or a preferred implementation language. Concrete fixtures supply the evidence needed to answer each prompt. Coverage tags require every major responsibility to remain represented. The scenario catalogs provide additional context: [Plinth behavior](plugins/plinth/evals/behavior.md) and [Quire behavior](plugins/quire/evals/behavior.md).

Candidates receive a snapshot of the current checkout's policies, including the patched Ponytail policy. Candidate and grader processes use clean contexts with user configuration, hooks, plugins, and repository instruction discovery disabled. This tests policy composition; mechanical lifecycle checks exercise hooks separately. It does not establish that a particular user's installed plugin cache discovers the policies correctly. Known-answer checks require the semantic grader to both accept a supported statement and reject an unsupported causal claim before evaluating candidates. Deterministic requirements use direct checks where possible. Behavioral results remain observations of the recorded model and prompts, not guarantees about every future response.

The default test-taking target is `gpt-5.6-sol` with medium reasoning effort; its independent evaluator uses the same model with high reasoning effort. `GPT_TOOLING_EVAL_MODEL` can select another available model for both roles. Records include both reasoning settings, policy hashes, prompts, responses, criteria, grades, and deterministic results. Logs and a checkpointed `report.json` live under `dist/tests/<run>/`. The summary counts mechanical check groups and behavioral cases separately from the individual assertions and upstream tests recorded in group logs. Interrupted runs retain completed evidence and mark unfinished work incomplete; rerun the same command for a new complete result.

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
