# Synthetic teaching example. No production services are contacted.
trace_id = "t-42"
spans = []
spans.append({"id": "s1", "name": "invoke_agent", "parent": None, "status": "ERROR"})
spans.append({"id": "s2", "name": "chat", "parent": "s1", "status": "OK"})
spans.append({"id": "s3", "name": "execute_tool", "parent": "s1", "status": "ERROR", "error.type": "timeout"})
failed_span = next(s["name"] for s in spans if s["status"] == "ERROR" and s["parent"] is not None)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['trace_id', 'spans', 'failed_span']}, indent=2))
