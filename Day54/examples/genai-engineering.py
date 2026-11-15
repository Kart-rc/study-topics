# Synthetic teaching example. No production services are contacted.
alerts=['a54','a55']; negotiated='2025-11-25'
bare_allowed=negotiated>='2026-07-28'
wire=alerts if bare_allowed else {'alerts':alerts}
result={'negotiated':negotiated,'wire':wire,'accepted':isinstance(wire,dict)}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['alerts', 'negotiated', 'bare_allowed', 'wire', 'result']}, indent=2))
