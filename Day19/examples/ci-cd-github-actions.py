# Synthetic teaching example. No production services are contacted.
attested = {"digest": "aaa", "repo": "acme/service"}
downloaded = {"name": "service.bin", "digest": "bbb"}
digest_ok = downloaded["digest"] == attested["digest"]
repo_ok = attested["repo"] == "acme/service"
deploy = digest_ok and repo_ok

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['attested', 'downloaded', 'digest_ok', 'repo_ok', 'deploy']}, indent=2))
