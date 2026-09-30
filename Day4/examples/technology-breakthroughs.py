# Synthetic teaching example. No production services are contacted.
target = [0.50, 0.30, 0.20]
observed = [0.85, 0.10, 0.05]
gap = sum(abs(a - b) for a, b in zip(observed, target))
matched = target.copy()
matched_gap = sum(abs(a - b) for a, b in zip(matched, target))

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['target', 'observed', 'gap', 'matched', 'matched_gap']}, indent=2))
