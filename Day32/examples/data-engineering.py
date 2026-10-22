# Synthetic teaching example. No production services are contacted.
rows = [('east-42', 'east'), ('west-77', 'west'), ('east-99', 'east')]
caller_region = 'east'
visible = [order for order, region in rows if region == caller_region]
visible_count = len(visible)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rows', 'caller_region', 'visible', 'visible_count']}, indent=2))
