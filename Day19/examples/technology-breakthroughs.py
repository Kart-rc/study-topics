# Synthetic teaching example. No production services are contacted.
allowed_policy = "P7"
attested_workload = "X9"
key_released = attested_workload == allowed_policy
plaintext_available = key_released
attested_workload = "P7"
key_released = attested_workload == allowed_policy
plaintext_available = key_released

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['allowed_policy', 'attested_workload', 'key_released', 'plaintext_available']}, indent=2))
