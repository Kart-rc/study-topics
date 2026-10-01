# Synthetic teaching example. No production services are contacted.
body = {"sku": "MUG"}
required = ["sku", "quantity"]
missing = [key for key in required if key not in body]
shape_ok = not missing
body["quantity"] = 2
missing = [key for key in required if key not in body]
quantity = body["quantity"]
integer_value = type(quantity) in (int, float) and quantity % 1 == 0
shape_ok = not missing and isinstance(body["sku"], str) and len(body["sku"]) >= 1 and integer_value and quantity >= 1 and set(body) <= {"sku", "quantity"}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['body', 'required', 'missing', 'shape_ok', 'quantity', 'integer_value']}, indent=2))
