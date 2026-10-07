# Synthetic teaching example. No production services are contacted.
requests = 20
manual_minutes = 15
residual_minutes = 3
build_hours = 24
maintenance_hours = 1
manual_weekly = requests * manual_minutes / 60
auto_weekly = requests * residual_minutes / 60 + maintenance_hours
net_saved = manual_weekly - auto_weekly
payback_weeks = build_hours / net_saved if net_saved > 0 else None
manual_at_12 = 12 * manual_weekly
auto_at_12 = build_hours + 12 * auto_weekly
saved_at_12 = manual_at_12 - auto_at_12

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requests', 'manual_minutes', 'residual_minutes', 'build_hours', 'maintenance_hours', 'manual_weekly', 'auto_weekly', 'net_saved', 'payback_weeks', 'manual_at_12', 'auto_at_12', 'saved_at_12']}, indent=2))
