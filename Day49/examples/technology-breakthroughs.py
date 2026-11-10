# Synthetic teaching example. No production services are contacted.
polarization=1; detunings=[-0.3,0.0,0.3,0.6]
target=0.3*polarization
alignments=[round(max(0,1-abs(d-target)),2) for d in detunings]
outputs=[round(a*a,2) for a in alignments]; result={'peak_detuning':detunings[outputs.index(max(outputs))],'peak_output':max(outputs)}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['polarization', 'detunings', 'target', 'alignments', 'outputs', 'result']}, indent=2))
