# Synthetic teaching example. No production services are contacted.
manifest={"classification":"PII","encrypted":False,"public":True}
violations=[]
if manifest["classification"]=="PII" and not manifest["encrypted"]: violations.append("PII must be encrypted")
if manifest["classification"]=="PII" and manifest["public"]: violations.append("PII must be private")
decision="BLOCK" if violations else "PASS"

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['manifest', 'violations', 'decision']}, indent=2))
