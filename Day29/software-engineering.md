# The urgent thread waits while ordinary work runs

Software engineering · Day29 · 15 minutes

See priority inversion and how priority inheritance lets the lock owner finish.

## Recall (2 minutes)

<p><a href="../Day18/software-engineering.html">Day18: Two slots, no waiting room: cap in-flight work with a semaphore</a></p><p>A and B occupy both slots. C calls tryAcquire(). What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>C fails to acquire and should avoid the DB call. tryAcquire returns false when no permit is available. The application must turn that into its chosen busy response; it is not an automatic HTTP response.</p></details><p><a href="../Day22/software-engineering.html">Day22: The reply happened after the request—even when its wall clock says earlier</a></p><p>B wall=95 receives (100,0). Its next HLC is?</p><details><summary>Recall first, then reveal the refresher</summary><p>(100,1). The received physical value wins and the logical counter advances.</p></details>

## Understand (4 minutes)

A paramedic needs a medicine cabinet. A cleaner has the key, but an ordinary delivery keeps interrupting the cleaner. The paramedic waits even though the delivery is less urgent.

In software, a low-priority thread holds a lock needed by a high-priority thread. Medium-priority work keeps preempting the lock owner. This is priority inversion. With priority inheritance, the lock owner temporarily inherits the waiter’s higher priority so it can finish and release the lock.



Low L holds the Kafka checkpoint lock for two ticks. High H arrives and blocks. Medium M becomes runnable. Without inheritance, M runs before L, so H waits longer. With inheritance, L is boosted above M, runs its remaining two ticks, unlocks, and H proceeds.



## Read the visual

The scheduler lane separates lock ownership from CPU choice: H waits on L, while M delays L only when the owner is not boosted.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use priority-inheritance synchronization when bounded latency matters and a high-priority thread may wait on a lock held by lower-priority work.

**Practical example.** A real-time ingestion controller waits for a checkpoint mutex while a background metrics thread owns it and normal compression work is runnable.

**How to decide.** First shorten critical sections and avoid unnecessary shared locks. When real-time scheduling is truly required, use an owner-aware PI mutex supported by the OS/runtime; a counting semaphore has no single owner to boost.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
priority={'L':1,'M':2,'H':3}
lock_owner='L'
blocked={'H':'lock'}
effective=dict(priority)
effective[lock_owner]=priority['H']
next_thread=max(('L','M'),key=lambda t:effective[t])
```

1. Low-priority L starts while owning the needed lock.

   Changed values: `{"priority": {"L": 1, "M": 2, "H": 3}, "lock_owner": "L"}`

2. High-priority H arrives but cannot acquire the lock.

   Changed values: `{"blocked": {"H": "lock"}}`

3. Priority inheritance boosts the owner to H’s priority.

   Changed values: `{"effective": {"L": 3, "M": 2, "H": 3}}`

4. The scheduler chooses boosted L so it can unlock.

   Changed values: `{"next_thread": "L"}`

[Full runnable example](examples/software-engineering.py).

Limits: This deterministic toy has three threads, one lock, fixed work, and no interrupts or nested lock chains. Actual schedulers, runtime safepoints, I/O, cgroups, and non-preemptible regions change latency. Priority inheritance bounds one inversion mechanism; it does not guarantee every deadline.

## Explore (remaining exploration time)

Switch priority inheritance on and off. Follow who owns the lock and which thread the scheduler runs at each tick.

Open software-engineering.html for the executable model.

Model limits: This deterministic toy has three threads, one lock, fixed work, and no interrupts or nested lock chains. Actual schedulers, runtime safepoints, I/O, cgroups, and non-preemptible regions change latency. Priority inheritance bounds one inversion mechanism; it does not guarantee every deadline.

## Quiz (4 minutes)

1. Who causes H to wait directly?
   - L, because L owns the lock
   - M, because M owns the lock
   - The queue

2. Why does M make the inversion worse?
   - M preempts L, delaying unlock
   - M gives H the lock
   - M raises L automatically

3. What does priority inheritance do?
   - Permanently raises every thread
   - Temporarily boosts the lock owner
   - Removes all locks

4. Where could a high-priority control path in your platform wait on background work?
5. Which measurement would show a long lock-owner delay rather than CPU saturation?

<details><summary>Answer key — attempt first</summary>

1. L, because L owns the lock. H blocks on the lock held by L.

2. M preempts L, delaying unlock. Medium work delays the low-priority owner even though high-priority work waits.

3. Temporarily boosts the lock owner. The owner borrows the waiter’s priority until it can release the contested lock.

</details>

## Sources

- [Linux futex(2): priority-inheritance futexes](https://man7.org/linux/man-pages/man2/futex.2.html) — Linux man-pages 6.16, September 9, 2026; checked 2026-10-19.
- [Linux RT-mutex implementation design](https://docs.kernel.org/locking/rt-mutex-design.html) — Linux kernel documentation; checked 2026-10-19.
- [Linux lock types and priority inheritance limits](https://docs.kernel.org/locking/locktypes.html) — Linux kernel documentation; checked 2026-10-19.
