# Synthetic teaching example. No production services are contacted.
batches = 12; delta_gb = 0.4; changed_files_gb = 1.2
changelog_gb = batches * delta_gb
file_upload_gb = batches * changed_files_gb
snapshot_every = 6
max_replay_gb = (snapshot_every - 1) * delta_gb

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['batches', 'delta_gb', 'changed_files_gb', 'changelog_gb', 'file_upload_gb', 'snapshot_every', 'max_replay_gb']}, indent=2))
