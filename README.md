# GPT Tooling

My personal engineering tooling for GPT-5.6: a coordinated Codex product for sound judgment, economical implementation, and clear technical communication.

GPT-5.6 can reason broadly, write substantial code, and produce polished documents. Those strengths also create predictable failure modes: solving a larger problem than requested, treating plausible methodology as established fact, adding machinery before proving its value, or turning a simple result into an oversized report. GPT Tooling addresses those failure modes by separating three responsibilities instead of asking one monolithic prompt to optimize everything at once.

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
4. installs Plinth, Quire, and Ponytail from that marketplace;
5. verifies that all three modules were installed from this checkout.

Review and trust the bundled hooks after installation, then start a new Codex thread so the session and subagent policies load from a clean context.

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
| Standard | `$quire-standard` | `/quire standard` | Forces ordinary and operational writing policy |
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
├── scripts/install.js
├── .gitmodules
└── README.md
```

Plinth and Quire each contain their own manifest, hooks, skill policy, progressive references, documentation, and behavioral checks. Ponytail remains an upstream Git submodule so the toolkit can pin and install a reviewed dependency without copying or silently drifting its code.

## Verification

Run the bundled mechanical checks from the repository root:

```bash
node plugins/plinth/hooks/plinth.js test
node plugins/plinth/scripts/install-agents.js test
node plugins/quire/hooks/quire.js test
node scripts/install.js test
```

Behavioral scenarios live in:

- [Plinth behavior](plugins/plinth/evals/behavior.md)
- [Quire behavior](plugins/quire/evals/behavior.md)

The mechanical checks protect manifests, hook contracts, routes, selector metadata, context budgets, submodule integrity, and installer behavior. The behavioral suites protect the policy outcomes without coupling them to exact prose.

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
