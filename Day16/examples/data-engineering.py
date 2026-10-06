# Synthetic teaching example. No production services are contacted.
sizes_mb = [8, 12, 3, 64, 5]
target_mb = 32
groups = []
current = 0
for size in sizes_mb:
    if current and current + size > target_mb:
        groups.append(current)
        current = 0
    current += size
if current:
    groups.append(current)
task_reduction = len(sizes_mb) - len(groups)
total_before = sum(sizes_mb)
total_after = sum(groups)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['sizes_mb', 'target_mb', 'groups', 'current', 'size', 'task_reduction', 'total_before', 'total_after']}, indent=2))
