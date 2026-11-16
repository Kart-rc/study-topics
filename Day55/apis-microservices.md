# Deprecation says migrate; Sunset says when the resource may stop responding

APIs & Microservices · Day55 · 15 minutes

Communicate an API retirement without confusing a lifecycle warning with a behavioral shutdown.

## Recall (2 minutes)

<p><a href="../Day31/apis-microservices.html">Day31: A null child can erase its non-null parent</a></p><p>A non-null leaf resolves to null. What happens first?</p><details><summary>Recall first, then reveal the refresher</summary><p>A field error propagates to the nearest nullable parent. The non-null contract forces error propagation.</p></details><p><a href="../Day35/apis-microservices.html">Day35: If-Match turns a stale write into 412, not a lost update</a></p><p>Alice writes v8 before Bob sends If-Match v7. What should the origin server do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reject the stale change, commonly with 412. The false precondition prevents the method from being applied.</p></details>

## Understand (4 minutes)

A store can announce “we are closing” today and still serve customers until the final date. The announcement and the locked door are different events.

RFC 9745 defines the Deprecation response header. It signals that a resource will be or has been deprecated, but does not itself change resource behavior. RFC 8594 defines Sunset, which can communicate when the resource is expected to become unresponsive. A Link with relation deprecation can point humans to migration guidance.



/v1/orders returns Deprecation: @1798761600, a migration link, and Sunset: Thu, 01 Apr 2027 00:00:00 GMT. Existing calls still work during migration. Clients alert their owners and move to /v2/orders; they do not treat the warning as an immediate retry failure.



## Read the visual

Two dated gates sit on one resource timeline, separating migration notice from expected unavailability.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Send lifecycle headers when a deployed HTTP resource has known consumers that need runtime discovery of a migration window.

**Practical example.** An internal order API retires v1 across dozens of services while a portal and ownership inventory track completion.

**How to decide.** Use headers as hints alongside direct owner communication, documentation, telemetry, and a tested replacement. Do not rely on clients to notice headers, and do not set Sunset earlier than Deprecation.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
deprecation='2027-01-01'; sunset='2027-04-01'
today='2027-02-15'
deprecated=today>=deprecation; sunset_passed=today>=sunset
result={'deprecated':deprecated,'sunset_passed':sunset_passed,'behavior_changed_by_deprecation':False,'client_action':'migrate'}
```

1. Define two different lifecycle dates.

   Changed values: `{"deprecation": "2027-01-01", "sunset": "2027-04-01"}`

2. Place the client between deprecation and sunset.

   Changed values: `{"today": "2027-02-15"}`

3. Evaluate the two signals independently.

   Changed values: `{"deprecated": true, "sunset_passed": false}`

4. Keep the warning separate from server behavior.

   Changed values: `{"result": {"deprecated": true, "sunset_passed": false, "behavior_changed_by_deprecation": false, "client_action": "migrate"}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model compares calendar dates and assumes a service policy. It is not an HTTP server, Structured Fields parser, HTTP-date parser, client inventory, migration portal, availability guarantee, or enforcement mechanism.

## Explore (remaining exploration time)

Move the current date before deprecation, between deprecation and sunset, and after sunset. Predict the lifecycle signal and whether availability is guaranteed.

Open apis-microservices.html for the executable model.

Model limits: The model compares calendar dates and assumes a service policy. It is not an HTTP server, Structured Fields parser, HTTP-date parser, client inventory, migration portal, availability guarantee, or enforcement mechanism.

## Quiz (4 minutes)

1. A response contains Deprecation with a past date. What changes automatically?
   - Nothing about response behavior; it is a lifecycle signal
   - The server must return 410 immediately
   - The client must retry v2 without checking semantics

2. What does Sunset add?
   - The time when the resource is expected to become unresponsive
   - An authorization grant
   - A guarantee that migration succeeds

3. Why is the migration link still only part of the plan?
   - Clients may ignore hints, so owner outreach, telemetry, and a compatible replacement remain necessary
   - Links execute the migration
   - Headers replace versioning

4. Which API retirement currently has no runtime deprecation signal or owner-facing migration link?
5. What telemetry will prove each consumer moved before Sunset?

<details><summary>Answer key — attempt first</summary>

1. Nothing about response behavior; it is a lifecycle signal. RFC 9745 states that deprecation itself does not change resource behavior.

2. The time when the resource is expected to become unresponsive. Sunset communicates expected unavailability, using a separate HTTP-date syntax.

3. Clients may ignore hints, so owner outreach, telemetry, and a compatible replacement remain necessary. Runtime hints improve discovery but do not prove consumer action.

</details>

## Sources

- [RFC 9745: The Deprecation HTTP Response Header Field](https://www.rfc-editor.org/rfc/rfc9745.html) — IETF RFC; published March 2025; checked November 15, 2026; checked 2026-11-15.
- [RFC 8594: The Sunset HTTP Header Field](https://www.rfc-editor.org/rfc/rfc8594.html) — IETF RFC; published May 2019; checked November 15, 2026; checked 2026-11-15.
