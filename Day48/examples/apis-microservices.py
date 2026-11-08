# Synthetic teaching example. No production services are contacted.
timeline=[]; timeline.append(('initial_metadata',{'traceparent':'00-abc-def-01'}))
timeline.append(('messages',[{'event_id':1},{'event_id':2}]))
timeline.append(('trailers',{'query-cost':'7','grpc-status':'0'}))
result={'order':[stage for stage,_ in timeline]}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['timeline', 'result']}, indent=2))
