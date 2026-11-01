# Give API errors a stable type, not a sentence clients must parse

APIs & Microservices · Day42 · 15 minutes

Use RFC 9457 problem details so machines branch on a documented type while people receive occurrence-specific guidance.

## Recall (2 minutes)

<p><a href="../Day30/apis-microservices.html">Day30: One URL, two languages: Vary is part of the cache key</a></p><p>What does Vary: Accept-Language change?</p><details><summary>Recall first, then reveal the refresher</summary><p>The cache’s representation-matching key. The nominated request header must match before a stored response is reused without revalidation.</p></details><p><a href="../Day18/apis-microservices.html">Day18: 202 means accepted: give long-running work a status resource</a></p><p>POST returns 202. What may the client conclude?</p><details><summary>Recall first, then reveal the refresher</summary><p>The request was accepted; processing is incomplete. 202 is not a completion guarantee. The client needs a status observation to know the eventual outcome.</p></details>

## Understand (4 minutes)

A hospital form has a standard diagnosis code and a note for this patient. Software needs the code; a person needs the note.

RFC 9457 defines application/problem+json. type identifies the stable problem class. title summarizes that class. detail explains this occurrence. instance identifies this occurrence. Optional status mirrors the real HTTP status and must agree when generated.



An order exceeds its account limit. The response is HTTP 403 with type https://api.example/problems/credit-limit, a helpful detail, and an extension availableCredit: 30. The client branches on type, never on the English detail sentence.



## Read the visual

The response separates transport status, stable problem identity, occurrence detail, extensions, and an explicit unsafe-debug branch.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use problem details when an HTTP API needs a reusable machine-readable error envelope beyond the status code.

**Practical example.** An order API must distinguish credit-limit, inventory, and validation problems while keeping each occurrence traceable.

**How to decide.** Reuse a plain status code when it already says enough. Define a stable documented type and typed extensions when clients need more. Do not expose stack traces, SQL, secrets, account internals, or personal data in detail or instance links.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
status=403; problem_type='https://api.example/problems/credit-limit'
problem={'type':problem_type,'title':'Credit limit exceeded','status':status}
problem.update({'detail':'Need 50; available 30','instance':'/problems/occ-42','availableCredit':30})
client_action='offer funding' if problem['type']==problem_type else 'generic error'
```

1. Choose HTTP semantics and a stable class identity.

   Changed values: `{"status": 403, "problem_type": "https://api.example/problems/credit-limit"}`

2. Create the shared problem envelope.

   Changed values: `{"problem": {"type": "https://api.example/problems/credit-limit", "title": "Credit limit exceeded", "status": 403}}`

3. Add occurrence detail and a typed extension.

   Changed values: `{"problem": {"type": "https://api.example/problems/credit-limit", "title": "Credit limit exceeded", "status": 403, "detail": "Need 50; available 30", "instance": "/problems/occ-42", "availableCredit": 30}}`

4. Branch on type, not human prose.

   Changed values: `{"client_action": "offer funding"}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model emits two synthetic problem shapes. It does not implement HTTP content negotiation, localization, authentication, caches, proxies, OpenAPI schemas, registries, dereferenceable type pages, or a security review.

## Explore (remaining exploration time)

Switch problem types and toggle an unsafe debug field. Inspect which fields are stable class identity, occurrence detail, and security leakage.

Open apis-microservices.html for the executable model.

Model limits: The model emits two synthetic problem shapes. It does not implement HTTP content negotiation, localization, authentication, caches, proxies, OpenAPI schemas, registries, dereferenceable type pages, or a security review.

## Quiz (4 minutes)

1. Which field should drive client remediation logic?
   - The documented type URI
   - The English detail sentence
   - A stack trace

2. Why must the body status match the HTTP status when generated?
   - Generic HTTP software acts on the real response status
   - The title replaces HTTP semantics
   - Instance is a status code

3. What must stay out of detail?
   - Stack dumps, secrets, and exploitable internals
   - A safe occurrence-specific explanation
   - A documented correction hint

4. Which error strings do your clients currently parse and what stable problem types should replace them?
5. Which fields need a security/privacy review before they leave the service boundary?

<details><summary>Answer key — attempt first</summary>

1. The documented type URI. Type is the problem class's primary identifier.

2. Generic HTTP software acts on the real response status. Proxies and clients may ignore or not understand the problem body.

3. Stack dumps, secrets, and exploitable internals. Problem details are an interface, not a debugging dump.

</details>

## Sources

- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html) — IETF Standards Track RFC; published July 2023; checked November 1, 2026; checked 2026-11-01.
- [IANA HTTP Problem Types registry](https://www.iana.org/assignments/http-problem-types/http-problem-types.xhtml) — Official registry; checked November 1, 2026; checked 2026-11-01.
