# If the ETag still matches, return 304 and keep the cached body

APIs & Microservices · Day45 · 15 minutes

Use If-None-Match to validate a cached representation without retransmitting an unchanged response body.

## Recall (2 minutes)

<p><a href="../Day26/apis-microservices.html">Day26: Budget GraphQL breadth before nested lists multiply</a></p><p>10 repos × 10 issues × 10 comments produces how many comment nodes?</p><details><summary>Recall first, then reveal the refresher</summary><p>1000. Nested list widths multiply.</p></details><p><a href="../Day30/apis-microservices.html">Day30: One URL, two languages: Vary is part of the cache key</a></p><p>What does Vary: Accept-Language change?</p><details><summary>Recall first, then reveal the refresher</summary><p>The cache’s representation-matching key. The nominated request header must match before a stored response is reused without revalidation.</p></details>

## Understand (4 minutes)

A library member asks, “Has edition v7 changed?” If not, the librarian only says “still v7” instead of photocopying the whole book again.

An API sends an ETag with a representation. On a later GET, the client sends If-None-Match. If a listed tag matches the selected representation, the server returns 304 Not Modified with no response content; the client reuses its cached body.



The order summary body is 5,120 bytes with ETag "v7". A client holding v7 sends If-None-Match: "v7" and receives 304 plus no body bytes. A client holding v6 receives 200, the v7 body, and the new tag.



## Read the visual

The validator comparison ends in either a zero-body 304 path or a full-body 200 path, making cache reuse and representation replacement distinct outcomes.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use conditional GET when clients repeatedly fetch a cacheable resource that changes less often than it is read.

**Practical example.** A dashboard polls an order summary every 20 seconds while the summary changes only a few times per hour.

**How to decide.** Use ETags when the server can generate stable validators and caches understand representation variants. Prefer push/events for immediate change notification; do not use 304 as authorization or as proof that every variant is identical.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
server={'etag':'"v7"','body_bytes':5120}; client={'etag':'"v7"','cached_bytes':5120}
if_none_match=client['etag']; matches=if_none_match==server['etag']
status=304 if matches else 200; response_body_bytes=0 if matches else server['body_bytes']
usable_bytes=client['cached_bytes'] if status==304 else response_body_bytes; decision='reuse cache' if status==304 else 'replace cache'
```

1. The client holds the same validator and body as the selected server representation.

   Changed values: `{"server": {"etag": "\"v7\"", "body_bytes": 5120}, "client": {"etag": "\"v7\"", "cached_bytes": 5120}}`

2. Compare the teaching tags for this conditional GET.

   Changed values: `{"if_none_match": "\"v7\"", "matches": true}`

3. A match returns 304 without retransmitting the representation content.

   Changed values: `{"status": 304, "response_body_bytes": 0}`

4. The client continues using the cached v7 body.

   Changed values: `{"usable_bytes": 5120, "decision": "reuse cache"}`

[Full runnable example](examples/apis-microservices.py).

Limits: The model compares simple strong-looking strings. RFC If-None-Match uses weak comparison for cache validation. The model omits Vary, content negotiation, intermediaries, freshness, authorization, ranges, HEAD, wildcard semantics, weak tag generation, and header bytes.

## Explore (remaining exploration time)

Change the client tag and selected representation. Predict 304 versus 200 and the number of body bytes sent.

Open apis-microservices.html for the executable model.

Model limits: The model compares simple strong-looking strings. RFC If-None-Match uses weak comparison for cache validation. The model omits Vary, content negotiation, intermediaries, freshness, authorization, ranges, HEAD, wildcard semantics, weak tag generation, and header bytes.

## Quiz (4 minutes)

1. Client and selected representation both have ETag v7. What response follows a conditional GET?
   - 304 with no response content; reuse cached body
   - 200 with the full body
   - 412 because GET is unsafe

2. The client sends v6 while the server selects v7. What happens?
   - 200 with the current body and validator
   - 304 because both are ETags
   - The server deletes the cache

3. What is a key boundary?
   - ETags validate one selected representation; variants and authorization still matter
   - 304 authenticates the caller
   - Every response may share one tag

4. Which high-read, low-change API in your platform would benefit from conditional GET?
5. How will content negotiation, Vary, authorization, and validator generation keep caches correct?

<details><summary>Answer key — attempt first</summary>

1. 304 with no response content; reuse cached body. A matching If-None-Match condition on GET produces 304 Not Modified.

2. 200 with the current body and validator. No listed tag matches, so the GET proceeds normally with the current representation.

3. ETags validate one selected representation; variants and authorization still matter. Validators do not replace cache keys, Vary handling, or access control.

</details>

## Sources

- [RFC 9110: HTTP Semantics, If-None-Match](https://www.rfc-editor.org/rfc/rfc9110.html#name-if-none-match) — Internet standard; published June 2022; checked November 4, 2026; checked 2026-11-04.
- [RFC 9110: 304 Not Modified](https://www.rfc-editor.org/rfc/rfc9110.html#name-304-not-modified) — Internet standard; published June 2022; checked November 4, 2026; checked 2026-11-04.
