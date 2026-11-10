# Content-Digest detects changed bytes—it does not authenticate the sender

APIs & Microservices · Day49 · 15 minutes

Use HTTP digest fields for integrity while keeping sender authentication as a separate control.

## Recall (2 minutes)

<p><a href="../Day28/apis-microservices.html">Day28: OpenAPI oneOf means exactly one schema</a></p><p>A payload matches both branches. Does oneOf accept it?</p><details><summary>Recall first, then reveal the refresher</summary><p>No. oneOf requires exactly one valid branch.</p></details><p><a href="../Day32/apis-microservices.html">Day32: Wait for ready, but never wait past the deadline</a></p><p>Ready at 3s, deadline at 5s, Wait-for-Ready enabled. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>The RPC sends with about 2s remaining. The call waits, but the original deadline keeps counting.</p></details>

## Understand (4 minutes)

A packing slip can list the exact weight of a sealed box. If the weight differs, you know the contents changed. But anyone who repacks the box can print a new slip.

RFC 9530 defines Content-Digest for HTTP message content bytes and Repr-Digest for representation data. A digest detects mismatch against the supplied value. By itself it does not authenticate, authorize, or provide privacy. Bind the digest into an authenticated HTTP Message Signature when you need to know who sent those bytes.



A payment webhook sends {"amount":40} with a SHA-256 Content-Digest. Changing the body to 400 while leaving the header unchanged fails verification. An attacker who changes both body and digest can make the digest match; only a verified signature from a trusted key authenticates the message.



## Read the visual

The request crosses an integrity comparison and then a signature gate. Recomputing the digest can make the first green while the sender remains unauthenticated.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use Content-Digest when an endpoint needs to detect accidental or malicious content changes across HTTP handling and intermediaries.

**Practical example.** A large webhook body is hashed before parsing; the digest field is also covered by the sender's HTTP Message Signature.

**How to decide.** Use a digest for byte integrity. Add a signature for sender authenticity and covered metadata. Use TLS for transport confidentiality; none of these alone is business authorization.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
import hashlib,base64; original=b'{"amount":40}'
sent_digest=base64.b64encode(hashlib.sha256(original).digest()).decode(); received=b'{"amount":400}'
computed=base64.b64encode(hashlib.sha256(received).digest()).decode(); integrity_ok=(computed==sent_digest)
signature_verified=False; authenticated=integrity_ok and signature_verified; result={'integrity_ok':integrity_ok,'authenticated':authenticated}
```

1. Start with exact synthetic HTTP content bytes.

   Changed values: `{}`

2. Carry the original digest but change the received body.

   Changed values: `{"sent_digest": "94pVFV6MCH+QAWtLjVHLaP7JkqlYeioluPgwfJsB3W8="}`

3. Recompute over received content and detect the mismatch.

   Changed values: `{"computed": "5I1C4hxsGKX2LXU5QtDtzQ2nVrHQJa7DFFIGyGiZaF8=", "integrity_ok": false}`

4. Keep sender authentication separate from digest verification.

   Changed values: `{"signature_verified": false, "authenticated": false, "result": {"integrity_ok": false, "authenticated": false}}`

[Full runnable example](examples/apis-microservices.py).

Limits: The browser uses symbolic hashes, not cryptography. It omits Structured Fields encoding, content versus representation transformations, trailers, algorithm agility, canonical signature bases, key distribution, replay protection, clocks, TLS, authorization, and library interoperability.

## Explore (remaining exploration time)

Tamper with the body, recompute the digest, and toggle signature verification. Predict integrity and authenticity separately.

Open apis-microservices.html for the executable model.

Model limits: The browser uses symbolic hashes, not cryptography. It omits Structured Fields encoding, content versus representation transformations, trailers, algorithm agility, canonical signature bases, key distribution, replay protection, clocks, TLS, authorization, and library interoperability.

## Quiz (4 minutes)

1. The body changes but the original Content-Digest remains. What should verification report?
   - Digest mismatch
   - Authenticated sender
   - Authorized payment

2. Why can an attacker recompute a matching digest?
   - A bare digest is not keyed and does not authenticate its creator
   - SHA-256 always collides
   - HTTP forbids signatures

3. What should cover Content-Digest when sender authenticity matters?
   - A verified HTTP Message Signature with sufficient component coverage
   - A larger JSON body
   - A cache-control header

4. Which API payload in your estate needs byte-integrity evidence in addition to TLS?
5. Which fields and derived components must a signature cover to prevent a valid body being replayed in the wrong context?

<details><summary>Answer key — attempt first</summary>

1. Digest mismatch. Different content bytes produce a different digest.

2. A bare digest is not keyed and does not authenticate its creator. Integrity comparison alone does not establish a trusted sender.

3. A verified HTTP Message Signature with sufficient component coverage. Signing the digest field binds the content integrity value into authenticated message metadata.

</details>

## Sources

- [RFC 9530: Digest Fields](https://www.rfc-editor.org/rfc/rfc9530.html) — IETF Standards Track; published February 2024; defines Content-Digest and Repr-Digest; checked 2026-11-09.
- [RFC 9421: HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421.html) — IETF Standards Track; published February 2024; signatures can cover content-digest; checked 2026-11-09.
