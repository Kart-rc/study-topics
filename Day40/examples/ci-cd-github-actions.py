# Synthetic teaching example. No production services are contacted.
trigger = {'workflow':'PR tests','conclusion':'success','head_repo':'fork','head_sha':'abc123'}
origin_ok = trigger['workflow'] == 'PR tests' and trigger['conclusion'] == 'success' and len(trigger['head_sha']) == 6
artifact = {'coverage': 87}; schema_ok = set(artifact) == {'coverage'} and 0 <= artifact['coverage'] <= 100
execute_artifact = False; privileged_action_allowed = origin_ok and schema_ok and not execute_artifact

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['trigger', 'origin_ok', 'artifact', 'schema_ok', 'execute_artifact', 'privileged_action_allowed']}, indent=2))
