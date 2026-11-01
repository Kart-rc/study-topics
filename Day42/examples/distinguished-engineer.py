# Synthetic teaching example. No production services are contacted.
incident={'condition':'missing tenant policy','effect':'unfiltered publish'}
weak={'action':'remind','unsafe_path_open':True}
gate={'action':'contract test','unsafe_path_open':False}
evidence={'test_rejects_missing_policy':True,'owner':'platform','due':'tracked'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['incident', 'weak', 'gate', 'evidence']}, indent=2))
