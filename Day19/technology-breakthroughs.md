# A key only for approved code: verifiable federated learning with TEEs

Technology breakthroughs · Day19 · 15 minutes

Trace how policy, attestation and a transparency log constrain who can decrypt training uploads.

## Recall (2 minutes)

<p><a href="../Day10/technology-breakthroughs.html">Day10: A light-based memory that remembers its setting</a></p><p>After programming level 10, what does removing programming power do in the model?</p><details><summary>Recall first, then reveal the refresher</summary><p>It keeps level 10. Nonvolatile storage retains the programmed state. Reading still needs the modeled light and detector; retention is not the same as free operation.</p></details><p><a href="../Day4/technology-breakthroughs.html">Day4: MaD-RL: optimize the output distribution, not only the best-looking sample</a></p><p>A per-sample optimizer always favors the slightly highest-reward mode. What population failure can follow?</p><details><summary>Recall first, then reveal the refresher</summary><p>Mode concentration. Maximizing individual rewards can push probability toward one mode even when the desired output population is broader.</p></details>

## Understand (4 minutes)

Imagine a sealed kitchen. Ingredients arrive in locked boxes. The key service releases a key only when the kitchen proves it is running an approved recipe whose fingerprint appears in a public log. A trusted execution environment (TEE) provides a related idea for computation: remotely attest the workload identity, protect its internal state, and gate keys on policy.

Google Research announced a TEE-based federated-learning system on October 2, 2026. This is a current research-and-deployment report, not a claim that TEEs remove all trust. The authors explicitly discuss current-generation TEE limits.



A device encrypts its example and pre-authorizes a policy hash. That policy is published to a transparency log. A server workload presents an attestation. The KMS releases a decryption key only if the attested workload matches the allowed policy. The workload releases anonymized model updates rather than raw examples.

Change one hash in the local model: the key gate closes. The visual teaches authorization flow; it performs no attestation, encryption, differential privacy or federated training.



## Read the visual

Encrypted data, policy log, KMS gate and TEE are separate. Only a matching workload identity opens the key path.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** This is relevant when studying privacy-preserving federated analytics or training where clients need auditable constraints on server-side workloads.

**Practical example.** A keyboard client authorizes a published training program; only an attested matching TEE can receive a key for time-bounded encrypted uploads.

**How to decide.** Treat this as specialist architecture and research evidence. Evaluate TEE side channels, supply chain, policy review, differential-privacy accounting and operational recovery before production use.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
allowed_policy = "P7"
attested_workload = "X9"
key_released = attested_workload == allowed_policy
plaintext_available = key_released
attested_workload = "P7"
key_released = attested_workload == allowed_policy
plaintext_available = key_released
```

1. A client policy and presented workload do not match.

   Changed values: `{"allowed_policy": "P7", "attested_workload": "X9"}`

2. The key gate denies the mismatched workload.

   Changed values: `{"key_released": false, "plaintext_available": false}`

3. A matching label opens the toy gate; real attestation is far richer.

   Changed values: `{"attested_workload": "P7", "key_released": true, "plaintext_available": true}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: Executed string comparisons only. It is not a security or privacy implementation.

## Explore (remaining exploration time)

Toggle whether the attested workload hash matches the logged policy. Predict whether KMS releases a key and which data becomes visible.

Open technology-breakthroughs.html for the executable model.

Model limits: The JavaScript compares two labels. It provides no cryptographic attestation, confidentiality, integrity, transparency proof, differential privacy, consensus or training.

## Quiz (4 minutes)

1. Attestation reports X9 but policy allows P7. What should KMS do?
   - Release the key
   - Deny the key
   - Publish raw data

2. What does the public log add?
   - A visible record of allowed workload policies for auditing
   - A copy of every raw training example
   - A guarantee against every side channel

3. Does this browser model prove privacy?
   - Yes
   - Only for keyboard data
   - No; it compares labels and omits cryptography and DP

4. Which component makes the allowed program externally inspectable?
5. Name two TEE or surrounding-system limits you would investigate before adoption.

<details><summary>Answer key — attempt first</summary>

1. Deny the key. The mismatch means the workload is not within the pre-authorized policy.

2. A visible record of allowed workload policies for auditing. The log supports transparency about authorized workloads; it does not publish raw data or eliminate TEE limitations.

3. No; it compares labels and omits cryptography and DP. A UI state transition is explanatory, not security evidence.

</details>

## Sources

- [Google Research: Toward provably private learning from federated data](https://www.research.google/blog/toward-provably-private-learning-from-federated-data/) — 2026-10-02; checked 2026-10-09.
- [Daly et al. whitepaper](https://arxiv.org/abs/2609.31494) — 2026-09 preprint; checked 2026-10-09.
