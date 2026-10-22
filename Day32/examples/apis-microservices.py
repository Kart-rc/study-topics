# Synthetic teaching example. No production services are contacted.
ready_after_s = 3
deadline_s = 5
sent = ready_after_s < deadline_s
remaining_budget_s = deadline_s - ready_after_s if sent else 0

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['ready_after_s', 'deadline_s', 'sent', 'remaining_budget_s']}, indent=2))
