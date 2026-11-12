# Synthetic teaching example. No production services are contacted.
history=[{'version':40,'rows':1000,'op':'MERGE'},{'version':41,'rows':120,'op':'DELETE'}]
current=history[-1]; target=next(x for x in history if x['version']==40)
history.append({'version':42,'rows':target['rows'],'op':'RESTORE_FROM_40'})
result={'before':current['rows'],'after':history[-1]['rows'],'recovered':history[-1]['rows']-current['rows'],'new_version':history[-1]['version']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['history', 'current', 'target', 'result']}, indent=2))
