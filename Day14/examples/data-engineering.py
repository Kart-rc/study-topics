# Synthetic teaching example. No production services are contacted.
snapshot = {'O42': 'queued'}
boundary_lsn = 100
log = [(100, 'O42', 'queued'), (101, 'O42', 'paid'), (102, 'O43', 'queued')]
replay = [event for event in log if event[0] > boundary_lsn]
replay_lsns = [event[0] for event in replay]
current = snapshot.copy()
for lsn, order_id, status in replay:
    current[order_id] = status

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['snapshot', 'boundary_lsn', 'log', 'replay', 'replay_lsns', 'current', 'lsn', 'order_id', 'status']}, indent=2))
