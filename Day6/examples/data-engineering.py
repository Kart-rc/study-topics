# Synthetic teaching example. No production services are contacted.
mib_per_second = 120; replicas = 3
local_tib = mib_per_second * 6 * 3600 * replicas / 1024**2
remote_tib = mib_per_second * 168 * 3600 / 1024**2
rewind_hours = 48
read_path = "remote" if rewind_hours > 6 else "local"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['mib_per_second', 'replicas', 'local_tib', 'remote_tib', 'rewind_hours', 'read_path']}, indent=2))
