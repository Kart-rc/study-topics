# Synthetic teaching example. No production services are contacted.
clients={'c55-old':'roots','c55-new':'explicit_uri'}
status={'roots':'deprecated','explicit_uri':'active'}
served={c: True for c in clients}; warnings={'c55-old':'migrate_to_explicit_uri'}
result={'old_client_works':served['c55-old'],'legacy_uses':sum(v=='roots' for v in clients.values()),'removed_automatically':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['clients', 'status', 'served', 'warnings', 'result']}, indent=2))
