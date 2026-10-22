# Synthetic teaching example. No production services are contacted.
history = ['order=42', 'email=ada@example.com', 'tool raw JSON', 'reason=late']
needed_prefixes = ('order=', 'reason=')
transferred = [item for item in history if item.startswith(needed_prefixes)]
transferred_count = len(transferred)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['history', 'needed_prefixes', 'transferred', 'transferred_count']}, indent=2))
