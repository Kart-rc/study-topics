# Synthetic teaching example. No production services are contacted.
receipt={"order_id":"R7","items":[{"sku":"A","qty":2},{"sku":"B","qty":1}]}
rows=[{"order_id":receipt["order_id"],**item} for item in receipt["items"]]
row_count=len(rows)
unit_count=sum(r["qty"] for r in rows)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['receipt', 'rows', 'row_count', 'unit_count']}, indent=2))
