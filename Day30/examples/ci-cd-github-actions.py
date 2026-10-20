# Synthetic teaching example. No production services are contacted.
rank={'none':0,'read':1,'write':2}
caller='read'
build_request='read'
build=min(rank[caller],rank[build_request])
publish=min(build,rank['write'])

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rank', 'caller', 'build_request', 'build', 'publish']}, indent=2))
