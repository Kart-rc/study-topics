# Synthetic teaching example. No production services are contacted.
provider={'version':3,'rows':120}
grant=True
recipient_version=provider['version'] if grant else None
provider['version']=4
recipient_version=provider['version'] if grant else None
grant=False
after_revoke=provider['version'] if grant else None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['provider', 'grant', 'recipient_version', 'after_revoke']}, indent=2))
