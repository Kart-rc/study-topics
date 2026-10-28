# Synthetic teaching example. No production services are contacted.
arrivals = [0, 20, 90]
quiet_seconds = 60
run_times = [arrivals[1] + quiet_seconds, arrivals[2] + quiet_seconds]
processed_files = ['part-1.json', 'part-2.json', 'part-3.json']; wakeups = len(run_times)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['arrivals', 'quiet_seconds', 'run_times', 'processed_files', 'wakeups']}, indent=2))
