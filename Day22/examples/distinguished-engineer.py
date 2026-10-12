# Synthetic teaching example. No production services are contacted.
milestones={"service":"10:12","business":"11:05","prevention":"+2d"}
customer_rows_wrong_at_service_restore=12400
fully_recovered=all(k in milestones for k in ("service","business","prevention")) and customer_rows_wrong_at_service_restore>0

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['milestones', 'customer_rows_wrong_at_service_restore', 'fully_recovered']}, indent=2))
