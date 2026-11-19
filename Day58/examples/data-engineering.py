# Synthetic teaching example. No production services are contacted.
claims=['fixed_window','one_current_row','query_layout','declared_promotion','verified_share']
evidence={'fixed_window':'trigger parameters','one_current_row':'history invariant','query_layout':'pruning evidence','declared_promotion':'reviewed diff','verified_share':'recipient read'}
product_lab='not_run'; delivered=set(evidence)==set(claims)
result={'claims_retrieved':len(claims),'evidence_links':len(evidence),'delivered':delivered,'product_lab':product_lab,'gap':'real_platform_evidence'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['claims', 'evidence', 'product_lab', 'delivered', 'result']}, indent=2))
