# Synthetic teaching example. No production services are contacted.
eligible=1_000_000; slo=0.999
budget=round(eligible*(1-slo))
failed=800; consumed=failed/budget
result={'budget':budget,'consumed_pct':round(consumed*100),'action':'pause_risky_launches' if consumed>=0.8 else 'normal_policy','owner':'service_owner'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['eligible', 'slo', 'budget', 'failed', 'consumed', 'result']}, indent=2))
