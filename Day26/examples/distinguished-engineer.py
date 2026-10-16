# Synthetic teaching example. No production services are contacted.
cost_a=12000
tb_a=600
cost_b=8000
tb_b=200
unit_a=cost_a/tb_a
unit_b=cost_b/tb_b
unallocated=5000
total=cost_a+cost_b+unallocated
allocation_coverage=(cost_a+cost_b)/total

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['cost_a', 'tb_a', 'cost_b', 'tb_b', 'unit_a', 'unit_b', 'unallocated', 'total', 'allocation_coverage']}, indent=2))
