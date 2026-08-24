# Plinth Agents

These optional read-only agents extend Plinth with three independent review roles.

| Agent | Scope |
| --- | --- |
| `plinth_code` | Implementation correctness, invariants, affected behavior, and material regressions |
| `plinth_methods` | Scientific, statistical, experimental, analytical, and evaluation validity |
| `plinth_claims` | Evidence for one consequential technical claim or reviewer finding |

Use an agent only when its review axis is material to the task. The parent agent supplies the bounded question, relevant artifacts, requirements, and evidence. It retains synthesis and decision ownership.

Install the profiles from the repository root:

```bash
node plugins/plinth/scripts/install-agents.js
```

Use `--force` only when replacing an existing profile with the definitions in this checkout.
