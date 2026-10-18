# Synthetic teaching example. No production services are contacted.
journey={'opened':100,'created':72,'production':45,'retained':36}
activation=journey['production']/journey['opened']
retained_activation=journey['retained']/journey['opened']
largest_drop=max([('open_to_create',28),('create_to_prod',27),('prod_to_return',9)],key=lambda x:x[1])[0]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['journey', 'activation', 'retained_activation', 'largest_drop']}, indent=2))
