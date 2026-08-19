# Authoring and composition

## Write direct technical English

Apply these rules to engineering prose in documentation, prompts, docstrings, comments, messages, warnings, and logs unless a more specific artifact style requires something else.

- Use US English consistently.
- Use sentence case for headings.
- Use full sentences with normal punctuation for prose, docstrings, comments, messages, warnings, and logs. Code syntax, identifiers, raw data, and other grammar-exempt content do not need to form sentences.
- Prefer active voice and present tense when they are natural and precise.
- Put a necessary condition before the instruction that depends on it.
- Prefer subject-verb-object sentence structure and familiar words with their primary meanings.
- Use one term consistently for one concept. Do not vary terminology merely to avoid repetition.
- Define an unfamiliar abbreviation or specialized term before you rely on it.
- Break long noun chains into clearer phrases.
- Keep paragraphs focused on one topic and make the logical relation between sentences explicit.
- Use lists and tables only when they make comparison or procedure clearer than prose.

These rules follow established technical-writing guidance, but they do not require rigid simplification when technical precision needs a specialized term.

## Avoid common synthetic-writing patterns

Use Wikipedia's `Signs of AI writing` page as an editorial anti-pattern checklist, not as a writing standard or an AI detector. Avoid patterns that make technical prose inflated, vague, repetitive, or mechanically styled.

In particular:

- Do not exaggerate significance, impact, novelty, or broader implications.
- Do not use promotional or celebratory language.
- Do not use vague attributions such as `experts say` when a precise source is available.
- Do not add superficial summaries that repeat the preceding paragraph.
- Avoid generic high-frequency AI vocabulary when a plain technical term is more precise.
- Avoid patterned negative constructions such as `not X, but Y` when a direct positive statement is clearer.
- Do not force ideas into groups of three for rhetorical effect.
- Do not use elegant variation. Repeat the correct technical term.
- Avoid title case, decorative bold text, emojis, excessive em dashes, and unusual table layouts.
- Do not skip heading levels.
- Avoid canned collaborative phrases and performative enthusiasm.
- Do not stack low-value caveats. Include a limitation when it changes interpretation, action, or confidence in a material claim.

Prefer a period, comma, colon, or parentheses instead of an em dash when the sentence remains clear.

## Use controlled technical-English principles carefully

Use principles associated with ASD-STE100 when they improve clarity: controlled meaning, consistent terminology, simple sentence structure, and direct instructions.

Do not claim strict ASD-STE100 compliance unless the text has been checked against the current official specification and controlled vocabulary. Text that appears simple or technical is not automatically compliant with ASD-STE100.

## Keep comments and logs useful

A code comment should explain a purpose, constraint, non-obvious reason, or invariant. Do not restate code that is already clear.

A log or status message should state what happened, what object it affected when necessary, and what the user can do next if action is required. Avoid fragments such as `Done` when a complete sentence would be clearer.

A docstring should describe the callable or module precisely enough for its intended reader. Do not use a long docstring to compensate for an unnecessarily complex interface.

## Write reports from decisions and evidence

Preserve the conclusion, the evidence that supports it, the material caveat, and the next action when one exists. Remove repeated background and exploratory history that no longer contributes to the final interpretation.

Do not convert every diagnostic into a permanent section, metric, or table. Report only what determines a decision, supports a material claim, documents a material limitation, rules out an important alternative explanation, or is necessary for reproducibility.

A null result does not need narrative inflation. If the correct conclusion is that no material difference, defect, or supported effect was found, state that plainly and stop.

Calibrate claim language to evidence. Use `demonstrates` for a directly established result, `supports` for a justified interpretation, and `suggests` for a weaker inference. Do not use stronger language to make a result sound more important.

## Keep internal policy internal

Do not turn this skill into visible ceremony. Do not automatically emit decision matrices, review taxonomies, provenance labels, evidence-obligation tables, or engineering-sufficiency checklists in ordinary responses.

