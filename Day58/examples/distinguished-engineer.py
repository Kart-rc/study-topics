# Synthetic teaching example. No production services are contacted.
releases_per_week=6; drag_hours_each=2; repair_hours=8
weekly_drag=releases_per_week*drag_hours_each
payback_weeks=repair_hours/weekly_drag
result={'weekly_drag_hours':weekly_drag,'repair_hours':repair_hours,'payback_weeks':round(payback_weeks,2),'decision':'candidate-investment-not-automatic-priority'}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['releases_per_week', 'drag_hours_each', 'repair_hours', 'weekly_drag', 'payback_weeks', 'result']}, indent=2))
