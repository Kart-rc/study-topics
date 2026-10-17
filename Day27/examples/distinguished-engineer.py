# Synthetic teaching example. No production services are contacted.
required={'owner','slo','scan','rollback'}
spark={'owner','slo','scan','rollback'}
service={'owner','slo','scan'}
spark_gaps=required-spark
service_gaps=required-service
decision='pass' if not spark_gaps and not service_gaps else 'block'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['decision']}, indent=2))
