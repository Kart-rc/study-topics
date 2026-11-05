# Synthetic teaching example. No production services are contacted.
target_nh=126; tin_density_nh_per_um2=7
spiral_density_nh_per_mm2=200; spiral_density_nh_per_um2=spiral_density_nh_per_mm2/1_000_000
tin_area_um2=target_nh/tin_density_nh_per_um2; spiral_area_um2=target_nh/spiral_density_nh_per_um2
area_ratio=spiral_area_um2/tin_area_um2; claim='commercial-CMOS cryogenic prototype'; production_ready=False

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['target_nh', 'tin_density_nh_per_um2', 'spiral_density_nh_per_mm2', 'spiral_density_nh_per_um2', 'tin_area_um2', 'spiral_area_um2', 'area_ratio', 'claim', 'production_ready']}, indent=2))
