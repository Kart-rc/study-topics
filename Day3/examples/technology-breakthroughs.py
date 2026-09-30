# Synthetic teaching example. No production services are contacted.
baseline = [100] * 7
planned_backfill = [False, True, False, False, True, False, False]
forecast = [value + (40 if planned else 0) for value, planned in zip(baseline, planned_backfill)]
baseline_total = sum(baseline)
forecast_total = sum(forecast)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['baseline', 'planned_backfill', 'forecast', 'baseline_total', 'forecast_total']}, indent=2))
