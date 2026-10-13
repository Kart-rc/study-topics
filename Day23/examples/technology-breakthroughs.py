# Synthetic teaching example. No production services are contacted.
reported={"generalist_captured":0.0,"personalized_target":62.5,"subset_sim":66.7,"subset_real":63.9}
sim_to_real_gap=reported["subset_sim"]-reported["subset_real"]
claim="close_tracking_in_reported_subset" if abs(sim_to_real_gap)<5 else "large_gap"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['reported', 'sim_to_real_gap', 'claim']}, indent=2))
