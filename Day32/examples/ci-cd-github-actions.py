# Synthetic teaching example. No production services are contacted.
severity_rank = {'none': 0, 'low': 1, 'moderate': 2, 'high': 3, 'critical': 4}
threshold = severity_rank['high']
introduced = severity_rank['high']
merge_allowed = introduced < threshold

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['severity_rank', 'threshold', 'introduced', 'merge_allowed']}, indent=2))
