# Synthetic teaching example. No production services are contacted.
packet={'production_contexts':1,'rollback_tested':True,'critical_failure':False}
ring='Caution' if packet['critical_failure'] else ('Adopt' if packet['production_contexts']>=3 and packet['rollback_tested'] else ('Trial' if packet['production_contexts']>=1 and packet['rollback_tested'] else 'Assess'))
record={'ring':ring,'owner':'platform_council','review_on':'2027-02-21'}
result={**record,'next_evidence':'different_workload' if ring=='Trial' else 'bounded_pilot'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['packet', 'ring', 'record', 'result']}, indent=2))
