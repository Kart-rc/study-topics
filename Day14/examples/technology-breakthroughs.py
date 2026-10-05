# Synthetic teaching example. No production services are contacted.
input_bits = '10100100'
running = 0
trace = []
for bit in input_bits:
    running ^= int(bit)
    trace.append(running)
target_output = running
candidates = {0: int(0 != target_output), 1: int(1 != target_output)}
favored_candidate = min(candidates, key=candidates.get)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['input_bits', 'running', 'trace', 'bit', 'target_output', 'candidates', 'favored_candidate']}, indent=2))
