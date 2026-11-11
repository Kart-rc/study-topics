# Synthetic teaching example. No production services are contacted.
raw_timeout='10'; raw_continue='false'
import json; timeout=json.loads(raw_timeout); continue_on_error=json.loads(raw_continue)
types={'timeout':type(timeout).__name__,'continue':type(continue_on_error).__name__}
result={'timeout_minutes':timeout,'continue_on_error':continue_on_error,'types':types}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['raw_timeout', 'raw_continue', 'timeout', 'continue_on_error', 'types', 'result']}, indent=2))
