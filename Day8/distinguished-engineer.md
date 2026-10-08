# Fault injection: bound the experiment before you create the fault

Distinguished Engineer · Day8 · 15 minutes

A fault experiment has a stop alarm.

## Recall (2 minutes)

<p><a href="../Day1/distinguished-engineer.html">Day1: Turn an SLO into a decision</a></p><p>At 99.9% over 10,000 deliveries, 30 failures consume what budget?</p><details><summary>Recall first, then reveal the refresher</summary><p>300%. The allowance is 10 deliveries. Thirty is three times that allowance.</p></details><p><a href="../Day5/distinguished-engineer.html">Day5: Dependency isolation: spend concurrency by failure domain</a></p><p>A dependency&#x27;s latency rises tenfold while arrival rate stays fixed. What happens to its concurrency demand?</p><details><summary>Recall first, then reveal the refresher</summary><p>It rises roughly tenfold. Little&#x27;s Law links in-flight work to rate times time.</p></details>

## Understand (4 minutes)

A fault experiment has a stop alarm. That does not mean customer impact stops the instant a metric crosses its threshold.

Fault injection deliberately creates a failure to test a stated hypothesis. Bound the target, watch customer-facing signals, and define how to stop and recover. Alarm evaluation, stop propagation, and system recovery all take time.



The toy alarm needs two ten-second breaching periods, followed by eight seconds for stopping and recovery. That gives 28 seconds of modeled exposure. At 4% failures, multiplying rate by time gives 112 percent-seconds, not a count of affected users.



## Read the visual

A timeline separates collecting enough breaching metric periods from stop/recovery delay. The planned end can truncate the modeled window. The shaded exposure lasts until that end; an alarm does not erase the harm accumulated while detecting and recovering.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
period_seconds = 10; required_periods = 2
detection_seconds = period_seconds * required_periods
stop_and_recover_seconds = 8
exposure_seconds = detection_seconds + stop_and_recover_seconds
impact_percent_seconds = 4 * exposure_seconds
```

1. The alarm needs two breaching periods.

   Changed values: `{"period_seconds": 10, "required_periods": 2}`

2. This simplified alignment produces 20 seconds to detection.

   Changed values: `{"detection_seconds": 20}`

3. Stopping and recovering take additional time.

   Changed values: `{"stop_and_recover_seconds": 8}`

4. The modeled exposure totals 28 seconds.

   Changed values: `{"exposure_seconds": 28}`

5. This comparison metric is 112 percent-seconds.

   Changed values: `{"impact_percent_seconds": 112}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is an illustrative timing budget, not a prediction of AWS FIS alarm timing. Publication delays, period alignment, evaluation rules, and recovery behavior can lengthen or otherwise change exposure.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A production game day is not “break something and watch.” It is a controlled experiment: name the steady state, state a falsifiable hypothesis, inject one bounded fault, and stop when the customer-impact boundary is crossed. AWS FIS performs real actions on real resources, so target selection, IAM scope, stop alarms, recovery procedures, and an accountable operator are part of the architecture—not meeting logistics.</p><p>A stop condition connects a CloudWatch alarm to the experiment. When the alarm enters its configured state, FIS stops the experiment and it cannot be resumed. That is a guardrail, not an instantaneous shield. Metric publication, alarm periods and evaluation windows, FIS reaction, and system recovery all consume time after impact begins.</p><p>Distinguished Engineer judgment appears in the escalation path: prove observability and rollback in test, start with one target, expand only when evidence supports the hypothesis, and use both technical and business steady-state metrics. A CPU alarm can look healthy while sign-ins fail.</p><h3>Original detailed example</h3><p><strong>Worked example:</strong> An experiment removes one of 20 service tasks. The hypothesis says sign-in failures stay below 1%. The stop alarm uses 10-second periods and requires two breaching periods; allow another 8 seconds for stop propagation and recovery.</p><pre>earliest modeled stop = 2 × 10 s + 8 s = 28 s
if observed failures = 4%, impact-seconds = 4 × 28 = 112 %-seconds</pre><p>That compact number is useful for comparing designs, not for predicting affected users. Traffic varies, alarms may ingest late samples, and stopping the injection does not instantly heal queues, connections, or retries. The decision document should name the maximum tolerable exposure in real customer terms.</p>

</details>

## Explore (remaining exploration time)

Set experiment duration, observed error rate, stop threshold, metric period, evaluation periods, and recovery delay. Predict whether the guardrail fires and how much modeled exposure accumulates before recovery.

Open distinguished-engineer.html for the executable model.

Model limits: A deterministic alarm-lag and impact-seconds calculator. CloudWatch alarm behavior can include missing data, ingestion delay, percentile rules, composite alarms, and state transitions. FIS action stop time and workload recovery vary. The model does not call AWS, select safe targets, estimate users, or guarantee that the chosen metric detects every harmful condition.

## Quiz (4 minutes)

1. A stop alarm needs three 60-second breaching periods. What should the experiment owner assume?
   - The fault is harmless for three minutes
   - Potentially harmful exposure continues while evidence accumulates
   - FIS will stop before the first breaching sample

2. Why state the hypothesis before selecting an FIS action?
   - It identifies the steady-state metric and acceptable boundary the action is meant to test
   - It automatically provisions rollback capacity
   - It removes the need for monitoring

3. Which boundary can a technically correct CPU stop condition miss?
   - A customer-facing failure that does not push CPU past the threshold
   - The ARN format of the alarm
   - The fact that the experiment has a name

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Potentially harmful exposure continues while evidence accumulates. The evaluation window is part of the blast-radius budget, not a grace period without impact.

2. It identifies the steady-state metric and acceptable boundary the action is meant to test. A falsifiable expectation determines what to measure and when to stop.

3. A customer-facing failure that does not push CPU past the threshold. Guardrails see only the signals encoded in them, so business and technical steady state both matter.

</details>

## Sources

- [AWS FIS User Guide: planning your experiments](https://docs.aws.amazon.com/fis/latest/userguide/getting-started-planning.html) — Living AWS documentation; publication date not stated; checked 2026-09-28.
- [AWS FIS User Guide: stop conditions](https://docs.aws.amazon.com/fis/latest/userguide/stop-conditions.html) — Living AWS documentation; publication date not stated; checked 2026-09-28.
- [AWS FIS User Guide: safety levers](https://docs.aws.amazon.com/fis/latest/userguide/safety-lever.html) — Living AWS documentation; publication date not stated; checked 2026-09-28.
