# Synthetic teaching example. No production services are contacted.
provider={'o54':'review'}; grant=True; recipient_snapshot={}
recipient_snapshot['o54']=provider['o54']
provider['o54']='approved'; live_value=provider['o54'] if grant else None
grant=False; result={'live_after_revoke':provider['o54'] if grant else 'denied','snapshot_after_revoke':recipient_snapshot['o54']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['provider', 'grant', 'recipient_snapshot', 'live_value', 'result']}, indent=2))
