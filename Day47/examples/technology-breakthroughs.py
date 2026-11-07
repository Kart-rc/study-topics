# Synthetic teaching example. No production services are contacted.
state=0.20; pulses=[0.15,0.15,0.15]
history=[state]
for pulse in pulses: state=min(1.0,max(0.0,state+pulse)); history.append(round(state,2))
readout=round(state,2); result={'history':history,'readout':readout}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['state', 'pulses', 'history', 'pulse', 'readout', 'result']}, indent=2))
