# Synthetic teaching example. No production services are contacted.
eligible=10; active=8; successful=4
adoption=active/eligible
success_of_eligible=successful/eligible; success_of_adopters=successful/active
result={'adoption_pct':int(adoption*100),'eligible_success_pct':int(success_of_eligible*100),'adopter_success_pct':int(success_of_adopters*100),'decision':'repair-task-flow'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['eligible', 'active', 'successful', 'adoption', 'success_of_eligible', 'success_of_adopters', 'result']}, indent=2))
