# Synthetic teaching example. No production services are contacted.
uri='/help'
first_language='en'
first_body='Reset password'
vary=['Accept-Language']
cache_key=(uri,first_language if 'Accept-Language' in vary else None)
second_key=(uri,'fr' if 'Accept-Language' in vary else None)
cache_hit=second_key==cache_key

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['uri', 'first_language', 'first_body', 'vary', 'cache_key', 'second_key', 'cache_hit']}, indent=2))
