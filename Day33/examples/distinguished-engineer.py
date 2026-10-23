# Synthetic teaching example. No production services are contacted.
quota = 1000; finance = 350; ml_normal = 300
normal_headroom = quota - finance - ml_normal
ml_surge = 750; surge_total = finance + ml_surge
rejected = max(0, surge_total - quota)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['quota', 'finance', 'ml_normal', 'normal_headroom', 'ml_surge', 'surge_total', 'rejected']}, indent=2))
