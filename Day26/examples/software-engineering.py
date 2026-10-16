# Synthetic teaching example. No production services are contacted.
rows=['order:42']
state='active'
savepoint=len(rows)
rows.append('loyalty:+10')
state='failed'
rows=rows[:savepoint]
state='active'
rows.append('repair:loyalty')
committed=(state=='active')

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['rows', 'state', 'savepoint', 'committed']}, indent=2))
