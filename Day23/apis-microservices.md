# Deprecated is a warning; Sunset is the shutdown date

APIs & Microservices · Day23 · 15 minutes

Signal API lifecycle separately: when use became discouraged and when service is expected to stop.

## Recall (2 minutes)

<p><a href="../Day18/apis-microservices.html">Day18: 202 means accepted: give long-running work a status resource</a></p><p>POST returns 202. What may the client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The request was accepted; processing is incomplete. 202 is not a completion guarantee. The client needs a status observation to know the eventual outcome.</p></details><p><a href="../Day20/apis-microservices.html">Day20: Stop routing before the next RPC: gRPC health Watch</a></p><p>B NOT_SERVING with health enabled?</p><details><summary>Recall first, then reveal the refresher</summary><p>Avoid B. Health changes eligibility.</p></details>

## Understand (4 minutes)

A train station can announce “this route is being retired” before it posts “last train: December 1.” Those are different facts.

The HTTP Deprecation response header signals that a resource is or will be deprecated. Sunset communicates when it is expected to become unresponsive. A Link can point to migration guidance.



GET /v1/orders returns Deprecation: @1790812800, Sunset: Tue, 01 Dec 2026 00:00:00 GMT, and a link to the v2 guide. Clients can warn owners before the deadline instead of discovering removal through a 404.



## Read the visual

The timeline keeps deprecation and sunset as two distinct markers; changing the current date moves the client’s required action between them.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use lifecycle headers when an API version or resource has active consumers that need machine-readable migration notice.

**Practical example.** A gateway inventories callers still using <code>/v1/orders</code> and alerts teams before the announced sunset.

**How to decide.** Headers complement—not replace—direct owner communication, telemetry, compatibility testing, and a rollback plan. Do not announce a date you cannot support operationally.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
from datetime import datetime, timezone
deprecation=datetime(2026,10,1,tzinfo=timezone.utc)
sunset=datetime(2026,12,1,tzinfo=timezone.utc)
now=datetime(2026,10,15,tzinfo=timezone.utc)
state="PAST_SUNSET" if now>=sunset else "DEPRECATED" if now>=deprecation else "SUPPORTED"
```

1. Define the two independent lifecycle times.

   Changed values: `{}`

2. Place the client between them.

   Changed values: `{}`

3. Derive the action window.

   Changed values: `{"state": "DEPRECATED"}`

[Full runnable example](examples/apis-microservices.py).

Limits: Executed local Python datetime comparison. It did not send HTTP traffic or test client support.

## Explore (remaining exploration time)

Move the current date before deprecation, between deprecation and sunset, and after sunset. Observe the client action.

Open apis-microservices.html for the executable model.

Model limits: The browser uses fixed dates. RFC 9745 does not force a server to stop at sunset, guarantee client support, or define organization-specific enforcement and communication.

## Quiz (4 minutes)

1. What does Deprecation communicate?
   - The resource is discouraged now or from a stated time
   - The exact shutdown is guaranteed
   - Authentication

2. Which header communicates expected unresponsiveness?
   - ETag
   - Sunset
   - Retry-After

3. Why keep direct consumer outreach?
   - Headers guarantee every client reacts
   - Many clients do not inspect lifecycle headers
   - RFCs forbid links

4. Which current API needs a machine-readable deprecation signal?
5. What consumer evidence must be zero before its sunset date?

<details><summary>Answer key — attempt first</summary>

1. The resource is discouraged now or from a stated time. Deprecation and shutdown time are separate signals.

2. Sunset. Sunset carries the lifecycle end date.

3. Many clients do not inspect lifecycle headers. Machine-readable notice is one layer of migration management.

</details>

## Sources

- [RFC 9745: Deprecation HTTP Response Header](https://www.rfc-editor.org/rfc/rfc9745.html) — Published 2025-03; checked 2026-10-13.
- [RFC 8594: Sunset HTTP Header](https://www.rfc-editor.org/rfc/rfc8594.html) — Published 2019-05; checked 2026-10-13.
