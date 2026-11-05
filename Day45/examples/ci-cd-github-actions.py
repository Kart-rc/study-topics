# Synthetic teaching example. No production services are contacted.
step1_shell={}; github_env=[]
github_env.append('RELEASE_COLOR=blue'); same_step=step1_shell.get('RELEASE_COLOR')
next_step={'RELEASE_COLOR':'blue'}; same_job_value=next_step['RELEASE_COLOR']
different_job={}; cross_job_value=different_job.get('RELEASE_COLOR'); transport='job output or artifact'

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['step1_shell', 'github_env', 'same_step', 'next_step', 'same_job_value', 'different_job', 'cross_job_value', 'transport']}, indent=2))
