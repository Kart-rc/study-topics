# Synthetic teaching example. No production services are contacted.
width=640; height=512; pixels=width*height
process='room-temperature aqueous growth on CMOS ROIC'; bonding_boundary=False
detectivity_jones=4.4e11; wavelength_um=2.5
evidence='research demonstration'; production_ready=False

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['width', 'height', 'pixels', 'process', 'bonding_boundary', 'detectivity_jones', 'wavelength_um', 'evidence', 'production_ready']}, indent=2))
