# Synthetic teaching example. No production services are contacted.
previous_max = 12; delay = 5
watermark = previous_max - delay
windows = {"0-5": 2, "5-10": 0}
windows.pop("0-5") if 5 < watermark else None
accept_event_3 = "0-5" in windows
windows["5-10"] += 1

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['previous_max', 'delay', 'watermark', 'windows', 'accept_event_3']}, indent=2))
