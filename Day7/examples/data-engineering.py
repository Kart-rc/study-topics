# Synthetic teaching example. No production services are contacted.
arrivals = 20000; tasks = 4; rate_per_task = 8000
capacity = tasks * rate_per_task
has_stateful_counter = False
eligible = not has_stateful_counter
has_stateful_counter = True
eligible = not has_stateful_counter

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['arrivals', 'tasks', 'rate_per_task', 'capacity', 'has_stateful_counter', 'eligible']}, indent=2))
