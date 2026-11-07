# Synthetic teaching example. No production services are contacted.
client={'preferred':'2026-07-28','needs':['tasks','tools'],'fallback':True}
server={'versions':['2026-07-28'],'capabilities':['tools']}
version=client['preferred'] if client['preferred'] in server['versions'] else 'legacy' if client['fallback'] else None
enabled=sorted(set(client['needs']) & set(server['capabilities'])); disabled=sorted(set(client['needs'])-set(enabled)); result={'version':version,'enabled':enabled,'disabled':disabled}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['client', 'server', 'version', 'enabled', 'disabled', 'result']}, indent=2))
