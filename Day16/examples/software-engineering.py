# Synthetic teaching example. No production services are contacted.
snapshot = {'Alice': True, 'Bob': True}
alice_saw_backup = snapshot['Bob']
bob_saw_backup = snapshot['Alice']
repeatable_result = snapshot.copy()
if alice_saw_backup:
    repeatable_result['Alice'] = False
if bob_saw_backup:
    repeatable_result['Bob'] = False
serializable_result = snapshot.copy()
serializable_result['Alice'] = False
bob_aborted = True
if bob_aborted and not serializable_result['Alice']:
    serializable_result['Bob'] = True
repeatable_on_call = sum(repeatable_result.values())
serializable_on_call = sum(serializable_result.values())

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['snapshot', 'alice_saw_backup', 'bob_saw_backup', 'repeatable_result', 'serializable_result', 'bob_aborted', 'repeatable_on_call', 'serializable_on_call']}, indent=2))
