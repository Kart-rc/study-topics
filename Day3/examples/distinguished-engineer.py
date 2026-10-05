# Synthetic teaching example. No production services are contacted.
tenants = 1000; cells = 5
affected = tenants // cells
cells = 10
affected = tenants // cells
shared_catalog_failed = True
affected = tenants if shared_catalog_failed else tenants // cells

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['tenants', 'cells', 'affected', 'shared_catalog_failed']}, indent=2))
