# Synthetic teaching example. No production services are contacted.
source_files = ['A', 'B', 'C']
clone_shared = list(source_files)
clone_owned = ['D']; clone_visible = clone_shared + clone_owned
source_visible = list(source_files); shared_count = len([f for f in source_files if f in clone_visible])

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['source_files', 'clone_shared', 'clone_owned', 'clone_visible', 'source_visible', 'shared_count']}, indent=2))
