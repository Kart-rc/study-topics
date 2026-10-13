# Synthetic teaching example. No production services are contacted.
from datetime import datetime, timezone
deprecation=datetime(2026,10,1,tzinfo=timezone.utc)
sunset=datetime(2026,12,1,tzinfo=timezone.utc)
now=datetime(2026,10,15,tzinfo=timezone.utc)
state="PAST_SUNSET" if now>=sunset else "DEPRECATED" if now>=deprecation else "SUPPORTED"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['state']}, indent=2))
