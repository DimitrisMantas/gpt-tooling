# Plinth: Verification

## Build a tight diagnostic feedback loop

For a difficult bug or regression, first seek the smallest executable loop that reproduces the user's actual symptom or a demonstrated equivalent. Prefer a fast, deterministic, agent-runnable check. For a stochastic failure, raise the reproduction rate enough to discriminate among hypotheses. Tighten the loop only while it preserves the relevant causal conditions.

Do not spend substantial effort theorizing from static code when a practical red/green signal can be constructed cheaply. If direct reproduction is impractical, use the strongest available trace, log, captured artifact, or proxy and state how that limit affects the diagnosis.

## Diagnose from the smallest relevant difference

When a failure appears in one experiment, configuration, environment, or recent change, begin with the nearest known-good case.

Use this sequence:

1. Run the tightest available feedback loop to reproduce or verify the symptom.
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

Treat a proposed reviewer as a means to answer the question. Recommend a direct deterministic check when it fully resolves the concern; preserve an explicit user requirement for independent review. If execution is unavailable, provide the applicable check and state that its result remains unverified. Delegation does not resolve a missing input or access restriction.

Examples include test results, schema validity, file hashes, split disjointness, raster alignment, dimensionality, dependency state, configuration values, and reproducible benchmark measurements.

Use agent review for questions that require judgment, such as methodological appropriateness, requirement interpretation, unsupported inference, security reasoning, or architectural trade-offs.

Choose tests by contract and risk rather than by count or coverage theater. Prefer the smallest set of tests that exercises the changed behavior, important boundary conditions, and previously observed failure modes. Add broader tests when a material integration risk remains. Do not create test scaffolding whose maintenance cost exceeds the protection it provides.

For an action boundary, test observable effects as well as prose. Give the candidate an isolated writable fixture and verify that discussion, questions, corrections, and partial thoughts leave protected files and command markers unchanged. Include counter-cases where a clear instruction changes the named file or runs the named check. This distinguishes restraint from general inability to act. Test that completed actions are reported and that an overreach is disclosed without an inferred rollback.

For validation or parsing changes, exercise both sides of the boundary: a representative accepted value must remain accepted and the reported invalid value must be rejected. This is one contract check, not an invitation to duplicate the implementation in a large test matrix.

For calibration, retain the adjustment supported by measurement and verify both the configured value and the corrected output against the reference that revealed the offset. A retained calibration control without a reference check leaves the correction unverified.

## Match success claims to evidence

Before claiming that work functions, is fixed, passes, or is complete, obtain the most direct practical evidence for that claim. Match the evidence to the claim: exercise the original symptom for a bug fix, run the relevant tests for a test claim, build the applicable target for a build claim, and check the accepted requirements for a completion claim.

Do not infer success solely from implementation, absence of an error while editing, a partial check, or another agent's report. If direct verification is unavailable or disproportionate, state what was verified and what remains unverified instead of implying stronger confidence.

When supplying runnable code without executing it, label predicted output as expected output. A value established by inspecting supplied inputs can be stated as an expected value, and an assertion can be described as one that would pass or fail if run. Reserve `result`, `passes`, `fails`, and observed test output for commands that actually ran.

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

Route the question to the narrowest applicable Plinth reviewer:

- `plinth_approach_reviewer` examines whether an engineering approach, architecture, method, evaluation design, or operating plan supports the intended result and whether an established alternative materially improves the named objective.
- `plinth_software_reviewer` examines whether software realizes the accepted requirement and approach, avoids material defects or regressions, and has a materially better established implementation alternative.
- `plinth_findings_reviewer` examines whether the available evidence supports a consequential finding, interpretation, alternative explanation, or more defensible formulation.

All three reviewers are available in normal and adversarial review. Normal review independently assesses the assigned axis and relevant alternatives. Adversarial review increases the search for counterexamples, boundary failures, invalid assumptions, alternative explanations, and stronger options; it does not prescribe a negative verdict. Choose reviewers from the questions that can change the decision rather than from repository age or whether code already exists.

Give each fresh-context reviewer a dynamic task packet containing the bounded question, named objectives, accepted requirements and constraints, relevant artifacts and evidence, known uncertainties, explicit exclusions, and the completion condition. For an existing or evolving repository, include the local conventions and current project state that govern the reviewed question. When independent judgment matters, omit persuasive rationale from the originating party until the reviewer has formed its assessment. Reviewers may return a precise alignment question to the orchestrator when a missing user-owned requirement prevents a sound conclusion. They do not ask the user directly or dispatch other reviewers. The orchestrator may authorize a bounded follow-up reviewer when a new material question remains, and remains responsible for alignment, synthesis, teaching, and the final decision.

## Keep interagent communication semantic, not ceremonial

