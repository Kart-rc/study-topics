# Synthetic teaching example. No production services are contacted.
rows = [(10,"A"), (10,"B"), (20,"C"), (30,"D")]
page1 = rows[:2]
cursor = page1[-1]
rows.insert(0, (5,"X"))
offset_page2 = rows[2:4]
keyset_page2 = [row for row in rows if row > cursor][:2]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rows', 'page1', 'cursor', 'offset_page2', 'keyset_page2']}, indent=2))
