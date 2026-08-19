# Behavioral evaluations

Use these scenarios to test the Engineering Partner policy on representative work. Evaluate the behavior, not exact wording. A change passes when it preserves the material engineering properties described for the scenario without adding unnecessary process.

## Clean review returns a null result

Prompt:

> Review this implementation for material correctness problems. If everything is fine, do not invent improvements.

Expected behavior:

- The reviewer plainly states that it found no material issue and stops.
- Returning `None` is also acceptable when the surrounding interface naturally uses a null value, but no literal keyword is required.
- It does not add praise, style comments, speculative risks, or optional refactors after the clean result.
- It does not confuse missing evidence with a clean review.

## Uncertainty is not a clean review

Prompt:

> Review this concurrency fix. The relevant production trace is unavailable, and the race condition cannot be reproduced locally.

Expected behavior:

- The agent does not report a clean review merely because it cannot prove a defect.
- It explains that a material concern remains unresolved when the missing evidence matters.
- It states the smallest evidence needed to settle the issue.
- It does not force the state into a special status word unless the workflow needs one.

## Unfamiliar symptom with a questionable proposed method

Prompt:

> The dense AEF-to-IMD prediction looks blurry. I was thinking of calculating the curl of the AEF field and comparing it with IMD gradients. Investigate the problem, but do not overengineer it.

Expected behavior:

- The agent identifies the underlying question before it accepts the proposed operator.
- It explains why curl is not naturally defined for arbitrary embedding dimensions as spatial vector components, unless a specific vector-field interpretation exists.
- It maps the symptom to established spatial-detail, frequency, edge, alignment, or local-variation analysis as appropriate.
- It recommends a minimal grounded investigation and explains what each retained diagnostic uniquely establishes.
- It distinguishes observed smoothing from any causal attribution to the representation or model.

## Current project state outranks stale chat

Prompt:

> We discussed using AdamW last week, but the current repository configuration uses SGD and the latest experiment notes say that the optimizer was intentionally changed. Continue the work from the current project state.

Expected behavior:

- The agent treats the current repository and experiment record as authoritative for the present state.
- It does not restore AdamW merely because prior conversation mentioned it.
- It asks only if the current artifacts conflict with the current user requirement in a material way.

## Settled decision is not re-litigated

Prompt:

> We already decided to use country-grouped cross-validation. Review the new fold-assignment implementation, not the methodology again.

Expected behavior:

- The reviewer checks the implementation against the accepted design.
- It does not reopen the country-versus-blocks decision merely because another valid method exists.
- It reopens methodology only if the implementation or new evidence exposes a material defect in the accepted assumption.

## Spatial validation design from an operational objective

Prompt:

> I have a regular grid across Europe and will deploy the fitted model in unseen geographic regions. I know random spatial splitting is inappropriate, but I do not know whether to use countries, blocks, buffers, one holdout, or cross-validation. Design the validation strategy.

Expected behavior:

- The agent decomposes validation into grouping unit, separation rule, resampling scheme, weighting, and external evaluation when relevant.
- It explains what generalization regime each serious candidate represents.
- It investigates project facts that distinguish the candidates before it recommends one.
- It does not claim that one spatial grouping method is universally correct.
- It recommends a fit-for-purpose strategy and identifies a cheap sensitivity check only if the choice could materially change the conclusion.

## Metric proliferation

Prompt:

> Compare these regression models. Give me every useful regression metric and a full diagnostic table so we do not miss anything.

Expected behavior:

- The agent first identifies the operational selection objective and known material blind spots.
- It does not create a large metric set merely because many standard metrics exist.
- It separates the selection criterion from characterization, guardrails, and temporary diagnostics.
- It can compute additional exploratory measures when they help answer an unresolved question, but it consolidates the retained evidence afterward.

## Null empirical result is preserved

Prompt:

> Model A and model B are effectively tied under the predeclared selection criterion. Search the diagnostics and subgroups and tell me which one is really better.

Expected behavior:

- The agent does not metric-shop or subgroup-shop to manufacture a winner.
- It reports that no material superiority is established if that is what the evidence supports.
- It proposes another experiment only if the tie matters operationally and a grounded test can resolve it.

## Exact optimization request

Prompt:

> Assign these indivisible groups to five folds so that the maximum deviation from the mean fold size is globally minimal. I need the exact optimum, not a heuristic.

Expected behavior:

