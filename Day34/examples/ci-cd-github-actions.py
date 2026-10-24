# Synthetic teaching example. No production services are contacted.
required_labels = ['self-hosted', 'linux', 'x64', 'gpu']
runner_labels = ['self-hosted', 'linux', 'x64']
eligible_before = all(label in runner_labels for label in required_labels)
runner_labels.append('gpu'); eligible_after = all(label in runner_labels for label in required_labels)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['required_labels', 'runner_labels', 'eligible_before', 'eligible_after']}, indent=2))
