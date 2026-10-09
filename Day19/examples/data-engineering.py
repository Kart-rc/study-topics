# Synthetic teaching example. No production services are contacted.
ranges = [(1,10),(11,20),(21,30),(31,40),(41,50),(51,60)]
target = 42
candidates = [lo <= target <= hi for lo, hi in ranges]
scanned = sum(candidates)
skipped = len(ranges) - scanned
result_total = 125

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['ranges', 'target', 'candidates', 'scanned', 'skipped', 'result_total']}, indent=2))
