# Synthetic teaching example. No production services are contacted.
current_version = 7; alice_tag = 7; bob_tag = 7
alice_status = 200 if alice_tag == current_version else 412; current_version += 1 if alice_status == 200 else 0
bob_status = 200 if bob_tag == current_version else 412
stored_version = current_version

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['current_version', 'alice_tag', 'bob_tag', 'alice_status', 'bob_status', 'stored_version']}, indent=2))
