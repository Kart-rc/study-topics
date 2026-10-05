# Synthetic teaching example. No production services are contacted.
samples = [10, 10, 40, 40, 15]
threshold = 0
inhibition = 0.5
changes = [abs(b - a) for a, b in zip(samples, samples[1:])]
events = [max(0, change - threshold) for change in changes]
amplitudes = [round(event * (1 - inhibition), 1) for event in events]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['samples', 'threshold', 'inhibition', 'changes', 'events', 'amplitudes']}, indent=2))
