# Synthetic teaching example. No production services are contacted.
A=[1,1,0,0,1]
B=[1,0,1,1,1]
b_wins=sum(a==0 and b==1 for a,b in zip(A,B))
a_wins=sum(a==1 and b==0 for a,b in zip(A,B))
net=b_wins-a_wins

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['A', 'B', 'b_wins', 'a_wins', 'net']}, indent=2))
