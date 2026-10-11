# Synthetic teaching example. No production services are contacted.
import json, hashlib
catalog_a={"tools":[{"name":"search","inputSchema":{"required":["query"]}}]}
canonical=json.dumps(catalog_a,sort_keys=True,separators=(",",":"))
hash_a=hashlib.sha256(canonical.encode()).hexdigest()[:8]
catalog_b={"tools":[{"name":"search","inputSchema":{"required":["query","region"]}}]}
hash_b=hashlib.sha256(json.dumps(catalog_b,sort_keys=True,separators=(",",":")).encode()).hexdigest()[:8]
comparable=hash_a==hash_b

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['catalog_a', 'canonical', 'hash_a', 'catalog_b', 'hash_b', 'comparable']}, indent=2))
