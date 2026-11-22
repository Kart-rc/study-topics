# A strategy principle should decide a repeated choice—not decorate a slide

Distinguished Engineer · Day62 · 15 minutes

Write a technology principle as a usable default, an evidence test, and an explicit exception path.

## Recall (2 minutes)

<p><a href="../Day38/distinguished-engineer.html">Day38: A risk acceptance needs an owner, a trigger, and an expiry</a></p><p>R-42 is only 20 days old, but the service becomes public. What happens?</p><details><summary>Recall first, then reveal the refresher</summary><p>Reassess immediately because the evidence trigger changed. Expiry is the latest review, not protection from material change.</p></details><p><a href="../Day40/distinguished-engineer.html">Day40: When overloaded, finish valuable work before starting expendable work</a></p><p>Capacity is 100; checkout demand is 80 and crawler demand is 50. Priority admission completes what?</p><details><summary>Recall first, then reveal the refresher</summary><p>80 checkout and 20 crawler units. Finish the higher-priority 80, then use the remaining 20.</p></details>

## Understand (4 minutes)

A road sign that says “be thoughtful” sounds friendly but does not tell two drivers who goes first. “Yield to traffic already in the circle” resolves the repeated choice.

An engineering principle works only when the same facts produce the same starting decision. State the default, the context where it applies, the evidence that permits an exception, and who revisits the exception. That makes the principle a sensible default: a strong starting point, not a claim that one answer is best everywhere.



Fourteen data services use the supported Java event client. A new team asks for a second client because it prefers Python. The principle says: “Use the supported event runtime when it meets the workload's latency, security, and integration needs. Trial an exception only when measured evidence shows a requirement the default cannot meet; name an owner and expiry.” Preference alone selects the default. A measured missing capability opens a bounded exception.



## Read the visual

The same technology request flows through four evidence packets. A vague slogan stops without a decision; a named applicability test selects the default, opens a bounded trial, or forces an expired exception back to review.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a decision-producing principle when many teams repeatedly choose runtimes, data formats, observability libraries, deployment paths, or platform integrations.

**Practical example.** A data-platform organization wants deep expertise in one event-client stack without blocking a workload that proves the standard cannot meet a regulatory or latency requirement.

**How to decide.** Publish a default plus applicability test, exception evidence, owner, and review date. Use team judgment without a principle when the choice is rare, local, cheap to reverse, and creates no shared operating burden.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
case={'default_meets_needs':True,'measured_gap':None,'exception_requested':True}
decision='default' if case['default_meets_needs'] else 'bounded_exception'
record={'decision':decision,'default':'java_event_client','exception_owner':None}
result={**record,'principle_resolved_choice':decision=='default'}
```

1. Capture the facts, including that the request is preference rather than evidence of a gap.

   Changed values: `{"case": {"default_meets_needs": true, "measured_gap": null, "exception_requested": true}}`

2. Apply the principle's explicit applicability test.

   Changed values: `{"decision": "default"}`

3. Record the starting decision and avoid inventing an owner for an exception that was not granted.

   Changed values: `{"record": {"decision": "default", "default": "java_event_client", "exception_owner": null}}`

4. Show that the principle removed a repeated choice instead of creating another approval meeting.

   Changed values: `{"result": {"decision": "default", "default": "java_event_client", "exception_owner": null, "principle_resolved_choice": true}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is an original local decision model, not Spotify's or Thoughtworks' governance process. It reduces technical fit to one Boolean and omits migration cost, security review, regulatory interpretation, skills, ecosystem maturity, commercial terms, support load, and how teams challenge a bad default.

## Explore (remaining exploration time)

Switch among a vague slogan, an ordinary service, a measured capability gap, and an expired exception. Predict whether the strategy yields a decision or merely creates a meeting.

Open distinguished-engineer.html for the executable model.

Model limits: This is an original local decision model, not Spotify's or Thoughtworks' governance process. It reduces technical fit to one Boolean and omits migration cost, security review, regulatory interpretation, skills, ecosystem maturity, commercial terms, support load, and how teams challenge a bad default.

## Quiz (4 minutes)

1. The supported client meets the service's named needs, but the team prefers another language. What does the principle select?
   - The supported default
   - An automatic permanent exception
   - No decision until executives vote

2. What makes an exception compatible with the strategy?
   - A measured gap, bounded trial, owner, and review date
   - A popular library
   - An exception with no return path

3. When is this kind of principle unnecessary?
   - A rare local choice is cheap to reverse and creates no shared burden
   - Many teams repeatedly choose incompatible observability libraries
   - Each choice expands the on-call and security surface

4. Which repeated technology choice in your organization is currently governed by a slogan rather than a test?
5. Write its default, applicability evidence, exception trigger, owner, and review date in five lines.

<details><summary>Answer key — attempt first</summary>

1. The supported default. Preference alone does not disprove the applicability test.

2. A measured gap, bounded trial, owner, and review date. The exception tests an explicit limit without silently creating a second standard.

3. A rare local choice is cheap to reverse and creates no shared burden. Strategy should remove repeated coordination cost, not govern every small decision.

</details>

## Sources

- [Spotify Engineering: Coding Is No Longer the Constraint](https://www.engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint) — Official engineering case study; published June 2026; checked 2026-11-22.
- [Spotify Engineering: Introducing Spotify Technology](https://www.engineering.atspotify.com/2026/10/introducing-spotify-technology-proven-at-spotify-now-yours) — Official platform-strategy case study; published October 2026; checked 2026-11-22.
- [Thoughtworks: Better technology decision-making is underpinned by sensible defaults](https://www.thoughtworks.com/en-us/insights/blog/technology-strategy/better-tech-decision-making-underpinned-by-sensible-defaults) — Official technology-strategy article; published September 5, 2024; checked 2026-11-22.
