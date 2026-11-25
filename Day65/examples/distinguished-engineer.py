# Synthetic teaching example. No production services are contacted.
profile={'investment':2,'adoption':1,'interfaces':3,'operations':2,'measurement':1}
journey={'eligible':40,'started':36,'completed':10}
dropoffs={'access_approval':26,'other_after_start':journey['started']-journey['completed']-26}
result={'lowest_aspects':[k for k,v in profile.items() if v==min(profile.values())],'next_action':'instrument and redesign access approval','observed_completion':f"{journey['completed']}/{journey['eligible']}"}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['profile', 'journey', 'dropoffs', 'result']}, indent=2))
