# Synthetic teaching example. No production services are contacted.
core=[('schema',3),('migration',5),('cutover',4)]; parallel=[('dashboards',6)]
core_days=sum(days for _,days in core); parallel_days=sum(days for _,days in parallel)
baseline=max(core_days,parallel_days); dashboard_saved=max(core_days,parallel_days-2)
migration_saved=max(core_days-2,parallel_days); leverage=baseline-migration_saved

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['core', 'parallel', 'core_days', 'parallel_days', 'baseline', 'dashboard_saved', 'migration_saved', 'leverage']}, indent=2))
