# Software extension review

Reviewed on 2026-09-06 against the repository, the [shared discussion](https://chatgpt.com/share/6a9d7634-45e4-83ed-924c-cabd3032fefe), current applicable OpenAI guidance, upstream tool documentation, and executable examples.

The extension fits the toolkit when software semantics remain in Plinth, implementation economy remains in Ponytail, and expression remains in Quire. The original proposal needed corrections to tool guarantees and several policy conflicts. The revised implementation preserves the requested engineering practices and WPS while separating general policy from its Python realization.

## Composition and scope

The [software reference](../plugins/plinth/skills/plinth/references/software.md) belongs to Plinth and loads for software work. Its [Python companion](../plugins/plinth/skills/plinth/references/python.md) loads only for Python. The supplied configuration fragments are assets for an authorized target-project change; they do not turn this Node.js repository into a Python project or automatically migrate another repository.

The [integration policy](../plugins/plinth/skills/plinth/references/integration.md) now defines feedback among the modules. A diagnostic or implementation constraint can expose a contract problem for Plinth to resolve. Ponytail implements the accepted meaning economically, and Quire preserves it in text. This requires no new plugin, hook, orchestrator, agent role, or mandatory sequence of passes. The existing compatibility patch continues to remove Ponytail's competing prose directives.

Language, framework, domain, repository shape, and model are not universal policy assumptions. Codex manifests and lifecycle hooks remain the delivery mechanism. The Python tool profile and evaluation model are concrete, replaceable realizations with explicit validation boundaries.

The optional reviewer profiles also inherit the caller's model selection instead of retaining the unsupported hard-coded identifier. Their existing high reasoning effort and read-only role remain explicit review settings. The installer self-check verifies model inheritance in the bundled profiles.

## OpenAI guidance

The structure follows current [skill guidance](https://learn.chatgpt.com/docs/build-skills): retain a compact discoverable entrypoint, load detailed references progressively, and keep reusable configuration in assets. The existing [plugin packaging](https://developers.openai.com/plugins/build/plugins) remains sufficient. No additional runtime service is needed.

The [hook documentation](https://learn.chatgpt.com/docs/hooks) supports the existing lifecycle activation approach. Hook output remains compact routing context, with complete policy read separately. Skill composition is made explicit because installing several skills does not itself resolve overlapping instructions. Local requirements remain controlling under the relevant [AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

Current [model guidance](https://developers.openai.com/api/docs/guides/latest-model) supports auditing instruction conflicts, preserving the user's requirements, completing authorized work, and keeping verification proportionate. Model-independent policy does not imply identical performance on every model. The old runner identifier `gpt-5.6` was rejected by the current ChatGPT-backed CLI. The runner now defaults to the available `gpt-5.6-sol` and accepts `GPT_TOOLING_EVAL_MODEL` as an explicit override.

The verification design follows [evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices): test task-specific behavior, use deterministic checks for mechanically observable conditions, and treat model grading as fallible evidence. Local policy snapshots are distinct from installed-plugin lifecycle tests. Optional [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) remain unnecessary for routine composition.

## Requirement coverage

The section numbers below refer to the constitution in the shared discussion. Each requirement has an owning policy rather than a duplicate standalone constitution.

| Section | Requirement | Revised home |
| --- | --- | --- |
| 1 | Human-owned durable source, semantics, local reasoning, reproducibility | Software: durable ownership and contracts |
| 2 | Plinth/Ponytail/Quire/tool responsibilities | Integration: cooperating responsibilities and feedback |
| 3 | KISS before DRY; deduplicate knowledge | Software: cohesion and implementation |
| 4 | Consequential API choices and defaults | Software: durable ownership and contracts |
| 5 | Domain types, constants, capabilities, controlled extension | Software contracts; Python types |
| 6 | Honest casts versus actual conversion | Software contracts; Python types |
| 7 | NumPy rank and dtype without false shape guarantees | Python types; executable rank and runtime examples |
| 8 | Pydantic for structured, dependent, or repeated validation | Python validation, including invariant lifetime |
| 9 | Established libraries before subtle custom machinery | Software implementation; Ponytail's existing ladder |
| 10 | Cohesive functions/classes, guard clauses, unsurprising properties | Software implementation |
| 11 | Legible qualified implementation imports and declaration vocabulary | Python imports and profile exclusions |
| 12 | Preserve unavailable rationale, units, and threshold sources | Software verification and explanation; Quire expression |
| 13 | No manual column wrapping of prose or literal text | Quire governing skill; Ruff E501/W505 exclusions |
| 14 | Meaningful blank-line phases | Software implementation; WPS473 exclusion |
| 15 | Coherent modules rather than generic dumping grounds | Software repository ownership |
| 16 | Consumer, ownership, and lifecycle for durable objects | Software repository and research artifacts |
| 17 | Structure appropriate to the actual project role | Software repository and research artifacts |
| 18 | Notebooks as first-class artifacts | Software repository and research artifacts |
| 19 | Configuration-based experiment variation and identity | Software artifacts; existing evidence reference |
| 20 | Computation versus IO and external representation | Software implementation |
| 21 | Consumer-oriented artifacts and family-level metadata | Software artifacts |
| 22 | Meaningful raw/derived/evaluation/presentation lifecycles | Software artifacts |
| 23 | Scripts and CLIs for real consumers | Software artifacts |
| 24 | Existing verification and narrow justified exceptions | Software verification; Python adoption |
| 25 | Configuration for mechanics, policy for judgment | Integration and Python rule boundaries |
| 26 | Proportionate, evidence-based completion | Existing governing skill and verification reference |

The final request to retain WPS is honored. Pydantic remains the preferred solution for the stated validation pressures, with simple isolated guards and an existing equivalent framework treated proportionately. Python 3.13 is the profile-check runtime, not a newly imposed minimum for every target repository.

## Corrections to the discussion

| Topic | Verified distinction and resulting change |
| --- | --- |
| Ruff imports | I001 sorts imports; F401 detects unused imports. Neither decides the semantic ownership of an API. PLR0402's submodule-to-from-import rewrite remains unselected. |
| Ruff preview | Explicit preview selection limits activation of preview rules; it does not freeze preview behavior of existing rules. SIM111 is already remapped to SIM110 in the tested release, so the redundant selector was removed. |
| BasedPyright | `all` is a broad diagnostic baseline, not a runtime proof. `recommended` can also fail the CLI on warnings. `allowedUntypedLibraries` suppresses specific diagnostics, not all typing failures. A JSON configuration takes precedence over TOML. |
| Python typing | `cast` asserts a static type; `Final` restricts rebinding. Neither validates values or establishes deep immutability. A meaningful Protocol can have one implementation. |
| NumPy | A rank-three unsigned-byte array can have four channels. Rank/dtype information remains useful, but RGB and axis semantics require additional boundary checks. |
| Pydantic | Strict Python-input and JSON-input rules can differ. Validation does not make arbitrary later mutation safe; invariant lifetime matters. |
| WPS303 | Current WPS permits groups of three digits. Its exclusion supports other meaningful domain grouping, rather than correcting a nonexistent universal underscore ban. |
| WPS336 | The diagnostic targets explicit string concatenation involving known string syntax. Its explanatory text is broader than the actual check and does not establish a universal f-string ban. |
| WPS473/602 | Blank-line ratios and blanket static-method bans conflict with semantic phases and legitimate class contracts. Both are excluded in addition to the discussion's six exclusions. |
| Other WPS checks | Naming, mutable-constant, class-field, endless-loop, and complexity rules are heuristics with limited scope. Their presence is not proof of cohesion, deep immutability, correct class ownership, termination, or good decomposition. Obsolete WPS451 is not relied upon. |
| pytest | Native `[tool.pytest]` and the strict bundle require pytest 9+. Older 7.1 documentation cannot substantiate that configuration. The check uses released 9.1.1 rather than an unreleased changelog heading. |
| uv | `sync --locked` checks lock freshness and reconciles dependencies; it can remove undeclared packages. A lock does not pin every interpreter, platform, external input, or random source. |

Primary tool references: [Ruff settings](https://docs.astral.sh/ruff/settings/), [formatter](https://docs.astral.sh/ruff/formatter/), [PLR0402](https://docs.astral.sh/ruff/rules/manual-from-import/), [BasedPyright configuration](https://docs.basedpyright.com/latest/configuration/config-files/), [Python typing](https://docs.python.org/3.13/library/typing.html), [NumPy typing](https://numpy.org/doc/stable/reference/typing.html), [Pydantic strict mode](https://docs.pydantic.dev/latest/concepts/strict_mode/), [WPS consistency](https://wemake-python-styleguide.readthedocs.io/en/latest/pages/usage/violations/consistency.html), [WPS best practices](https://wemake-python-styleguide.readthedocs.io/en/latest/pages/usage/violations/best_practices.html), [WPS OOP](https://wemake-python-styleguide.readthedocs.io/en/latest/pages/usage/violations/oop.html), [pytest reference](https://docs.pytest.org/en/stable/reference/reference.html), and [uv sync](https://docs.astral.sh/uv/concepts/projects/sync/).

Mypy remains appropriate for an actual compatibility consumer, Pylint R0801 remains advisory similarity evidence, and Import Linter encodes already accepted architecture. They are not default additional gates. See [mypy existing-code guidance](https://mypy.readthedocs.io/en/stable/existing_code.html), [Pylint duplicate-code](https://pylint.readthedocs.io/en/latest/user_guide/messages/refactor/duplicate-code.html), and [Import Linter contracts](https://import-linter.readthedocs.io/en/stable/contract_types.html).

## Source audit boundary

The discussion's inline citations and three source panels yielded 427 distinct URLs after normalization, including historical versions, localized duplicates, and background search results. All were requested again. The [source ledger](software-extension-sources.csv) records each URL, redirect destination, retrieval status, and retrieved-text hash. The working research inventory and downloaded source text are archived locally outside the repository and are not redistributed policy.

HTTP success is not substantive verification. Forty-five PyPI pages returned JavaScript challenge content. Package availability and the selected compatibility versions were instead checked by resolving and executing the packages. Versioned older pages were treated as historical context, and unrelated sources such as FastUI documentation were not used to justify Pydantic validation. Applicable claims were checked against current primary documentation and, for fragile rule semantics, installed source and executable examples. This review does not claim that every background URL contains a requirement, that every source agrees, or that all OpenAI documentation is applicable to this extension.

## Reproducible checks and limits

Run `uv run --script plugins/plinth/scripts/check-python-profile.py` for the isolated Python compatibility check. It pins the test dependencies, runs a clean example through the profile, checks failing annotations and return types, exercises retained and excluded WPS diagnostics, checks strict pytest marker handling, preserves a long literal through Ruff formatting, and distinguishes NumPy rank from runtime shape and Pydantic coercion from strict integer validation.

The three added behavioral cases exercise cross-module contract preservation, non-Python repository compatibility, and typing/runtime/prose boundaries. They now run with every other check through `node scripts/test.js`; see the [verification contract](../README.md#verification). The historical path-based experiment encountered blocked Windows sandbox reads, so its apparent semantic passes did not establish that the policies loaded. The current runner supplies complete policy text through stdin and records policy hashes. This tests representative policy outcomes; mechanical hook checks separately exercise lifecycle behavior.

The root mechanical and release checks cover manifests, skill routing, hooks, compatibility patching, evaluation-runner structure, archive assembly, and extracted-package checks. The optional Python test remains separate so a toolkit installation does not acquire Python dependencies. A passing profile demonstrates the sampled behavior for its recorded versions, not universal semantic correctness or complete experimental reproducibility.

Recorded results for this review:

| Check | Result |
| --- | --- |
| Isolated Python profile, Python 3.13 and the pinned dependencies | Passed |
| Three software policy regressions, `gpt-5.6-sol`, high effort | 3/3 passed after the evaluator and composition corrections |
| Release assembly and extracted-archive mechanical checks | Passed |
| Reviewer installer model-inheritance check | Passed |
| Diff whitespace check | Passed |
| Installed-plugin behavioral activation with the revised checkout | Not run; requires a fresh session after installation |

The final behavioral records are `2026-09-06T15-01-33-844Z.json`, `2026-09-06T15-01-19-910Z.json`, and `2026-09-06T15-01-36-567Z.json` under `dist/evals/`. Their candidate and grader contexts ignore user configuration and execution rules, disable hooks/plugins, and set `project_doc_max_bytes=0` using the documented [configuration control](https://learn.chatgpt.com/docs/config-file/config-reference). The observed final responses were also inspected directly. The full 24-case behavioral suite was not rerun; these results cover the extension's three targeted cases.
