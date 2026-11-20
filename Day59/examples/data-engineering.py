# Synthetic teaching example. No production services are contacted.
total=2500; hard_limit=1000; checkpoint=0
batch1=min(hard_limit,total-checkpoint); checkpoint+=batch1
batch2=min(hard_limit,total-checkpoint); failed_before_commit=True
result={'checkpoint':checkpoint,'retry_starts_at':checkpoint+1,'failed_batch_size':batch2,'remaining_after_retry':total-checkpoint}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['total', 'hard_limit', 'checkpoint', 'batch1', 'batch2', 'failed_before_commit', 'result']}, indent=2))
