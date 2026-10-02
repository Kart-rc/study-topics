# Synthetic teaching example. No production services are contacted.
resource = {"address": "A", "window": "morning"}
etag = "v1"
bob_copy = resource.copy()
bob_tag = etag
resource = {"address": "B", "window": "morning"}
etag = "v2"
condition_matches = bob_tag == etag
status = 200 if condition_matches else 412
if condition_matches:
    resource = {**bob_copy, "window": "evening"}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['resource', 'etag', 'bob_copy', 'bob_tag', 'condition_matches', 'status']}, indent=2))
