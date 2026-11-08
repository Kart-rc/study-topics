# Synthetic teaching example. No production services are contacted.
stored='alex@example.com'; roles=['fraud','analyst','unknown']
def mask(role): return stored if role=='fraud' else 'a***@example.com' if role=='analyst' else '***'
visible={role:mask(role) for role in roles}
result={'stored':stored,'visible':visible}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['stored', 'roles', 'visible', 'result']}, indent=2))
