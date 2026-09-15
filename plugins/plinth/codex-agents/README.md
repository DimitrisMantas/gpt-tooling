# Plinth Agents

These installable read-only agents extend Plinth with three independent review roles. Once installed, Plinth routes material review questions to them automatically; the user does not need to select a profile. They investigate a bounded question and return findings to the parent agent. They do not edit files, implement fixes, or own the final decision.

The profiles inherit model selection from the spawn request, configured subagent default, or parent session. They use `medium` reasoning effort as the balanced default for review. Choose a compatible model in the calling environment; the package does not pin reviewer roles to a model identifier. This follows the [custom-agent configuration rules](https://learn.chatgpt.com/docs/agent-configuration/subagents).

The natural dependency order is Approach, Software, then Findings:

| Agent | Question |
| --- | --- |
| `plinth_approach_reviewer` | Can the proposed engineering direction satisfy the intended outcome, and is an established alternative materially better for the named objective? |
| `plinth_software_reviewer` | Does the software faithfully realize the accepted requirement and approach, and is there a materially better established implementation? |
| `plinth_findings_reviewer` | Do the available facts and evidence support the consequential finding or a more defensible interpretation? |

This order expresses a reasoning dependency. It does not require a three-agent workflow. Plinth uses the smallest review surface that addresses a material uncertainty. A clean review is valid; an unresolved review identifies the evidence or user-owned decision needed to settle it.

## Approach

`plinth_approach_reviewer` reviews consequential engineering directions and credible alternatives. Its scope includes requirement interpretations, architectures, scientific or analytical methods, evaluation designs, operating plans, and other decisions that determine whether later work can achieve the intended outcome. It works before a repository exists from requirements, designs, prototypes, and governed external semantics, and in an existing repository from the current implementation, tests, configuration, and project decisions.

Use it when an approach can materially change validity, simplicity, cost, robustness, interpretability, or verification burden. For empirical work, it also checks whether the design measures the intended quantity and preserves the relevant inference boundary. It should not reopen an accepted choice merely because another valid approach exists.

For example:

> Use `plinth_approach_reviewer` in normal mode to review the grouped validation design. Determine whether the grouping unit matches the deployment boundary, whether information can cross from training to evaluation, whether the metric can support the intended conclusion, and whether an established alternative materially improves validity or simplicity under the accepted deployment objective. Use the supplied protocol, data schema, and evaluation outputs.

## Software

`plinth_software_reviewer` reviews software correctness, requirement fidelity, material regressions, and credible implementation alternatives. Use it after the requirement and relevant approach are sufficiently settled when a meaningful code change could introduce incorrect behavior, violated invariants, data loss, trust-boundary failures, concurrency or lifecycle errors, compatibility regressions, an untested material path, or avoidable complexity that changes a material engineering objective. It traces the real execution path and compares the software with the accepted contract.

It is not a general style or simplification reviewer. It reports complexity when that complexity creates a material correctness, verification, or maintenance risk, or when a simpler established implementation can materially improve the accepted result.

For example:

> Use `plinth_software_reviewer` in adversarial mode to review the data-loading change against the accepted boundary rule. Trace every affected caller, check whether the rule is enforced at the shared boundary, determine whether the tests directly cover the material behavior, and compare a simpler established implementation if it preserves the contract with less risk.

## Findings

`plinth_findings_reviewer` reviews one consequential finding or interpretation whose support is not yet decisive. Use it when a conclusion could create substantial work, change a technical decision, alter a release decision, justify departure from established practice, or resolve a material disagreement among the user, orchestrator, repository, or reviewers.

Give it the finding, the available facts and evidence, and the decision that depends on the answer. It considers alternative explanations and narrower or more defensible formulations without presuming that the original conclusion is wrong.

For example:

> Use `plinth_findings_reviewer` in normal mode to assess the finding that the measured improvement demonstrates deployment readiness. Check whether the evaluation conditions, uncertainty, comparison baseline, and failure cases support that interpretation. Identify a narrower defensible formulation if needed, and state the exact missing evidence when the result remains unresolved.

## Relationship to Ponytail

Plinth and Ponytail have separate responsibilities. `plinth_software_reviewer` independently evaluates correctness against the accepted requirement and approach and checks decision-relevant implementation alternatives. Ponytail continuously seeks the smallest sound implementation while code is designed and changed.

| Tool | Scope | Typical question |
| --- | --- | --- |
| Ponytail | Persistent implementation discipline while code is designed, written, fixed, or refactored | What is the smallest sound implementation? |
| `ponytail-review` | Removable over-engineering in the current diff | What can this change delete, inline, or replace with standard or native functionality? |
| `ponytail-audit` | The same complexity review across the complete repository | Where is the largest removable repository-wide complexity? |
| `ponytail-debt` | Existing `ponytail:` comments that record deliberate simplifications | What shortcuts and upgrade triggers have already been recorded? |
| `ponytail-gain` | Ponytail's benchmark-based impact summary | What does Ponytail typically save? |
| `ponytail-help` | Command and mode reference | Which Ponytail capability should I invoke? |
| `plinth_software_reviewer` | Requirement fidelity, invariants, execution behavior, regressions, direct verification, and decision-relevant alternatives | Does this software work as accepted, and is there a materially better established implementation? |

Use Ponytail during implementation. Plinth automatically adds `plinth_software_reviewer` when correctness or a material implementation trade-off warrants independent review. Add `ponytail-review` when the user requests a focused over-engineering review or removable complexity is itself the assigned question. Keep the results separate when both axes matter.

## Review modes

All three profiles support normal and adversarial review. The mode belongs in the dynamic task given to the reviewer; duplicate profiles are unnecessary.

Normal review independently evaluates the current proposal and credible established alternatives against named objectives. Adversarial review applies stronger pressure to assumptions, boundary conditions, counterexamples, alternative explanations, and competing approaches or implementations. Neither mode prescribes agreement or contradiction. A supported proposal and a clean review remain valid results.

Reviewers treat proposals consistently regardless of whether they came from the user, orchestrator, repository, or another reviewer. When a missing user-owned requirement prevents a sound comparison, the reviewer returns one precise alignment question to the orchestrator. The orchestrator owns user interaction, synthesis, teaching, and the final decision.

## Automatic routing

Plinth chooses reviewers from the questions that can change the engineering decision:

1. Approach review establishes whether the proposed direction can achieve the intended outcome and compares material alternatives.
2. Software review establishes whether the implementation faithfully realizes the accepted direction and checks material implementation alternatives.
3. Findings review examines a consequential conclusion or interpretation that remains uncertain.

The orchestrator may use one reviewer, several independent reviewers on distinct axes, or multiple fresh-context reviewers on the same consequential question when adversarial comparison is justified. It supplies a dynamic task packet with the objective, accepted constraints, relevant artifacts, known uncertainties, exclusions, review mode, and completion condition. Reviewers do not recursively dispatch agents unless the orchestrator explicitly authorizes it.

## Installation

Install the profiles from the repository root:

```bash
node plugins/plinth/scripts/install-agents.js
```

After upgrading from profiles named `plinth_methods`, `plinth_code`, and `plinth_claims`, rerun the installer with `--force` to remove those legacy profiles and install the renamed set.
