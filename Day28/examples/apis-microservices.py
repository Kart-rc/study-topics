# Synthetic teaching example. No production services are contacted.
payload={'cardNumber':'4111','iban':None}
matches=[payload.get('cardNumber') is not None,payload.get('iban') is not None]
match_count=sum(matches)
one_of_valid=match_count==1
any_of_valid=match_count>=1

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['payload', 'matches', 'match_count', 'one_of_valid', 'any_of_valid']}, indent=2))
