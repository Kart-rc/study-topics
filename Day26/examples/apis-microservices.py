# Synthetic teaching example. No production services are contacted.
repos=10
issues_each=10
comments_each=10
issue_nodes=repos*issues_each
comment_nodes=issue_nodes*comments_each
total_nodes=repos+issue_nodes+comment_nodes
within_budget=(total_nodes<=1000)

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['repos', 'issues_each', 'comments_each', 'issue_nodes', 'comment_nodes', 'total_nodes', 'within_budget']}, indent=2))
