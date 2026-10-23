# Synthetic teaching example. No production services are contacted.
checks = {'platform_grant': True, 'aws_trust': True, 'prefix_allowed': True}
finance_allowed = all(checks.values())
checks['prefix_allowed'] = False
hr_allowed = all(checks.values())

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['checks', 'finance_allowed', 'hr_allowed']}, indent=2))
