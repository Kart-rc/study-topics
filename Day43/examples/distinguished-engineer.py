# Synthetic teaching example. No production services are contacted.
risk='catastrophic'; deterministic=True; failure_already_happened=False
control='guardrail' if risk=='catastrophic' and deterministic else 'golden path'
evidence={'control':control,'outcome':'public access denied','owner':'platform security'}
exception={'allowed':False,'review_required':True,'expires':None}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['risk', 'deterministic', 'failure_already_happened', 'control', 'evidence', 'exception']}, indent=2))
