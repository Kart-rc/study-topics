# Synthetic teaching example. No production services are contacted.
signal=1; pump=False
output_without_pump=signal
pump=True; toy_gain=80; output_with_pump=signal*toy_gain
result={'input':signal,'without_pump':output_without_pump,'with_pump':output_with_pump,'paper_reproduction':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['signal', 'pump', 'output_without_pump', 'toy_gain', 'output_with_pump', 'result']}, indent=2))
