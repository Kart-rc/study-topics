# Synthetic teaching example. No production services are contacted.
guardrail_ms = 120
tool_start_ms = 90
parallel_side_effect_risk = tool_start_ms < guardrail_ms
blocking_starts_agent = False; decision = 'block first' if parallel_side_effect_risk else 'parallel acceptable'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['guardrail_ms', 'tool_start_ms', 'parallel_side_effect_risk', 'blocking_starts_agent', 'decision']}, indent=2))
