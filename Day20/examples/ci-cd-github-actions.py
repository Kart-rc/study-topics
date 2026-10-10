# Synthetic teaching example. No production services are contacted.
tag="aaa"
pinned="aaa"
tag="bbb"
tag_run=tag
pinned_run=pinned

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['tag', 'pinned', 'tag_run', 'pinned_run']}, indent=2))
