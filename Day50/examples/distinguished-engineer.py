# Synthetic teaching example. No production services are contacted.
candidates=[{'name':'tiny batch','coverage':20,'blast':10},{'name':'payments live','coverage':100,'blast':95},{'name':'orders shadow','coverage':85,'blast':25}]
eligible=[x for x in candidates if x['coverage']>=70 and x['blast']<=40]
chosen=max(eligible,key=lambda x:x['coverage']-x['blast'])
result={'chosen':chosen['name'],'coverage':chosen['coverage'],'blast':chosen['blast']} 

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['candidates', 'eligible', 'chosen', 'result']}, indent=2))
