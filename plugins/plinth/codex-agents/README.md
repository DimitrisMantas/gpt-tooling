# Plinth Agents

These optional read-only agents extend Plinth with three independent review roles. They investigate a bounded question and return evidence-based findings to the parent agent. They do not edit files, implement fixes, or take ownership of the final decision.

| Agent | Scope |
| --- | --- |
| `plinth_code` | Whether the implementation faithfully satisfies the accepted requirement |
| `plinth_methods` | Whether the accepted method can support the intended interpretation |
| `plinth_claims` | Whether available evidence supports one consequential technical claim |

Use an agent only when its review axis is material to the task. The parent agent supplies the bounded question, relevant artifacts, requirements, and evidence. It retains synthesis and decision ownership. A clean review is a valid result, and an unresolved result should identify the evidence needed to settle it.

## Code

`plinth_code` reviews implementation fidelity. Use it after a meaningful code change when incorrect behavior, violated invariants, data loss, security boundaries, concurrency, lifecycle behavior, compatibility, or an untested material path could affect the result. It traces the relevant execution path and compares the implementation with the accepted requirement and design.

This agent is not a general style reviewer. Do not use it to request aesthetic refactoring, speculative abstractions, or a repository-wide audit. Ponytail already governs unnecessary implementation complexity.

For example, suppose a shared data-loading function was changed to enforce a boundary condition. The change affects several callers, and a local unit test passes. A useful request to the parent agent would be:

> Use `plinth_code` to review the data-loading change against the accepted boundary rule. Trace every affected caller, check whether the rule is enforced at the shared boundary, and determine whether the current tests directly cover the material behavior. Report only defects or unresolved implementation concerns that could affect the requirement.

The agent should return a concise explanation of any defect, the supporting code or test evidence, its consequence, and the condition that would resolve it. If the implementation satisfies the requirement and no material path remains unverified, it should say so plainly.

## Methods

`plinth_methods` reviews methodological validity. Use it when a scientific, statistical, experimental, analytical, or evaluation choice can change what a result means. It checks whether the design measures the intended quantity, preserves the inference boundary, and avoids material leakage, dependence errors, confounding, invalid aggregation, or unsupported interpretation.

Use this agent before implementation review when the method determines whether the implementation is meaningful. It is especially useful for an unfamiliar method, a custom combination of established methods, or a consequential validation design. It should not reopen an accepted choice merely because another valid method exists.

For example, suppose an empirical study uses grouped validation because observations within a group are dependent. The grouping rule is accepted, but its ability to represent the intended deployment setting needs independent review. A useful request would be:

> Use `plinth_methods` to review the accepted grouped validation design. Determine whether the grouping unit matches the deployment boundary, whether any information can cross from training to evaluation, and whether the reported metric can support the intended performance claim. Use the supplied protocol, data schema, and evaluation outputs. Do not propose a different method unless the current design has a material validity problem.

The response should distinguish a demonstrated methodological defect from an unresolved question. It should identify the evidence that controls the conclusion and avoid expanding the review into a general literature survey unless stronger external evidence could change the decision.

## Claims

`plinth_claims` validates one consequential technical claim or reviewer finding whose evidence is not yet decisive. Use it when a claim could create substantial work, change a technical conclusion, alter a release decision, or justify departure from established practice. It is also useful when two reviewers disagree about a material fact.

This agent does not repeat a broad review. Give it one claim, the evidence already available, and the decision that depends on the answer. Trivial, stylistic, or already decisive findings do not need a separate claim-validation pass.

For example, suppose a reviewer states that a measured improvement demonstrates that a system is ready for deployment, but the evaluation covers only part of the operating conditions. A useful request would be:

> Use `plinth_claims` to evaluate the claim that the measured improvement demonstrates deployment readiness. Check whether the evaluation conditions, uncertainty, comparison baseline, and failure cases support that conclusion. State whether the evidence supports the claim, contradicts it, or leaves it unresolved, and identify the exact missing evidence if the conclusion is not yet justified.

The response should remain focused on that claim. It should not design a new evaluation program unless the parent agent asks for one after considering the validation result.

## Choosing and sequencing agents

Do not run all three agents by default. Choose the smallest review surface that addresses the material uncertainty.

- Use Methods first when an invalid method would make implementation quality irrelevant.
- Use Code when the method and requirement are settled but their implementation needs independent verification.
- Use Claims after a consequential finding or conclusion remains uncertain despite the available project evidence.

The parent agent should synthesize the responses in ordinary technical prose, decide which findings are material, and ask an agent to verify a fix only when that additional pass can change the completion decision.

## Installation

Install the profiles from the repository root:

```bash
node plugins/plinth/scripts/install-agents.js
```
