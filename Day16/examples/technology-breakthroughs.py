# Synthetic teaching example. No production services are contacted.
clock_a = 2.0
clock_b = -1.0
combined_uncertainty = 7.7
difference = abs(clock_a - clock_b)
agrees_within_uncertainty = difference <= combined_uncertainty
claim = 'agreement' if agrees_within_uncertainty else 'investigate discrepancy'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['clock_a', 'clock_b', 'combined_uncertainty', 'difference', 'agrees_within_uncertainty', 'claim']}, indent=2))
