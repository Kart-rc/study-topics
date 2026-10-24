# Synthetic teaching example. No production services are contacted.
max_turns = 4
evidence_counts = [1, 2, 2, 2]
progress_deltas = [evidence_counts[i] - evidence_counts[i-1] for i in range(1, len(evidence_counts))]
stopped_without_progress = evidence_counts[-1] == evidence_counts[-2]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['max_turns', 'evidence_counts', 'progress_deltas', 'stopped_without_progress']}, indent=2))
