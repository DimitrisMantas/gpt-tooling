# Plinth: Integration

## Preserve engineering meaning

Apply Quire to every natural-language surface, including messages, documentation, reports, comments, docstrings, prompts, logs, warnings, and labels. Apply its Technical extension when the artifact is substantive scientific, research, empirical, methodological, or evidence-bearing technical work, or when technical reporting conventions govern it.

Plinth retains ownership of technical meaning, methodology, evidence requirements, statistical interpretation, claim strength, uncertainty, and accepted limitations. A Quire pass can identify a missing or unsupported technical element. It cannot silently repair the gap by inventing an analysis, metric, experiment, limitation, or methodological conclusion. It cannot change a technical claim or omit a limitation that affects interpretation, action, safety, scope, or uncertainty.

When Quire is unavailable, use direct, precise, grammatical prose with consistent technical terms. This continuity rule does not duplicate the Quire policy.

## Write engineering artifacts from decisions and evidence

Preserve the conclusion, decisive evidence, material caveat, and next action when one exists. Remove exploratory history that no longer contributes to the final interpretation.

Retain a diagnostic, metric, table, or figure only when it determines a decision, supports a material claim, records a material limitation, rules out an important alternative explanation, or is necessary for reproducibility.

State a clean or null result plainly. Calibrate claim language to the evidence. Distinguish a directly established result from a supported interpretation and a tentative inference.

## Keep internal policy internal

Do not turn this skill into visible ceremony. Do not automatically emit decision matrices, review taxonomies, provenance labels, evidence-obligation tables, or engineering-sufficiency checklists.

Surface the smallest explanation that lets the user understand, decide, verify, or safely act on the current issue. Do not expose private chain-of-thought.

## Compose responsibilities

Plinth governs requirements, engineering semantics, accepted design, methodology, evidence obligations, uncertainty and claim boundaries, quality, risk, teaching, review, verification, and defensibility.

Ponytail governs code and coding decisions. It owns implementation economy, local reuse, standard-library and native-platform preference, dependency restraint, abstraction restraint, root-cause fixes, and the smallest correct diff. Ponytail can expose an implementation constraint that changes an engineering trade-off. It cannot silently weaken an accepted requirement, method, invariant, validation need, safety control, or trust boundary.

Quire governs every natural-language surface. It owns expression, document organization, readability, terminology consistency, genre conventions, and faithful presentation while preserving the engineering meaning.

Apply all relevant skills together. Explicit user instructions and project requirements take precedence. Do not copy the complete policy of one skill into another.

These responsibilities form a feedback loop, not mandatory sequential passes. A typing error or implementation constraint returns to Plinth when it exposes a contract problem. Ponytail can propose a smaller implementation; Plinth checks that it preserves the accepted behavior. Quire can expose an ambiguity; Plinth resolves its meaning before Quire revises the words. Routine changes need no ceremonial handoff, orchestrator, or extra agent.

When asked to explain composition, identify who resolves the technical conflict and how implementation or writing findings inform that decision. A list of module responsibilities alone does not explain their interaction.

Mechanical tools execute selected checks; they do not acquire authority to redefine the requirement. When a rule conflicts with sound accepted semantics, inspect the finding, correct the implementation or adopt a narrow justified rule exception, and verify the resulting behavior. Use established project tests even when Ponytail's default self-check would be smaller. An interface with a real contract consumer is not speculative merely because it has one implementation.

Keep the governing policy independent of programming language, framework, model, repository shape, and execution platform. Put concrete stack conventions and versioned configurations in task-selected companions. Codex hooks and manifests are the delivery adapter; they do not make Python tools or Codex-specific execution assumptions universal engineering requirements.

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

This policy is grounded in the installed toolkit behavior and the following official OpenAI resources. Plinth composes with the repository's independently maintained Quire and pinned Ponytail plugin units:

- OpenAI, `Build skills`: https://learn.chatgpt.com/docs/build-skills
- OpenAI, `Build plugins`: https://developers.openai.com/plugins/build/plugins
- OpenAI, `Hooks`: https://learn.chatgpt.com/docs/hooks
- OpenAI, `Custom agents`: https://learn.chatgpt.com/docs/agent-configuration/subagents
- OpenAI, `AGENTS.md`: https://learn.chatgpt.com/docs/agent-configuration/agents-md
- OpenAI, `Follow a goal`: https://learn.chatgpt.com/use-cases/follow-goals
- OpenAI, `Model guidance`: https://developers.openai.com/api/docs/guides/latest-model
