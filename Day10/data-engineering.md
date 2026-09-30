# Save the order and a “send later” note together

Data engineering · Day10 · 15 minutes

Keep an order and its notification from drifting apart when a process crashes.

## Recall (2 minutes)

<p><a href="../Day6/data-engineering.html">Day6: Kafka tiered storage: retention is not local disk</a></p><p>A consumer rewinds 24 hours while local retention is six hours and overall retention is seven days. Where is the segment in this model?</p><details><summary>Recall first, then reveal the refresher</summary><p>Remote tier. The offset remains within overall retention but lies beyond the local hot window.</p></details><p><a href="../Day8/data-engineering.html">Day8: Spark changelog checkpoints: persist the delta, snapshot in the background</a></p><p>A 300 GB state store changes 100 MB per trigger, while compaction produces 900 MB of new SST files. What should you predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Changelog checkpointing can reduce foreground durable bytes. The benefit comes from persisting the small change instead of the larger set of changed physical files.</p></details>

## Understand (4 minutes)

A shop accepts order A100. It must save the order in its database and tell the shipping service about it through Kafka. If it saves the order and crashes before sending the message, shipping never hears about the order.

Think of a restaurant: the cashier records both the sale and a kitchen ticket. The ticket waits until someone delivers it. An outbox is that waiting tray, stored as a database table.

Save the order and its outbox row in one transaction: the database saves both, or neither. A separate worker, called a relay, reads saved outbox rows and sends them to Kafka. After Kafka confirms the send, the relay marks the row sent.

One database transactionOrder A100status: acceptedOutbox E7status: waiting↓ Relay sends the saved ticket

Kafka → shipping consumerThe database remembers what still needs sending. Kafka remembers what it received. These are separate records. That gap is why a retry can send the same event twice.



Give the event a stable name: E7. The relay sends E7, then crashes before marking it sent. After restart, E7 still looks pending, so the relay sends it again. Kafka may now contain E7 at two different offsets.

The shipping consumer must recognize event E7, not only its Kafka offset. It saves an E7 processing marker together with the shipment update in its own database transaction. Two copies then produce one shipment.

Try to predict: after that crash, does a pending outbox row mean “never sent”? No. It means “not yet recorded as sent.”



## Explore (5 minutes)

Press Save order, Send event, Crash, then Send event again. Read the three boxes after every click. Deliver the messages first with duplicate protection on, then repeat with it off.

Open data-engineering.html for the executable model.

Model limits: This is a local state machine, not a Kafka or database emulator. Each Save action represents a completed atomic transaction. It models one event and one relay, without ordering, concurrent workers, retries with backoff, or lost acknowledgements. A real consumer needs a unique marker and business update in one transaction. External effects such as email need their own strategy. Event IDs require a suitable namespace and retention policy.

## Quiz (4 minutes)

1. E7 reached Kafka, but the relay crashed before marking it sent. What can happen?
   - E7 is safely deleted
   - E7 is sent again
   - The order is rolled back

2. Why save the order and ticket in one transaction?
   - It makes Kafka part of the database
   - It prevents every duplicate
   - It prevents a saved order without a saved send request

3. Two Kafka records contain the same event E7 at different offsets. What identifies this duplicate?
   - The stable event ID E7
   - Only the Kafka offset
   - The order ID for every possible event

4. Explain why a pending ticket does not prove that Kafka never received E7.
5. Suppose the consumer also sends an email. Why does its database marker alone not guarantee one email?

<details><summary>Answer key — attempt first</summary>

1. E7 is sent again. The saved ticket is still pending, so the relay may resend it. Kafka receiving E7 does not update the order database. A later relay crash cannot undo a committed order.

2. It prevents a saved order without a saved send request. Both database rows commit together. Kafka remains separate, and the relay can still publish a duplicate.

3. The stable event ID E7. E7 identifies this logical event across repeated sends. Offsets identify different Kafka records. Order A100 may legitimately have several different events.

</details>

## Sources

- [AWS: Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) — Living guidance; publication date not stated; checked 2026-09-29.
