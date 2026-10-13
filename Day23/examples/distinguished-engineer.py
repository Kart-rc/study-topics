# Synthetic teaching example. No production services are contacted.
request={"id":"r-23","sku":"A"}
legacy={"price":25}
shadow={"price":27}
customer_response=legacy
diff={k:(legacy.get(k),shadow.get(k)) for k in legacy if legacy.get(k)!=shadow.get(k)}
decision="INVESTIGATE" if diff else "EVIDENCE_OK"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['request', 'legacy', 'shadow', 'customer_response', 'diff', 'decision']}, indent=2))
