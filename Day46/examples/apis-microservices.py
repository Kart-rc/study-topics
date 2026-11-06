# Synthetic teaching example. No production services are contacted.
events=[]; reservation=None; payment=None
reservation='RES-9'; events.append('inventory reserved')
payment='FAILED'; events.append('payment failed')
needs_compensation=reservation is not None and payment=='FAILED'; automatic_rollback=False

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['events', 'reservation', 'payment', 'needs_compensation', 'automatic_rollback']}, indent=2))
