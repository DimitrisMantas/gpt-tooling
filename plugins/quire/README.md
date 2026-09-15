# Quire

The writing module of GPT Tooling.

[Return to GPT Tooling](../../README.md)

Quire governs every natural-language surface that is not source-code syntax: responses, documents, READMEs, comments, docstrings, command-line output, logs, diagnostics, warnings, labels, help text, prompts, and interagent communication.

The name reflects the product's role. A quire gathers pages into a coherent written object. This plugin gathers accepted technical meaning into communication that is direct, readable, consistent, and appropriate for its audience without changing the underlying result.

## Why Quire exists

Model-generated prose often fails in two opposite ways. It can be thin and generic, or it can be polished beyond the evidence, filled with repetitive qualifications, decorative structure, synthetic contrast, and unnecessary reporting ceremony. A single scientific-writing policy applied to every occurrence of “report” or “review” makes the second problem worse.

Quire separates common writing principles from a progressively loaded Technical extension. It routes by the artifact's function, applies review effort in proportion to the surface, and preserves the result state established by the technical record.

## Authority boundary

Quire owns:

- natural-language expression and information order;
- document organization and navigation;
- readability and terminology consistency;
- genre, venue, and medium conventions;
- faithful presentation of accepted evidence, uncertainty, and limitations.

[Plinth](../plinth/README.md) owns requirements, methodology, technical semantics, evidence obligations, statistical interpretation, claim strength, accepted limitations, decisions, review, and verification. Quire can flag a missing or unsupported technical element. It cannot silently repair the text by inventing an analysis, metric, experiment, uncertainty estimate, limitation, evidence requirement, or conclusion.

[Ponytail](../ponytail/README.md) owns source-code implementation and implementation economy. Quire governs the words in code comments, docstrings, messages, and documentation. Project formatters own mechanical source syntax. Preserve semantic newlines and required target-format syntax; do not manually split prose or literal text to satisfy a line-length diagnostic.

This boundary protects a central invariant: better prose must not manufacture significance, novelty, causality, certainty, or a preferred outcome. Null, mixed, adverse, negative, and unresolved results remain in that state.

## Writing modes

Quire has three persistent modes. The plugin exposes each mode as an explicit-only skill so the Codex UI can show a clear selector label.

| UI label | Skill | Command | Behavior |
| --- | --- | --- | --- |
| Automatic | `$quire-auto` | `/quire auto` | Selects Standard or Technical from the artifact's function |
| Standard | `$quire-standard` | `/quire standard` | Forces ordinary and operational writing, including technical subject matter that does not require the Technical extension |
| Technical | `$quire-technical` | `/quire technical` | Forces Standard plus the technical and scientific extension |

Automatic is the default. Mode changes persist through the plugin data directory until another selector changes the mode.

### Automatic routing

Routing follows purpose and governing conventions, not artifact nouns.

Standard examples:

- ordinary conversation and explanations;
- operational messages, logs, warnings, and diagnostics;
- product or performance reviews;
- annual business reports;
- short code comments and interface text.

Technical examples:

- scientific and empirical papers;
- literature and methodological reviews;
- evidence-bearing engineering or validation reports;
- technical records with reproducibility obligations;
- artifacts governed by scientific or technical reporting conventions.

The phrase “the report parser failed” does not activate Technical mode. An engineering validation report built from accepted requirements, measurements, and test results normally does.

## Standard policy

The Standard branch applies common principles across every natural-language surface while adapting their realization to the medium and audience.

It favors:

- the result or controlling message before process narration;
- one consistent term for one concept;
- concrete actors, actions, quantities, conditions, and consequences;
- enough context to understand and act, without standalone-document ceremony on short messages;
- familiar forms and direct sentence structure;
- material negative or limiting information without repetitive qualification;
- proportionate final checks.

Sentence-length thresholds drawn from controlled technical English are diagnostics, not mandatory limits. Punctuation follows the target style and technical convention. Let the project formatter lay out source syntax while preserving complete prose and literal text, including comments and docstrings.

