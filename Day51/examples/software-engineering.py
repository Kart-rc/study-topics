# Synthetic teaching example. No production services are contacted.
stack=[]; visible=lambda: stack[-1] if stack else None
stack.append('bank-a'); outer=visible()
stack.append('support'); nested=visible(); stack.pop(); restored=visible()
stack.pop(); after=visible(); result={'outer':outer,'nested':nested,'restored':restored,'after':after}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['stack', 'outer', 'nested', 'restored', 'after', 'result']}, indent=2))
