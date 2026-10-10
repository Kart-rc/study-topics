# Synthetic teaching example. No production services are contacted.
rate_gbps=4
hours=1
retain_fraction=0.02
raw_tb=rate_gbps*hours*3600/8/1000
retained_tb=raw_tb*retain_fraction

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rate_gbps', 'hours', 'retain_fraction', 'raw_tb', 'retained_tb']}, indent=2))
