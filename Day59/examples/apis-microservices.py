# Synthetic teaching example. No production services are contacted.
values=[80,120,'huge']; maximum=100
loose=[not isinstance(v,(int,float)) or v<=maximum for v in values]
typed=[isinstance(v,int) and v<=maximum for v in values]
result={'values':values,'maximum_only':loose,'typed_integer':typed}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['values', 'maximum', 'loose', 'typed', 'result']}, indent=2))
