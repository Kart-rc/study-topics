# Synthetic teaching example. No production services are contacted.
persistent_disk = {}
persistent_disk["leftover_token.txt"] = "synthetic"
next_persistent_job_sees_residue = "leftover_token.txt" in persistent_disk
ephemeral_disk = {"leftover_token.txt": "synthetic"}
ephemeral_disk = {}  # destroy after one job
next_ephemeral_job_sees_residue = "leftover_token.txt" in ephemeral_disk

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['persistent_disk', 'next_persistent_job_sees_residue', 'ephemeral_disk', 'next_ephemeral_job_sees_residue']}, indent=2))
