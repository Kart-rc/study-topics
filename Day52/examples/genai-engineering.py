# Synthetic teaching example. No production services are contacted.
known={'welcome':'Read tools.md first.'}; requested='drafts'
note=known.get(requested)
tool_result={'content':'No note drafts. Known ids: welcome','isError':True} if note is None else {'content':note}
result={'wire_has_result':True,'model_sees_error':tool_result.get('isError',False),'can_retry_with':'welcome'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['known', 'requested', 'note', 'tool_result', 'result']}, indent=2))
