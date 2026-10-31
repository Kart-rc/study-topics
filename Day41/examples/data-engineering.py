# Synthetic teaching example. No production services are contacted.
total=100; invalid=4
warn={'published':total,'violations':invalid}
drop={'published':total-invalid,'violations':invalid}
fail={'published':0 if invalid else total,'old_version_remains':invalid>0}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['total', 'invalid', 'warn', 'drop', 'fail']}, indent=2))
