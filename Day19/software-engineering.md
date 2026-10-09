# A returned value can hide a changed history: the ABA problem

Software engineering · Day19 · 15 minutes

Use a version stamp when “A again” must not mean “unchanged.”

## Recall (2 minutes)

<p><a href="../Day10/software-engineering.html">Day10: Stop calling a failing service, then try one small probe</a></p><p>After three failures open this breaker, what happens to a fourth immediate call?</p><details><summary>Recall first, then reveal the refresher</summary><p>It is blocked without reaching the service. Open means the local breaker rejects the call. It avoids another remote wait, but it cannot turn a failed operation into a success.</p></details><p><a href="../Day4/software-engineering.html">Day4: Protobuf evolution: the field number is the contract</a></p><p>A V2 producer adds tag 3. What does a V1 binary parser do?</p><details><summary>Recall first, then reveal the refresher</summary><p>Treats tag 3 as an unknown field. Adding a field is binary wire-safe; old code does not recognize its application meaning.</p></details>

## Understand (4 minutes)

You photograph a parking spot with a blue car. While you look away, the blue car leaves, a red car parks, then the same blue car returns. A second photo still says “blue,” but the spot changed twice. A compare-and-set that checks only the current value can miss that history. This is the ABA problem.

Add a version stamp. The state becomes (value, version). A worker that read (A,0) must fail if the current state is (A,2), even though the visible value is A again.



Worker W1 reads A at version 0 and pauses. W2 changes A→B, version 1, then B→A, version 2. A plain value comparison says W1's old expectation still matches. AtomicStampedReference.compareAndSet checks both reference and stamp, so W1's stale update A→C with expected stamp 0 fails.

boolean changed = ref.compareAndSet("A", "C", 0, 1);

The recorded Java example executes this sequence without threads so the history is deterministic. The API operation is atomic; the lesson does not reproduce a race scheduler.



## Read the visual

The same visible value A appears at both ends, while the version and highlighted history reveal two intervening changes.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this in lock-free state machines, free lists or ownership tokens where a value can cycle back and that intermediate history matters.

**Practical example.** A worker claims slot A, another worker removes and restores A, and the first worker later tries to update using its stale observation.

**How to decide.** Use a stamp when value reuse is legitimate and history matters. A lock or immutable identity may be simpler; version wraparound and reference identity still require design.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var ref = new java.util.concurrent.atomic.AtomicStampedReference<String>("A", 0);
String seen = ref.getReference();
int seenStamp = ref.getStamp();
ref.compareAndSet("A", "B", 0, 1);
ref.compareAndSet("B", "A", 1, 2);
boolean valueMatches = ref.getReference().equals(seen);
boolean staleUpdate = ref.compareAndSet(seen, "C", seenStamp, seenStamp + 1);
String finalValue = ref.getReference();
int finalStamp = ref.getStamp();
```

1. W1 reads A with stamp 0.

   Changed values: `{"ref": "java.util.concurrent.atomic.AtomicStampedReference@402e37bc", "seen": "A", "seenStamp": "0"}`

2. W2 performs the ABA cycle; the visible value matches.

   Changed values: `{"valueMatches": "true"}`

3. W1 supplies its old stamp. The atomic update fails.

   Changed values: `{"staleUpdate": "false", "finalValue": "A", "finalStamp": "2"}`

[Full runnable example](examples/software-engineering.java).

Limits: Executed with Java 17 in one thread to verify API outcomes. It does not reproduce interleaving or garbage-collection hazards.

## Explore (remaining exploration time)

Step W2 through A→B→A. Toggle value-only versus value+stamp validation and predict whether W1’s stale write reaches C.

Open software-engineering.html for the executable model.

Model limits: The browser is a deterministic history player, not a concurrent memory model. The recorded Java uses one thread. Integer stamp wraparound, object identity and memory reclamation are outside the toy.

## Quiz (4 minutes)

1. W1 read A,v0. Current state is A,v2. What should stamped CAS do?
   - Succeed because A matches
   - Fail because v0 is stale
   - Reset the stamp

2. What does value-only CAS see after A→B→A?
   - A matches A
   - B matches A
   - The full history

3. Does a stamp solve every lock-free problem?
   - Yes
   - Only on 64-bit systems
   - No; wraparound and reclamation remain design concerns

4. Where could an ABA cycle appear in a work-ownership protocol?
5. When would a lock be safer or clearer than stamped CAS?

<details><summary>Answer key — attempt first</summary>

1. Fail because v0 is stale. The stamp exposes the intervening A→B→A history.

2. A matches A. It sees only the current value, so it cannot distinguish unchanged A from returned A.

3. No; wraparound and reclamation remain design concerns. A stamp addresses this stale-history check, not all memory lifecycle or concurrency hazards.

</details>

## Sources

- [Java 17 AtomicStampedReference](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/atomic/AtomicStampedReference.html) — Java SE 17 API; checked 2026-10-09.
