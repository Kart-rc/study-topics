# Synthetic teaching example. No production services are contacted.
source = "Gold(O42); Gold(x) -> Review(x); query Review(O42)"
source_label = "ENTAILS"
renamed = source.replace("O42", "O77")
expected_relation = "same label"
candidate_outputs = {"source": source_label, "renamed": "CONTRADICTS"}
violation = candidate_outputs["source"] != candidate_outputs["renamed"]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['source', 'source_label', 'renamed', 'expected_relation', 'candidate_outputs', 'violation']}, indent=2))
