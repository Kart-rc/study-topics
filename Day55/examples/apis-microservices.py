# Synthetic teaching example. No production services are contacted.
deprecation='2027-01-01'; sunset='2027-04-01'
today='2027-02-15'
deprecated=today>=deprecation; sunset_passed=today>=sunset
result={'deprecated':deprecated,'sunset_passed':sunset_passed,'behavior_changed_by_deprecation':False,'client_action':'migrate'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['deprecation', 'sunset', 'today', 'deprecated', 'sunset_passed', 'result']}, indent=2))
