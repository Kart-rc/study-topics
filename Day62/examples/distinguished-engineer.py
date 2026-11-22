# Synthetic teaching example. No production services are contacted.
case={'default_meets_needs':True,'measured_gap':None,'exception_requested':True}
decision='default' if case['default_meets_needs'] else 'bounded_exception'
record={'decision':decision,'default':'java_event_client','exception_owner':None}
result={**record,'principle_resolved_choice':decision=='default'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['case', 'decision', 'record', 'result']}, indent=2))
