# Synthetic teaching example. No production services are contacted.
order_table={'order_id':'O-42','total':50}; shipping_sql_column='total'
order_table={'order_id':'O-42','amount':50}; direct_read=order_table.get(shipping_sql_column)
event={'type':'OrderPriced.v1','order_id':'O-42','order_total':50}; shipping_view={event['order_id']:event['order_total']}
shipping_quote=shipping_view['O-42']*0.02; consistency='eventual'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['order_table', 'shipping_sql_column', 'direct_read', 'event', 'shipping_view', 'shipping_quote', 'consistency']}, indent=2))
