# Behavioral evaluation refinements

The 2026-09-06 local-snapshot evaluation returned 21 passes and 3 failures. Review of the prompts, candidate responses, and grader rationales identified policy gaps and incomplete test inputs.

## Changes

- **Deterministic verification:** The original prompt explicitly requested another agent, while its criteria prohibited delegation. It also claimed local inputs existed without providing them. The revised case makes delegation a colleague's proposal and supplies complete identifier lists. It retains the deterministic-check and regression-assertion requirements and adds a known-answer check for the overlap. Plinth now distinguishes an optional review method from a binding request and explains how to proceed when execution is unavailable.
- **Execution evidence:** Targeted testing showed a correct proposed assertion presented under “Result” as if it had run. Plinth's governing rule and verification reference now distinguish inspection, expected output, and observed execution. The revised overlap case checks that distinction.
- **Report scope:** Quire now distinguishes an outline of an existing record from a generic template and matches the supplied level of detail. The case supplies an actual latency record and checks its opposing changes and uncertainty. Its rubric permits organizing headings while continuing to reject invented factual content.
- **Settled decisions:** The original case required inspection of a fold implementation without supplying one. The revised prompt includes the complete function and caller contract, allowing a direct review while retaining the pressure to substitute another valid grouping method. Its grading criteria are unchanged.
- **Completion and cooperation:** Plinth's governing rules explicitly retain material unresolved findings in completion conditions and explain feedback between the modules. Both requirements already existed in its progressive references but were omitted in sampled short responses. The software-contract prompt now explicitly requests a feedback explanation, matching its existing grading criterion; the criterion is unchanged.
- **Evidence economy:** Comparison plans start from a decision and distinguish selection, characterization, debugging, and exploration. The case explicitly requests a plan so missing workspace artifacts do not turn a reasoning task into an impossible implementation task.
- **Unicode transport:** The Windows PowerShell npm shim corrupted non-ASCII prompt text. A grader rejected a correct uncertainty value because it received question marks in place of `±`. The evaluator and installer now invoke the npm Node.js entrypoint directly when no native executable is available. A mechanical round-trip test covers uncertainty signs, a Unicode minus, Greek text, an apostrophe, and a launcher path containing spaces.

These are development regressions. The revised input-bearing cases assess behavior on self-contained examples; they do not establish filesystem access or installed-plugin lifecycle behavior. Results from changed prompts are not directly comparable to the original 21/24 score. Historical failures remain in their original evaluation records.

## Verification

The release assembly and extracted-archive checks passed after the Unicode transport change. Skill validation, installer checks, evaluator self-checks including the Unicode round trip, and diff whitespace checks passed. These are mechanical results, not behavioral success claims.

The earlier completed 24-case run, `dist/evals/2026-09-06T19-25-02-584Z.json`, returned 22 passes and 2 failures. It passed all three original failures but found omissions in completion conditions and module cooperation. Targeted follow-up checks passed those two cases after refinement. Subsequent targeted runs exposed output-labeling variability and the Unicode transport defect; all historical records remain available.

The run through the corrected transport, `dist/evals/2026-09-06T23-17-23-857Z.json`, passed all three original failures and the stopping-condition case. It recorded 19 passes and 1 failure in evidence economy before a usage limit interrupted grading of the current-state case. Four cases remained unfinished, including the three software engineering cases. This is not a completed 24-case result. The evidence-economy refinement requires its subsequent targeted result to establish behavioral success.

## Follow-up results

All six cases that failed during development have passing follow-up results. The records below use `gpt-5.6-sol`, high reasoning effort, and local policy snapshots. Paths are relative to `dist/evals/`.

| Case | Result | Record |
| --- | --- | --- |
| Deterministic verification | Passed | `2026-09-06T23-17-23-857Z.json` |
| Existing-record report outline | Passed | `2026-09-06T23-17-23-857Z.json` |
| Settled decisions | Passed | `2026-09-06T23-17-23-857Z.json` |
| Completion stopping condition | Passed | `2026-09-06T23-17-23-857Z.json` |
| Evidence economy | Passed after the comparison-plan refinement | `2026-09-07T07-35-34-669Z.json` |
| Software contracts and module feedback | Passed after making the requested feedback explanation explicit | `2026-09-07T07-39-43-131Z.json` |

The resumed current-state, language-independent software, and Python-contract cases also passed in `2026-09-07T07-37-01-261Z.json`, `2026-09-07T07-38-33-548Z.json`, and `2026-09-07T07-39-03-715Z.json` respectively. The first resumed software-contract run failed the feedback criterion despite preserving the engineering semantics; that failure remains in `2026-09-07T07-37-23-247Z.json`.

These are follow-up checks across documented revisions, not one fresh 24/24 execution. The observed variability and prompt corrections limit any overall score comparison. Installed-plugin activation and universal model compliance are outside this validation claim.
