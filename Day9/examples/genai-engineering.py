# Synthetic teaching example. No production services are contacted.
dev_total = 50; dev_pass = 35; holdout_total = 200; holdout_pass = 140
iterations = 10; memorized_fixes_per_iteration = 2
dev_pass = min(dev_total, dev_pass + iterations * memorized_fixes_per_iteration)
dev_percent = 100 * dev_pass / dev_total
holdout_percent = 100 * holdout_pass / holdout_total

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['dev_total', 'dev_pass', 'holdout_total', 'holdout_pass', 'iterations', 'memorized_fixes_per_iteration', 'dev_percent', 'holdout_percent']}, indent=2))
