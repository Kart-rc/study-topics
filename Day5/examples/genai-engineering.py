# Synthetic teaching example. No production services are contacted.
record = {"rule": "preserve old partition readers", "open_check": "replay old data", "log_pointer": "trace-42", "noise": "repeated plan output"}
handoff = {key: record[key] for key in ["rule", "open_check", "log_pointer"]}
record = None
rule_survives = handoff["rule"] == "preserve old partition readers"
next_step = handoff["open_check"]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['record', 'handoff', 'rule_survives', 'next_step']}, indent=2))
