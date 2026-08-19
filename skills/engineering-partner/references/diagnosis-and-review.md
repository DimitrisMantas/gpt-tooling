# Diagnosis and review

## Diagnose from the smallest relevant difference

When a failure appears in one experiment, configuration, environment, or recent change, begin with the nearest known-good case.

Use this sequence:

1. Reproduce or verify the symptom.
2. Identify the closest known-good case.
3. List the smallest relevant differences between the two cases.
4. Inspect the actual execution path before you speculate about broad causes.
5. Rank causal hypotheses by consistency with the observed difference.
6. Run the cheapest discriminating check that can eliminate important hypotheses.
7. Fix the root cause with the smallest correct change.
8. Verify the fix against the original failure and relevant regression checks.

Do not begin with a large catalogue of possible causes when a direct delta can narrow the search.

After you resolve a consequential cause, encode the relevant invariant or regression test when that protection has lasting value.

## Check semantic contracts at boundaries

Many engineering failures come from a correct local calculation connected to the wrong semantics at an interface.

At consequential data or system boundaries, verify the semantics that can materially change behavior. Examples include units, coordinate systems, reference frames, axis order, time zones, timestamps, shape and channel order, dtype and numeric range, normalization, label encoding, missing-value conventions, identifiers, and versioned schema meaning.

Check these properties mechanically when possible. Do not add a generic validation framework when a direct assertion or existing schema is sufficient.

## Validate before expensive work

Before an expensive training run, migration, batch job, deployment, or external operation, run the smallest checks that can catch likely high-cost failures.

Do not create a large preflight framework unless the risk justifies it. Use existing tests and project mechanisms before you add new infrastructure.

## Prefer deterministic verification

If a condition can be established mechanically, check it mechanically before you ask an agent to judge it.

Examples include test results, schema validity, file hashes, split disjointness, raster alignment, dimensionality, dependency state, configuration values, and reproducible benchmark measurements.

Use agent review for questions that require judgement, such as methodological appropriateness, requirement interpretation, unsupported inference, security reasoning, or architectural trade-offs.

Choose tests by contract and risk rather than by count or coverage theater. Prefer the smallest set of tests that exercises the changed behavior, important boundary conditions, and previously observed failure modes. Add broader tests when a material integration risk remains. Do not create test scaffolding whose maintenance cost exceeds the protection it provides.

## Review the relevant surface

When the user asks to review a change, diff, experiment, or component, focus on the behavior introduced or affected by that scope. Do not turn a local review into a repository-wide audit.

Report a pre-existing issue outside the reviewed surface only when it materially changes the safety or correctness of the requested work. Label it as pre-existing when that distinction matters.

## Use subagents for distinct work

Dispatch a subagent only when at least one of these conditions is true:

- A consequential decision benefits from an independent review axis.
- A bounded investigation can run with fresh context and return a compact result.
- A consequential reviewer finding is uncertain and needs independent validation.
- Parallel read-heavy investigations are independent and reduce latency without introducing shared-state risk.

Do not dispatch agents merely to increase apparent rigor or to obtain votes.

Keep the parent agent responsible for the overall objective, accepted constraints, synthesis, teaching, and user escalation.

## Keep interagent communication semantic, not ceremonial

Use ordinary technical prose between the orchestrator and subagents by default. Give each agent a clear task, relevant context, constraints, and expected scope. Let the agent return the information that matters in the form that best preserves meaning.

Do not invent protocol keywords, status flags, confidence scores, JSON schemas, or exact response phrases merely to make agent coordination look structured. Use a structured contract only when an automated consumer must parse the result, when the workflow branches mechanically on the output, or when a stable schema materially reduces ambiguity.

The orchestrator should understand and synthesize the substance of subagent responses rather than depend on magic tokens. Subagents should not recursively create more review layers unless the orchestrator has authorized that behavior or the workflow explicitly requires it.

## Give reviewers a failure-seeking role

A reviewer should test one explicit material concern rather than judge the work generically.

Provide the reviewer with the artifact or relevant code, the requirement, necessary project constraints, and relevant evidence. When independent judgement matters, omit the originating agent's persuasive rationale until after the reviewer forms its assessment.

Keep reviewers read-only by default. The implementation agent makes changes. The reviewer that raised a blocking finding should verify the fix when practical.

A clean review is a valid result. Say plainly that no material issue was found and stop. If the surrounding API or workflow naturally uses `None` for that condition, returning `None` is also valid. Do not require a literal token, exact phrase, flag, or status field when ordinary prose is sufficient.

Do not confuse a clean review with uncertainty. If the evidence cannot settle a material concern, explain what remains uncertain and what evidence is missing. Do not force that state into a special keyword unless a machine-readable workflow actually needs one.

Describe a material finding in natural technical prose. Make the defect, supporting evidence, material consequence, and resolution condition clear. Use headings, fields, or a structured object only when they improve coordination or when an automated consumer requires them.

Do not merge independent review axes into an arbitrary overall score or vote. Do not assign numerical confidence unless the number has a defined calibrated or statistical meaning.

## Validate consequential uncertain findings

If a reviewer raises a consequential claim and the evidence is not already decisive, use a fresh claim-validation pass before you create work from the finding.

The validator should explain whether the available evidence supports the claim, contradicts it, or leaves it unresolved. Natural language is sufficient unless a downstream tool needs a machine-readable state. It should not broaden the review or redesign the solution.

Do not validate trivial or stylistic findings with another agent.

## Order reviews by dependency

Review the most fundamental validity condition before secondary quality concerns.

For an empirical model, methodological validity normally precedes implementation polish. For ordinary application code, requirement compliance normally precedes broader engineering quality. For a numerical implementation, mathematical formulation can precede code-level review when an incorrect formulation would make the implementation irrelevant.

Use a final fresh-context holistic review only when the work is consequential enough that it adds material value after local findings are closed.

## Stop review loops deliberately

Continue a review and fix loop until blocking material findings are resolved and the agreed engineering-sufficiency conditions hold.

Do not continue until no reviewer can imagine another improvement. An open-ended improvement objective is not a completion criterion.

Before another review round, state what material uncertainty remains and what the additional review can change. If the answer is nothing material, stop.

## Compress reviewer output

Do not send raw reviewer transcripts to the user unless they ask for them.

Synthesize the result into unresolved material findings, decisions that genuinely need the user, material uncertainty, and a concise statement of what passed. Preserve the distinction between separate review axes.

If there are no material findings and no unresolved question, a brief natural-language clean result is sufficient. Use `None` only when the surrounding interface naturally represents the result that way.
