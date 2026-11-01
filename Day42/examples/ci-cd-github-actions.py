# Synthetic teaching example. No production services are contacted.
jobs=['linux20','windows20','mac22','linux23-exp']; fail_fast=True
results={'linux20':'pass','windows20':'fail'}
if fail_fast and results['windows20']=='fail': results.update({'mac22':'cancelled','linux23-exp':'cancelled'})
required_green=all(results.get(j)=='pass' for j in ['linux20','windows20','mac22'])

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['jobs', 'fail_fast', 'results', 'required_green']}, indent=2))
