# Synthetic teaching example. No production services are contacted.
wavelength_nm=13.5
k1=0.28
na=0.75
resolution_nm=k1*wavelength_nm/na
dof_relative=(0.33/na)**2

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['wavelength_nm', 'k1', 'na', 'resolution_nm', 'dof_relative']}, indent=2))
