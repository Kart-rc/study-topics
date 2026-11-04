# Synthetic teaching example. No production services are contacted.
stages=['wake','transform','quality','publish','serve']; evidence={'wake':True,'transform':False,'quality':None,'publish':None,'serve':None}
first_unproven=next(s for s in stages if evidence[s] is not True)
repair=['transform','quality','publish']; preserved=['wake']
mastery='not_assessed'; coverage='delivered'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['stages', 'evidence', 'first_unproven', 'repair', 'preserved', 'mastery', 'coverage']}, indent=2))
