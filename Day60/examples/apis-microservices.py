# Synthetic teaching example. No production services are contacted.
old_known={'id','total'}; response={'id':60,'total':125,'riskBand':'low'}
unknown=set(response)-old_known
tolerant_valid=True; closed_valid=(len(unknown)==0)
result={'unknown':sorted(unknown),'tolerant_valid':tolerant_valid,'closed_valid':closed_valid}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['response', 'tolerant_valid', 'closed_valid', 'result']}, indent=2))
