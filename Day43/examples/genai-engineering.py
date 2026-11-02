# Synthetic teaching example. No production services are contacted.
request={'method':'tools/call','name':'ship','arguments':{'order_id':'O-42'}}
result={'resultType':'input_required','inputRequests':[{'method':'elicitation/create','params':{'mode':'form','message':'Choose delivery date'}}]}
input_response={'action':'accept','content':{'date':'2026-11-05'}}
retry={**request,'inputResponses':[input_response]}; outcome='retry original call'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['request', 'result', 'input_response', 'retry', 'outcome']}, indent=2))
