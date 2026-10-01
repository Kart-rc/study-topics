# Synthetic teaching example. No production services are contacted.
bits = [0, 0]
reference = [0, 0]
bits[1] ^= 1
parity = bits[0] ^ bits[1]
accept = parity == 0
bits = [1, 1]
parity = bits[0] ^ bits[1]
accept = parity == 0
preserved = bits == reference

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['bits', 'reference', 'parity', 'accept', 'preserved']}, indent=2))