Quire reserves binary contrast for material distinctions, corrections, expectation reversals, and trade-offs. It removes familiar or irrelevant negative setup when the affirmative point carries the useful meaning. Its default punctuation style uses colons to introduce lists after a complete lead-in, commas for simple in-line items, and semicolons for complex in-line items with internal punctuation or clause-like content. Displayed lists or separate sentences take priority when they scan more clearly.

Short operational text receives checks for correctness, clarity, terminology, actionability, and unnecessary wording. Substantive documents also receive checks for audience, structure, background, uncertainty, scope, repetition, and standalone readability.

## Technical extension

The [Technical extension](skills/quire/references/technical.md) adds evidence-aware reporting behavior without taking over methodology.

It requires Quire to:

- preserve the accepted technical result and its inference boundary;
- distinguish observations, calculated results, interpretations, assumptions, estimates, and recommendations;
- calibrate claims to available evidence and uncertainty;
- preserve negative, null, mixed, and unexpected results;
- include reproducibility details that matter to the accepted claim;
- use a reporting guideline only when its scope genuinely covers the study;
- follow target venue and established disciplinary practice when no applicable checklist governs the artifact.

Biomedical reporting frameworks remain domain-specific examples. A generic label such as “prediction model” is not enough to import a guideline from another discipline.

## Interagent and operational writing

Interagent messages use concise natural technical prose. They preserve findings, evidence, uncertainty, dependencies, and requested actions without expanding into standalone reports. Structured status tokens, schemas, headings, or confidence scores are reserved for workflows that actually parse them.

Logs, diagnostics, and interface text retain the same principles at the level appropriate to their purpose. They should be accurate, concise, and actionable. They do not receive a paper-style editorial pass.

## Grounding

Quire's Standard policy adapts the controlled-language principles in the official [ASD-STE100 specification](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) without claiming formal compliance. The official PDF is linked rather than redistributed.

Current [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model) informs prompt economy, outcome-oriented scope, and explicit autonomy boundaries.

[blader/humanizer](https://github.com/blader/humanizer), [Stop Slop](https://github.com/hardikpandya/stop-slop), and Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) are secondary anti-pattern diagnostics. Humanizer substantially operationalizes patterns from the Wikipedia field guide, so they are related sources rather than independent evidence. They guide editing for synthetic prose tendencies and do not govern technical or scientific meaning.

The Technical extension also draws on established scientific and technical communication sources, including [ICMJE manuscript recommendations](https://www.icmje.org/recommendations/browse/manuscript-preparation/preparing-for-submission.html), [EQUATOR reporting guidance](https://www.equator-network.org/about-us/what-is-a-reporting-guideline/), [ANSI/NISO Z39.18](https://www.niso.org/publications/z39.18-2005-r2010), the [CDC Clear Communication Index](https://www.cdc.gov/ccindex/index.html), and Gopen and Swan's [Science of Scientific Writing](https://plantscience.psu.edu/research/labs/guiltinan/resources/readings-in-scientific-method-and-writing/the-science-of-scientific-writing/view).

## Plugin structure

```text
plugins/quire/
├── .codex-plugin/plugin.json
├── hooks/
│   ├── hooks.json
│   └── quire.js
├── skills/
│   ├── quire/
│   ├── quire-auto/
│   ├── quire-standard/
│   └── quire-technical/
├── evals/behavior.md
└── README.md
```

The lifecycle hook injects a concise route rather than the complete policy. Automatic mode loads the Technical extension progressively only when the artifact requires it. The three selector skills exist to provide stable UI labels and send an explicit mode token to the prompt hook; they do not duplicate Quire's writing policy.

## Installation

The supported installation path is the [repository installer](../../README.md#installation), which installs Quire with Plinth and the pinned Ponytail dependency.

Review and trust the Quire hook before use. `SessionStart` and `SubagentStart` keep the policy active in parent and delegated contexts. `UserPromptSubmit` handles explicit mode selectors and stores only the selected mode.

## Validation

From the tooling repository root, run `node scripts/test.js`. Every mechanical and behavioral check must pass. See the [complete verification contract](../../README.md#verification) and [behavioral scenarios](evals/behavior.md).

## License

Quire is available under the [MIT License](LICENSE).
