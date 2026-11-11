# Synthetic teaching example. No production services are contacted.
regions=[{'id':'A','length':.9,'junction':.3},{'id':'B','length':.5,'junction':.95},{'id':'C','length':.7,'junction':.6}]
preference='junction'
recommended=max(regions,key=lambda r:r[preference])
result={'recommended':recommended['id'],'human_decision_required':True,'physics_solved':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['regions', 'preference', 'recommended', 'result']}, indent=2))
