# Synthetic teaching example. No production services are contacted.
exception={'owner':True,'controls':True,'review_days':60,'reentry':'image-v12'}
governed=exception['owner'] and exception['controls']
temporary=exception['review_days']>0 and bool(exception['reentry'])
result={'approved':governed and temporary,'shadow_platform':not(governed and temporary),'reentry':exception['reentry']}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['exception', 'governed', 'temporary', 'result']}, indent=2))
