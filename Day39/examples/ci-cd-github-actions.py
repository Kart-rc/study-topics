# Synthetic teaching example. No production services are contacted.
trigger = 'low-trust'; declared_mode = None
effective_mode = 'read' if trigger == 'low-trust' and declared_mode is None else declared_mode
restore_allowed = effective_mode in {'read', 'write'}; save_allowed = effective_mode in {'write', 'write-only'}
poisoning_path = trigger == 'low-trust' and save_allowed

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['trigger', 'declared_mode', 'effective_mode', 'restore_allowed', 'save_allowed', 'poisoning_path']}, indent=2))
