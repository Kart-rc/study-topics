# Synthetic teaching example. No production services are contacted.
server={'etag':'"v7"','body_bytes':5120}; client={'etag':'"v7"','cached_bytes':5120}
if_none_match=client['etag']; matches=if_none_match==server['etag']
status=304 if matches else 200; response_body_bytes=0 if matches else server['body_bytes']
usable_bytes=client['cached_bytes'] if status==304 else response_body_bytes; decision='reuse cache' if status==304 else 'replace cache'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['server', 'client', 'if_none_match', 'matches', 'status', 'response_body_bytes', 'usable_bytes', 'decision']}, indent=2))
