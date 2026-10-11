# Synthetic teaching example. No production services are contacted.
retry_after=3
client_jitter=[0,0,1,1,2]
retry_times=[retry_after+j for j in client_jitter]
peak=max(retry_times.count(t) for t in set(retry_times))
earliest=min(retry_times)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['retry_after', 'client_jitter', 'retry_times', 'peak', 'earliest']}, indent=2))
