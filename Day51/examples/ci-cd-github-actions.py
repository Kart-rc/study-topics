# Synthetic teaching example. No production services are contacted.
A={'aws_role','release_token'}
B=set(A)
C={'aws_role'} if 'aws_role' in B else set()
result={'A':sorted(A),'B':sorted(B),'C':sorted(C),'c_can_deploy':'aws_role' in C}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['result']}, indent=2))
