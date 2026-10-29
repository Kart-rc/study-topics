# Synthetic teaching example. No production services are contacted.
wire_message = {1: 42, 7: 'EXPRESS'}; old_known_numbers = {1}
old_known = {k: v for k, v in wire_message.items() if k in old_known_numbers}
binary_forward = dict(wire_message)
json_round_trip = dict(old_known); preserved_by_binary = 7 in binary_forward; preserved_by_json = 7 in json_round_trip

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['wire_message', 'old_known', 'binary_forward', 'json_round_trip', 'preserved_by_binary', 'preserved_by_json']}, indent=2))
