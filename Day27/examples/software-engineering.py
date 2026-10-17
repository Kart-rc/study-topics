# Synthetic teaching example. No production services are contacted.
message={'id':'order-42','valid':False}
max_receives=3
receive_count=1
status="retry"
receive_count=3
status="retry"
receive_count=4
status="dlq" if not message["valid"] and receive_count>max_receives else "ack"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['message', 'max_receives', 'receive_count', 'status']}, indent=2))
