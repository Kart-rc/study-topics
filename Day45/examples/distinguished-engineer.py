# Synthetic teaching example. No production services are contacted.
incident={'impact':'35% payment errors','objective':'stop bad writes'}; roles={'IC':'Priya'}
roles['Ops']='Marco'; change_authority=['Ops']
roles['Comms']='Lee'; update_minutes=15
investigations=['API','Kafka','database']; decision='findings flow to IC; approved actions flow to Ops'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['incident', 'roles', 'change_authority', 'update_minutes', 'investigations', 'decision']}, indent=2))
