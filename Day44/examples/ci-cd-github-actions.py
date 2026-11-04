# Synthetic teaching example. No production services are contacted.
token={'aud':'sts.amazonaws.com','sub':'repo:acme@12/payments@34:ref:refs/heads/main'}
trust={'aud':'sts.amazonaws.com','sub':'repo:acme@12/payments@34:ref:refs/heads/main'}
audience_ok=token['aud']==trust['aud']; subject_ok=token['sub']==trust['sub']
assume_role=audience_ok and subject_ok; permissions='separate least-privilege policy'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['token', 'trust', 'audience_ok', 'subject_ok', 'assume_role', 'permissions']}, indent=2))
