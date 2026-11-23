# Synthetic teaching example. No production services are contacted.
packet={'diagnosis':'recovery varies 20m-6h across five runtimes','choice':'managed runtime for new regulated streams','non_goals':['batch migration this half']}
actions=['golden path','common recovery evidence','stop new custom schedulers']
supports_choice={'golden path':True,'common recovery evidence':True,'stop new custom schedulers':True}
result={'choice':packet['choice'],'deferred':packet['non_goals'],'coherent':all(supports_choice[a] for a in actions),'funded_actions':actions}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['packet', 'actions', 'supports_choice', 'result']}, indent=2))
