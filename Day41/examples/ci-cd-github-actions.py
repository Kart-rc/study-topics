# Synthetic teaching example. No production services are contacted.
image_digest='sha256:abc123'; artifact_name='service-linux'
binary_size_mb=18; output_limit_mb=1
binary_channel='artifact' if binary_size_mb>output_limit_mb else 'job-output'
downstream={'digest':image_digest,'download':artifact_name,'binary_channel':binary_channel}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['image_digest', 'artifact_name', 'binary_size_mb', 'output_limit_mb', 'binary_channel', 'downstream']}, indent=2))
