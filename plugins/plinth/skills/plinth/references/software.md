# Plinth: Software and research engineering

Apply this reference to software work alongside the governing skill. It defines engineering meaning; Ponytail selects the minimum implementation that preserves it, and Quire expresses it faithfully. For Python work, also read [python.md](python.md). Other languages retain their native contracts and established tools.

## Durable ownership and contracts

Optimize for a repository the human can understand, change, verify, and own. Preserve correctness, explicit semantics, local reasoning, cohesion, reproducibility, and minimal owned machinery. Line count, deduplication, annotation density, and lint scores are evidence or constraints, not independent objectives.

Inspect the changed behavior, callers, configuration, and relevant API contracts before choosing the change. Make consequential policy explicit at the owning boundary. An omitted argument delegates to a dependency's default; supply it when the project owns that choice. Preserve useful defaults rather than restating every argument. Verify material signatures, defaults, version behavior, and side effects from the installed implementation or applicable official documentation.

Use types and interfaces to express real domain distinctions, capabilities, ownership, units, states, and invariants. A contract can be justified by a real consumer even with one implementation. Avoid speculative extension points. Use immutable representations for actual constants; a constant binding does not make referenced state immutable. Seal extension when it is unsupported and that restriction is meaningful.

Keep static assertions, runtime validation, and conversion distinct. A cast does not validate or transform a value. Investigate incorrect annotations, missing narrowing, an untyped dependency, or a mismatched contract before adding a cast. Convert only when actual normalization is intended. Validate at trust boundaries and where an invariant is established. Revalidate when mutation, deserialization, or lifecycle changes can invalidate it; downstream code may otherwise rely on the established contract.

## Cohesion and implementation

Prefer a simple cohesive implementation before deduplicating it. Deduplicate shared knowledge and policy, not coincidentally similar text. Complexity and duplication warnings prompt investigation; they do not establish the correct abstraction. Use established libraries before owning subtle validation, parsing, protocol, numerical, or infrastructure semantics when their benefits justify dependency cost.

Give functions one coherent responsibility, use guard clauses where they clarify control flow, and group semantic phases with useful blank lines. Do not fragment a coherent operation solely to satisfy size or complexity thresholds. Classes should own meaningful state, behavior, or a real contract. Avoid classes used only as namespaces and properties with surprising cost or side effects. A class-owned factory or protocol operation can justify a static method.

Keep domain computation separable from transport, filesystem, presentation, and external representation where those boundaries exist. Preserve useful local reasoning without inventing layers for a trivial program. Import through supported public APIs and make implementation dependencies legible. A public facade can be the correct dependency; do not reach into private internals merely to name a deeper module.

Let formatters own mechanical source layout. Quire owns prose, comments, docstrings, messages, and documentation. Do not manually split prose or literal text to meet a column width. Keep semantic grouping even when it costs a blank line; a linter warning is not a reason to obscure phases.

## Repository and research artifacts

Organize by the project's actual role and consumers. Each durable module, notebook, configuration, dataset, and output should have a clear responsibility, owner, and lifecycle. Avoid miscellaneous dumping grounds and copied variants such as `final2` or `train_v2`; a settings module is appropriate when it owns coherent configuration. Do not impose package, `src`, CLI, test-directory, service, or pipeline scaffolding on a scratch task without a consumer.

Treat notebooks as first-class working artifacts. Promote logic into modules when it becomes reusable, stable, testable independently, or needed unattended. Represent experiment variation in configuration rather than copied source. Record enough code, configuration, input-data identity, environment, and randomness information to reproduce or explain a run. Load the existing evidence reference when methodological or stochastic validity is material. A dependency lock alone does not establish reproducibility.

Treat artifacts as interfaces. Choose human summaries, machine-readable detail, schemas, units, identity, and metadata for the actual consumer. Put common metadata at the artifact-family or run level rather than repeating it everywhere. Separate raw, derived, evaluation, and presentation lifecycles when their provenance or consumers require it. Introduce scripts or a CLI for real execution needs; avoid wrappers that merely rename one existing command.

## Verification and explanation

Use the project's established formatter, linter, checker, tests, and CI before adding parallel infrastructure. Encode mechanically decidable invariants in the appropriate tool. Test relevant behavior and failure boundaries, including the original failing case when fixing a bug. Do not weaken a gate, add a dishonest cast, or restructure sound code merely to make a check green. Resolve genuine policy conflicts explicitly and narrowly, with the reason recoverable beside the exception or configuration.

Preserve rationale that cannot be recovered from syntax: consequential defaults, units, threshold sources, tolerances, domain assumptions, and unusual constraints. Explain a decision where its future owner will need it. Completion requires the accepted behavior and proportionate evidence, with material unverified limits stated accurately.
