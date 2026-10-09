# Synthetic teaching example. No production services are contacted.
import hmac, hashlib
secret = b"study-secret"
original = b'{"amount":50}'
header = "sha256=" + hmac.new(secret, original, hashlib.sha256).hexdigest()
tampered = b'{"amount":500}'
expected = "sha256=" + hmac.new(secret, tampered, hashlib.sha256).hexdigest()
valid_original = hmac.compare_digest(header, "sha256=" + hmac.new(secret, original, hashlib.sha256).hexdigest())
valid_tampered = hmac.compare_digest(header, expected)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['header', 'expected', 'valid_original', 'valid_tampered']}, indent=2))
