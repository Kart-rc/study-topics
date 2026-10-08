# Synthetic teaching example. No production services are contacted.
adr7 = "accepted"
required_hours = 24
adr8 = "absent"
required_hours = 0.25
review_needed = required_hours < 24
adr8 = "proposed"
review_approved = True
adr8 = "accepted" if review_approved else "proposed"
adr7 = "superseded" if review_approved else "accepted"
history = ["ADR-7", "ADR-8"]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['adr7', 'required_hours', 'adr8', 'review_needed', 'review_approved', 'history']}, indent=2))
