# A technology strategy needs a choice chain—not a project catalog

Distinguished Engineer · Day63 · 15 minutes

Turn a platform problem into one explicit choice, a stop-list, and a small set of actions that reinforce one another.

## Recall (2 minutes)

<p><a href="../Day12/distinguished-engineer.html">Day12: Keep serving with the last good map: control plane vs data plane</a></p><p>The control plane fails after cell-a was published. In the stable design, where does the next order go?</p><details><summary>Recall first, then reveal the refresher</summary><p>cell-a. The data plane keeps the last good snapshot and continues using the known route.</p></details><p><a href="../Day28/distinguished-engineer.html">Day28: Measure the journey, not the sign-ups</a></p><p>Which metric best represents platform activation?</p><details><summary>Recall first, then reveal the refresher</summary><p>Teams completing the valuable production journey. A platform earns value when users complete a useful outcome.</p></details>

## Understand (4 minutes)

A grocery list can contain bread, paint, and a train ticket. It tells you what to buy, but not what you are trying to accomplish. A project catalog has the same weakness: every item may be useful while the collection makes no strategic choice.

A usable technology strategy forms a choice chain. Start with a diagnosis of the important obstacle. Choose how the organization will respond. Name what will not be pursued now. Then fund actions that reinforce that choice. If a proposed project cannot be traced through that chain—or directly contradicts it—it belongs outside this strategy.



A data platform has five ingestion runtimes. Incident recovery varies from 20 minutes to 6 hours because each runtime uses different replay, ownership, and observability practices. The strategy is not “modernize ingestion.” The choice is: new regulated event streams use the managed event runtime; existing batch imports are not migrated this half. Coherent actions are a regulated-stream golden path, migration support for two high-risk services, common recovery evidence, and a stop on funding new custom schedulers.



## Read the visual

The strategy packet moves from obstacle to choice to an explicit not-now boundary and then to funded actions. The project catalog and diagnosis-only packets stop early; the contradictory packet turns red because one action expands the fragmentation the choice is meant to reduce.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a choice chain when several teams have more plausible platform work than capacity and need the same rule for funding, sequencing, and saying no.

**Practical example.** A senior data-platform group must reduce recovery risk without pretending it can replace every Spark job, Kafka client, scheduler, and warehouse loader at once.

**How to decide.** Write a diagnosis, choice, non-goals, and reinforcing actions when work spans teams and tradeoffs are durable. Use an ordinary prioritized backlog when the goal is already settled and the remaining work is local execution.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
packet={'diagnosis':'recovery varies 20m-6h across five runtimes','choice':'managed runtime for new regulated streams','non_goals':['batch migration this half']}
actions=['golden path','common recovery evidence','stop new custom schedulers']
supports_choice={'golden path':True,'common recovery evidence':True,'stop new custom schedulers':True}
result={'choice':packet['choice'],'deferred':packet['non_goals'],'coherent':all(supports_choice[a] for a in actions),'funded_actions':actions}
```

1. Write the obstacle, response, and explicit boundary before listing projects.

   Changed values: `{"packet": {"diagnosis": "recovery varies 20m-6h across five runtimes", "choice": "managed runtime for new regulated streams", "non_goals": ["batch migration this half"]}}`

2. Select actions that make the choice easier and prevent renewed fragmentation.

   Changed values: `{"actions": ["golden path", "common recovery evidence", "stop new custom schedulers"]}`

3. Test each action against the same choice rather than scoring projects independently.

   Changed values: `{"supports_choice": {"golden path": true, "common recovery evidence": true, "stop new custom schedulers": true}}`

4. Record one bounded choice chain whose actions all reinforce the response.

   Changed values: `{"result": {"choice": "managed runtime for new regulated streams", "deferred": ["batch migration this half"], "coherent": true, "funded_actions": ["golden path", "common recovery evidence", "stop new custom schedulers"]}}`

[Full runnable example](examples/distinguished-engineer.py).

Limits: This is an original local coherence model, not Spotify's, Thoughtworks' or GitLab's strategy process. It tests traceability between five short fields. It does not estimate economics, political feasibility, migration risk, regulatory interpretation, capability maturity, portfolio dependencies, or whether the diagnosis is true.

## Explore (remaining exploration time)

Switch among a project catalog, a diagnosis without a choice, a bounded choice, a coherent action set, and a contradictory investment. Predict where the chain stops and which proposal should be removed.

Open distinguished-engineer.html for the executable model.

Model limits: This is an original local coherence model, not Spotify's, Thoughtworks' or GitLab's strategy process. It tests traceability between five short fields. It does not estimate economics, political feasibility, migration risk, regulatory interpretation, capability maturity, portfolio dependencies, or whether the diagnosis is true.

## Quiz (4 minutes)

1. The platform lists six worthwhile modernization projects but never names the obstacle or tradeoff. What is missing?
   - A strategic choice chain
   - A seventh project
   - A longer milestone plan

2. Why does the example explicitly defer batch migration?
   - The non-goal protects capacity for the regulated-stream recovery choice
   - Batch systems can never be modernized
   - A non-goal permanently bans all later work

3. Which proposal contradicts the strategy?
   - Funding a sixth custom runtime
   - Adding common recovery evidence
   - Building a managed-runtime golden path

4. Take one current platform roadmap theme. What obstacle and organizational choice does it imply?
5. Name one attractive project to defer and one currently funded action that contradicts the choice.

<details><summary>Answer key — attempt first</summary>

1. A strategic choice chain. More projects do not explain which obstacle matters or what the organization will decline.

2. The non-goal protects capacity for the regulated-stream recovery choice. A time-bounded non-goal makes the current tradeoff visible; it is not a permanent technical claim.

3. Funding a sixth custom runtime. A new custom runtime expands the exact recovery variation the strategy chose to reduce.

</details>

## Sources

- [Martin Fowler: Creating an integrated business and technology strategy](https://martinfowler.com/articles/creating-integrated-tech-strategy.html) — Foundation; published August 24, 2023. Warns that a current-to-future-state exercise can become a wish list and says strategy is as much about what is left out as included.; checked 2026-11-23.
- [Thoughtworks: How to better connect strategy to implementation](https://www.thoughtworks.com/en-ca/insights/blog/technology-strategy/how-to-better-connect-strategy-to-implementation) — Practice guidance; published January 23, 2026. Describes the failure mode where the strategy document becomes the goal and recommends operationalizing recommendations into roadmaps.; checked 2026-11-23.
- [Spotify Engineering: AI Product Management at Spotify—A View From Three Angles](https://engineering.atspotify.com/2026/11/ai-product-management-at-spotify-a-view-from-three-angles) — Recent primary case; published November 9, 2026. Says a promising architecture is not a roadmap and describes starting with a concrete problem, a useful test, and evidence for the next step.; checked 2026-11-23.
