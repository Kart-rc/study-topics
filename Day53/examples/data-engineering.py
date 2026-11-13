# Synthetic teaching example. No production services are contacted.
units_before=[['c52','c10'],['c20','c52'],['c52','c70'],['c90','c52']]
scanned_before=sum('c52' in unit for unit in units_before)
units_after=[['c10','c20'],['c52','c52'],['c70','c80'],['c90','c99']]; scanned_after=sum('c52' in unit for unit in units_after)
result={'before':scanned_before,'after':scanned_after,'skipped_after':len(units_after)-scanned_after}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['units_before', 'scanned_before', 'units_after', 'scanned_after', 'result']}, indent=2))
