# Synthetic teaching example. No production services are contacted.
artifact={'name':'spark-event-log.zst','bytes':20_000_000,'mime':'application/zstd'}
result={'type':'resource_link','uri':'s3://diagnostics/run-42','name':artifact['name'],'mimeType':artifact['mime']} 
immediate_payload_bytes=len(str(result).encode()); deferred_bytes=artifact['bytes']
listed_later=False; harness_must_preserve_uri=not listed_later

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['artifact', 'result', 'immediate_payload_bytes', 'deferred_bytes', 'listed_later', 'harness_must_preserve_uri']}, indent=2))
