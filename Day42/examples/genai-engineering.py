# Synthetic teaching example. No production services are contacted.
tool_result={'kind':'receipt','status':'shipped','signature':'sig-42'}
behavior='stop_on_first_tool'
final_output=tool_result if behavior=='stop_on_first_tool' else 'model synthesis'
model_turns=1 if behavior=='stop_on_first_tool' else 2

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['tool_result', 'behavior', 'final_output', 'model_turns']}, indent=2))
