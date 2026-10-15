# Synthetic teaching example. No production services are contacted.
run_id=815
attempt=1
keys=[]
keys.append(f'{run_id}/{attempt}')
attempt+=1
keys.append(f'{run_id}/{attempt}')
preserved=(keys==['815/1','815/2'])

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['run_id', 'attempt', 'keys', 'preserved']}, indent=2))
