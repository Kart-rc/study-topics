# Synthetic teaching example. No production services are contacted.
total=5000; migrated=4800; approved_exceptions=120
unresolved=total-migrated-approved_exceptions
ownerless=40; controlled_stop_passed=False
result={'launched':True,'unresolved':unresolved,'ownerless':ownerless,'safe_to_decommission':unresolved==0 and ownerless==0 and controlled_stop_passed}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['total', 'migrated', 'approved_exceptions', 'unresolved', 'ownerless', 'controlled_stop_passed', 'result']}, indent=2))
