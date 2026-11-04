# Synthetic teaching example. No production services are contacted.
signal={'user_errors':0.12,'cpu':0.85,'quota':0.72}; action='shift traffic'
urgent=signal['user_errors']>0.05; actionable=bool(action)
route='page' if urgent and actionable else 'ticket'
cpu_route='dashboard'; quota_route='ticket' if signal['quota']<0.95 else 'page'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['signal', 'action', 'urgent', 'actionable', 'route', 'cpu_route', 'quota_route']}, indent=2))
