# Synthetic teaching example. No production services are contacted.
risk = {'id': 'R-42', 'owner': 'platform-director', 'expires_day': 90}
age_days = 95; evidence_changed = False
must_reassess = age_days >= risk['expires_day'] or evidence_changed
action = 'reassess and choose accept, mitigate, transfer, or avoid' if must_reassess else 'continue controls'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['risk', 'age_days', 'evidence_changed', 'must_reassess', 'action']}, indent=2))
