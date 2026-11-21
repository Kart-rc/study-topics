# Synthetic teaching example. No production services are contacted.
arrivals=[0,90,180,270]; threshold=60
starts=1+sum((b-a)>threshold for a,b in zip(arrivals,arrivals[1:]))
long_threshold=300; long_starts=1+sum((b-a)>long_threshold for a,b in zip(arrivals,arrivals[1:]))
result={'short_threshold_starts':starts,'long_threshold_starts':long_starts,'gap_seconds':90}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['arrivals', 'threshold', 'starts', 'long_threshold', 'long_starts', 'result']}, indent=2))
