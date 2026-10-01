# Synthetic teaching example. No production services are contacted.
pages = [[10, 12, 20], [40, 42, 50], [80, 90, 100]]
target = 42
bounds = [(min(page), max(page)) for page in pages]
candidates = [i for i, (lo, hi) in enumerate(bounds) if lo <= target <= hi]
matches = [x for i in candidates for x in pages[i] if x == target]
target = 45
candidates = [i for i, (lo, hi) in enumerate(bounds) if lo <= target <= hi]
matches = [x for i in candidates for x in pages[i] if x == target]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['pages', 'target', 'bounds', 'candidates', 'matches']}, indent=2))
