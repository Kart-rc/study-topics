# Synthetic teaching example. No production services are contacted.
jobs={'21':'required','25':'required','26-ea':'experimental'}; failure='26-ea'
forgiven=(jobs[failure]=='experimental')
siblings_cancelled=not forgiven
result={'failure':failure,'forgiven':forgiven,'siblings_cancelled':siblings_cancelled,'workflow':'success-with-experimental-failure'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['jobs', 'failure', 'forgiven', 'siblings_cancelled', 'result']}, indent=2))
