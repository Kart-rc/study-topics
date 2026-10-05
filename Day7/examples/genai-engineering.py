# Synthetic teaching example. No production services are contacted.
remaining_failures = 8; turn = 0; max_turns = 5
remaining_failures -= 1; turn += 1
remaining_failures -= 1; turn += 1
remaining_failures -= 1; turn += 1
remaining_failures -= 1; turn += 1
remaining_failures -= 1; turn += 1
status = "MET" if remaining_failures == 0 else "BUDGET_EXHAUSTED" if turn >= max_turns else "CONTINUE"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['remaining_failures', 'turn', 'max_turns', 'status']}, indent=2))
