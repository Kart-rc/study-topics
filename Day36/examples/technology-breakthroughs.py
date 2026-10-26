# Synthetic teaching example. No production services are contacted.
implant_signal = 7
tissue_attenuation = 3
sensor_noise = 2; received = max(0, implant_signal - tissue_attenuation)
snr = received / sensor_noise; readable = snr >= 2

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['implant_signal', 'tissue_attenuation', 'sensor_noise', 'received', 'snr', 'readable']}, indent=2))
