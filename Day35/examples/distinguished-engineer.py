# Synthetic teaching example. No production services are contacted.
assumption_limit = 0.30
observed_share = 0.45
revisit_required = observed_share > assumption_limit
old_status = 'superseded'; replacement = 'ADR-087 cell-based Kafka' if revisit_required else None

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['assumption_limit', 'observed_share', 'revisit_required', 'old_status', 'replacement']}, indent=2))
