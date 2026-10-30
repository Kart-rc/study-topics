# Synthetic teaching example. No production services are contacted.
request = ['diagnose Kafka lag', 'check warehouse pressure']
tool_results = {'kafka': 'rebalance in progress', 'warehouse': 'queue depth 8'}
manager_output = f"Kafka: {tool_results['kafka']}; Snowflake: {tool_results['warehouse']}"
handoff_owner = 'kafka-specialist'; can_builtin_synthesize_both = False

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['request', 'tool_results', 'manager_output', 'handoff_owner', 'can_builtin_synthesize_both']}, indent=2))
