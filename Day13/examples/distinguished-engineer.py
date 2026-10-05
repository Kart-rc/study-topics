# Synthetic teaching example. No production services are contacted.
hands = {
    "Rainbow": ["W1", "W4"],
    "Rose": ["W1", "W8"],
    "Sunflower": ["W3", "W6"],
}
failed = ["W1", "W4"]
healthy = {tenant: [w for w in hand if w not in failed]
           for tenant, hand in hands.items()}
fully_impacted = sorted(tenant for tenant, workers in healthy.items() if not workers)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['hands', 'failed', 'healthy', 'fully_impacted']}, indent=2))
