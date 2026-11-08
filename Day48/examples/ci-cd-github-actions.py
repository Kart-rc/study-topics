# Synthetic teaching example. No production services are contacted.
raw_exit=1; continue_on_error=True
outcome='failure' if raw_exit else 'success'
conclusion='success' if outcome=='failure' and continue_on_error else outcome
result={'outcome':outcome,'conclusion':conclusion,'warn':outcome=='failure'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['raw_exit', 'continue_on_error', 'outcome', 'conclusion', 'result']}, indent=2))
