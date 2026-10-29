# Synthetic teaching example. No production services are contacted.
baseline_success = 99.4; hypothesis_floor = 99.0
stop_floor = 98.0; observed_success = 98.6
hypothesis_holds = observed_success >= hypothesis_floor
must_stop = observed_success < stop_floor; decision = 'stop-and-restore' if must_stop else 'continue-bounded-observation'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['baseline_success', 'hypothesis_floor', 'stop_floor', 'observed_success', 'hypothesis_holds', 'must_stop', 'decision']}, indent=2))
