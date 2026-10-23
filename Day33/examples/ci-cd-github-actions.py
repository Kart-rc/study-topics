# Synthetic teaching example. No production services are contacted.
title = 'a\"; echo PWNED; #'
direct_script = 'title=\"' + title + '\"'
safe_script = 'if [[ \"$TITLE\" =~ ^feat: ]]'
script_contains_payload = 'PWNED' in direct_script and 'PWNED' not in safe_script

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['title', 'direct_script', 'safe_script', 'script_contains_payload']}, indent=2))
