# Synthetic teaching example. No production services are contacted.
import hashlib
original = b'release-v1'
attested_digest = hashlib.sha256(original).hexdigest()
promoted = b'release-v2'
verified = hashlib.sha256(promoted).hexdigest() == attested_digest

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['attested_digest', 'verified']}, indent=2))
