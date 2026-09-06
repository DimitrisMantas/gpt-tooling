# /// script
# requires-python = "==3.13.*"
# dependencies = [
#   "ruff==0.16.6", "basedpyright==1.39.10", "wemake-python-styleguide==1.8.0",
#   "pytest==9.1.1", "numpy==2.5.2", "pydantic==2.13.5",
# ]
# ///
"""Check the optional Python profile in an isolated directory with pinned tools."""

import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


def main() -> None:
    profile = Path(__file__).resolve().parents[1] / "skills/plinth/assets/python"
    with tempfile.TemporaryDirectory(prefix="plinth-python-profile-") as directory:
        work = Path(directory)
        config = profile.joinpath("pyproject.toml").read_text(encoding="utf-8")
        work.joinpath("pyproject.toml").write_text(config, encoding="utf-8")
        shutil.copyfile(profile / ".flake8", work / ".flake8")

        def run(module: str, *arguments: str, success: bool = True) -> str:
            result = subprocess.run(
                [sys.executable, "-m", module, *arguments],
                cwd=work, capture_output=True, text=True, check=False,
            )
            output = result.stdout + result.stderr
            assert (result.returncode == 0) == success, (module, arguments, output)
            return output

        def source(text: str) -> None:
            work.joinpath("sample.py").write_text(text, encoding="utf-8")

        source('"""Calculate a signed change."""\n\n\ndef difference(current: int, previous: int) -> int:\n    """Return the change from the previous value."""\n    return current - previous\n')
        run("ruff", "format", "--check", "sample.py")
        run("ruff", "check", "sample.py")
        run("flake8", "sample.py")
        run("basedpyright", "sample.py")
        work.joinpath("test_sample.py").write_text(
            "import sample\n\n\ndef test_difference() -> None:\n    assert sample.difference(2, 5) == -3\n", encoding="utf-8",
        )
        run("pytest", "-q")
        run("pytest", "-q", "-m", "unknown_marker", success=False)

        source("def untyped(value):\n    return value\n")
        lint = run("ruff", "check", "sample.py", success=False)
        assert "missing-type-function-argument" in lint and "missing-return-type" in lint, lint
        source("def count() -> int:\n    return 'wrong'\n")
        typing = run("basedpyright", "--outputjson", "sample.py", success=False)
        assert any(item.get("rule") == "reportReturnType" for item in json.loads(typing)["generalDiagnostics"]), typing

        # Check retained WPS semantics and disabled conflicts independently of other rules.
        examples = {
            "WPS301": "import xml.etree.ElementTree\n",
            "WPS303": "mask = 0xFF_FF\n",
            "WPS335": "for item in [1, 2]:\n    print(item)\n",
            "WPS336": "message = 'prefix: ' + suffix\n",
            "WPS430": "def outer():\n    def inner():\n        return 1\n    return inner\n",
            "WPS473": "def phases():\n    first()\n\n    second()\n\n    third()\n\n    fourth()\n",
            "WPS476": "async def sequence(items):\n    for item in items:\n        await item()\n",
            "WPS602": "class Factory:\n    @staticmethod\n    def create():\n        return 1\n",
        }
        for code, example in examples.items():
            source(example)
            assert not run("flake8", "--select", code, "sample.py"), code
            assert code in run("flake8", "--isolated", "--select", code, "sample.py", success=False), code
        source("STATES = []\n")
        assert "WPS407" in run("flake8", "--select", "WPS407", "sample.py", success=False)

        text = "A long message preserving its complete source line and literal value. " * 3
        source(f'"""{text}"""\n\nMESSAGE = "{text}"\n')
        run("ruff", "check", "sample.py")
        run("ruff", "format", "sample.py")
        assert f'MESSAGE = "{text}"' in work.joinpath("sample.py").read_text(encoding="utf-8")

        source("import numpy as np\n\ndef flatten(image: np.ndarray[tuple[int, int, int], np.dtype[np.uint8]]) -> np.ndarray[tuple[int, int], np.dtype[np.uint8]]:\n    return image\n")
        typing = run("basedpyright", "--outputjson", "sample.py", success=False)
        assert any(item.get("rule") == "reportReturnType" for item in json.loads(typing)["generalDiagnostics"]), typing

        # Runtime validation has obligations that rank annotations and strict labels cannot prove.
        import numpy as np
        from pydantic import TypeAdapter, ValidationError

        image = np.zeros((2, 2, 4), dtype=np.uint8)
        assert image.ndim == 3 and image.shape[-1] != 3
        adapter = TypeAdapter(int)
        assert adapter.validate_python("12") == 12
        try:
            adapter.validate_python("12", strict=True)
        except ValidationError:
            pass
        else:
            raise AssertionError("Strict integer validation accepted a string")
        print("Python profile checks passed: full baseline, negative diagnostics, WPS conflicts, literal layout, rank, and runtime validation.")


if __name__ == "__main__":
    main()
