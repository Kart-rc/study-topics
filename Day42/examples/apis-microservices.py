# Synthetic teaching example. No production services are contacted.
status=403; problem_type='https://api.example/problems/credit-limit'
problem={'type':problem_type,'title':'Credit limit exceeded','status':status}
problem.update({'detail':'Need 50; available 30','instance':'/problems/occ-42','availableCredit':30})
client_action='offer funding' if problem['type']==problem_type else 'generic error'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['status', 'problem_type', 'problem', 'client_action']}, indent=2))
