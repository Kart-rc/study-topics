# Synthetic teaching example. No production services are contacted.
raw_probability = 0.70
historical_frequency = 0.50
calibrated_probability = historical_frequency
reliability_gap = abs(raw_probability - calibrated_probability)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['raw_probability', 'historical_frequency', 'calibrated_probability', 'reliability_gap']}, indent=2))
