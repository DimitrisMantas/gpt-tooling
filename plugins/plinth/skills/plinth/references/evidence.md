# Plinth: Evidence

## Start from evidence obligations

Do not begin by choosing metrics or diagnostics. First identify what the current engineering decision or claim requires you to establish.

An evidence obligation can arise from a decision, a material claim, a known blind spot, a failure mode, or a reproducibility requirement.

For each proposed metric, diagnostic, plot, experiment, benchmark, or statistical summary, answer these questions:

- Purpose: What unresolved question does this item answer?
- Increment: What does it add beyond the evidence already available?
- Consequence: What decision, interpretation, or next action could change because of its result?
- Provenance: Is the method canonical, established, adapted, custom, or experimental for this use?
- Retention: Does it need to remain in the final methodology or report after the investigation is complete?

If the incremental information or consequence is negligible, do not add the item merely for completeness.

There is no fixed correct number of metrics, diagnostics, experiments, or plots. Seek minimum sufficient nonredundant evidence, not an arbitrary count.

Do not select additional subgroups, metrics, transformations, or diagnostic views after seeing results merely to obtain a more favorable story. Post-result exploration is valid when it is labeled as exploration and answers a new material question. It must not be retroactively presented as the original decision criterion or confirmatory evidence.

## Accept null and negative results

A null result is a valid engineering result.

If a comparison shows no material difference, report no material difference. If a review finds no material issue, report none. If a search finds no clear precedent, report that absence. If an experiment does not support the hypothesis, do not search for a different metric, subgroup, threshold, or narrative solely to manufacture a positive result.

Keep the underlying evidence state clear without forcing it into a fixed vocabulary. A clean or null result means that the available evidence supports no material issue or action within the reviewed scope. A different case occurs when material competing explanations remain, when the requested conclusion lacks sufficient evidence, or when a question was outside the reviewed scope. State the relevant condition naturally and identify missing evidence when it matters.

Use `None` only when the surrounding interface naturally represents a clean null result that way. Do not treat silence or missing evidence as proof that a condition is safe.

## Keep analytical roles distinct

Do not turn every measurement into a permanent metric hierarchy. Distinguish its role instead.

A selection criterion chooses among candidate solutions. Select it from the operational requirement before inspecting candidate results when practical.

A guardrail can veto or qualify a candidate because the main criterion has a known material blind spot.

A characterization diagnostic describes the behavior or limitations of a chosen system.

A debugging diagnostic is temporary evidence used to find a cause and can be removed after the problem is understood.

An exploratory experiment generates or tests a new hypothesis. Do not present it as part of the core evaluation unless it later earns that role.

An external or final evaluation tests the finished system on data that did not drive model or method selection.

Do not invent labels such as primary, secondary, and auxiliary metrics when the labels do not clarify a distinct role.

## Use baseline and complexity escalation deliberately

For a new empirical or modeling approach, identify the simplest credible established baseline that answers the project question. Add complexity when it addresses a demonstrated limitation, required capability, or material failure mode.

Do not require a trivial baseline that cannot answer the task. Do not jump to a more complex model merely because it is more expressive or fashionable.

When a comparison is used to attribute an effect to one design choice, keep other relevant factors fixed when practical. If several material factors change together, describe the result as a bundled comparison and do not attribute the effect to one component without further evidence.

## Use sensitivity analysis when it can change the conclusion

When several nearby reasonable methodological choices remain and they could plausibly reverse the material conclusion, compare a small set of representative alternatives or run a targeted sensitivity analysis.

Use the analysis to determine whether the choice is material, not to prove that one configuration is globally optimal.

If reasonable alternatives change absolute scores but preserve the decision or model ordering, record that distinction. If they reverse the conclusion, investigate the cause before you proceed.

## Justify material thresholds and scales

A project-specific threshold, buffer, window, binning rule, fold count, morphological radius, cutoff, tolerance, or other scale can be practical without being theoretically optimal.

If the choice can materially affect the conclusion, connect it to at least one of these sources:

- An operational requirement or physical scale.
- An established convention or documented precedent.
- A property measured from the project data.
- A targeted sensitivity analysis showing that the conclusion is not fragile to nearby reasonable values.

If the exact value is arbitrary but immaterial, label it as a practical choice and proceed. Do not fabricate a theoretical justification after the fact.

## Validate custom analyses with known behavior

When a custom or materially adapted diagnostic supports an important conclusion, verify that its implementation and interpretation behave sensibly on a simple known-answer, synthetic, controlled, or limiting case when such a check is practical.

Compare it with the nearest established method when the comparison can reveal a material failure or interpretation error.

Do not require elaborate synthetic test suites for transparent low-consequence diagnostics.

## Triangulate only for a reason

Independent corroboration is useful when a material conclusion would otherwise depend on a method with a known blind spot, a strong assumption, an unfamiliar interpretation, or a high consequence.

Do not add a second method only because independent confirmation sounds rigorous. State the plausible false conclusion that the second method protects against.

If two measurements answer substantially the same engineering question and one is more direct, established, or interpretable, prefer the stronger one unless the weaker method adds a specific useful distinction.

