# Synthetic teaching example. No production services are contacted.
priority={'L':1,'M':2,'H':3}
lock_owner='L'
blocked={'H':'lock'}
effective=dict(priority)
effective[lock_owner]=priority['H']
next_thread=max(('L','M'),key=lambda t:effective[t])

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['priority', 'lock_owner', 'blocked', 'effective', 'next_thread']}, indent=2))
