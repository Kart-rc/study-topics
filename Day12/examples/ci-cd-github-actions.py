# Synthetic teaching example. No production services are contacted.
cache = set()
lock_key = "lock-v1"
artifact = None
cache_hit = lock_key in cache
if not cache_hit:
    cache.add(lock_key)
dependencies = "ready"
artifact = "app-abc123.zip"
deploy_input = artifact
deploy_ok = deploy_input is not None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['lock_key', 'artifact', 'cache_hit', 'dependencies', 'deploy_input', 'deploy_ok']}, indent=2))
