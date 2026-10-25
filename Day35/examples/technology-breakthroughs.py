# Synthetic teaching example. No production services are contacted.
standard_bit_flip_time_s = 22 / 160
squeezed_bit_flip_time_s = 22
phase_flip_time_us = 1.3
improvement = squeezed_bit_flip_time_s / standard_bit_flip_time_s

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['standard_bit_flip_time_s', 'squeezed_bit_flip_time_s', 'phase_flip_time_us', 'improvement']}, indent=2))