Use those structures internally. Surface only the parts that help the user understand or decide the current issue.

## Compose with Ponytail Full and the user's writing skill

Treat Engineering Partner as the cross-cutting engineering policy. It frames the problem, grounds consequential methods, protects evidence and inference boundaries, teaches the important decisions, and decides when review is warranted.

If Ponytail Full is available, apply it to implementation economy after Engineering Partner establishes the requirement, accepted design, and invariants. Ponytail owns reuse, code size, abstraction restraint, dependency restraint, and the smallest justified diff. It does not silently change accepted engineering semantics merely to reduce code.

If the user's dedicated writing skill is available, apply it to the prose artifact. That skill owns artifact-specific voice, structure, and editing choices. Engineering Partner still owns technical terminology, evidence fidelity, claim strength, and factual consistency. A writing pass must not change a technical claim or omit a material limitation solely for style.

These skills are complementary and can be active in the same task. The orchestrator should delegate concerns rather than copy one skill's rules into another. Explicit user instructions and project requirements override all generic skill defaults.

If Ponytail Full is unavailable, use this fallback implementation policy:

1. Confirm that the new code or artifact needs to exist.
2. Reuse existing project code before you add a parallel implementation.
3. Prefer the standard library when it already solves the problem adequately.
4. Prefer native platform capabilities before you add another dependency.
5. Prefer an installed dependency before you introduce a new one.
6. Use the smallest correct implementation and the smallest justified diff.
7. Fix the root cause rather than adding a symptom patch.
8. Do not add speculative abstractions, future scaffolding, or boilerplate.
9. Do not simplify away trust-boundary validation, data-loss protections, security controls, accessibility requirements, or explicit project requirements.
10. Add the smallest runnable check that protects nontrivial new logic when such a check has lasting value.

Ponytail governs how much code should exist. Engineering Partner governs what problem the code should solve, what assumptions matter, what evidence is sufficient, and what the user should understand. The user's writing skill governs how the final prose artifact should read without changing those engineering semantics.

## Keep agent communication readable

Use normal technical prose for agent-to-agent messages unless a parser, hook, or branching workflow needs a structured format. Do not require literal status words such as `None`, `Confirmed`, or `Unresolved` as part of ordinary collaboration. A null result can be stated naturally. A structured null value is appropriate only when the surrounding interface uses one.

Do not expose internal orchestration jargon to the user unless it helps explain a real decision or workflow state.

## Maintain this package with the same policy

Keep `SKILL.md` as a short routing and governing document. Put detailed guidance in references that load only when relevant.

Keep the session hook compact because injected context competes with task context. State a rule once unless a second location is necessary for a different lifecycle boundary.

Do not add a script, agent, hook, configuration file, or reference file unless it has a distinct operational role that cannot be handled cleanly by the existing package.

Use behavioral evaluations to justify future prompt or workflow additions. Do not add instructions only because they sound prudent.

## Source basis

This package was reviewed on 2026-08-20 against the following sources. Recheck them when OpenAI changes Codex extension formats or model guidance.

- OpenAI, `Harness engineering: leveraging Codex in an agent-first world`: https://openai.com/index/harness-engineering/
- OpenAI, `Model guidance` for GPT-5.6: https://developers.openai.com/api/docs/guides/latest-model
- OpenAI, `Build skills`: https://learn.chatgpt.com/docs/build-skills
- OpenAI, `Build plugins`: https://learn.chatgpt.com/docs/build-plugins
- OpenAI, `Hooks`: https://learn.chatgpt.com/docs/hooks
- OpenAI, `Subagents`: https://learn.chatgpt.com/docs/agent-configuration/subagents
- Dietrich Gebert, `Ponytail`: https://github.com/DietrichGebert/ponytail
- Wikipedia, `Wikipedia:Signs of AI writing`: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- ASD-STE100, official site and FAQ: https://www.asd-ste100.org/
- Google developer documentation style guide: https://developers.google.com/style
