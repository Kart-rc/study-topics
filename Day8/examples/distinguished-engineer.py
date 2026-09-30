# Synthetic teaching example. No production services are contacted.
period_seconds = 10; required_periods = 2
detection_seconds = period_seconds * required_periods
stop_and_recover_seconds = 8
exposure_seconds = detection_seconds + stop_and_recover_seconds
impact_percent_seconds = 4 * exposure_seconds

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['period_seconds', 'required_periods', 'detection_seconds', 'stop_and_recover_seconds', 'exposure_seconds', 'impact_percent_seconds']}, indent=2))
