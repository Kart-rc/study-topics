# Synthetic teaching example. No production services are contacted.
status = {'code':'RESOURCE_EXHAUSTED','message':'tenant burst quota exceeded','details':{'retry_seconds':30,'quota_subject':'tenant/42'}}
request_idempotent = True; known_retry = status['details'].get('retry_seconds')
action = f"retry-after-{known_retry}s" if status['code'] == 'RESOURCE_EXHAUSTED' and known_retry and request_idempotent else 'do-not-auto-retry'
fallback_for_old_client = status['code']

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['status', 'request_idempotent', 'known_retry', 'action', 'fallback_for_old_client']}, indent=2))
