# Synthetic teaching example. No production services are contacted.
changes=10; routine=8; high_risk=2; board_wait_days=3
all_board_queue_days=routine*board_wait_days
risk_routed_queue_days=0; retained_reviews=high_risk
result={'routine_queue_days_removed':all_board_queue_days-risk_routed_queue_days,'high_risk_reviews_retained':retained_reviews}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['changes', 'routine', 'high_risk', 'board_wait_days', 'all_board_queue_days', 'risk_routed_queue_days', 'retained_reviews', 'result']}, indent=2))
