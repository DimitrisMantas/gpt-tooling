# Plinth: Python application

Apply [software.md](software.md) using the project's supported Python version, dependencies, and existing configuration. This companion is a Python realization of the general policy, not a requirement to use Python or migrate every Python project.

## Types, validation, and dependencies

Use `Final`, `ClassVar`, `Protocol`, `NewType`, `Literal`, enums, dataclasses, and `final` when they express a meaningful contract. `Final` restricts rebinding, `ClassVar` distinguishes class state, and `final` constrains static extension; none is a universal runtime enforcement mechanism. Prefer immutable containers for actual constants and account for nested mutable values.

Preserve useful NumPy rank and dtype information when the installed NumPy and checker support it. For example, `np.ndarray[tuple[int, int, int], np.dtype[np.uint8]]` describes rank three with an unsigned-byte dtype; it does not prove a three-channel RGB image, axis meanings, contiguity, or channel order. Validate those runtime obligations at the boundary. Use `numpy.typing.ArrayLike` for inputs deliberately normalized into arrays, not to erase a known internal array contract. Investigate checker limitations before adding casts or broad unknown-type suppression.

Prefer Pydantic for structured runtime validation when conditional guards, dependent fields, coercion, or repeated validation would otherwise become custom validation machinery. Use the smallest fitting `BaseModel`, `TypeAdapter`, field/model validator, or `validate_call`; retain an existing equivalent framework when it meets the contract. Simple isolated guards need no model. Prefer strict internal values and deliberate boundary coercion. Verify Python-input and JSON-input behavior separately where relevant: strict mode still has representation-specific allowances. Validation establishes a contract for a lifecycle; choose immutability or assignment/revalidation behavior when later mutation matters.

Prefer module-qualified implementation calls (`import pathlib`, `import numpy as np`) and direct imports for declaration vocabulary (`from typing import Final`). Use conventional aliases and the most specific supported public module that owns the API. Public facades such as `os.path` remain legitimate. Importing `a.b` normally also binds `a`; do not add redundant imports to satisfy a mistaken model of Python imports. Import sorting and unused-import checks do not enforce this semantic distinction.

## Tool profile and adoption

The companion [pyproject fragment](../assets/python/pyproject.toml) and [Flake8 configuration](../assets/python/.flake8) realize the requested uv, Ruff, BasedPyright, WPS, and pytest baseline. Merge them only for an authorized Python tooling change after inspecting current configuration, supported interpreters, CI, source roots, notebooks, generated code, and package versus script layout. They are templates, not root configuration for this Node.js toolkit. Preserve sound existing equivalents; explain any material conflict with an explicit user requirement.

Keep mechanical rules in configuration and semantic judgment in this policy. Establish project metadata and the real Python minimum separately. Ruff can infer its target from `requires-python`; BasedPyright must agree with the actual supported runtime. A `pyrightconfig.json` takes precedence over its TOML section. A notebook needs its existing execution/checking path; the listed commands alone do not establish notebook execution correctness.

Use project-managed development dependencies and lock the resolved environment. The checked profile uses Ruff 0.16.6, BasedPyright 1.39.10, WPS 1.8.0, and pytest 9.1.1. These are a tested compatibility snapshot, not permanently current versions or mandatory pins for unrelated projects. `[tool.pytest]` and `strict` require pytest 9 or later. Upgrade intentionally and rerun representative checks because rule semantics and strict bundles can change. Ruff preview remains enabled only to support the explicitly selected preview rules; `explicit-preview-rules` does not freeze changes to existing rules.

For a uv project with these tools in its locked development environment, use the existing task/CI mechanism to run:

```sh
uv sync --locked
uv run --no-sync ruff format --check .
uv run --no-sync ruff check .
uv run --no-sync flake8 .
uv run --no-sync basedpyright
uv run --no-sync pytest
```

`sync` reconciles the environment and can remove undeclared packages; `--locked` rejects a stale lock. `--no-sync` reuses that reconciled environment. Supply project-specific groups and paths where needed. Record interpreter/platform and external input identity when reproducibility requires them. For scripts without a project, use the existing script environment rather than creating a package solely to run these commands.

## Rule boundaries and exceptions

Ruff owns formatting, import sorting, and the selected static diagnostics. E501 and W505 are excluded so column width does not force manual prose wrapping. Its formatter's width is a best-effort syntax target. PLR0402 is deliberately unselected because its import rewrite conflicts with qualified implementation imports. TID252 and BasedPyright's implicit-relative-import diagnostic check different import forms. Complexity thresholds and magic-number findings require domain judgment, meaningful constants, or narrow documented exceptions.

BasedPyright `all` is a deliberately broad diagnostic baseline. It neither requires every useful annotation nor proves runtime invariants. Scope `allowedUntypedLibraries` to identified libraries only when justified; it suppresses selected unknown-variable, unknown-member, and missing-stub diagnostics, not every typing issue. Keep mypy when a real compatibility consumer requires it. Use Pylint R0801 as advisory duplication evidence and Import Linter for already accepted architecture contracts, rather than installing either speculatively.

WPS remains enabled with `select = WPS`, so its complementary diagnostics are retained without duplicating all of Flake8's rule families. The profile disables these genuine conflicts:

| Rule | Reason |
| --- | --- |
| WPS301 | Dotted imports can express the intended public implementation dependency. |
| WPS303 | Domain-specific digit grouping can be clearer than mandatory groups of three; current WPS already allows ordinary thousands separators. |
| WPS335 | A blanket loop-literal restriction can force unnecessary local variables. |
| WPS336 | A blanket concatenation restriction can replace the appropriate string operation; its documentation's formatting preference is not an actual universal f-string ban. |
| WPS430 | Closures and nested helpers can own legitimate local state and behavior. |
| WPS473 | A blank-line ratio must not erase useful semantic phases or force fragmentation. |
| WPS476 | Sequential awaits can preserve ordering, backpressure, resource limits, or failure semantics. |
| WPS602 | A static method can belong to an actual class contract or factory. |

Other WPS rules remain diagnostic evidence. Generic-name checks cannot determine module cohesion; mutable-constant checks cannot prove deep immutability; class-field checks do not replace `ClassVar`; complexity limits cannot decide decomposition. Preserve the underlying quality requirement when a narrow justified exception is needed. Do not disable whole families merely because a finding is inconvenient.
