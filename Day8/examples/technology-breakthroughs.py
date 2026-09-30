# Synthetic teaching example. No production services are contacted.
capacity_mah = 3.5; usable_fraction = 0.8
usable_mah = round(capacity_mah * usable_fraction, 3)
load_ma = 0.1
runtime_hours = round(usable_mah / load_ma, 2)
double_load_hours = round(usable_mah / (2 * load_ma), 2)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['capacity_mah', 'usable_fraction', 'usable_mah', 'load_ma', 'runtime_hours', 'double_load_hours']}, indent=2))
