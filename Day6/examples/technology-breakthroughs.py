# Synthetic teaching example. No production services are contacted.
population = 10000; prevalence = 0.01
affected = population * prevalence; unaffected = population - affected
true_positive = affected * 0.70
false_positive = unaffected * 0.01
ppv_percent = 100 * true_positive / (true_positive + false_positive)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['population', 'prevalence', 'affected', 'unaffected', 'true_positive', 'false_positive', 'ppv_percent']}, indent=2))
