# ScopedValue ends with the call; ThreadLocal can outlive it

Software engineering · Day51 · 15 minutes

Use Java 25 ScopedValue for bounded, one-way request context without leaking mutable thread state.

## Recall (2 minutes)

<p><a href="../Day29/software-engineering.html">Day29: The urgent thread waits while ordinary work runs</a></p><p>Who causes H to wait directly?</p><details><summary>Recall first, then reveal the refresher</summary><p>L, because L owns the lock. H blocks on the lock held by L.</p></details><p><a href="../Day33/software-engineering.html">Day33: A pooled thread remembers the last tenant unless you clean it</a></p><p>Request A sets east and omits cleanup. Request B runs on the same worker without setting a value. What can get() return?</p><details><summary>Recall first, then reveal the refresher</summary><p>east. The value belongs to the reused worker thread.</p></details>

## Understand (4 minutes)

A visitor badge works only while you are inside the building. A sticky note left on a shared desk can be read by the next visitor.

Java 25 ScopedValue binds an immutable context for one dynamic call scope. Far-away callees can read it, but they cannot overwrite that binding. When the call ends—normally or exceptionally—the binding disappears. This is narrower than a mutable ThreadLocal whose value lives until code removes it.

// Java 25 API; not executed in this runtime
static final ScopedValue<RequestContext> CTX = ScopedValue.newInstance();
ScopedValue.where(CTX, ctx).run(() -> handleOrder());



Request req-51 binds tenant bank-a. A repository method reads that value without every intermediate method accepting a context parameter. After handleOrder returns, reading CTX outside the scope is invalid; the next request cannot inherit bank-a accidentally.



## Read the visual

A nested scope stack shows the visible context changing temporarily, reverting to the outer binding, then becoming unbound when the request ends.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use ScopedValue for immutable request context that must flow down a bounded Java call tree, especially with virtual threads or structured concurrency.

**Practical example.** Pass tenant, trace, and policy context through a Java API handler into repository and audit code without mutable thread-local cleanup.

**How to decide.** Prefer ordinary method parameters when only a few layers need the value. Use a small immutable record when several context fields travel together. Do not use ScopedValue as a global cache or mutable session store.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
stack=[]; visible=lambda: stack[-1] if stack else None
stack.append('bank-a'); outer=visible()
stack.append('support'); nested=visible(); stack.pop(); restored=visible()
stack.pop(); after=visible(); result={'outer':outer,'nested':nested,'restored':restored,'after':after}
```

1. Create a tiny model of the current dynamic binding.

   Changed values: `{"stack": []}`

2. Enter request req-51 with tenant bank-a.

   Changed values: `{"stack": ["bank-a"], "outer": "bank-a"}`

3. Rebind inside a nested scope, then reveal the outer value again.

   Changed values: `{"nested": "support", "restored": "bank-a"}`

4. Leave the request; no tenant remains bound.

   Changed values: `{"stack": [], "after": null, "result": {"outer": "bank-a", "nested": "support", "restored": "bank-a", "after": null}}`

[Full runnable example](examples/software-engineering.py).

Limits: The recorded Python stack and browser model illustrate dynamic scoping only. They do not execute Java 25 ScopedValue, virtual threads, StructuredTaskScope inheritance, JVM access control, exceptions, performance caches, or thread handoff.

## Explore (remaining exploration time)

Step into, rebind, and leave nested request scopes. Predict the value visible at each call depth.

Open software-engineering.html for the executable model.

Model limits: The recorded Python stack and browser model illustrate dynamic scoping only. They do not execute Java 25 ScopedValue, virtual threads, StructuredTaskScope inheritance, JVM access control, exceptions, performance caches, or thread handoff.

## Quiz (4 minutes)

1. What happens to req-51's binding when the bounded call returns?
   - It becomes unbound
   - It stays until the carrier thread dies
   - A callee mutates it to null

2. Why prefer ScopedValue over ThreadLocal for one-way context?
   - Bounded lifetime and no callee mutation of the binding
   - It stores unlimited mutable sessions
   - It works in every pre-Java-25 runtime

3. When are plain parameters simpler?
   - When only a small, explicit call chain needs the value
   - Whenever the context is immutable
   - Whenever virtual threads exist

4. Which ThreadLocal in your Java services really represents bounded request context?
5. What immutable fields belong in one RequestContext record?

<details><summary>Answer key — attempt first</summary>

1. It becomes unbound. The binding exists only for the dynamic scope.

2. Bounded lifetime and no callee mutation of the binding. The API is designed for bounded one-way transmission.

3. When only a small, explicit call chain needs the value. Do not hide context when ordinary parameters remain clear.

</details>

## Sources

- [ScopedValue — Java SE 25 API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ScopedValue.html) — Official Java SE 25 API; checked November 11, 2026; checked 2026-11-11.
- [Significant changes in JDK 25](https://docs.oracle.com/en/java/javase/25/migrate/significant-changes-jdk-25.html) — Official Oracle migration guide; JEP 506 is final in Java 25; checked 2026-11-11.
