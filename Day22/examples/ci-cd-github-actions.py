# Synthetic teaching example. No production services are contacted.
import hashlib
build=b"api-v22|locked-deps"
tested=hashlib.sha256(build).hexdigest()
production=build
deployed=hashlib.sha256(production).hexdigest()
verified=(deployed==tested)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['tested', 'deployed', 'verified']}, indent=2))
