# Synthetic teaching example. No production services are contacted.
proposal={'call_id':'call_A','tool':'cancelOrder','args':{'orderId':42}}
approved_call_id='call_A'
later={'call_id':'call_B','tool':'cancelOrder','args':{'orderId':99}}
may_execute=later['call_id']==approved_call_id

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['proposal', 'approved_call_id', 'later', 'may_execute']}, indent=2))
