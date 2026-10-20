# Synthetic teaching example. No production services are contacted.
role='reader'
catalog=['lookup_order','search_docs','create_refund','delete_customer']
visible=[t for t in catalog if t in {'lookup_order','search_docs'}]
execution_guard='required even for '+visible[0]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['role', 'catalog', 'visible', 'execution_guard']}, indent=2))
