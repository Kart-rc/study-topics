# Synthetic teaching example. No production services are contacted.
state = 10
channel = [2, 3]
snapshot = {"state": state, "channel": channel.copy()}
state = 0
channel = []
restored = snapshot["state"] + sum(snapshot["channel"])
broken_restore = snapshot["state"]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['state', 'channel', 'snapshot', 'restored', 'broken_restore']}, indent=2))
