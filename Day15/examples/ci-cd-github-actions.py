# Synthetic teaching example. No production services are contacted.
token = {'aud': 'sts.amazonaws.com', 'sub': 'repo:octo-org@123456/octo-repo@456789:environment:prod'}
trust = {'aud': 'sts.amazonaws.com', 'sub': 'repo:octo-org@123456/octo-repo@456789:environment:prod'}
audience_matches = token['aud'] == trust['aud']
subject_matches = token['sub'] == trust['sub']
temporary_credentials_issued = audience_matches and subject_matches

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['token', 'trust', 'audience_matches', 'subject_matches', 'temporary_credentials_issued']}, indent=2))