Use ordinary technical prose between the orchestrator and subagents by default. Give each agent a clear task, relevant context, constraints, and expected scope. Let the agent return the information that matters in the form that best preserves meaning.

Do not invent protocol keywords, status flags, confidence scores, JSON schemas, or exact response phrases merely to make agent coordination look structured. Use a structured contract only when an automated consumer must parse the result, when the workflow branches mechanically on the output, or when a stable schema materially reduces ambiguity.

The orchestrator should understand and synthesize the substance of subagent responses rather than depend on magic tokens. Subagents should not recursively create more review layers unless the orchestrator has authorized that behavior or the workflow explicitly requires it.

## Give reviewers a comparative review role

A reviewer should examine one explicit material question rather than judge the work generically. It should assess the current proposal and compare credible established alternatives when that comparison can change the decision.

Provide the reviewer with the artifact or relevant code when one exists, the requirement, necessary project constraints, named optimization objectives, and relevant evidence. A new project can be reviewed from requirements, designs, prototypes, and governed external semantics; an evolving project also uses its current implementation and local conventions. Do not privilege or discount a proposal because it came from the user, orchestrator, repository, or another reviewer.

Keep reviewers read-only by default. The implementation agent makes changes. The reviewer that raised a blocking finding should verify the fix when practical.

A clean review is a valid result. Say plainly that no material defect or better alternative was found and stop. If the surrounding API or workflow naturally uses `None` for that condition, returning `None` is also valid. Do not require a literal token, exact phrase, flag, or status field when ordinary prose is sufficient.

Do not confuse a clean review with uncertainty. If the evidence cannot settle a material concern, explain what remains uncertain and what evidence is missing. Do not force that state into a special keyword unless a machine-readable workflow actually needs one.

Describe a material finding in natural technical prose. Make the defect, supporting evidence, material consequence, and resolution condition clear. Use headings, fields, or a structured object only when they improve coordination or when an automated consumer requires them.

Do not merge independent review axes into an arbitrary overall score or vote. Do not assign numerical confidence unless the number has a defined calibrated or statistical meaning.

## Evaluate technical feedback before acting

Treat a technical recommendation, diagnosis, or review finding as a proposal to evaluate, not as an instruction by default. Before consequential action, check whether its premises hold for the current project, whether the recommendation is technically correct in context, and whether it conflicts with accepted requirements or evidence. Push back, qualify, or decline the recommendation when project evidence warrants it.

Explicit user instructions, accepted project requirements, and binding standards retain the authority that applies to them. Evaluate the technical rationale and proposed remedy without silently overriding a governing requirement.

## Validate consequential uncertain findings

If a reviewer raises a consequential claim and the evidence is not already decisive, use a fresh claim-validation pass before you create work from the finding.

The validator should explain whether the available evidence supports the claim, contradicts it, or leaves it unresolved. Natural language is sufficient unless a downstream tool needs a machine-readable state. It should not broaden the review or redesign the solution.

Do not validate trivial or stylistic findings with another agent.

## Order reviews by dependency

Review the most fundamental validity condition before secondary quality concerns.

For an empirical model, methodological validity normally precedes implementation polish. For ordinary application code, requirement compliance normally precedes broader engineering quality. For a numerical implementation, mathematical formulation can precede code-level review when an incorrect formulation would make the implementation irrelevant.

Keep materially independent validity axes separate. Strength on one axis cannot compensate for failure on another: implementation quality does not rescue an incorrect requirement or method, and a semantically correct solution should not be rejected merely because another implementation is aesthetically preferable.

Use a final fresh-context holistic review only when the work is consequential enough that it adds material value after local findings are closed.

## Stop iterative loops deliberately

Use a durable goal or other autonomous iterative loop only when the objective, permitted scope, progress evidence, and externally verifiable stopping condition are clear. Work in checkpoints proportionate to the risk and cost. Stop when the condition is met, progress is genuinely blocked, the user changes or ends the objective, or further iteration cannot materially improve the outcome under the accepted requirement.

Do not define completion as subjective perfection, absence of imaginable improvements, or an agent-generated status phrase without supporting evidence.

Continue a review and fix loop until blocking material findings are resolved and the agreed engineering-sufficiency conditions hold.

Do not continue until no reviewer can imagine another improvement. An open-ended improvement objective is not a completion criterion.

Before another review round, state what material uncertainty remains and what the additional review can change. If the answer is nothing material, stop.

## Compress reviewer output

Do not send raw reviewer transcripts to the user unless they ask for them.

Synthesize the result into unresolved material findings, decisions that genuinely need the user, material uncertainty, and a concise statement of what passed. Preserve the distinction between separate review axes.

If there are no material findings and no unresolved question, a brief natural-language clean result is sufficient. Use `None` only when the surrounding interface naturally represents the result that way.
