# Synthetic teaching example. No production services are contacted.
history=[{"digest":"good22","healthy":True},{"digest":"bad23","healthy":False}]
schema_compatible=True
candidate=next(x for x in reversed(history) if x["healthy"])
decision={"action":"DEPLOY_EXISTING_DIGEST","digest":candidate["digest"]} if schema_compatible else {"action":"ROLL_FORWARD"}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['history', 'schema_compatible', 'candidate', 'decision']}, indent=2))
