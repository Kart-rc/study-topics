# Synthetic teaching example. No production services are contacted.
signals = {
    "compressed": {"H": 62, "V": 38},
    "tensile": {"H": 41, "V": 59},
}
dichroism = {sample: pair["H"] - pair["V"]
              for sample, pair in signals.items()}
sign = {sample: "positive" if value > 0 else "negative" if value < 0 else "zero"
        for sample, value in dichroism.items()}
sign_flip = sign["compressed"] != sign["tensile"]

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['signals', 'dichroism', 'sign', 'sign_flip']}, indent=2))
