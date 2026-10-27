# Synthetic teaching example. No production services are contacted.
symptom = 'changes missing after downtime'
boundary = 'change position and retention'
evidence = ['durable cursor', 'earliest retained version or STALE_AFTER']
first_action = 'reconcile the gap; do not blind-retry'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['symptom', 'boundary', 'evidence', 'first_action']}, indent=2))
