# Synthetic teaching example. No production services are contacted.
traceparent='00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
parts=traceparent.split('-')
version,trace_id,parent_span_id,flags=parts
valid=(len(trace_id)==32 and int(trace_id,16)!=0 and len(parent_span_id)==16 and int(parent_span_id,16)!=0)
orders_span_id='b7ad6b7169203331'
outgoing=f'{version}-{trace_id}-{orders_span_id}-{flags}'
authorized=False

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['traceparent', 'parts', 'version', 'trace_id', 'parent_span_id', 'flags', 'valid', 'orders_span_id', 'outgoing', 'authorized']}, indent=2))
