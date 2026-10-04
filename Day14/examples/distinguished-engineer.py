# Synthetic teaching example. No production services are contacted.
replicas = 3
required_healthy = 2
bad_change = True
fleet_wave = 3
fleet_healthy = replicas - fleet_wave if bad_change else replicas
safe_wave = 1
safe_healthy = replicas - safe_wave if bad_change else replicas
target_met = safe_healthy >= required_healthy
rollout_action = "stop" if bad_change else "continue"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['replicas', 'required_healthy', 'bad_change', 'fleet_wave', 'fleet_healthy', 'safe_wave', 'safe_healthy', 'target_met', 'rollout_action']}, indent=2))
