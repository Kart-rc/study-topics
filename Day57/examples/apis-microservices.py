# Synthetic teaching example. No production services are contacted.
incoming='00-'+'57'*16+'-'+'ab'*8+'-01'; bearer_tenant=None
parts=incoming.split('-'); trace_valid=(len(parts)==4 and len(parts[1])==32 and len(parts[2])==16)
trace_id=parts[1] if trace_valid else '99'*16; authorized=(bearer_tenant=='red')
result={'trace_joined':trace_valid,'trace_id_prefix':trace_id[:4],'authorized':authorized,'decision':'deny' if not authorized else 'allow'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['incoming', 'bearer_tenant', 'parts', 'trace_valid', 'trace_id', 'authorized', 'result']}, indent=2))
