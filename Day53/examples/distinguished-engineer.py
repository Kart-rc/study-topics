# Synthetic teaching example. No production services are contacted.
exception={'owner':'orders-platform','days':60,'control':'rotate secret weekly'}
exception['review_day']=30; exception['evidence']=['secret age','denied network attempts']
today=31; evidence_current=True; decision='continue-to-expiry' if evidence_current else 'revoke'
result={'owned':bool(exception['owner']),'bounded':exception['days']<90,'reviewed':today>=exception['review_day'],'decision':decision}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['exception', 'today', 'evidence_current', 'decision', 'result']}, indent=2))
