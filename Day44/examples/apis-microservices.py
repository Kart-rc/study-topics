# Synthetic teaching example. No production services are contacted.
order={'id':'O-42','state':'PENDING'}; inventory={'sku':'S-7','state':'AVAILABLE'}
inventory['state']='RESERVED'; order['state']='PAYMENT_PENDING'
payment={'state':'DECLINED'}; compensation_needed=payment['state']=='DECLINED'
inventory['state']='AVAILABLE'; order['state']='CANCELLED'; outcome='compensated, not rewound'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['order', 'inventory', 'payment', 'compensation_needed', 'outcome']}, indent=2))
