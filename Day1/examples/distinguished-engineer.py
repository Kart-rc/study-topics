# Synthetic teaching example. No production services are contacted.
scheduled = 10000; allowed_bad_fraction = 0.005
budget = round(scheduled * allowed_bad_fraction)
bad = 30
remaining = budget - bad
used_percent = 100 * bad / budget

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['scheduled', 'allowed_bad_fraction', 'budget', 'bad', 'remaining', 'used_percent']}, indent=2))
