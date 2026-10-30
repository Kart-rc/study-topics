# Synthetic teaching example. No production services are contacted.
gates = {'single_molecule_address': True, 'stable_line': True, 'spin_selective': True, 'coherence_ms_scale': True}
interface_path = all(gates.values())
network_proven = False
missing_system_evidence = ['entanglement fidelity/rate', 'collection efficiency', 'integration and yield']

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['gates', 'interface_path', 'network_proven', 'missing_system_evidence']}, indent=2))
