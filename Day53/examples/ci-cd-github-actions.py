# Synthetic teaching example. No production services are contacted.
requested='npm-linux-lock53'; caches=['npm-linux-lock49','npm-linux-lock51']
exact=requested if requested in caches else None; prefix='npm-linux-'
restored=exact or sorted([k for k in caches if k.startswith(prefix)])[-1]
result={'exact_hit':restored==requested,'restored':restored,'verify_lock':'lock53','save_after_success':requested}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['requested', 'caches', 'exact', 'prefix', 'restored', 'result']}, indent=2))
