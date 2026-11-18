# Synthetic teaching example. No production services are contacted.
observations=[('t57','approval-1'),('t57','approval-1')]
presented=set(); dialogs=0

for pair in observations:
    if pair not in presented:
        dialogs+=1; presented.add(pair)
result={'observations':len(observations),'dialogs':dialogs,'updates_expected':1,'presented':sorted(presented)}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['observations', 'dialogs', 'pair', 'result']}, indent=2))
