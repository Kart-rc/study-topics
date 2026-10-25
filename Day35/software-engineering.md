# The work failure stays primary; close failures become suppressed

Software engineering · Day35 · 15 minutes

Use Java try-with-resources so cleanup runs without hiding the exception that caused the operation to fail.

## Recall (2 minutes)

<p><a href="../Day21/software-engineering.html">Day21: Publish one configuration snapshot, not three changing fields</a></p><p>Reader sees {1000,0,B}. What does that prove?</p><details><summary>Recall first, then reveal the refresher</summary><p>It combined separately published fields. That tuple exists in neither v1 nor v2.</p></details><p><a href="../Day25/software-engineering.html">Day25: One lock order breaks the deadlock cycle</a></p><p>T1 holds 7 and waits for 9; T2 holds 9 and waits for 7. What exists?</p><details><summary>Recall first, then reveal the refresher</summary><p>A wait-for cycle. Each transaction waits for a resource held by the other.</p></details>

## Understand (4 minutes)

Imagine a delivery truck crashes, and then its broken door jams while responders unload it. The crash explains why the delivery failed; the jam is also important, but it should not replace the original cause.

Java try-with-resources closes every initialized AutoCloseable. If the body and close() both throw, the body exception is propagated and the close exception is attached as suppressed.



A JDBC transaction throws "insert failed". Closing the connection also throws "socket close failed". Logs should show the insert failure as primary and the socket failure in getSuppressed(). A hand-written finally block that simply throws from close can mask the real cause.



## Read the visual

The nested stack answers which exception tells the main story and where cleanup evidence remains accessible.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use try-with-resources for files, streams, JDBC connections/statements/result sets, and other AutoCloseable resources.

**Practical example.** An order insert fails and the database connection also errors during close; incident responders need both failures in causal order.

**How to decide.** Let try-with-resources establish primary/suppressed ordering. Log suppressed failures, and design close methods to be idempotent and specific. Do not ignore cleanup failures that may signal leaks or incomplete flushes.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```java
class LoudResource implements AutoCloseable { public void close() { throw new RuntimeException("close failed"); } }
RuntimeException primary = null; int suppressed = 0;
try (LoudResource r = new LoudResource()) { throw new RuntimeException("work failed"); } catch (RuntimeException e) { primary = e; suppressed = e.getSuppressed().length; }
String primaryMessage = primary.getMessage(); String closeMessage = primary.getSuppressed()[0].getMessage();
```

1. Define a resource whose close operation fails.

   Changed values: `{}`

2. Prepare to capture the propagated exception.

   Changed values: `{"suppressed": "0"}`

3. The body fails first; automatic close fails second.

   Changed values: `{"suppressed": "1"}`

4. Inspect both causes without losing their order.

   Changed values: `{"primaryMessage": "work failed", "closeMessage": "close failed"}`

[Full runnable example](examples/software-engineering.java).

Limits: The browser models one resource. Real Java closes multiple resources in reverse declaration order and can suppress multiple failures. It does not model Errors, initialization failure, logging frameworks, JDBC rollback, async cleanup, or process termination. The Java replay was executed during the build.

## Explore (remaining exploration time)

Toggle whether the body and close fail. The stack shows which failure is primary and which is preserved underneath it.

Open software-engineering.html for the executable model.

Model limits: The browser models one resource. Real Java closes multiple resources in reverse declaration order and can suppress multiple failures. It does not model Errors, initialization failure, logging frameworks, JDBC rollback, async cleanup, or process termination. The Java replay was executed during the build.

## Quiz (4 minutes)

1. The try body and close both throw. Which is propagated?
   - The body exception, with close attached as suppressed
   - Only close
   - Neither

2. Where do you find the close failure?
   - Throwable.getSuppressed()
   - System.getenv()
   - Thread.interrupted()

3. Why prefer this over a naive finally close?
   - A close failure will not mask the earlier work failure
   - It prevents all close failures
   - It makes resources global

4. Which AutoCloseable resources in your services are still managed by hand-written finally blocks?
5. How should your logging and alerting expose suppressed close failures without obscuring the primary incident?

<details><summary>Answer key — attempt first</summary>

1. The body exception, with close attached as suppressed. Try-with-resources preserves the work failure as the primary cause.

2. Throwable.getSuppressed(). Suppressed exceptions preserve sibling cleanup failures.

3. A close failure will not mask the earlier work failure. Causal ordering is kept automatically.

</details>

## Sources

- [Oracle Java tutorial: try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) — Java language tutorial; checked 2026-10-25.
- [Java SE 26 Throwable.getSuppressed](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/Throwable.html#getSuppressed()) — Current API documentation; checked 2026-10-25.
- [Java Language Specification: try-with-resources](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.3) — Java SE 21 language specification; checked 2026-10-25.
