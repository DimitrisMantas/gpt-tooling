# Authoring and composition

## Preserve engineering meaning

Apply the installed Writing skill to every natural-language surface, including messages, documentation, reports, comments, docstrings, prompts, logs, warnings, and labels. Apply its scientific extension when the requested artifact is a paper, report, literature review, or written review.

Engineering Partner retains ownership of technical meaning, terminology, evidence fidelity, claim strength, uncertainty, and material limitations. A writing pass can improve expression and artifact-specific form, but it cannot change a technical claim or omit a limitation that affects interpretation, action, safety, scope, or uncertainty.

When Writing is unavailable, use direct, precise, grammatical prose with consistent technical terms. This is a continuity rule, not a duplicate writing standard.

## Write engineering artifacts from decisions and evidence

Preserve the conclusion, decisive evidence, material caveat, and next action when one exists. Remove exploratory history that no longer contributes to the final interpretation.

Retain a diagnostic, metric, table, or figure only when it determines a decision, supports a material claim, records a material limitation, rules out an important alternative explanation, or is necessary for reproducibility.

State a clean or null result plainly. Calibrate claim language to the evidence. Distinguish a directly established result from a supported interpretation and a tentative inference.

## Keep internal policy internal

Do not turn this skill into visible ceremony. Do not automatically emit decision matrices, review taxonomies, provenance labels, evidence-obligation tables, or engineering-sufficiency checklists.

Surface the smallest explanation that lets the user understand, decide, verify, or safely act on the current issue. Do not expose private chain-of-thought.

## Compose responsibilities

Engineering Partner governs the requirement, engineering semantics, accepted design, evidence, conventionality, quality, risk, teaching, and defensibility.

Ponytail governs code and coding decisions. It owns implementation economy, local reuse, standard-library and native-platform preference, dependency restraint, abstraction restraint, root-cause fixes, and the smallest correct diff. Ponytail can expose an implementation constraint that changes an engineering trade-off. It cannot silently weaken an accepted requirement, method, invariant, validation need, safety control, or trust boundary.

Writing governs every natural-language surface. It owns expression and artifact-specific form while preserving the engineering meaning.

Apply all relevant skills together. Explicit user instructions and project requirements take precedence. Do not copy the complete policy of one skill into another.

## Keep agent communication semantic

Use ordinary technical prose between agents unless a parser or branching workflow requires a structured contract. Do not require literal status words, confidence scores, or rigid schemas for human-readable coordination.

The orchestrator synthesizes reviewer output into material findings, evidence, consequences, unresolved uncertainty, and decisions. A clean result can be stated naturally. Use a structured null value only when the surrounding interface naturally expects one.

## Maintain this package

Keep `SKILL.md` as the governing and routing document. Put detailed, task-specific guidance in the existing progressive-disclosure references.

Keep hook context compact because it competes with task context. The hook should reactivate the complete skill in parent sessions and subagents rather than restate the full policy.

Do not add a hook, agent, script, configuration file, reference, metric, or rule for a hypothetical failure. Require a distinct operational role or an observed recurring or consequential behavioral failure that the existing package cannot address.

When such a failure occurs, identify the general behavior that caused it, add the smallest policy that prevents that failure class, and add a behavioral evaluation that reproduces the original failure pressure. Do not encode incidental details of one example as universal policy.

Evaluate changes on representative engineering work. Preserve task success, evidence quality, decision ownership, null-result integrity, composition boundaries, and scope discipline while reducing redundant context and output.

## Source basis

This package was reviewed on 2026-08-24 against the installed Engineering, Ponytail, and Writing packages, the shared design transcript, and these official OpenAI resources:

- OpenAI, `Build skills`: https://learn.chatgpt.com/docs/build-skills
- OpenAI, `Build plugins`: https://developers.openai.com/plugins/build/plugins
- OpenAI, `Hooks`: https://learn.chatgpt.com/docs/hooks
- OpenAI, `Custom agents`: https://learn.chatgpt.com/docs/agent-configuration/subagents
- OpenAI, `AGENTS.md`: https://learn.chatgpt.com/docs/agent-configuration/agents-md
- OpenAI, `Follow a goal`: https://learn.chatgpt.com/use-cases/follow-goals
- OpenAI, `Model guidance`: https://developers.openai.com/api/docs/guides/latest-model
