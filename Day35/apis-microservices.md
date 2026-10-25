# If-Match turns a stale write into 412, not a lost update

APIs & Microservices · Day35 · 15 minutes

Use strong ETags as optimistic concurrency tokens so two clients cannot silently overwrite each other.

## Recall (2 minutes)

<p><a href="../Day21/apis-microservices.html">Day21: Retry-After is a floor, not a synchronized alarm clock</a></p><p>Retry-After: 3. Is a retry at second 1 compliant with the advice?</p><details><summary>Recall first, then reveal the refresher</summary><p>No. The field asks the client to wait.</p></details><p><a href="../Day25/apis-microservices.html">Day25: A field mask says exactly what PATCH may change</a></p><p>Payload contains alerts=false, but update_mask is timezone. What happens to alerts?</p><details><summary>Recall first, then reveal the refresher</summary><p>It stays unchanged. Only paths named in the mask participate in the update.</p></details>

## Understand (4 minutes)

Two people open the same shared document at version 7. Alice saves first, creating version 8. Bob's screen still shows version 7. If Bob saves without a version check, he can erase Alice's work.

An API can return a strong ETag: "v7". The client sends If-Match: "v7" with its PUT or PATCH. The origin server compares before applying the method. If the current tag is now "v8", it does not apply the stale write and can return 412 Precondition Failed.



Alice and Bob GET order 42 at v7. Alice changes the address with If-Match v7; the server writes and returns v8. Bob changes the delivery date with If-Match v7; the comparison fails, so Bob must GET v8, reconcile, and submit a new change.



## Read the visual

The three snapshots make the race concrete: both read v7, Alice advances the server to v8, and Bob's unchanged tag blocks the overwrite.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use If-Match for editable resources where parallel clients can read and then update the same representation.

**Practical example.** A customer and an operations agent edit different fields of the same order within seconds.

**How to decide.** Issue a strong validator that changes whenever relevant representation data changes. Require If-Match for unsafe updates, return 428 when the precondition is missing if that is your API policy, and return 412 for a stale validator.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
current_version = 7; alice_tag = 7; bob_tag = 7
alice_status = 200 if alice_tag == current_version else 412; current_version += 1 if alice_status == 200 else 0
bob_status = 200 if bob_tag == current_version else 412
stored_version = current_version
```

1. Both clients read the same version.

   Changed values: `{"current_version": 7, "alice_tag": 7, "bob_tag": 7}`

2. Alice's matching update creates v8.

   Changed values: `{"current_version": 8, "alice_status": 200}`

3. Bob's stale v7 tag fails.

   Changed values: `{"bob_status": 412}`

4. The server remains at v8; Alice's update was not lost.

   Changed values: `{"stored_version": 8}`

[Full runnable example](examples/apis-microservices.py).

Limits: The browser uses integer versions as ETags. Real validators are opaque, strong versus weak comparison matters, representations can vary, a 2xx may be allowed when the requested change is already applied, and PATCH merge semantics remain application-specific. No HTTP request ran.

## Explore (remaining exploration time)

Step Alice and Bob through their writes. Change whether Bob refreshes before retrying and watch the stored version.

Open apis-microservices.html for the executable model.

Model limits: The browser uses integer versions as ETags. Real validators are opaque, strong versus weak comparison matters, representations can vary, a 2xx may be allowed when the requested change is already applied, and PATCH merge semantics remain application-specific. No HTTP request ran.

## Quiz (4 minutes)

1. Alice writes v8 before Bob sends If-Match v7. What should the origin server do?
   - Reject the stale change, commonly with 412
   - Overwrite v8 silently
   - Return 304

2. Why must If-Match use strong comparison?
   - The client intends to detect any relevant representation change
   - Weak tags are always faster
   - It authenticates the user

3. What does If-Match not replace?
   - Authentication, authorization, validation, and merge rules
   - An ETag
   - HTTP methods

4. Which API resources can currently lose updates because writes lack a validator?
5. How will clients reconcile a 412 without automatically overwriting a change they do not understand?

<details><summary>Answer key — attempt first</summary>

1. Reject the stale change, commonly with 412. The false precondition prevents the method from being applied.

2. The client intends to detect any relevant representation change. Lost-update protection needs a validator that changes with representation data.

3. Authentication, authorization, validation, and merge rules. Concurrency control is only one API responsibility.

</details>

## Sources

- [RFC 9110 §13.1.1 If-Match](https://www.rfc-editor.org/rfc/rfc9110.html#section-13.1.1) — Internet Standard; June 2022; checked 2026-10-25.
- [RFC 9110 §8.8.3 Entity Tags](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.8.3) — Internet Standard; June 2022; checked 2026-10-25.
- [RFC 6585 §3 428 Precondition Required](https://www.rfc-editor.org/rfc/rfc6585.html#section-3) — IETF RFC; April 2012; checked 2026-10-25.
