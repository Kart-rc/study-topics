# Synthetic teaching example. No production services are contacted.
tasks={'ingest':'SUCCESS','validate':'FAILED','publish':'BLOCKED'}
rows_before_repair=60
restart=[name for name,state in tasks.items() if state in ('FAILED','BLOCKED')]
write_mode='merge'
rows_after_repair=100 if write_mode=='merge' else 160

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['tasks', 'rows_before_repair', 'restart', 'write_mode', 'rows_after_repair']}, indent=2))
