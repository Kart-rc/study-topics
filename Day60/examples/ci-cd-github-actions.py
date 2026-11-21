# Synthetic teaching example. No production services are contacted.
raw={'name':'orders-raw','digest':'abc'}
signed_bytes_digest='def'
signed={'name':'orders-signed','digest':signed_bytes_digest,'input_digest':raw['digest']}
result={'artifacts':[raw['name'],signed['name']],'raw_unchanged':raw['digest']=='abc','lineage':signed['input_digest']+'->'+signed['digest']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['raw', 'signed_bytes_digest', 'signed', 'result']}, indent=2))
