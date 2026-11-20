# Synthetic teaching example. No production services are contacted.
inputs=[0,1]
outputs=[1-i for i in inputs]
active_paths=['CNT-p pull-up','MoS2-n pull-down']
result={'truth_table':list(zip(inputs,outputs)),'paths':active_paths,'paper_reproduction':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['inputs', 'outputs', 'active_paths', 'result']}, indent=2))
