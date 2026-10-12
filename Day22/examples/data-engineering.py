# Synthetic teaching example. No production services are contacted.
events=[{"id":"e1","order":"o-41","items":["A","B"]},{"id":"e1","order":"o-41","items":["A","B"]},{"id":"e2","order":"o-42","items":["C"]},None]
valid=[e for e in events if e is not None]
unique={e["id"]:e for e in valid}
items=[(e["order"],item) for e in unique.values() for item in e["items"]]
gate={"orders":len(unique),"items":len(items),"duplicate":len(valid)-len(unique),"malformed":len(events)-len(valid)}
publish=gate=={"orders":2,"items":3,"duplicate":1,"malformed":1}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['events', 'valid', 'unique', 'items', 'gate', 'publish']}, indent=2))
