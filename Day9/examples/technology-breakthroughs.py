# Synthetic teaching example. No production services are contacted.
pump1_thz = 30.0; pump2_thz = 20.5
output_thz = abs(pump1_thz - pump2_thz)
toy_efficiency_mw_per_w2 = 0.7; p1_w = 0.216; p2_w = 0.1
output_mw = toy_efficiency_mw_per_w2 * p1_w * p2_w
output_microwatts = output_mw * 1000

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['pump1_thz', 'pump2_thz', 'output_thz', 'toy_efficiency_mw_per_w2', 'p1_w', 'p2_w', 'output_mw', 'output_microwatts']}, indent=2))
