# Retry a poison message three times—then quarantine it

Software engineering · Day27 · 15 minutes

Keep one permanently bad event from consuming the whole retry lane.

## Recall (2 minutes)

<p><a href="../Day10/software-engineering.html">Day10: Stop calling a failing service, then try one small probe</a></p><p>After three failures open this breaker, what happens to a fourth immediate call?</p><details><summary>Recall first, then reveal the refresher</summary><p>It is blocked without reaching the service. Open means the local breaker rejects the call. It avoids another remote wait, but it cannot turn a failed operation into a success.</p></details><p><a href="../Day17/software-engineering.html">Day17: Bloom filters: a cheap no, a cautious maybe</a></p><p>ID 9 checks two set bits. What should the service do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Read the exact catalog. Shared bits are not proof. Clearing them can damage other IDs.</p></details>

## Understand (4 minutes)

A conveyor belt should not keep sending the same broken package through the scanner forever. Give each message a small retry budget. If it still fails, move it to a dead-letter queue (DLQ) so healthy work can continue and operators have evidence to repair.

A DLQ is a quarantine, not a trash can: retain context, alert on depth/age, fix the cause, and redrive at a controlled rate.



order-42 contains amount="twelve". Attempts 1, 2, and 3 fail validation. On the next receive it is quarantined. order-43 can now complete. After the schema producer is fixed, an operator redrives order-42 slowly.



## Read the visual

The belt has three destinations with different meanings: main queue, bounded processing, and quarantine. Moving the receive slider shows the exact boundary where a permanent failure stops blocking normal work.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use bounded retries when a queue offers at-least-once delivery and some failures may be permanent or require human repair.

**Practical example.** A malformed order event fails deserialization while valid orders wait behind it.

**How to decide.** Retry transient errors with backoff. Quarantine deterministic data/code failures after a measured limit. Preserve ordering requirements before adding a DLQ.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
message={'id':'order-42','valid':False}
max_receives=3
receive_count=1
status="retry"
receive_count=3
status="retry"
receive_count=4
status="dlq" if not message["valid"] and receive_count>max_receives else "ack"
```

1. Start with a deterministic poison message and a retry budget.

   Changed values: `{"message": {"id": "order-42", "valid": false}, "max_receives": 3}`

2. The first failed receive stays inside the budget.

   Changed values: `{"receive_count": 1, "status": "retry"}`

3. The third failure uses the final normal attempt.

   Changed values: `{"receive_count": 3}`

4. The next receive crosses the budget and quarantines the message.

   Changed values: `{"receive_count": 4, "status": "dlq"}`

[Full runnable example](examples/software-engineering.py).

Limits: The local model is not SQS or Kafka and has no time, visibility timeout, ordering, retention, duplicate delivery, backoff, alarm, or redrive-velocity behavior. DLQs can break strict FIFO ordering.

## Explore (remaining exploration time)

Choose the failure type and step through attempts. The belt either recovers or sends the message to quarantine.

Open software-engineering.html for the executable model.

Model limits: The local model is not SQS or Kafka and has no time, visibility timeout, ordering, retention, duplicate delivery, backoff, alarm, or redrive-velocity behavior. DLQs can break strict FIFO ordering.

## Quiz (4 minutes)

1. Why cap retries?
   - To prevent one permanent failure from consuming work forever
   - To guarantee exactly once
   - To remove monitoring

2. What should happen before redrive?
   - Fix or understand the cause and choose a safe velocity
   - Delete the DLQ blindly
   - Increase payload corruption

3. When can a DLQ be a bad fit?
   - When strict FIFO ordering must be preserved
   - When messages have IDs
   - When metrics exist

4. Which errors in your consumer are transient versus poison-message failures?
5. What alarm and redrive runbook would keep the DLQ from becoming permanent storage?

<details><summary>Answer key — attempt first</summary>

1. To prevent one permanent failure from consuming work forever. Permanent failures need quarantine and repair, not infinite retries.

2. Fix or understand the cause and choose a safe velocity. Redrive without repair can recreate the incident.

3. When strict FIFO ordering must be preserved. Moving one item aside changes strict sequence semantics.

</details>

## Sources

- [Amazon SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) — Living documentation; checked 2026-10-17.
- [Amazon SQS DLQ redrive](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-dead-letter-queue-redrive.html) — Living documentation; checked 2026-10-17.
