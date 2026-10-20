# One URL, two languages: Vary is part of the cache key

APIs & Microservices · Day30 · 15 minutes

Prevent a shared cache from serving the English representation to a French request.

## Recall (2 minutes)

<p><a href="../Day24/apis-microservices.html">Day24: One trace ID joins the call path; it does not authenticate it</a></p><p>What stays the same across spans in one distributed trace?</p><details><summary>Recall first, then reveal the refresher</summary><p>trace ID. The shared trace ID correlates the path; each span has its own ID.</p></details><p><a href="../Day12/apis-microservices.html">Day12: Do not erase a newer edit: ETag and If-Match</a></p><p>Alice has advanced the resource to v2. Bob sends If-Match v1. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Server does not perform the update and may return 412. The condition is false. RFC 9110 says the origin server must not perform the requested method; 412 can report the failed precondition.</p></details>

## Understand (4 minutes)

A restaurant uses one menu number for English and French. If the waiter files only by menu number, the next guest may receive the wrong language. The language choice must be part of the filing key.

HTTP Vary tells a cache which request headers selected the stored representation. With Vary: Accept-Language, /help in English and French occupy separate variants. Without that dimension, a shared cache can replay the wrong body.



Request 1 asks for /help with Accept-Language: en; the origin returns “Reset password” and Vary: Accept-Language. Request 2 asks for French. A compliant cache does not reuse the English variant because the nominated request header differs; it fetches/stores “Réinitialiser le mot de passe.”



## Read the visual

The table makes the hidden secondary key visible. The wrong-language failure appears exactly when two representations collapse into one slot.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use Vary when the same URI has cacheable representations selected by request headers such as Accept-Encoding or Accept-Language.

**Practical example.** A public help API returns localized text from one URI through a shared CDN.

**How to decide.** Vary only on headers that genuinely select representation. High-cardinality dimensions fragment the cache. Personalized or sensitive responses may need private/no-store behavior instead of a huge Vary key.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
uri='/help'
first_language='en'
first_body='Reset password'
vary=['Accept-Language']
cache_key=(uri,first_language if 'Accept-Language' in vary else None)
second_key=(uri,'fr' if 'Accept-Language' in vary else None)
cache_hit=second_key==cache_key
```

1. The English response fills the first cache entry.

   Changed values: `{"uri": "/help", "first_language": "en", "first_body": "Reset password"}`

2. The response names the request header that selected the representation.

   Changed values: `{"vary": ["Accept-Language"]}`

3. The cache key now includes the language dimension.

   Changed values: `{"cache_key": ["/help", "en"]}`

4. The French request does not match the English variant.

   Changed values: `{"second_key": ["/help", "fr"], "cache_hit": false}`

[Full runnable example](examples/apis-microservices.py).

Limits: This browser models one shared cache, one URI, two languages, and no freshness/revalidation. Real caches also consider method, target URI, cache controls, authorization, validators, status codes, CDN configuration, and header normalization.

## Explore (remaining exploration time)

Toggle whether the origin sends Vary. The cache either keeps two language slots or incorrectly reuses the first body.

Open apis-microservices.html for the executable model.

Model limits: This browser models one shared cache, one URI, two languages, and no freshness/revalidation. Real caches also consider method, target URI, cache controls, authorization, validators, status codes, CDN configuration, and header normalization.

## Quiz (4 minutes)

1. What does Vary: Accept-Language change?
   - The cache’s representation-matching key
   - The URI path itself
   - The user’s authorization

2. What happens without Vary in the example?
   - The French request can receive the cached English body
   - The cache becomes encrypted
   - The origin changes method

3. Why not Vary on every request header?
   - High-cardinality keys fragment the cache and reduce hits
   - It makes HTTP invalid
   - It guarantees freshness

4. Which response header selects a representation in one of your APIs today, and is it reflected in the cache key?
5. How would Cache-Status and an origin request ID help distinguish an origin bug from a cache-key bug?

<details><summary>Answer key — attempt first</summary>

1. The cache’s representation-matching key. The nominated request header must match before a stored response is reused without revalidation.

2. The French request can receive the cached English body. Both requests collapse to the same cache key.

3. High-cardinality keys fragment the cache and reduce hits. Only representation-selecting dimensions belong in the secondary key.

</details>

## Sources

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html#section-4.1) — Published June 2022; checked 2026-10-20.
- [RFC 9110: Vary](https://www.rfc-editor.org/rfc/rfc9110.html#field.vary) — Published June 2022; checked 2026-10-20.
- [RFC 9211: Cache-Status](https://www.rfc-editor.org/rfc/rfc9211.html) — Published June 2022; checked 2026-10-20.
