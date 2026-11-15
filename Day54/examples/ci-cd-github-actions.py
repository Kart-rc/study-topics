# Synthetic teaching example. No production services are contacted.
host_files=set(); lifecycle='persistent'
host_files.add('/tmp/deploy-wrapper')
if lifecycle=='ephemeral': host_files.clear()
result={'deploy_inherits_wrapper':'/tmp/deploy-wrapper' in host_files,'safe_boundary':lifecycle=='ephemeral'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['lifecycle', 'result']}, indent=2))
