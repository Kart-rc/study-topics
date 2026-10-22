# Synthetic teaching example. No production services are contacted.
phosphate_units = 100
baseline_at_interface = 10
enriched_at_interface = 35
teaching_gain = enriched_at_interface / baseline_at_interface

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['phosphate_units', 'baseline_at_interface', 'enriched_at_interface', 'teaching_gain']}, indent=2))
