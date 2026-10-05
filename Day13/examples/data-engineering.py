# Synthetic teaching example. No production services are contacted.
replication_factor = 3
min_isr = 2
acks = "all"
isr = ["leader", "follower-a"]
first_accepted = acks != "all" or len(isr) >= min_isr
first_ack_count = len(isr) if first_accepted else 0
isr = ["leader"]
second_accepted = acks != "all" or len(isr) >= min_isr

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['replication_factor', 'min_isr', 'acks', 'isr', 'first_accepted', 'first_ack_count', 'second_accepted']}, indent=2))
