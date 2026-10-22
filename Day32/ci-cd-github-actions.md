# Block the newly vulnerable dependency, not the whole history

CI/CD & GitHub Actions · Day32 · 15 minutes

Use dependency review as a pull-request delta gate.

## Recall (2 minutes)

<p><a href="../Day25/ci-cd-github-actions.html">Day25: A rerun keeps the run ID but increments the attempt</a></p><p>What changes when the same workflow run is rerun?</p><details><summary>Recall first, then reveal the refresher</summary><p>GITHUB_RUN_ATTEMPT. Attempt increments; run ID and the rerun SHA/ref stay the same.</p></details><p><a href="../Day13/ci-cd-github-actions.html">Day13: One job, then gone: ephemeral self-hosted runners</a></p><p>What happens after an ephemeral self-hosted runner processes one job?</p><details><summary>Recall first, then reveal the refresher</summary><p>GitHub automatically de-registers it. GitHub documents one-job assignment and automatic de-registration; your infrastructure should then wipe or destroy it.</p></details>

## Understand (4 minutes)

A building inspector checks the new room added by today's permit, not every brick ever laid. GitHub dependency review compares dependency changes in a pull request and can fail when the change introduces a dependency with a known vulnerability.

The key word is introduced. A pull-request gate helps stop new risk from entering. Existing vulnerable dependencies still need an inventory and remediation program.



A pull request upgrades widget-lib from 1.4 to 2.0 and adds parser-x 3.1. The dependency review finds a high-severity advisory on parser-x. With fail-on-severity: high and the job marked required, the merge is blocked. A moderate advisory does not cross that chosen threshold.



## Read the visual

The gate shows the exact comparison between the PR's highest introduced severity and the configured threshold, separating detection from enforcement.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use dependency review on repositories whose pull requests change supported package manifests or lockfiles and where new vulnerable or disallowed dependencies should block merge.

**Practical example.** A Java data-service PR adds a serializer library; the required dependency-review job checks the dependency diff before the service can merge.

**How to decide.** Choose a severity and license policy that matches organizational risk, make the check required, and manage exceptions explicitly. Pair it with scanning and remediation for vulnerabilities already present.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
severity_rank = {'none': 0, 'low': 1, 'moderate': 2, 'high': 3, 'critical': 4}
threshold = severity_rank['high']
introduced = severity_rank['high']
merge_allowed = introduced < threshold
```

1. Order the supported policy levels.

   Changed values: `{"severity_rank": {"none": 0, "low": 1, "moderate": 2, "high": 3, "critical": 4}}`

2. Configure the merge-blocking threshold.

   Changed values: `{"threshold": 3}`

3. The synthetic PR adds a high-severity advisory.

   Changed values: `{"introduced": 3}`

4. The required check rejects the change.

   Changed values: `{"merge_allowed": false}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser evaluates four severity labels. It does not call GitHub, parse manifests, query the Advisory Database, model transitive reachability or license policy, or prove that a status check is required. Availability depends on GitHub plan and repository configuration.

## Explore (remaining exploration time)

Change the highest severity introduced by the PR. Watch the required check pass or block at the configured threshold.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser evaluates four severity labels. It does not call GitHub, parse manifests, query the Advisory Database, model transitive reachability or license policy, or prove that a status check is required. Availability depends on GitHub plan and repository configuration.

## Quiz (4 minutes)

1. A PR introduces one high advisory and threshold is high. Result?
   - The review job fails
   - It always passes
   - The old dependency graph is deleted

2. Why make the job a required check?
   - A failing job must actually block merge
   - It makes advisories impossible
   - It scans production memory

3. What remains outside this delta gate?
   - Existing vulnerable dependencies
   - New dependency changes
   - The chosen severity threshold

4. What severity and license exception process would your repositories use, and who owns it?
5. How will you find and reduce vulnerable dependencies that predate the pull-request gate?

<details><summary>Answer key — attempt first</summary>

1. The review job fails. The introduced severity meets the fail threshold.

2. A failing job must actually block merge. Enforcement needs branch/ruleset wiring in addition to job logic.

3. Existing vulnerable dependencies. A PR-delta gate is not a full backlog-remediation program.

</details>

## Sources

- [GitHub dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review) — Living documentation; checked 2026-10-22.
- [Configure dependency review action](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/configure-dependency-review-action) — Living documentation; checked 2026-10-22.
- [Customize dependency review policy](https://docs.github.com/en/enterprise-cloud@latest/code-security/tutorials/secure-your-dependencies/customize-dependency-review-action) — Living documentation; checked 2026-10-22.
