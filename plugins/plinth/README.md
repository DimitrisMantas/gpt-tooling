# Plinth

The engineering module of GPT Tooling.

[Return to GPT Tooling](../../README.md)

Plinth provides the stable technical foundation beneath implementation and communication. It helps Codex produce the best engineering result available within the actual requirements, evidence, resources, risk, and preference for conventional solutions. It applies to software, systems, hardware, interfaces, models, methods, experiments, operations, validation, and reviews.

The name reflects its role: Plinth supports the work without becoming the work. Its policy should shape decisions and verification while remaining mostly invisible in the final artifact.

## Why Plinth exists

Capable models can generate a sophisticated answer before they have established what the project needs, what the evidence supports, or whether a standard solution already works. They can also react to ambiguity by expanding research, metrics, agents, and process until the engineering task becomes a methodology exercise.

Plinth controls those tendencies without making conventionality an end in itself. It starts from established practice, requires complexity to answer a material limitation, and increases the validation burden as novelty or consequence grows. Ordinary competent judgment remains sufficient for familiar, reversible, low-consequence choices when more research is unlikely to change the action.

## What Plinth owns

Plinth governs:

- requirements, constraints, and accepted design;
- technical and interface semantics;
- methodology and evidence obligations;
- uncertainty, claim boundaries, and accepted limitations;
- engineering risk, review, and verification;
- technical teaching at consequential decision boundaries.

It does not own source-code style or natural-language style. [Ponytail](../ponytail/README.md) governs implementation economy. [Quire](../quire/README.md) governs expression and document form while preserving Plinth's technical meaning.

## Operating model

### Use typed authority

Authority depends on the question:

| Question | Primary authority |
| --- | --- |
| What should the project do? | Current user instructions and accepted project specification |
| What does the project do now? | Repository, configuration, data, tests, artifacts, and observed behavior |
| What does an external interface guarantee? | Current standard, specification, or official documentation |
| What supports a scientific or analytical claim? | Strongest applicable methodological evidence |
| Why was an earlier decision made? | Design records, prior discussion, and recorded recommendations, subject to current evidence |

Model knowledge is a starting hypothesis when stronger authority is unavailable. It does not outrank current project or governed external evidence.

### Control complexity

Plinth starts with the simplest established approach that fully satisfies the requirement. Each added abstraction, dependency, method, metric, agent, or workflow layer must address a named material limitation.

`Boring` is retained only as shorthand for conventional, legible, reviewable, testable, maintainable, and replaceable. The objective is the best fit-for-purpose result, not maximum conventionality.

Departure from established practice remains available when an explicit requirement, demonstrated limitation, direct project evidence, authoritative external evidence, or targeted experiment provides a material reason. Novelty raises the burden for evidence, validation, monitoring, and rollback.

### Match evidence to the decision

External research is warranted when unresolved judgment is consequential, unfamiliar, contested, scientifically material, or uncertain enough that stronger evidence could change the decision. Research depth should follow consequence, uncertainty, reversibility, evidence cost, and decision value.

Source assessment considers applicability, methodological rigor, review and publication process, the established standing and relevant track record of venues and contributors, independent replication or convergence, transparency, conflicts, currency, and correction status. Reputation and uptake are supporting signals. They do not replace examination of the evidence.

Peer-reviewed methodological work and convergent evidence are strong defaults for mature scientific claims. Standards, official documentation, foundational works, established books, technical reports, preprints, source code, and direct project evidence remain appropriate when they are the best authority for the specific claim.

### Resolve decisions in dependency order

Plinth resolves inspectable facts before asking the user. When several real decisions remain, it identifies their dependencies and asks only for the earliest unresolved decision needed to make downstream choices meaningful. Consequential questions include a recommendation and the decision boundary the user needs to understand.

This produces the intended interaction: investigate the problem and evidence aggressively, involve the user minimally, and preserve user ownership where judgment actually matters.

### Verify claims directly

