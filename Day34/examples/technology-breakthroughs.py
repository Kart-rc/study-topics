# Synthetic teaching example. No production services are contacted.
scattering_strength = [1, 2, 3, 4, 5, 6]
critical_temperature = [4, 7, 10, 13, 16, 19]
paired = list(zip(scattering_strength, critical_temperature))
trend_is_positive = all(paired[i][1] > paired[i-1][1] for i in range(1, len(paired)))

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['scattering_strength', 'critical_temperature', 'paired', 'trend_is_positive']}, indent=2))
