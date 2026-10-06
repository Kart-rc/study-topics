# Synthetic teaching example. No production services are contacted.
failure = 'out_of_stock'
order_id = 'O42'
occurrence = 'e-731'
problem = {
    'type': 'https://api.example/problems/out-of-stock',
    'title': 'Item is out of stock',
    'status': 409,
}
problem['detail'] = f'SKU-7 cannot fulfill order {order_id}'
problem['instance'] = f'/errors/{occurrence}'
http_status = 409
content_type = 'application/problem+json'
client_action = 'change item' if problem['type'].endswith('out-of-stock') else 'inspect'
status_matches = http_status == problem['status']

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['failure', 'order_id', 'occurrence', 'problem', 'http_status', 'content_type', 'client_action', 'status_matches']}, indent=2))
