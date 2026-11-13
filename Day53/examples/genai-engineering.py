# Synthetic teaching example. No production services are contacted.
schema={'properties':{'limit':{'type':'integer','default':10}},'required':['customer']} ; args={'customer':'c52'}
valid='customer' in args; before=dict(args)
resolved={**args,'limit':args.get('limit',schema['properties']['limit']['default'])}
result={'valid':valid,'before':before,'handler_args':resolved,'inserted_by':'harness'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['schema', 'args', 'valid', 'before', 'resolved', 'result']}, indent=2))
