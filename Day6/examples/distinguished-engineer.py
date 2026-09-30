# Synthetic teaching example. No production services are contacted.
dashboard = {"code_reversible": True, "data_compatible": True, "external_consumers": False}
schema = {"code_reversible": True, "data_compatible": False, "external_consumers": True}
dashboard_path = "bounded experiment" if dashboard["data_compatible"] else "compatibility review"
schema_path = "bounded experiment" if schema["data_compatible"] else "compatibility review"
missing_evidence = "consumer inventory and migration/repair plan"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['dashboard', 'schema', 'dashboard_path', 'schema_path', 'missing_evidence']}, indent=2))
