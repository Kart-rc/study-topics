# Synthetic teaching example. No production services are contacted.
window={'roadmap_lock_week':6,'full_research_week':8,'first_outreach_week':2}
packet={'known':'CDC reduces custom polling','unknowns':['replay recovery','security boundary'],'next_test_week':5}
participants=['platform owner','security owner','two consumer owners']
result={'window_preserved':window['first_outreach_week']<window['roadmap_lock_week'],'commitment':'conditional','decision_week':window['roadmap_lock_week'],'participants':participants}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['window', 'packet', 'participants', 'result']}, indent=2))
