# Synthetic teaching example. No production services are contacted.
run_a_external_change = True
run_b_arrives = True; cancel_in_progress = True
run_a_canceled = run_b_arrives and cancel_in_progress
production_rolled_back = False; state = 'canceled run; external recovery still required'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['run_a_external_change', 'run_b_arrives', 'cancel_in_progress', 'run_a_canceled', 'production_rolled_back', 'state']}, indent=2))
