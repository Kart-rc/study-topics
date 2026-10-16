# Synthetic teaching example. No production services are contacted.
read_only={"pass":95,"total":95}
payments={"pass":0,"total":5}
overall=(read_only["pass"]+payments["pass"])/(read_only["total"]+payments["total"])
payment_rate=payments["pass"]/payments["total"]
release=(overall>=0.90 and payment_rate>=0.80)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['read_only', 'payments', 'overall', 'payment_rate', 'release']}, indent=2))
