# Plinth Agents

These optional read-only agents extend Plinth with three independent review roles. They investigate a bounded question and return evidence-based findings to the parent agent. They do not edit files, implement fixes, or take ownership of the final decision.

The profiles inherit model selection from the spawn request, configured subagent default, or parent session. They retain `high` reasoning effort for review. Choose a compatible model in the calling environment; the package does not pin reviewer roles to a model identifier. This follows the [custom-agent configuration rules](https://learn.chatgpt.com/docs/agent-configuration/subagents).

The natural dependency order is Methods, Code, then Claims:

| Agent | Question |
| --- | --- |
| `plinth_methods` | Can the accepted method support the intended interpretation? |
| `plinth_code` | Does the implementation faithfully realize the accepted requirement and method? |
| `plinth_claims` | Does the available evidence support one consequential technical claim? |

This order is a reasoning dependency, not a mandatory three-agent workflow. Use only the smallest review surface that addresses a material uncertainty. A clean review is a valid result, and an unresolved result should identify the evidence needed to settle it.

## Methods

`plinth_methods` reviews methodological validity. Use it when a scientific, statistical, experimental, analytical, or evaluation choice can change what a result means. It checks whether the design measures the intended quantity, preserves the inference boundary, and avoids material leakage, dependence errors, confounding, invalid aggregation, or unsupported interpretation.

Use this agent before implementation review when the method determines whether the implementation is meaningful. It is especially useful for an unfamiliar method, a custom combination of established methods, or a consequential validation design. It should not reopen an accepted choice merely because another valid method exists.

For example, suppose an empirical study uses grouped validation because observations within a group are dependent. The grouping rule is accepted, but its ability to represent the intended deployment setting needs independent review. A useful request to the parent agent would be:

> Use `plinth_methods` to review the accepted grouped validation design. Determine whether the grouping unit matches the deployment boundary, whether any information can cross from training to evaluation, and whether the reported metric can support the intended performance claim. Use the supplied protocol, data schema, and evaluation outputs. Do not propose a different method unless the current design has a material validity problem.

The response should distinguish a demonstrated methodological defect from an unresolved question. It should identify the evidence that controls the conclusion and avoid expanding the review into a general literature survey unless stronger external evidence could change the decision.

## Code

`plinth_code` reviews implementation fidelity. Use it after the requirement and method are settled and a meaningful code change could introduce incorrect behavior, violated invariants, data loss, trust-boundary failures, concurrency or lifecycle errors, compatibility regressions, or an untested material path. It traces the relevant execution path and compares the implementation with the accepted requirement and design.

This agent is not a general style or simplification reviewer. It can report unnecessary complexity when that complexity creates a material correctness, verification, or maintenance risk in the reviewed implementation. It does not search for code to delete merely because a shorter implementation exists.

For example, suppose a shared data-loading function was changed to enforce a boundary condition. The change affects several callers, and a local unit test passes. A useful request would be:

> Use `plinth_code` to review the data-loading change against the accepted boundary rule. Trace every affected caller, check whether the rule is enforced at the shared boundary, and determine whether the current tests directly cover the material behavior. Report only defects or unresolved implementation concerns that could affect the requirement.

The agent should return a concise explanation of any defect, the supporting code or test evidence, its consequence, and the condition that would resolve it. If the implementation satisfies the requirement and no material path remains unverified, it should say so plainly.

## Claims

`plinth_claims` validates one consequential technical claim or reviewer finding whose evidence is not yet decisive. Use it when a claim could create substantial work, change a technical conclusion, alter a release decision, or justify departure from established practice. It is also useful when two reviewers disagree about a material fact.

This agent does not repeat a broad review. Give it one claim, the evidence already available, and the decision that depends on the answer. Trivial, stylistic, or already decisive findings do not need a separate claim-validation pass.

For example, suppose a reviewer states that a measured improvement demonstrates that a system is ready for deployment, but the evaluation covers only part of the operating conditions. A useful request would be:

> Use `plinth_claims` to evaluate the claim that the measured improvement demonstrates deployment readiness. Check whether the evaluation conditions, uncertainty, comparison baseline, and failure cases support that conclusion. State whether the evidence supports the claim, contradicts it, or leaves it unresolved, and identify the exact missing evidence if the conclusion is not yet justified.

The response should remain focused on that claim. It should not design a new evaluation program unless the parent agent asks for one after considering the validation result.

## Relationship to Ponytail

Plinth and Ponytail review different failure classes. `plinth_code` asks whether the implementation is correct for the accepted requirement and method. Ponytail asks whether the implementation contains more code, dependencies, abstraction, or flexibility than the requirement earns. A clean result from one does not imply a clean result from the other.

| Tool | Scope | Typical question |
| --- | --- | --- |
| Ponytail | Persistent implementation discipline while code is designed, written, fixed, or refactored | What is the smallest sound implementation? |
| `ponytail-review` | Over-engineering in the current diff; correctness, security, and performance are out of scope | What can this change delete, inline, or replace with standard or native functionality? |
| `ponytail-audit` | The same complexity review across the complete repository | Where is the largest removable repository-wide complexity? |
| `ponytail-debt` | Existing `ponytail:` comments that record deliberate simplifications, their ceilings, and upgrade triggers | What deliberate shortcuts have already been recorded? |
| `ponytail-gain` | Ponytail's benchmark-based impact summary | What does Ponytail typically save? |
| `ponytail-help` | Command and mode reference | Which Ponytail capability should I invoke? |
| `plinth_code` | Requirement fidelity, invariants, execution behavior, material regressions, and direct verification | Does this implementation work as accepted, and is that claim directly supported? |

For the same changed function, `plinth_code` might find that one caller bypasses the required boundary check. `ponytail-review` might instead find that the custom validation wrapper duplicates a standard-library operation. `ponytail-debt` would report neither issue unless the source already contained a `ponytail:` comment describing a deliberate shortcut.

Use Ponytail during implementation. Add `plinth_code` when correctness warrants an independent review. Add `ponytail-review` when unnecessary complexity in the diff is itself a material concern. Use both when both axes matter, but keep their findings separate.

## Sequencing

When all three Plinth axes are material, review them in this order:

1. Methods establishes that the technical design can answer the intended question.
2. Code establishes that the implementation faithfully realizes that design.
3. Claims validates a consequential conclusion that remains uncertain after the first two reviews.

Claims is not an automatic final stage. Invoke it only for a specific unresolved assertion. The parent agent should synthesize all responses in ordinary technical prose, decide which findings are material, and ask an agent to verify a fix only when that additional pass can change the completion decision.

## Installation

Install the profiles from the repository root:

```bash
node plugins/plinth/scripts/install-agents.js
```
