# Synthetic teaching example. No production services are contacted.
replicas = ["A", "B", "C"]
N, W, R = 3, 2, 2
write_responders = ["A", "B"]
read_responders = ["B", "C"]
overlap = sorted(set(write_responders) & set(read_responders))
latest_is_reachable = len(overlap) > 0
unsafe_read = ["C"]
unsafe_overlap = sorted(set(write_responders) & set(unsafe_read))

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['replicas', 'N', 'W', 'R', 'write_responders', 'read_responders', 'overlap', 'latest_is_reachable', 'unsafe_read', 'unsafe_overlap']}, indent=2))
