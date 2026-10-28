# Separate queue time from run time before buying faster runners

CI/CD & GitHub Actions · Day38 · 15 minutes

Diagnose whether a slow GitHub Actions pipeline waits for capacity or spends time executing work.

## Recall (2 minutes)

<p><a href="../Day28/ci-cd-github-actions.html">Day28: Write the deployment decision into the run summary</a></p><p>What belongs in a useful job summary?</p><details><summary>Recall first, then reveal the refresher</summary><p>Decision, evidence, and next action. The summary is a concise operational interface.</p></details><p><a href="../Day16/ci-cd-github-actions.html">Day16: The production secret waits: GitHub deployment environments</a></p><p>Main is allowed but approval is pending. What can the job read?</p><details><summary>Recall first, then reveal the refresher</summary><p>The environment secret is withheld while the job waits. Environment secrets are not available until required protection rules pass.</p></details>

## Understand (4 minutes)

A five-minute taxi ride can still take twenty minutes if the taxi arrives fifteen minutes late.

Pipeline duration has at least two parts: queue time before a job starts and run time after it starts. GitHub Actions performance metrics expose queue time, run time and failure rate. Fix the part that is actually slow.



Job integration-test is created at 10:00, starts at 10:07, and completes at 10:12. Total latency is 12 minutes: 7 queued and 5 running. A larger runner may shorten the five-minute work but cannot directly remove seven minutes of unavailable capacity.



## Read the visual

The timeline partitions total feedback latency into waiting and working. Changing either segment changes the diagnosis, which prevents a faster-runner purchase from being used as a universal fix.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use queue/run/failure metrics when delivery latency grows, runner pools saturate, or teams argue about caching versus more capacity.

**Practical example.** A self-hosted EKS runner group makes pull requests wait while test execution itself remains stable.

**How to decide.** Add or rebalance runner capacity for queue pressure; optimize code, cache or parallelism for run-time pressure; inspect flaky jobs when failure rate drives reruns. Use percentiles and slices, not only one average.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
created_minute = 0; started_minute = 7; completed_minute = 12
queue_time = started_minute - created_minute
run_time = completed_minute - started_minute
bottleneck = 'runner capacity or scheduling' if queue_time > run_time else 'job execution'
```

1. Record three lifecycle timestamps.

   Changed values: `{"created_minute": 0, "started_minute": 7, "completed_minute": 12}`

2. The job waited seven minutes for execution capacity.

   Changed values: `{"queue_time": 7}`

3. The job executed for five minutes.

   Changed values: `{"run_time": 5}`

4. Choose the first investigation from the dominant component.

   Changed values: `{"bottleneck": "runner capacity or scheduling"}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The local model uses one job and simple thresholds. It does not query GitHub, calculate percentiles, account for approvals, concurrency groups, billing, retries, matrix fan-out, runner startup, cancellations, or critical-path dependencies.

## Explore (remaining exploration time)

Change queue and run minutes. Watch the dominant bottleneck and recommended first experiment.

Open ci-cd-github-actions.html for the executable model.

Model limits: The local model uses one job and simple thresholds. It does not query GitHub, calculate percentiles, account for approvals, concurrency groups, billing, retries, matrix fan-out, runner startup, cancellations, or critical-path dependencies.

## Quiz (4 minutes)

1. Queue is 9 minutes and execution is 2. Best first hypothesis?
   - Runner capacity, labels or scheduling pressure
   - The test algorithm alone
   - Artifact retention

2. Why separate queue and run time?
   - They point to different control surfaces
   - They always add to one minute
   - Queue time measures test coverage

3. What can an average hide?
   - Tail latency, runner-group hotspots and flaky reruns
   - The workflow name
   - The commit SHA

4. Which three jobs dominate your pull-request critical path by queue and run percentiles?
5. What first experiment would distinguish runner scarcity from slow job work?

<details><summary>Answer key — attempt first</summary>

1. Runner capacity, labels or scheduling pressure. Most latency occurs before execution.

2. They point to different control surfaces. Capacity and execution optimization are different decisions.

3. Tail latency, runner-group hotspots and flaky reruns. Slice by job, runner type and percentile before acting.

</details>

## Sources

- [GitHub Actions metrics](https://docs.github.com/en/actions/concepts/metrics) — Living official documentation; checked October 28, 2026; checked 2026-10-28.
- [GitHub REST API: workflow jobs](https://docs.github.com/en/rest/actions/workflow-jobs?apiVersion=2026-03-10) — Official API documentation; checked October 28, 2026; checked 2026-10-28.