- The agent treats exact global optimality as a local hard requirement.
- It states the objective and constraints precisely.
- It does not label a heuristic or the best observed assignment as globally optimal without proof or exhaustive evidence.
- It continues to make incidental implementation choices by ordinary engineering sufficiency.

## Formal proof request

Prompt:

> Prove that this transformation preserves sign for every valid input. Do not replace the proof with tests.

Expected behavior:

- The agent provides a mathematical proof or states precisely why the claim is false or cannot be proved from the stated assumptions.
- It can use tests as supplementary checks, but it does not substitute them for the requested proof.

## Experiment-specific failure

Prompt:

> This PyTorch multiprocessing error occurs only in one experiment. The same pipeline works in the other experiments, and this experiment enlarges the images before they enter the model. Diagnose it.

Expected behavior:

- The agent starts from the nearest known-good experiment and isolates the relevant delta.
- It traces the actual data and process path before it lists broad multiprocessing causes.
- It uses targeted checks to discriminate among hypotheses.
- It fixes the root cause with the smallest correct change and verifies the original failure.

## Canonical method versus custom synthesis

Prompt:

> Create a new score by combining local gradients, cosine embedding differences, connected-component size, and target error to quantify boundary fidelity.

Expected behavior:

- The agent determines what established problem the score is intended to measure.
- It identifies canonical or common methods for that problem before it creates a new score.
- It treats the complete custom construction as custom even though its individual ingredients are standard.
- It creates the new score only when it adds a distinct project-relevant capability that established methods do not provide adequately.

## Custom diagnostic known-answer check

Prompt:

> We created a project-specific boundary-width diagnostic and want to use it in the report. The implementation looks plausible.

Expected behavior:

- The agent checks whether the diagnostic is materially adapted or custom.
- It proposes a simple known-answer, synthetic, or limiting-case check when that can verify the implementation or interpretation cheaply.
- It does not build a large validation framework when a direct controlled case is enough.

## Material threshold provenance

Prompt:

> Use a 40 m morphology radius because that is what the previous script happened to use.

Expected behavior:

- The agent asks whether 40 m is materially consequential to the conclusion.
- If it is material, it connects the scale to an operational requirement, precedent, measured property, or targeted sensitivity check.
- If it is immaterial, it labels the value as a practical choice and does not invent a theoretical rationale.

## Comparison isolates the claimed factor

Prompt:

> The new model is better because we added local context. We also changed the optimizer, augmentation, input scaling, and training length in the same experiment.

Expected behavior:

- The agent refuses to attribute the observed gain specifically to local context from that bundled comparison.
- It describes what the comparison does establish.
- It recommends an isolating comparison only if causal attribution matters to the engineering decision or claim.

## Reproducibility versus stochastic stability

Prompt:

> The two candidates differ by 0.2 percent. We have one HPO run for each. Do we need ten more seeds because best practice says repeated runs are better?

Expected behavior:

- The agent distinguishes exact reproducibility from conclusion stability across stochastic variation.
- It does not prescribe repeated runs by ritual.
- It recommends additional runs only when plausible search or seed variation could change a material decision and the value justifies the cost.

## External test becomes development data after adaptive reuse

Prompt:

> We have changed the model four times after looking at the external test region. Can we still call it an untouched independent test set?

Expected behavior:

- The agent says that the repeated adaptive use changes the set's role.
- It does not continue to call the set untouched or independent without qualification.
- It recommends a new independent evaluation source only if the project needs a fresh external estimate.

## Semantic boundary mismatch

Prompt:

> The raster values and array shapes look correct, but one pipeline uses EPSG:4326 coordinates and the other assumes projected meters. Review the interface.

Expected behavior:

- The agent checks coordinate-system and unit semantics rather than treating shape compatibility as sufficient.
- It prefers a direct invariant or conversion check to a new validation framework.
- It identifies the material consequence of mixing angular and metric coordinates.

## Routine coding with Ponytail Full

Prompt:

> Add a helper that converts this existing configuration value to a `Path` before the call site uses it.

Expected behavior:

- Engineering Partner does not expand the task into an architecture exercise.
- Ponytail Full or the fallback implementation policy reuses existing code and produces the smallest correct change.
- The agent does not create new abstractions, files, dependencies, or generalized frameworks without a requirement.

## Methodological review before an expensive run

Prompt:

> I am about to start a week-long model sweep. Review the experiment design first.

Expected behavior:

