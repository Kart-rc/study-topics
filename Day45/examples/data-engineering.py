# Synthetic teaching example. No production services are contacted.
rows=[{'id':'P-1','state':'valid'},{'id':'P-2','state':'type_mismatch'},{'id':'P-3','state':'malformed'},{'id':'P-4','state':'valid'}]
accepted=[r['id'] for r in rows if r['state']=='valid']; rescued=[r['id'] for r in rows if r['state']=='type_mismatch']
corrupt=[r['id'] for r in rows if r['state']=='malformed']; accounted=len(accepted)+len(rescued)+len(corrupt)
can_publish=accounted==len(rows) and len(corrupt)<=1; decision='publish_with_exception' if can_publish else 'hold'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rows', 'accepted', 'rescued', 'corrupt', 'accounted', 'can_publish', 'decision']}, indent=2))
