# Synthetic teaching example. No production services are contacted.
oses=['ubuntu','windows','macos']
unsafe=['test-results' for os in oses]
unsafe_unique=len(set(unsafe))
safe=[f'test-results-{os}' for os in oses]
safe_unique=len(set(safe))

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['oses', 'unsafe', 'unsafe_unique', 'safe', 'safe_unique']}, indent=2))