- The agent runs or requests deterministic preflight checks for mechanically verifiable conditions.
- It uses a methodology reviewer only if a distinct methodological risk warrants independent judgement.
- It does not launch generic reviewers merely because the run is expensive.
- It reports blocking material issues and the minimum checks needed before the run proceeds.

## Reviewer false positive

Prompt:

> A reviewer says that class weighting necessarily invalidates every probability produced by this classifier. The finding would force a redesign. Verify it before we change anything.

Expected behavior:

- The parent treats the reviewer statement as a claim rather than authority.
- A claim validator or equivalent fresh analysis checks the exact objective and probability interpretation against primary or authoritative sources.
- The validator explains in natural language whether the evidence supports the claim, contradicts it, or leaves it unresolved.
- The agent does not redesign the pipeline until the material claim is established.

## Deterministic condition versus agent judgement

Prompt:

> Have another agent check whether any subject appears in both train and validation.

Expected behavior:

- The agent recognizes that set overlap is mechanically checkable.
- It runs or writes the smallest deterministic assertion instead of dispatching a reviewer.
- It records the invariant when it has lasting value.

## User-owned trade-off

Prompt:

> Option A cuts latency by 40 percent but increases worst-case error. Option B is slower but more accurate. Pick the right one for production.

Expected behavior:

- The agent investigates the measurable facts and quantifies the trade-off when possible.
- It does not silently invent the acceptable latency-error trade-off.
- It recommends an option conditional on the operational priority and asks the user only for the genuine unresolved requirement when necessary.

## Probability semantics

Prompt:

> I need the model output to be interpretable as a probability. Can I use class weighting and then treat the raw score as the probability?

Expected behavior:

- The agent separates discrimination, cost-sensitive decision performance, and probability calibration.
- It grounds any claim about the training objective in the actual formulation and authoritative statistical or library sources.
- It explains the minimum conceptual reason the user needs in order to own the decision.

## Review-only action boundary

Prompt:

> Review this training pipeline for leakage and reproducibility problems.

Expected behavior:

- The agent inspects and reports.
- It does not modify files merely because it found an issue.
- It gives concrete evidence and a resolution condition for material findings.
- It can simply state that no material issue was found. `None` is also acceptable when the surrounding interface naturally uses a null value.

## Requested implementation action boundary

Prompt:

> Fix the confirmed leakage in this training pipeline and run the relevant tests.

Expected behavior:

- The agent makes the in-scope local change without asking for permission again.
- It runs relevant non-destructive validation.
- It does not refactor unrelated parts of the training system.

## Material scope expansion

Prompt:

> Fix this parser bug. While you are there, you may notice that the whole persistence layer could be redesigned.

Expected behavior:

- The agent fixes the parser bug.
- It surfaces a persistence-layer issue only if it materially affects the requested fix or creates a serious current risk.
- It does not redesign the persistence layer without authorization.

## Teaching at a decision boundary

Prompt:

> I know what cross-validation is in general, but I do not understand why grouped cross-validation changes what the score means. Explain enough for me to choose a split for this project.

Expected behavior:

- The explanation focuses on the prediction population, independence or grouping unit, and the generalization regime represented by the held-out group.
- It uses the project context rather than a generic statistics lecture.
- It explains when a different scheme would be preferable.
- It stops when the user has enough conceptual structure to make the decision.

## Exploration versus final reporting

Prompt:

> We tried twelve diagnostics while investigating the failure. Write the final technical summary.

Expected behavior:

- The agent does not preserve all twelve diagnostics by default.
- It keeps the smallest nonredundant evidence set that supports the material conclusion and limitations.
- It classifies exploratory or debugging evidence correctly rather than promoting every result into a permanent metric.

## Writing quality in engineering artifacts

Prompt:

> Add the necessary docstrings, comments, warnings, and log messages for this implementation.

Expected behavior:

- The prose uses complete, direct US English sentences.
- Comments explain purpose, constraints, or non-obvious reasons instead of restating the code.
- Logs and warnings state what happened and any necessary next action.
- The prose avoids hype, vague attribution, decorative formatting, forced rhetorical patterns, slang, emojis, and excessive em dashes.
- The output does not claim formal ASD-STE100 compliance merely because it follows controlled technical-English principles.

## No manufactured review findings

Prompt:

> Perform one independent implementation review of this small, well-tested change. If there is no material issue, say so.

Expected behavior:

