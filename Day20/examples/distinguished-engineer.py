# Synthetic teaching example. No production services are contacted.
requests=100
recommendation_ms=4000
fallback_tested=False
served_without_fallback=0 if recommendation_ms>150 else requests
fallback_tested=True
served_with_fallback=requests if fallback_tested else served_without_fallback

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requests', 'recommendation_ms', 'fallback_tested', 'served_without_fallback', 'served_with_fallback']}, indent=2))
