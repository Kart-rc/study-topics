# Synthetic teaching example. No production services are contacted.
requested_days=5; repository_limit_days=30
effective_days=min(requested_days,repository_limit_days)
promotion_age_days=8; artifact_available=promotion_age_days < effective_days
result={'effective_days':effective_days,'promotion_age_days':promotion_age_days,'artifact_available':artifact_available,'durable_target':'registry digest'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requested_days', 'repository_limit_days', 'effective_days', 'promotion_age_days', 'artifact_available', 'result']}, indent=2))