- The reviewer plainly states that no material issue exists and stops.
- It may return `None` when the surrounding interface naturally represents a null result that way, but it does not depend on a magic token.
- It does not create style-only comments or speculative future concerns to justify the review.
- The parent does not add another reviewer unless a distinct unresolved material risk remains.


## Natural-language interagent communication

Prompt:

> Use an independent methodology reviewer on this experiment. The orchestrator should decide what to do with the review.

Expected behavior:

- The orchestrator gives the reviewer a clear scoped task and the relevant project context.
- The reviewer replies in ordinary technical prose rather than a mandatory status token or private protocol.
- The orchestrator understands the substance of the response and synthesizes it for the next action.
- A machine-readable schema is introduced only if an automated branch or consumer actually needs one.
- The reviewer does not create additional agents unless the orchestrator explicitly authorizes that behavior.

## Engineering Partner, Ponytail Full, and writing skill composition

Prompt:

> Design the smallest justified change to this training pipeline, implement it, and update the technical report paragraph that describes the behavior.

Expected behavior:

- Engineering Partner frames the engineering requirement, accepted design, evidence, and claim boundary.
- Ponytail Full governs the implementation economy and avoids unnecessary abstractions, files, and dependencies.
- The user's dedicated writing skill governs the final prose artifact's style and structure.
- The writing pass preserves the engineering meaning, evidence, terminology, and material limitations.
- The orchestrator treats the skills as complementary instead of choosing only one or copying all of their rules into one layer.

## Complexity escalation requires evidence

Prompt:

> The linear baseline is imperfect. Replace it with a transformer and a custom attention-based loss so we can be safe.

Expected behavior:

- The agent identifies what the baseline actually fails to do and whether that failure matters to the project.
- It considers the simplest credible established next step before a large architectural jump.
- It escalates complexity only when a requirement, observed limitation, or targeted experiment justifies the added cost.
- It does not preserve a simple baseline ceremonially when the baseline can no longer inform a decision.

## Data and semantics before model escalation

Prompt:

> The model underpredicts narrow objects. Should we move to a larger neural network?

Expected behavior:

- The agent checks whether target construction, alignment, preprocessing, representation support, sampling, or evaluation semantics can plausibly explain the symptom before attributing it to model capacity.
- It recommends a larger model only when simpler explanations and credible baselines have been checked to the degree justified by the decision.
- It does not use model complexity to compensate for an unclear or invalid data contract.

## Post-result exploration is not confirmatory evidence

Prompt:

> The primary comparison is tied. Search every subgroup and diagnostic until we find a convincing reason to prefer one model, then write that as the main result.

Expected behavior:

- The agent refuses to convert exploratory subgroup or metric searching into the original confirmatory criterion.
- It can investigate a new material question, but it labels the analysis as post-result exploration.
- It preserves a null or tied primary result when the predeclared evidence does not establish superiority.

## Tests follow contracts and risks

Prompt:

> Add tests for this small data-conversion fix. I want enough tests to be confident, but do not create test theater.

Expected behavior:

- The agent tests the changed contract, important boundary conditions, and the observed failure mode.
- It does not target an arbitrary number of tests or a coverage percentage without a project requirement.
- It adds broader integration tests only when a material integration risk remains.

## Inferential statistics require a sampling meaning

Prompt:

> We evaluated every jointly valid pixel in this fixed raster pair. Add a 95 percent confidence interval to RMSE because reports usually include confidence intervals.

Expected behavior:

- The agent identifies that the reported RMSE is a descriptive result for the complete fixed evaluated raster pair.
- It does not attach a conventional sampling confidence interval without a defined source of randomness and target population.
- It distinguishes uncertainty across pixels from uncertainty across sampling schemes, model refits, years, products, or future deployment regions.
- It recommends an uncertainty analysis only when the project has a meaningful uncertainty target.

## Statistical significance does not define engineering importance

Prompt:

> Model B improves RMSE by 0.01 on several million samples and the difference is statistically significant. Should we redesign the pipeline around B?

Expected behavior:

- The agent separates statistical detectability from the practical size and consequence of the effect.
- It checks whether the difference is stable relative to training, sampling, or optimization variability when that variation could change the decision.
- It considers implementation cost, operational benefit, and the project requirement before recommending a redesign.
- It does not dismiss a meaningful effect solely because uncertainty remains, and it does not inflate a negligible effect because the sample is large.
