# Synthetic teaching example. No production services are contacted.
required={"order_id","status"}
result={"id":"o-9","state":"shipped"}
missing=sorted(required-result.keys())
decision="PASS_TO_MODEL" if not missing else "REJECT_RESULT"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['result', 'missing', 'decision']}, indent=2))
