# Synthetic teaching example. No production services are contacted.
voltage = 1.2
threshold = 1.0
rotates = abs(voltage) >= threshold; direction = 'forward' if voltage > 0 else 'reverse'
conductance_state = 'enhanced' if rotates else 'rest-state range'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['voltage', 'threshold', 'rotates', 'direction', 'conductance_state']}, indent=2))
