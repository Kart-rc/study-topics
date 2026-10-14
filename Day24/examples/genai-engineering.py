# Synthetic teaching example. No production services are contacted.
protocol='2026-07-28'
new_design=True
sampling_deprecated=True
backchannel_available=False
route='provider_api' if new_design or not backchannel_available else 'mcp_sampling'
result='server_owned_provider_call' if route=='provider_api' else 'client_sampling'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['protocol', 'new_design', 'sampling_deprecated', 'backchannel_available', 'route', 'result']}, indent=2))
