# Synthetic teaching example. No production services are contacted.
requested='/workspace/payments/../../secrets.txt'; deprecated_roots=False
import posixpath; canonical=posixpath.normpath(requested); mount='/workspace/payments'
inside=canonical==mount or canonical.startswith(mount+'/'); decision='ALLOW' if inside else 'DENY'
authority='read-only sandbox mount'; protocol_input='resource_uri tool parameter'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requested', 'deprecated_roots', 'canonical', 'mount', 'inside', 'decision', 'authority', 'protocol_input']}, indent=2))
