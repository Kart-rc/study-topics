# Synthetic teaching example. No production services are contacted.
traffic={'blue':100,'green':0}; shared_db={'schema':'expand-compatible','green_writes':0}
green_deployed=True; smoke_passed=True; traffic={'blue':90,'green':10}
shared_db['green_writes']=3; green_error_rate=0.08; gate_passed=green_error_rate<0.02
traffic={'blue':100,'green':0} if not gate_passed else traffic; rollback='route to blue'; data_rewound=False

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['traffic', 'shared_db', 'green_deployed', 'smoke_passed', 'green_error_rate', 'gate_passed', 'rollback', 'data_rewound']}, indent=2))
