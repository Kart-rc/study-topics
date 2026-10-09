# Synthetic teaching example. No production services are contacted.
task_peak_gb = 1.5
strict_ceiling_gb = 1.0
strict_infra_error = task_peak_gb > strict_ceiling_gb
strict_capability_observed = not strict_infra_error
calibrated_ceiling_gb = 2.0
calibrated_infra_error = task_peak_gb > calibrated_ceiling_gb
calibrated_capability_observed = not calibrated_infra_error

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['task_peak_gb', 'strict_ceiling_gb', 'strict_infra_error', 'strict_capability_observed', 'calibrated_ceiling_gb', 'calibrated_infra_error', 'calibrated_capability_observed']}, indent=2))
