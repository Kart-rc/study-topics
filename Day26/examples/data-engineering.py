# Synthetic teaching example. No production services are contacted.
heavy_need=70
worker_capacity=40
scale_up=80 if heavy_need>worker_capacity else worker_capacity
small_queries=12
queries_per_cluster=4
clusters=(small_queries+queries_per_cluster-1)//queries_per_cluster
initial_wait=max(0,small_queries-clusters*queries_per_cluster)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['heavy_need', 'worker_capacity', 'scale_up', 'small_queries', 'queries_per_cluster', 'clusters', 'initial_wait']}, indent=2))
