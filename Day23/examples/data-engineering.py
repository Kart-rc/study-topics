# Synthetic teaching example. No production services are contacted.
symptoms={"duplicate":"recovery_identity","denied":"authorization_path","scan":"pruning_evidence","publish":"dependency_gate"}
evidence={"duplicate":"one_effect_after_replay","denied":"allow_and_deny_tests","scan":"fewer_bytes_scanned","publish":"blocked_on_failed_validation"}
case="publish"
decision={"control":symptoms[case],"proof":evidence[case]}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['symptoms', 'evidence', 'case', 'decision']}, indent=2))
