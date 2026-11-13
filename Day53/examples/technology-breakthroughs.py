# Synthetic teaching example. No production services are contacted.
evidence={'solution_film':True,'cavity':True,'continuous_optical_pump':True}
reported_setup=all(evidence.values())
product_evidence={'electrical_pump':False,'lifetime':False,'manufacturing_yield':False}
result={'supports_lasing_like_setup':reported_setup,'supports_commercial_laser':all(product_evidence.values()),'claim':'lasing-like'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['evidence', 'reported_setup', 'product_evidence', 'result']}, indent=2))
