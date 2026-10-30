# Synthetic teaching example. No production services are contacted.
capacity = 100; checkout = 80; crawler = 50
fifo = {'checkout': min(checkout, max(0, capacity - crawler)), 'crawler': min(crawler, capacity)}
priority = {'checkout': min(checkout, capacity), 'crawler': min(crawler, max(0, capacity - checkout))}
rejected = checkout + crawler - capacity; checkout_gain = priority['checkout'] - fifo['checkout']

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['capacity', 'checkout', 'crawler', 'fifo', 'priority', 'rejected', 'checkout_gain']}, indent=2))
