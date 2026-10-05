# Synthetic teaching example. No production services are contacted.
sizes = [40, 42, 43, 44, 45, 900]
median = (sizes[2] + sizes[3]) / 2
threshold = max(5 * median, 256)
skewed = sizes[-1] > threshold
pieces = (sizes[-1] + 63) // 64
piece_mb = sizes[-1] / pieces

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['sizes', 'median', 'threshold', 'skewed', 'pieces', 'piece_mb']}, indent=2))
