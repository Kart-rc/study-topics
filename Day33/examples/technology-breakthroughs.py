# Synthetic teaching example. No production services are contacted.
curvature = 3
fiber_sensitivity = [5, 6, 7, 8]
signals = [100 - abs(curvature) * value for value in fiber_sensitivity]
live_signal_count = len(signals) - 1

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['curvature', 'fiber_sensitivity', 'signals', 'live_signal_count']}, indent=2))
