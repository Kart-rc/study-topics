# Synthetic teaching example. No production services are contacted.
pairs=100; suppression_fraction=0.75
direct_only_opportunities=pairs
pseudo_direct_opportunities=round(pairs*(1-suppression_fraction))
delayed=direct_only_opportunities-pseudo_direct_opportunities

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['pairs', 'suppression_fraction', 'direct_only_opportunities', 'pseudo_direct_opportunities', 'delayed']}, indent=2))
