# Synthetic teaching example. No production services are contacted.
request={"method":"tools/call","args":{"date":"Friday"}}
first={"resultType":"input_required","requestState":"s23","inputRequests":{"party_size":"elicit"}}
retry={**request,"inputResponses":{"party_size":4},"requestState":first["requestState"]}
final={"resultType":"final","booking_id":"b-900"} if retry["inputResponses"]["party_size"] else None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['request', 'first', 'retry', 'final']}, indent=2))
