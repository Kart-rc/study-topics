# Synthetic teaching example. No production services are contacted.
app_context = {'budget': 3, 'tenant': 'acme'}
child_context = app_context; tool_input = {'topic': 'orders'}
child_context['budget'] -= 1
same_object = child_context is app_context; parent_budget = app_context['budget']

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['app_context', 'child_context', 'tool_input', 'same_object', 'parent_budget']}, indent=2))
