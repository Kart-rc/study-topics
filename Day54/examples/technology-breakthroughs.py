# Synthetic teaching example. No production services are contacted.
repeating=[0,0,10,0,0]
scale_rich=[1,2,4,2,1]
same_total=sum(repeating)==sum(scale_rich); peaks=[max(repeating),max(scale_rich)]
result={'same_total':same_total,'repeating_peak':peaks[0],'scale_rich_peak':peaks[1],'is_reported_measurement':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['repeating', 'scale_rich', 'same_total', 'peaks', 'result']}, indent=2))
