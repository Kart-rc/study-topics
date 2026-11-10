# Synthetic teaching example. No production services are contacted.
finishes=['linux','macos','windows']; values={os:os+'-sha' for os in finishes}
shared={}; [shared.update({'digest':values[os]}) for os in finishes]
unique={}; [unique.update({'digest_'+os:values[os]}) for os in reversed(finishes)]
result={'shared':shared,'unique':unique,'shared_count':len(shared),'unique_count':len(unique)}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['finishes', 'values', 'shared', 'unique', 'result']}, indent=2))
