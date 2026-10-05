# Synthetic teaching example. No production services are contacted.
old_file_hours = [24]; new_file_hours = [1] * 24
query_hours = [10, 11]
old_scan_hours = sum(old_file_hours)
new_scan_hours = sum(new_file_hours[h] for h in query_hours)
same_filter = "event_time in hours 10 and 11"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['old_file_hours', 'new_file_hours', 'query_hours', 'old_scan_hours', 'new_scan_hours', 'same_filter']}, indent=2))
