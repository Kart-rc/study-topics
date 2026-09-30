# Synthetic teaching example. No production services are contacted.
fixtures = [(False, ["demo-orders"], 0), (True, ["demo-orders"], 1), (True, ["demo-orders", "other"], 1), (False, ["demo-orders"], 1)]
claims = [True, True, True, True]
claim_score = sum(claims)
verdicts = [approved and changed == ["demo-orders"] and count == 1 for approved, changed, count in fixtures]
actual_score = sum(verdicts)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['fixtures', 'claims', 'claim_score', 'verdicts', 'actual_score']}, indent=2))
