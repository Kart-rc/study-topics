# Synthetic teaching example. No production services are contacted.
records = [(20, 'O42', 'packed'), (21, 'O17', 'queued'), (22, 'O42', 'shipped'), (23, 'O17', None)]
state = {}
for offset, key, value in records:
    if value is None:
        state.pop(key, None)
    else:
        state[key] = value
latest = {}
for offset, key, value in records:
    latest[key] = (offset, value)
compacted = sorted((offset, key, value) for key, (offset, value) in latest.items())
compacted_offsets = [row[0] for row in compacted]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['records', 'state', 'offset', 'key', 'value', 'latest', 'compacted', 'compacted_offsets']}, indent=2))
