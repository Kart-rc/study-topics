# Synthetic teaching example. No production services are contacted.
requested='linux-gradle-h2'
available=['linux-gradle-h1']
exact=requested in available
restored='linux-gradle-h1' if not exact else requested
install_required=(restored!=requested)
build_input='lockfile-h2'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requested', 'available', 'exact', 'restored', 'install_required', 'build_input']}, indent=2))
