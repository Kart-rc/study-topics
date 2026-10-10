# Synthetic teaching example. No production services are contacted.
backends={"A":"SERVING","B":"SERVING"}
health_checking=True
backends["B"]="NOT_SERVING"
eligible=[n for n,s in backends.items() if s=="SERVING"]
routes=[eligible[i%len(eligible)] for i in range(4)]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['backends', 'health_checking', 'eligible', 'routes']}, indent=2))
