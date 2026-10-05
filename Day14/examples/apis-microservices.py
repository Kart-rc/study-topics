# Synthetic teaching example. No production services are contacted.
posts = [{'id': 'P1', 'author': 'u1'}, {'id': 'P2', 'author': 'u2'}, {'id': 'P3', 'author': 'u1'}]
naive_author_calls = len(posts)
naive_total_calls = 1 + naive_author_calls
batch_keys = list(dict.fromkeys(post['author'] for post in posts))
batched_author_calls = 1 if batch_keys else 0
batched_total_calls = 1 + batched_author_calls

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['posts', 'naive_author_calls', 'naive_total_calls', 'batch_keys', 'batched_author_calls', 'batched_total_calls']}, indent=2))
