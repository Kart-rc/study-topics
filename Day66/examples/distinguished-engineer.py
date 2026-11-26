# Synthetic teaching example. No production services are contacted.
enabled={'wins':62,'errors':9,'seconds':110,'extra_tokens':12000}
baseline={'wins':23,'errors':34,'seconds':130,'extra_tokens':0}
delta={'quality_wins':enabled['wins']-baseline['wins'],'errors_avoided':baseline['errors']-enabled['errors'],'seconds_saved':baseline['seconds']-enabled['seconds'],'extra_tokens':enabled['extra_tokens']}
decision={'action':'keep and slim','reason':'quality and reliability beat the current baseline','next_test':'canary after model or harness change'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['enabled', 'baseline', 'delta', 'decision']}, indent=2))
