# Synthetic teaching example. No production services are contacted.
fact_rows=10_000_000; dimension_mb=8; workers=4
broadcast_transfer_mb=dimension_mb*workers
fact_rows_per_worker=fact_rows//workers
candidate=dimension_mb<=256; result={'transfer_mb':broadcast_transfer_mb,'fact_rows_per_worker':fact_rows_per_worker,'candidate':candidate}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['fact_rows', 'dimension_mb', 'workers', 'broadcast_transfer_mb', 'fact_rows_per_worker', 'candidate', 'result']}, indent=2))
