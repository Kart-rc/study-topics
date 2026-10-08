# Synthetic teaching example. No production services are contacted.
jobs = {"J17": "running", "J21": "queued", "Next": "queued"}
fail_fast = True
jobs["J17"] = "failed"
experimental = False
cancel_siblings = fail_fast and not experimental
jobs = {name: ("canceled" if cancel_siblings and state in ["running", "queued"] else state) for name, state in jobs.items()}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['jobs', 'fail_fast', 'experimental', 'cancel_siblings']}, indent=2))