A changed implementation is not evidence that a defect is fixed. A reviewer report is not evidence that a claim is correct. Before making a material success claim, Plinth seeks the most direct practical evidence available. When direct verification is unavailable or disproportionate, it states what was verified and what remains unverified.

Requirement correctness, methodological validity, implementation fidelity, and evidence or claim fidelity remain independent axes. Strength on one axis cannot compensate for a material failure on another.

### Accept null results and stopping conditions

Clean reviews and null empirical results are valid outcomes. Plinth does not create defects, metrics, or recommendations merely to populate a report.

Autonomous review or goal loops require an externally legible completion criterion. They stop when the agreed success conditions hold, blocking material findings are resolved, and remaining uncertainty cannot change the next engineering action. Subjective loops such as “improve until perfect” are not stable control mechanisms.

## Debugging discipline

For difficult defects, Plinth first seeks the smallest executable signal that reproduces the actual symptom. It then compares the failure with the nearest known-good case, identifies the smallest material delta, forms falsifiable hypotheses, fixes the root cause, and verifies the fix with the same signal.

This approach favors a fast deterministic reproducer. For stochastic failures, it seeks a reproduction rate high enough to distinguish hypotheses. Static theorizing is reserved for cases where an executable signal is unavailable or disproportionately expensive.

## Review and feedback

Technical feedback is evidence or a proposal to evaluate. Reviewer identity does not confer authority. Before applying a consequential recommendation, Plinth checks whether its premises hold in the current project, whether it conflicts with accepted requirements, and whether direct evidence supports it.

Optional Plinth agents are documented in the [agent guide](codex-agents/README.md):

- `plinth_methods.toml` checks scientific, statistical, experimental, and evaluation validity.
- `plinth_code.toml` checks implementation fidelity and material code-level defects.
- `plinth_claims.toml` checks whether available evidence supports a consequential claim.

Use one only for a distinct material failure mode or bounded investigation that benefits from fresh context. The parent agent retains synthesis and decision ownership.

## Progressive policy

The compact [SKILL.md](skills/plinth/SKILL.md) governs behavior and routes to four focused references:

| Reference | Use it for |
| --- | --- |
| [Decisions](skills/plinth/references/decisions.md) | Method selection, design, source evaluation, project conventions, teaching, and engineering sufficiency |
| [Evidence](skills/plinth/references/evidence.md) | Experiments, statistics, machine learning, data, validation, metrics, and stochastic stability |
| [Verification](skills/plinth/references/verification.md) | Debugging, direct verification, boundaries, reviewers, durable goals, and bounded iteration |
| [Integration](skills/plinth/references/integration.md) | Technical artifacts, toolkit maintenance, and composition with Ponytail and Quire |

The lifecycle hook injects only a concise route. Each agent context reads the complete base skill once when needed and loads task-specific references progressively.

## Installation

The supported installation path is the [repository installer](../../README.md#installation), which installs Plinth with Quire and the pinned Ponytail dependency.

To make the optional reviewer profiles available in the local Codex agent directory, run:

```bash
node plugins/plinth/scripts/install-agents.js
```

Review and trust the Plinth hook before use. Its `SessionStart` and `SubagentStart` routes keep the discipline active in parent and delegated contexts.

## Validation

Run the mechanical checks from the repository root:

```bash
node plugins/plinth/hooks/plinth.js test
node plugins/plinth/scripts/install-agents.js test
```

Use [behavioral evaluations](evals/behavior.md) to assess policy changes on representative engineering pressure. The suite tests outcomes such as proportional research, complexity restraint, dependency-ordered decisions, direct verification, semantic boundaries, null results, goal stopping conditions, and composition with Ponytail and Quire.

## Maintenance rule

Do not add standing policy for hypothetical failures. When a repeated or consequential failure occurs in real work, identify its general cause, add the smallest rule that prevents that failure class, and add a behavioral evaluation that reproduces the original pressure.

## License

Plinth is available under the [MIT License](LICENSE).
