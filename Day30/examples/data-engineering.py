# Synthetic teaching example. No production services are contacted.
symptom='twenty readers wait'
mechanism='concurrency' if 'readers' in symptom else 'unknown'
control='scale_out_after_queue_evidence' if mechanism=='concurrency' else 'investigate'
evidence=['queued_time','active_queries','cluster_count']

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['symptom', 'mechanism', 'control', 'evidence']}, indent=2))
