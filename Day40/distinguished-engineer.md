# When overloaded, finish valuable work before starting expendable work

Distinguished Engineer · Day40 · 15 minutes

Use explicit admission priority and cheap rejection to preserve useful completions instead of letting every request time out.

## Recall (2 minutes)

<p><a href="../Day29/distinguished-engineer.html">Day29: Stop starting six migrations; finish two</a></p><p>What is the primary purpose of a WIP limit?</p><details><summary>Recall first, then reveal the refresher</summary><p>Improve flow and finish evidence. Finishing creates feedback and frees the bottleneck.</p></details><p><a href="../Day1/distinguished-engineer.html">Day1: Turn an SLO into a decision</a></p><p>At 99.9% over 10,000 deliveries, 30 failures consume what budget?</p><details><summary>Recall first, then reveal the refresher</summary><p>300%. The allowance is 10 deliveries. Thirty is three times that allowance.</p></details>

## Understand (4 minutes)

A crowded emergency room does not start every case and leave all patients half-treated. It admits work it can finish and gives scarce capacity to the outcomes that matter most.

Under overload, accepting everything creates queues, timeouts, retries, and more load. Load shedding rejects excess work early. Priority makes the rejection policy explicit: health checks and completion calls can outrank new optional work. Measure successful-request latency and useful completions—goodput—separately from fast rejections.



A service can finish 100 cost units per second. It receives 80 checkout-completion units and 50 crawler units. FIFO after crawler traffic arrived first admits 50 crawler and only 50 checkout. Priority admission finishes all 80 checkout and admits 20 crawler; 30 crawler units are rejected early.



## Read the visual

The admission table keeps the capacity denominator fixed and shows where each unit goes. It makes the business effect of priority visible: identical total rejection, different useful completions.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use load shedding after defining measured capacity, bounded queues, client retry behavior, and business-visible priorities.

**Practical example.** During an Availability Zone impairment, preserve payment completion and health checks while shedding recommendation refreshes and crawlers.

**How to decide.** Add capacity and fix bottlenecks for sustained legitimate load. Shed only excess work during brownout, make rejection cheap, communicate retry semantics, test beyond the goodput plateau, and ensure shedding does not hide the autoscaling signal.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
capacity = 100; checkout = 80; crawler = 50
fifo = {'checkout': min(checkout, max(0, capacity - crawler)), 'crawler': min(crawler, capacity)}
priority = {'checkout': min(checkout, capacity), 'crawler': min(crawler, max(0, capacity - checkout))}
rejected = checkout + crawler - capacity; checkout_gain = priority['checkout'] - fifo['checkout']
```

1. Define one interval of capacity and two demand classes.

   Changed values: `{"capacity": 100, "checkout": 80, "crawler": 50}`

2. If crawler work arrives first, checkout gets only leftover capacity.

   Changed values: `{"fifo": {"checkout": 50, "crawler": 50}}`

3. Priority admits checkout first and uses remaining capacity for crawler work.

   Changed values: `{"priority": {"checkout": 80, "crawler": 20}}`

4. The same total rejection produces 30 more valuable completions.

   Changed values: `{"rejected": 30, "checkout_gain": 30}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This arithmetic model treats every unit as equal cost within a class and has one server interval. It does not model latency distributions, fairness, retries, dependency priorities, queue age, health checks, autoscaling, AZ loss, or real customer value.

## Explore (remaining exploration time)

Change capacity and workload mix. Compare FIFO admission with priority admission and watch completed checkout work, rejected work, and wasted queue pressure.

Open distinguished-engineer.html for the executable model.

Model limits: This arithmetic model treats every unit as equal cost within a class and has one server interval. It does not model latency distributions, fairness, retries, dependency priorities, queue age, health checks, autoscaling, AZ loss, or real customer value.

## Quiz (4 minutes)

1. Capacity is 100; checkout demand is 80 and crawler demand is 50. Priority admission completes what?
   - 80 checkout and 20 crawler units
   - 50 checkout and 50 crawler units
   - All 130 units

2. Why exclude fast rejections from successful-request latency?
   - They can make latency look healthy while accepted work is slow
   - Rejections use no CPU ever
   - It increases availability automatically

3. When is shedding the wrong primary response?
   - Legitimate load is sustained and capacity is routinely insufficient
   - A rare surge exceeds tested headroom
   - A low-priority crawler can retry later

4. Name three operations in one critical service and rank which should finish first during overload.
5. Which metric would reveal that shedding is hiding an autoscaling or headroom problem?

<details><summary>Answer key — attempt first</summary>

1. 80 checkout and 20 crawler units. Finish the higher-priority 80, then use the remaining 20.

2. They can make latency look healthy while accepted work is slow. Mixing rejected and successful latency hides the experience of admitted work.

3. Legitimate load is sustained and capacity is routinely insufficient. Chronic overload needs capacity or efficiency work, not permanent brownout.

</details>

## Sources

- [AWS Builder Center: Using load shedding to avoid overload](https://builder.aws.com/content/3Eun1EEyX6p2e3VYNyRLSJzLuMV/using-load-shedding-to-avoid-overload) — AWS Builders Library foundation; checked October 30, 2026; checked 2026-10-30.
- [AWS Well-Architected: REL05-BP03 Control and limit retry calls](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_mitigate_interaction_failure_limit_retries.html) — Official AWS guidance; checked October 30, 2026; checked 2026-10-30.
