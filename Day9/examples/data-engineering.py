# Synthetic teaching example. No production services are contacted.
partitions = 24; moved = 4; pause_seconds = 2
barrier_exposure = partitions * pause_seconds
incremental_exposure = moved * pause_seconds
unaffected = partitions - moved
reduction_percent = 100 * (barrier_exposure - incremental_exposure) / barrier_exposure

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['partitions', 'moved', 'pause_seconds', 'barrier_exposure', 'incremental_exposure', 'unaffected', 'reduction_percent']}, indent=2))
