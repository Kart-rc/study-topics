# Synthetic teaching example. No production services are contacted.
left=1; right_opposed=-1
energy_proxy=left*left+right_opposed*right_opposed
normal_information=(left+right_opposed)**2; right_aligned=1; aligned_information=(left+right_aligned)**2
result={'energy_proxy':energy_proxy,'normal_information_proxy':normal_information,'aligned_information_proxy':aligned_information,'paper_solver':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['left', 'right_opposed', 'energy_proxy', 'normal_information', 'right_aligned', 'aligned_information', 'result']}, indent=2))
