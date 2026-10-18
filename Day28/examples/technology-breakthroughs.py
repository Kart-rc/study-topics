# Synthetic teaching example. No production services are contacted.
top_current=21
bottom_current=19
tandem_current=min(top_current,bottom_current)
limiter='top' if top_current<bottom_current else 'bottom'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['top_current', 'bottom_current', 'tandem_current', 'limiter']}, indent=2))
