# Synthetic teaching example. No production services are contacted.
width=96; height=54; refresh_fps=30; colour_bits=8
pixels=width*height; colour_codes=2**colour_bits
frames_per_minute=refresh_fps*60; touch={'fibre':3,'position':5}
claim='integrated interactive textile prototype'; production_ready=False

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['width', 'height', 'refresh_fps', 'colour_bits', 'pixels', 'colour_codes', 'frames_per_minute', 'touch', 'claim', 'production_ready']}, indent=2))
