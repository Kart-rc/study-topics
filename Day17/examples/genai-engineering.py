# Synthetic teaching example. No production services are contacted.
trials = [[1,1,0], [1,0,1], [1,1,1], [0,0,0]]
any_pass = [any(row) for row in trials]
all_pass = [all(row) for row in trials]
observed_any = sum(any_pass) / len(trials)
observed_all = sum(all_pass) / len(trials)
individual_passes = sum(sum(row) for row in trials)
trial_count = sum(len(row) for row in trials)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['trials', 'any_pass', 'all_pass', 'observed_any', 'observed_all', 'individual_passes', 'trial_count']}, indent=2))
