# Synthetic teaching example. No production services are contacted.
queries=30; slots_per_cluster=10; clusters=1
running=min(queries, slots_per_cluster*clusters); queued=queries-running
clusters=3; running=min(queries, slots_per_cluster*clusters); queued=queries-running
memory_need_gb=18; cluster_memory_gb=12; spill_gb=max(0,memory_need_gb-cluster_memory_gb)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['queries', 'slots_per_cluster', 'clusters', 'running', 'queued', 'memory_need_gb', 'cluster_memory_gb', 'spill_gb']}, indent=2))
