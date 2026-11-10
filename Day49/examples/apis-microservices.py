# Synthetic teaching example. No production services are contacted.
import hashlib,base64; original=b'{"amount":40}'
sent_digest=base64.b64encode(hashlib.sha256(original).digest()).decode(); received=b'{"amount":400}'
computed=base64.b64encode(hashlib.sha256(received).digest()).decode(); integrity_ok=(computed==sent_digest)
signature_verified=False; authenticated=integrity_ok and signature_verified; result={'integrity_ok':integrity_ok,'authenticated':authenticated}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['sent_digest', 'computed', 'integrity_ok', 'signature_verified', 'authenticated', 'result']}, indent=2))
