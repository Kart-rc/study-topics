# Synthetic teaching example. No production services are contacted.
device_size_um = [38, 38, 61]
reported_force_to_mass = 340
light_power = 5
open_gap_um = 12
toy_gap_um = max(0, open_gap_um - light_power)
toy_state = 'gentle-hold' if 4 <= toy_gap_um <= 8 else 'outside-toy-band'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['device_size_um', 'reported_force_to_mass', 'light_power', 'open_gap_um', 'toy_gap_um', 'toy_state']}, indent=2))
