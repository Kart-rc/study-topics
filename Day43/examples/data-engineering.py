# Synthetic teaching example. No production services are contacted.
files=20; candidate_rows=100; invalid_rows=4; live_version=42
blocks_read=3; blocks_skipped=files-blocks_read
quality_ok=invalid_rows==0; publish_allowed=quality_ok
visible_version=43 if publish_allowed else live_version; queued_queries=0

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['files', 'candidate_rows', 'invalid_rows', 'live_version', 'blocks_read', 'blocks_skipped', 'quality_ok', 'publish_allowed', 'visible_version', 'queued_queries']}, indent=2))
