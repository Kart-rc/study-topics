# Synthetic teaching example. No production services are contacted.
target = 42; ranges = [(1,20),(21,40),(41,60),(61,80),(81,100),(101,120)]
candidates = [i + 1 for i, (lo, hi) in enumerate(ranges) if lo <= target <= hi]
pruned = len(ranges) - len(candidates)
scan_fraction = len(candidates) / len(ranges)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['target', 'ranges', 'candidates', 'pruned', 'scan_fraction']}, indent=2))
