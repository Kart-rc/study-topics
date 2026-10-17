# Synthetic teaching example. No production services are contacted.
trace={'request':'lookup_order(42)','observation':{'status':'delivered','paid':True}}
mode='replay'
proposed_action='refund(42)'
side_effects_allowed=(mode=='live')
result='executed' if side_effects_allowed else 'blocked-and-recorded'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['trace', 'mode', 'proposed_action', 'side_effects_allowed', 'result']}, indent=2))
