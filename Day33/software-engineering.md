# A pooled thread remembers the last tenant unless you clean it

Software engineering · Day33 · 15 minutes

Prevent ThreadLocal request data from leaking into the next task on the same worker.

## Recall (2 minutes)

<p><a href="../Day20/software-engineering.html">Day20: A clock can move backward: measure elapsed time with a monotonic source</a></p><p>Wall time jumps back 2000 ms during 250 ms of work. Result?</p><details><summary>Recall first, then reveal the refresher</summary><p>A negative duration. End wall time can be earlier than start.</p></details><p><a href="../Day24/software-engineering.html">Day24: An interrupt is a stop request—do not erase it</a></p><p>What happens to interrupt status when sleep throws InterruptedException?</p><details><summary>Recall first, then reveal the refresher</summary><p>It is cleared. The blocking method clears status when it throws.</p></details>

## Understand (4 minutes)

A hotel housekeeper reuses the same cart for many rooms. If the previous guest's key card stays on the cart, the next room can receive the wrong identity.

A thread pool also reuses workers. A ThreadLocal value belongs to the worker thread, not to one request. Set request data at entry and remove it in a finally block.



Worker-7 handles tenant east, stores east, and forgets cleanup. The same worker next handles a request whose authentication step fails before setting a tenant. A later get() still returns east. With remove() in finally, the second request sees no tenant.



## Read the visual

The visual keeps Worker-7 fixed while requests change, revealing that the value follows the thread rather than the request.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use ThreadLocal only when code truly needs thread-confined context and execution stays on a known thread model.

**Practical example.** A synchronous Java servlet adds tenant ID to logs on a fixed worker pool.

**How to decide.** Prefer explicit parameters or scoped context when possible. If ThreadLocal is justified, centralize set/remove around the request boundary and test worker reuse. Avoid assuming it follows reactive or asynchronous continuations.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
var tenant = new ThreadLocal<String>();
tenant.set("east");
var leakedTenant = tenant.get();
tenant.remove(); var cleanedTenant = String.valueOf(tenant.get());
```

1. Create one thread-local slot.

   Changed values: `{"tenant": "java.lang.ThreadLocal@e50a6f6"}`

2. Request A stores its tenant on the current worker.

   Changed values: `{}`

3. Without cleanup, a later task on that worker can still read east.

   Changed values: `{"leakedTenant": "east"}`

4. Explicit cleanup makes the next read null.

   Changed values: `{"cleanedTenant": "null"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser is a deterministic two-request state machine. The Java replay is single-threaded. Neither models virtual-thread design, framework cleanup, async continuation hops, inheritable values, memory retention, or real scheduler timing.

## Explore (remaining exploration time)

Toggle cleanup and step from request A to request B on the same worker. Predict the second tenant value.

Open software-engineering.html for the executable model.

Model limits: The browser is a deterministic two-request state machine. The Java replay is single-threaded. Neither models virtual-thread design, framework cleanup, async continuation hops, inheritable values, memory retention, or real scheduler timing.

## Quiz (4 minutes)

1. Request A sets east and omits cleanup. Request B runs on the same worker without setting a value. What can get() return?
   - east
   - Always null
   - A compile error

2. Why put remove() in finally?
   - It runs on success and failure paths
   - It migrates the value across threads
   - It makes the value immutable

3. Where does this design break down?
   - Work hops between asynchronous threads
   - A synchronous worker has explicit lifecycle cleanup
   - The value is removed in finally

4. Which context values in your services are currently tied to worker threads?
5. How would you test cleanup on authentication, timeout, and exception paths?

<details><summary>Answer key — attempt first</summary>

1. east. The value belongs to the reused worker thread.

2. It runs on success and failure paths. Exceptions must not bypass cleanup.

3. Work hops between asynchronous threads. Thread affinity is not request affinity in many async models.

</details>

## Sources

- [Java 26 Thread-Local Variables](https://docs.oracle.com/en/java/javase/26/core/thread-local-variables.html) — Java SE 26; checked October 23, 2026; checked 2026-10-23.
- [Java 26 ThreadLocal API](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/ThreadLocal.html) — Java SE 26; checked 2026-10-23.
