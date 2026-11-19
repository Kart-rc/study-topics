# Synthetic teaching example. No production services are contacted.
typed_input=False; event_input='false'
typed_runs=typed_input
naive_script_runs=bool(event_input)
result={'typed_runs':typed_runs,'naive_string_runs':naive_script_runs,'fix':'use typed inputs or explicit parsing'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['typed_input', 'event_input', 'typed_runs', 'naive_script_runs', 'result']}, indent=2))
