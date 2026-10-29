# Binary Protobuf preserves unknown fields; a JSON hop can erase them

APIs & Microservices · Day39 · 15 minutes

Evolve messages without silently deleting new fields when an older intermediary forwards them.

## Recall (2 minutes)

<p><a href="../Day23/apis-microservices.html">Day23: Deprecated is a warning; Sunset is the shutdown date</a></p><p>What does Deprecation communicate?</p><details><summary>Recall first, then reveal the refresher</summary><p>The resource is discouraged now or from a stated time. Deprecation and shutdown time are separate signals.</p></details><p><a href="../Day27/apis-microservices.html">Day27: A valid token does not make every order yours</a></p><p>Alice has a valid token. May she read Bob’s order?</p><details><summary>Recall first, then reveal the refresher</summary><p>Only if object-level policy allows that action. Authentication does not grant access to every object.</p></details>

## Understand (4 minutes)

An old postal sorter may not understand a new sticker, but it can leave the sticker on the package. If it rewrites the address onto a fresh plain box, the unknown sticker disappears.

An older proto3 parser keeps well-formed unknown binary fields and includes them when serializing again. Converting the message to ProtoJSON, or copying fields one by one into a new message, can lose unknown fields.



New producer sends order_id=42 as field 1 and priority=EXPRESS as new field 7. An old binary proxy understands field 1 but preserves field 7 during binary parse and reserialize. A binary → JSON → binary proxy drops field 7 because ProtoJSON generally does not propagate unknown fields.



## Read the visual

The same field-numbered package travels through two paths. Binary forwarding keeps the unknown sticker; the JSON path visibly emits only fields the old schema knows.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Protect unknown fields when old services, queues, gateways, or storage layers must forward newer Protobuf messages during a rolling upgrade.

**Practical example.** A v1 Kafka enrichment service reads a v2 order event and republishes it before every consumer has upgraded.

**How to decide.** Keep opaque binary forwarding or use message CopyFrom/MergeFrom when preservation matters. Use JSON at human-facing boundaries only after accepting its different evolution behavior, and reserve deleted field numbers and names.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
wire_message = {1: 42, 7: 'EXPRESS'}; old_known_numbers = {1}
old_known = {k: v for k, v in wire_message.items() if k in old_known_numbers}
binary_forward = dict(wire_message)
json_round_trip = dict(old_known); preserved_by_binary = 7 in binary_forward; preserved_by_json = 7 in json_round_trip
```

1. Represent one known and one future field.

   Changed values: `{"wire_message": {"1": 42, "7": "EXPRESS"}}`

2. The old service can interpret only field 1.

   Changed values: `{"old_known": {"1": 42}}`

3. Opaque binary forwarding keeps the unknown field.

   Changed values: `{"binary_forward": {"1": 42, "7": "EXPRESS"}}`

4. The JSON-style known-field copy loses field 7.

   Changed values: `{"json_round_trip": {"1": 42}, "preserved_by_binary": true, "preserved_by_json": false}`

[Full runnable example](examples/apis-microservices.py).

Limits: The local dictionary model is not a Protobuf encoder. It omits wire types, generated APIs, editions, enum behavior, maps, oneofs, extensions, deterministic serialization, malformed data, language differences, and schema registries.

## Explore (remaining exploration time)

Choose binary forwarding or a JSON hop. Watch field 7 survive or disappear while field 1 remains.

Open apis-microservices.html for the executable model.

Model limits: The local dictionary model is not a Protobuf encoder. It omits wire types, generated APIs, editions, enum behavior, maps, oneofs, extensions, deterministic serialization, malformed data, language differences, and schema registries.

## Quiz (4 minutes)

1. An old proto3 binary parser receives unknown field 7 and reserializes binary. Expected result?
   - Field 7 is preserved
   - Field 7 becomes field 1
   - Parsing must always fail

2. Why can a JSON hop lose field 7?
   - ProtoJSON generally does not propagate unknown fields
   - JSON reserves every number
   - Binary fields are encrypted

3. What should happen after deleting field 7 from the schema?
   - Reserve its number, and usually its name for JSON/TextFormat safety
   - Reuse 7 for an unrelated type immediately
   - Renumber every field

4. Which services deserialize and reconstruct Protobuf messages field by field today?
5. Where is a JSON conversion acceptable, and where must unknown binary fields survive?

<details><summary>Answer key — attempt first</summary>

1. Field 7 is preserved. Unknown binary fields survive parse/reserialize.

2. ProtoJSON generally does not propagate unknown fields. The JSON representation is not an opaque binary envelope.

3. Reserve its number, and usually its name for JSON/TextFormat safety. Reservation prevents dangerous future reuse.

</details>

## Sources

- [Protocol Buffers proto3 language guide: unknown fields](https://protobuf.dev/programming-guides/proto3/#unknowns) — Official documentation; checked October 29, 2026; checked 2026-10-29.
- [Protocol Buffers ProtoJSON format](https://protobuf.dev/programming-guides/json/) — Official documentation; checked October 29, 2026; checked 2026-10-29.
