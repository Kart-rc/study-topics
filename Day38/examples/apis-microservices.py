# Synthetic teaching example. No production services are contacted.
receiver_window = 2; messages = ['m1', 'm2', 'm3']
admitted = messages[:receiver_window]; blocked = messages[receiver_window:]
receiver_reads = admitted.pop(0); receiver_window += 1
admitted.append(blocked.pop(0)); outcome = {'delivered_to_app': receiver_reads, 'in_flight': admitted, 'blocked': blocked}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['receiver_window', 'messages', 'admitted', 'blocked', 'receiver_reads', 'outcome']}, indent=2))
