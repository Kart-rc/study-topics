# Synthetic teaching example. No production services are contacted.
request={'method':'POST','path':'/payments','early_data':True,'idempotency_key':'pay-77'}
unsafe=request['method']=='POST'; status=425 if request['early_data'] and unsafe else 200
request['early_data']=False; retry_status=200
ledger={'pay-77':'payment-900'}; effect=ledger[request['idempotency_key']]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['request', 'unsafe', 'status', 'retry_status', 'ledger', 'effect']}, indent=2))
