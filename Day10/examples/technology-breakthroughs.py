# Synthetic teaching example. No production services are contacted.
requested_level = 10; write_power = True
stored_level = requested_level if write_power else 0
write_power = False
read_light = True; input_value = 0.6
output = input_value * stored_level / 15 if read_light else None
read_light = False; output = None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requested_level', 'write_power', 'stored_level', 'read_light', 'input_value', 'output']}, indent=2))
