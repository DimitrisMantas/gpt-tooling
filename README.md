# Engineer suite

This repository distributes three independently maintained Codex plugins that are designed to operate together:

- Engineer owns requirements, technical semantics, methodology, evidence obligations, engineering decisions, uncertainty and claim boundaries, review, and verification.
- Ponytail owns source-code implementation, reuse, dependency restraint, abstraction restraint, and the smallest correct diff.
- Writer owns natural-language expression, document organization, readability, terminology consistency, genre conventions, and faithful presentation.

The suite is general and domain-agnostic. It applies to software, systems, hardware, models, methods, data, experiments, operations, reviews, and technical communication without naming particular projects, models, or datasets.

## Versions

- Engineer 2.0.0
- Writer 1.0.0
- Ponytail 4.9.0 at pinned commit `2ed6c52c9d7e5e56942508591085fd45dea277d3`

The final Engineering Partner 1.x state is preserved in commit `f87bbcf` as version 1.4.0.

## Install the suite

Clone the repository with its pinned dependency and run the coordinated installer:

```bash
git clone --recurse-submodules <repository-url>
cd <repository-directory>
node scripts/install.js
```

The installer initializes Ponytail when the repository was cloned without submodules, registers this repository as the `engineer-suite` marketplace, installs Engineer, Writer, and the pinned Ponytail plugin, and verifies the result. It reports installed Engineering Partner, Engineering, Writing, Writer, Engineer, or Ponytail plugins that would duplicate the suite policy without removing user configuration.

Codex does not automatically trust plugin hooks. Review and trust all three hook definitions, then start a new thread so their skills and hooks load together.

A source archive must include the populated `plugins/ponytail` directory because an archive has no Git metadata from which to initialize a submodule.

## Repository layout

```text
.
├── .agents/plugins/marketplace.json
├── plugins/
│   ├── engineer/
│   ├── writer/
│   └── ponytail/                 pinned Git submodule
└── scripts/install.js
```

Engineer and Writer each contain their own manifest, hook, skill, documentation, and checks. Either plugin can be maintained or packaged independently. The repository marketplace and installer are the supported path for operating them as one suite with Ponytail.

## Verify the checkout

```bash
node plugins/engineer/hooks/engineer.js test
node plugins/engineer/scripts/install-agents.js test
node plugins/writer/hooks/writer.js test
node scripts/install.js test
```

Run the skill and plugin validators on each plugin before distribution. Run the behavioral scenarios under each plugin's `evals` directory after policy changes.
