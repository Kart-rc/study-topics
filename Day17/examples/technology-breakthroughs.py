# Synthetic teaching example. No production services are contacted.
charge_in_ah = 10
charge_out_ah = 9.9
voltage_in = 1.4
voltage_out = 1.1
energy_in_wh = charge_in_ah * voltage_in
energy_out_wh = charge_out_ah * voltage_out
charge_efficiency = charge_out_ah / charge_in_ah
energy_efficiency = energy_out_wh / energy_in_wh
not_returned_wh = energy_in_wh - energy_out_wh

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['charge_in_ah', 'charge_out_ah', 'voltage_in', 'voltage_out', 'energy_in_wh', 'energy_out_wh', 'charge_efficiency', 'energy_efficiency', 'not_returned_wh']}, indent=2))
