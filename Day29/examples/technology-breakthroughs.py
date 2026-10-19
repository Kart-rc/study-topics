# Synthetic teaching example. No production services are contacted.
inputs=[1,0,1,1]
weights=[1,-1,1,0]
contributions=[x*w for x,w in zip(inputs,weights)]
detector_sum=sum(contributions)
claim_scope='teaching dot product, not optical hardware'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['inputs', 'weights', 'contributions', 'detector_sum', 'claim_scope']}, indent=2))