## Separate exploration from retained evidence

Exploration can be broad when that is an efficient way to understand a problem. Temporary diagnostics do not automatically become permanent project metrics or report content.

After the issue is understood, consolidate the retained analysis. Keep only evidence that determines a decision, supports a material claim, demonstrates a material limitation, rules out an important alternative explanation, or is necessary for reproducibility.

A final report should describe the evidence required for its conclusions. It should not preserve the full history of everything that the agent tried.

## Preserve inference boundaries

For empirical work, keep these levels separate:

1. Observation: What was directly measured.
2. Interpretation: What behavior the observation supports.
3. Attribution: What caused the behavior.

Do not move from observation to attribution without evidence that discriminates among plausible causes.

A project-specific diagnostic can be useful without being a standard estimator of a formal physical or statistical quantity. Label it accordingly and keep claims within what it measures.

## Check data and semantics before escalating the model

When an empirical system underperforms or behaves unexpectedly, do not assume that model architecture is the cause. First check the data, target semantics, preprocessing, split lifecycle, measurement alignment, representation support, and evaluation definition when those factors can plausibly explain the symptom.

Escalate model complexity after simpler explanations and established baselines have been checked to the degree justified by the decision. A more complex model is not a substitute for an unclear target, contaminated validation, weak labels, mismatched units, or missing input information.

## Frame empirical projects before model selection

Before consequential empirical or machine learning decisions, establish the project semantics that matter:

- The input and target.
- The unit of prediction.
- The independent entity or grouping unit.
- The intended deployment population or operating conditions.
- The information that will actually be available at inference time.
- The distribution shifts that matter for deployment.
- The operational success criterion.
- The role of development validation and final evaluation.

Do not invent requirements that the project does not have.

## Design validation by decomposing the problem

For dependent, grouped, spatial, temporal, repeated-measure, or otherwise structured data, do not treat validation as one choice. Consider the parts separately:

- Grouping unit: Which observations must remain together because splitting them would make evaluation unrealistically easy or violate independence assumptions?
- Separation rule: Is group membership enough, or is a spatial, temporal, identity, or other exclusion rule required?
- Resampling scheme: Does the development process need one fixed holdout, grouped cross-validation, repeated validation, or another established scheme?
- Fold or sample weighting: What population or operational quantity should the aggregate score represent?
- External evaluation: Is there an independent domain that should remain untouched until the development decisions are fixed?

Choose each part according to the intended generalization regime and project constraints. Do not assume that administrative groups, geometric blocks, or any other grouping method are universally correct.

Use cross-validation when dependence on one arbitrary holdout would materially affect development decisions and its cost is justified. Use a fixed holdout when it has a clear operational interpretation or cross-validation cost has little expected value. These are engineering choices, not universal laws.

## Protect external evaluation from adaptive reuse

Treat a genuinely external or final test set as independent only while it remains outside the adaptive development loop.

If the team repeatedly changes models, thresholds, features, or methodology in response to that test result, record that the set has become part of development. Do not continue to describe it as an untouched independent test without a new evaluation source.

## Distinguish reproducibility from stability

Reproducibility asks whether the same code, data, configuration, and random state can reproduce the result.

Stability asks whether the engineering conclusion survives relevant stochastic variation, such as random seeds, sample phases, optimization starts, or data perturbations.

Preserve the configuration, data identity, code revision, environment details, and random states needed to reproduce consequential empirical results when the project has a practical place to store them.

Do not run repeated seeds or searches by ritual. Measure stochastic stability when plausible variation could change the material conclusion or chosen solution.

## Prevent leakage and lifecycle contamination

Fit data-dependent preprocessing, feature selection, calibration, threshold selection, and model selection only on the data that the development protocol permits them to use.

Encode critical split and lifecycle assumptions as assertions or tests when practical. Examples include disjoint entity groups, train-only fitted transformations, and unchanged external test data.

Account for dropped, masked, invalid, or excluded observations when those exclusions can change the interpretation of the result. Do not silently discard data that materially changes the evaluated population.

## Match metrics and inference to their meaning

Before you use a metric for selection or a claim, state what population and error behavior it represents. Check whether prevalence, grouping, weighting, censoring, saturation, or dependence can make the aggregate number misleading for the intended use.

Before you add a confidence interval, significance test, p-value, or other inferential statement, identify the source of randomness and the population to which the uncertainty is meant to generalize. Distinguish descriptive census results on a fixed evaluated dataset from sampling uncertainty, model-training variability, measurement uncertainty, and variation across future deployment domains. Do not add inferential statistics by convention when the assumed sampling process does not match the data.

Separate statistical detectability from engineering materiality. With a large sample, a negligible effect can be statistically detectable. A practically important effect can also remain uncertain. Base engineering decisions on effect size, consequence, uncertainty, and the project requirement rather than on significance alone.

If probability estimates matter, distinguish discrimination, decision performance, and probability calibration. Do not assume that an objective designed for ranking or cost-sensitive classification yields calibrated probabilities unless that property is supported.

Do not let a convenient metric silently redefine the operational objective.
