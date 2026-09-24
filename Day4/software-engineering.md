# Protobuf evolution: the field number is the contract

Software engineering · Day4 · 15 minutes

Predict mixed-version decoding, preserve unknown fields, and recognize why a wire-safe change can still break application behavior.

## Recall (2 minutes)

<p><a href="../Day1/software-engineering.html">Day1: When retries multiply an outage</a></p><p>Four layers each allow two total attempts. Worst-case leaf calls?</p><details><summary>Recall first, then reveal the refresher</summary><p>16. The nested multiplication is 2⁴ = 16.</p></details><p><a href="../Day3/software-engineering.html">Day3: Fencing tokens: stop the worker whose lease already died</a></p><p>A has token 1, B&#x27;s token-2 write was accepted, then A resumes. What should the resource do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject token 1 as stale. The resource has already accepted token 2, so token 1 cannot be current.</p></details>

## Understand (4 minutes)

In Protobuf binary encoding, a field number—not its source-code name—is the durable identity on the wire. Adding a new field is binary wire-safe: an old parser treats the unfamiliar tag as an unknown field, while a new parser supplies defaults when reading old messages.

That tolerance is not permission to reuse numbers. Reassigning an old tag gives the same bytes a new meaning and can cause parse failures, data corruption, or leakage. Deleted numbers should be reserved. Compatibility also depends on the path: Proto3 preserves unknown binary fields during parse and serialization, but converting through JSON or copying known fields one by one can discard them.



Original teaching case: Version 1 of a dataset event uses tag 1 for dataset_id and tag 2 for owner. Version 2 adds tag 3 for classification. A V1 relay can read the message, ignore classification in its application logic, and reserialize the binary message while preserving tag 3. A later V2 consumer recovers it.

If the relay maps only known fields into JSON and back, tag 3 disappears. The schemas are wire-compatible, yet the integration path is lossy.

Worse, if V2 deletes owner and reuses tag 2 for retention_days, the bytes tag2="30" are read by V1 as owner "30". Both parsers can succeed while disagreeing semantically.

V1: 1 → dataset_id, 2 → owner
V2 safe: add 3 → classification
V2 unsafe: reuse 2 → retention_days

At enterprise scale, enforce compatibility in CI, retain descriptors, test old-new and new-old readers, and observe actual client versions before activating new semantics. Wire safety is necessary; coordinated application behavior is the release contract.



## Explore (5 minutes)

Start with the safe addition and a binary relay. Toggle the JSON bridge and predict whether classification survives. Then reuse tag 2 and explain why successful parsing is not evidence of semantic compatibility.

Open software-engineering.html for the executable model.

Model limits: A symbolic tag map, not the Protobuf wire codec. It omits wire types, packed fields, oneof behavior, language-specific enum handling, presence rules, descriptor registries, ProtoJSON's separate compatibility rules, and actual generated code. The tag-reuse example uses string-like values only to make semantic ambiguity visible.

## Quiz (4 minutes)

1. A V2 producer adds tag 3. What does a V1 binary parser do?
   - Treats tag 3 as an unknown field
   - Renumbers all fields
   - Must fail

2. Why reserve a deleted field number?
   - To reduce message size
   - To prevent a future field from reinterpreting old bytes
   - To make JSON faster

3. Schemas are wire-safe, but an old relay converts messages to JSON and back. What boundary matters?
   - Unknown fields may be lost on that path
   - Binary compatibility guarantees JSON preservation
   - The relay automatically upgrades

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Treats tag 3 as an unknown field. Adding a field is binary wire-safe; old code does not recognize its application meaning.

2. To prevent a future field from reinterpreting old bytes. A reused number makes historical and mixed-version bytes ambiguous.

3. Unknown fields may be lost on that path. The transport and copying behavior are part of compatibility, not just the .proto diff.

</details>

## Sources

- [Protocol Buffers proto3 guide: updating message types and unknown fields](https://protobuf.dev/programming-guides/proto3/#updating) — Living documentation; publication date not stated; checked 2026-09-24.
