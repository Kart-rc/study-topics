# Synthetic teaching example. No production services are contacted.
A,B,C=1,0,1
d1=A
d2=A^B
d3=B^C
recovered_A=d1
recovered_B=d2^recovered_A
recovered_C=d3^recovered_B
archive=[recovered_A,recovered_B,recovered_C]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['A', 'B', 'C', 'd1', 'd2', 'd3', 'recovered_A', 'recovered_B', 'recovered_C', 'archive']}, indent=2))
