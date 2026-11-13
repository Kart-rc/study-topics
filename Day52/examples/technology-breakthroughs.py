# Synthetic teaching example. No production services are contacted.
formula='ABO3'; text_features={'formula':formula}; structure_features={'sites':5,'neighbor_graph':True}
bridge_enabled=True; aligned=structure_features if bridge_enabled else None
property_signal={'band_gap_eV':'model_prediction'}; reasoning_inputs={'text':text_features,'structure':aligned,'property':property_signal}
result={'structure_grounded':reasoning_inputs['structure'] is not None,'prediction_is_measurement':False,'experiment_required':True}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['formula', 'text_features', 'structure_features', 'bridge_enabled', 'aligned', 'property_signal', 'reasoning_inputs', 'result']}, indent=2))
