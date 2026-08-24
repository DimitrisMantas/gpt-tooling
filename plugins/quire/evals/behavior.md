# Quire Behavior

Use these scenarios to test behavior, not exact wording. A response passes when it preserves the described writing properties without inventing technical content or adding document ceremony.

## Automatic Standard routing for an annual report

Prompt:

> Revise my annual business report for clarity.

Expected behavior:

- Quire applies the Standard branch.
- The word `report` does not trigger scientific reporting guidance.
- The revision preserves the supplied business meaning and evidence.

## Automatic Technical routing for empirical research

Prompt:

> Draft the methods and results sections for this empirical study from the supplied protocol and outputs.

Expected behavior:

- Quire loads the Technical extension.
- The artifact follows applicable venue and disciplinary conventions.
- Quire does not add analyses or results absent from the supplied record.

## Report parser false positive

Prompt:

> The report parser fails when the title contains a colon. Write a concise diagnostic message.

Expected behavior:

- Quire uses the Standard branch.
- The message is operational, direct, and actionable.
- No document-level or scientific checklist appears.

## Evidence-bearing engineering report

Prompt:

> Turn these accepted requirements, measurements, and validation results into an engineering validation report.

Expected behavior:

- Quire uses the Technical branch.
- The report preserves requirements, methods, evidence, uncertainty, and accepted limitations.
- Quire does not request generic extra metrics without a technical obligation from Plinth.

## UI mode selectors

Prompts:

> $quire-auto

> $quire-standard

> $quire-technical

Expected behavior:

- The skill UI labels are Automatic, Standard, and Technical.
- Each selector changes Quire to the matching persistent mode.
- Selector skills are explicit-only and do not compete with the always-on Quire policy through implicit routing.

## Explicit Standard override

Prompt:

> /quire standard

Follow-up:

> Rewrite this research summary as a short internal message.

Expected behavior:

- Quire remains in Standard mode.
- Automatic technical routing is suppressed.
- The message remains technically faithful without document ceremony.

## Explicit Technical override

Prompt:

> /quire technical

Follow-up:

> Edit this short methods note.

Expected behavior:

- Quire applies both the Standard and Technical policies.
- The technical reference is loaded once in the agent context when needed.

## Unsupported uncertainty analysis

Prompt:

> Improve this results section. It reports a point estimate but the analysis contains no uncertainty calculation.

Expected behavior:

- Quire identifies that the claim lacks available uncertainty information when this affects interpretation.
- Quire does not calculate or invent confidence intervals.
- The gap is returned to Plinth or the user as a technical-content issue.

## Null result preservation

Prompt:

> Rewrite this conclusion: the accepted analysis found no material difference between the methods.

Expected behavior:

- The null result remains null.
- Quire does not manufacture significance, novelty, or a directional preference.
- Qualifications remain proportional to the accepted evidence.

## Mixed result preservation

Prompt:

> Edit this discussion. Performance improved under one operating condition and degraded under another.

Expected behavior:

- Both result branches remain visible.
- Quire does not collapse the evidence into a uniformly positive narrative.
- Scope and operating conditions remain attached to the claims they qualify.

## Domain-applicable reporting guidance

Prompt:

> Structure this machine-learning experiment report. No reporting checklist or target venue is specified.

Expected behavior:

- Quire uses established practice for the relevant discipline.
- It does not apply a biomedical checklist solely because the work is a prediction model.
- It flags a missing governing requirement only when the gap materially changes the artifact.

## Operational log message

Prompt:

> Write the log message for three duplicate identifiers in the validation manifest.

Expected behavior:

- The output is a short, complete, precise message.
- It includes the material count and object.
- It does not receive a document-level editorial pass or headings.

## Source-code formatting authority

Prompt:

> Rewrite this docstring. The project formatter wraps source text at 88 characters.

Expected behavior:

- Quire improves the words.
- The project formatter governs physical wrapping.
- Quire does not enforce an absolute no-wrap rule inside the source file.

## Technical punctuation

Prompt:

> Edit this sentence for a venue that uses an en dash in numeric ranges: The operating range was 20 to 40 m.

Expected behavior:

- Quire follows the target style and may use `20–40 m`.
- Punctuation supports clarity instead of acting as a blanket prohibition or synthetic flourish.

## Sentence thresholds

Prompt:

> Edit this tightly qualified scientific claim. Splitting it would detach the qualification from the result.

Expected behavior:

- Quire treats sentence length as a diagnostic threshold.
- It preserves a longer sentence when that structure is clearer and more accurate.
- It avoids staccato prose created only to satisfy a word count.

## Interagent finding

Prompt:

> Send the implementation reviewer a finding with the evidence, uncertainty, dependency, and requested check.

Expected behavior:

- Quire uses concise natural technical prose.
- It preserves the operational content.
- It does not add ceremonial headings, status tokens, confidence scores, or a standalone-report structure without a machine consumer.

## Short error message final pass

Prompt:

> Rewrite: Cache file opening operation has been unsuccessful.

Expected behavior:

- The result is direct and grammatical, such as `The cache file could not be opened.`
- The check is limited to correctness, clarity, terminology, actionability, and unnecessary wording.

## Standalone document

Prompt:

> Turn these accepted decisions and evidence into a handoff document.

Expected behavior:

- The artifact includes the purpose, scope, necessary definitions, assumptions, evidence, and limitations.
- It removes references to the chat and drafting process unless provenance requires them.

## Source hierarchy and anti-pattern diagnostics

Prompt:

> Humanizer flags a phrase that the target technical standard requires. Which rule wins?

Expected behavior:

- The governing technical standard wins.
- Humanizer is treated as a secondary anti-pattern catalog.
- Quire does not treat Humanizer and its Wikipedia basis as independent evidence.

## Technical feedback boundary

Prompt:

> A reviewer asks Quire to add a new experiment so the report has a stronger conclusion.

Expected behavior:

- Quire treats the request as a technical proposal for Plinth to evaluate.
- It does not invent or silently add the experiment.
- It preserves the current conclusion until the accepted technical record changes.

## Proportional final review

Prompt:

> Edit one warning message and a full evidence-bearing technical report.

Expected behavior:

- Both artifacts follow the same core principles.
- The warning receives a compact operational check.
- The report receives the full technical, evidence, uncertainty, reproducibility, and governing-form checks.
