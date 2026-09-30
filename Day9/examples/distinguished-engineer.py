# Synthetic teaching example. No production services are contacted.
record = {"full_name": "Maya Rao"}
record.update({"given_name": "Maya", "family_name": "Rao"})
old_read = record.get("full_name", "ERROR")
record.pop("full_name")
old_read_after_contract = record.get("full_name", "ERROR")

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['record', 'old_read', 'old_read_after_contract']}, indent=2))
