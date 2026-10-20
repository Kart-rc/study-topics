# Synthetic teaching example. No production services are contacted.
evidence={'restore':False,'capacity':True,'owner':True,'rollback':True}
missing=[name for name,ok in evidence.items() if not ok]
residual_risk={'item':missing[0],'owner':'storage-team','due':'2026-10-22'}
decision='CONDITIONAL' if missing else 'READY'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['evidence', 'missing', 'residual_risk', 'decision']}, indent=2))
