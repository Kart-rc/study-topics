# Synthetic teaching example. No production services are contacted.
files = {"orders-A.parquet": ["O10", "O11", "O12"],
         "orders-B.parquet": ["O20", "O21"]}
position_deletes = {("orders-A.parquet", 1)}
visible = {name: [row for pos, row in enumerate(rows)
                  if (name, pos) not in position_deletes]
           for name, rows in files.items()}
wrong_file_same_position = files["orders-B.parquet"][1]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['files', 'visible', 'wrong_file_same_position']}, indent=2))
