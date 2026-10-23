# Synthetic teaching example. No production services are contacted.
resource_present = True
first_status = 204 if resource_present else 404; resource_present = False
second_status = 204 if resource_present else 404; resource_present = False
final_state = 'absent' if not resource_present else 'present'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['resource_present', 'first_status', 'second_status', 'final_state']}, indent=2))
