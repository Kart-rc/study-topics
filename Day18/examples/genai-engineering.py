# Synthetic teaching example. No production services are contacted.
fixture = {"orders.csv": [20, 30]}
workspace_a = dict(fixture)
workspace_a["report.csv"] = sum(workspace_a["orders.csv"])
reused_b = dict(workspace_a)
reused_pass = reused_b.get("report.csv") == 50
fresh_b = dict(fixture)
fresh_pass = fresh_b.get("report.csv") == 50

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['fixture', 'workspace_a', 'reused_b', 'reused_pass', 'fresh_b', 'fresh_pass']}, indent=2))
