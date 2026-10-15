# Synthetic teaching example. No production services are contacted.
n=8
tile=4
full_cells=n*n
peak_tile_cells=tile*tile
tiles=(n//tile)**2
comparisons=tiles*peak_tile_cells

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['n', 'tile', 'full_cells', 'peak_tile_cells', 'tiles', 'comparisons']}, indent=2))
