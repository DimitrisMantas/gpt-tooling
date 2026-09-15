# Repository self-consistency inspection

Inspected on 2026-09-06 against the repository's Plinth, Ponytail, and Quire policies.

The inspection found three concrete mismatches in verification behavior, evaluation evidence retention, and documentation. The refinements use the existing scripts and checks without adding dependencies or policy layers.

## Findings and refinements

| Governing requirement | Finding | Refinement |
| --- | --- | --- |
| Plinth requires non-destructive verification; the installer documentation limits updates to Plinth and Quire. | Both `install.js test` and `install.js update` called submodule initialization, which could change the Ponytail checkout before checking its pin. | Verify the existing checkout by default. Initial installation explicitly requests initialization. A regression check rejects a wrong pin and verifies that the default path issues only a read command. |
| Plinth requires evidence retention and distinguishes incomplete evidence from a result. | The evaluator wrote its report only after every candidate and grader succeeded. A later execution or parsing error deleted temporary responses and left no report of completed cases. | Save the selected cases, responses, and grades incrementally. Preserve the failing case and error. Keep ungraded responses at `pass: null`, validate grade types, and distinguish execution completion from behavioral success. |
| Quire prohibits manually splitting prose and literals merely to satisfy a line-length diagnostic. | Its README broadly delegated physical layout to linters and source conventions, leaving comments and literals outside the stated protection. | Align the README with the governing skill's distinction between mechanical source syntax and complete prose or literal text. |

The evaluator writes each replacement report through a temporary file and rename. Its regression check observes an ungraded response on disk before the grader returns an invalid boolean, then checks that the failure record retains the prior result and current response. A separate synthetic execution checks the completed state. These tests assess runner behavior, not model performance.

## Verification

The following checks passed:

- Plinth and Quire hook checks.
- Reviewer-profile installer checks.
- Ponytail compatibility patch checks.
- Toolkit installer and evaluation-runner self-checks, including the new regressions.
- Release assembly and checks against an extracted archive.
- The isolated Python profile check with its pinned dependencies.
- Git diff whitespace checks.

## Scope and limits

The review covered the toolkit's governing and relevant progressive policies, composition boundaries, root execution scripts, owned hooks, reviewer installer, documentation, and existing verification paths. Ponytail remains an upstream dependency maintained through the tracked compatibility patch.

The local policy snapshot intentionally loads complete policy text for composition testing. The README already distinguishes this from progressive discovery and installed-plugin activation, so that test-specific delivery choice was retained.

No model behavioral suite or installed-plugin activation test was run for this refinement. Historical external source claims were not re-audited. Passing mechanical checks supports the exercised implementation contracts; it does not prove universal policy compliance by every model or generated artifact.
