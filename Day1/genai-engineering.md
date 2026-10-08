# An agent handoff that survives a reset

GenAI engineering · Day1 · 15 minutes

An agent writes five pages, then loses its conversation context.

## Recall (2 minutes)

<p>No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.</p>

## Understand (4 minutes)

An agent writes five pages, then loses its conversation context. A note saying “done” could cause the next session to skip tests that never ran.

The harness is the code around the model that runs tools and records progress. Store a small handoff outside temporary conversation memory: what exists, what was checked, and what remains. A file being written and a file being verified are different states.

Watch the visual: What survives when the conversation disappears?



The record below survives the loss of the temporary session variable. Recovery sees five written files but no successful checks, so its next action is verification. Only observed checks justify marking the work verified.



## Read the visual

Temporary working memory and the durable record are drawn on opposite sides of a persistence boundary. Writing advances planned to written. Verification adds evidence and advances written to verified. A new session clears conversational context but reads the same durable status and evidence.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use a durable handoff when an agent’s work spans sessions, may be interrupted, or includes writes whose results must be checked before continuing. Keep the record with the artifacts it describes.

**Practical example.** An agent generates five study pages, then stops before testing them. Its saved record says which files exist, their version, and that checks remain pending. A fresh session reads that record, inspects the files, and performs the missing checks instead of generating another bundle.

**How to decide.** Record observed evidence and the next unresolved action. For a short, read-only question, this structure may be unnecessary. After an uncertain remote write, inspect the destination; a local progress note cannot prove what actually happened.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
durable = {"files": 5, "status": "written", "checks": []}
session = {"last_thought": "test next"}
session = {}
next_action = "verify" if durable["status"] == "written" else "inspect"
durable["checks"] = ["synthetic check passed"]; durable["status"] = "verified"
```

1. The handoff says what exists, without claiming success.

   Changed values: `{"durable": {"files": 5, "status": "written", "checks": []}}`

2. Conversation memory has a useful but temporary thought.

   Changed values: `{"session": {"last_thought": "test next"}}`

3. A reset loses temporary memory.

   Changed values: `{"session": {}}`

4. Recovery reads the durable record and chooses verification.

   Changed values: `{"next_action": "verify"}`

5. In this toy, an explicitly supplied passing result permits the transition.

   Changed values: `{"durable": {"files": 5, "status": "verified", "checks": ["synthetic check passed"]}}`

[Full runnable example](examples/genai-engineering.py).

Limits: The dictionary represents external durable storage; it is not durable by itself. Real recovery must inspect actual artifacts and checks. The synthetic passing result is input to this example, not evidence that any real page passed.

<details><summary>Optional deeper explanation and original worked example</summary>

<p>A language model’s active context is temporary. A harness is the surrounding execution system: it provides tools, selects work, records state, and decides how to continue. Anthropic describes an initial setup phase followed by sessions that make bounded progress, inspect previous artifacts, and leave a clean handoff. Its experiment highlights premature completion and insufficient end-to-end checking as recurring failure modes. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Read the original engineering report</a>.</p><p>For your own design, treat the handoff as a small operational record. It should let another session determine what is verified, what is uncertain, and which action is safe next. A confident paragraph is weaker than a result tied to an exact artifact and check.</p><h3>Original detailed example</h3><p><strong>Original teaching case:</strong> An agent is generating these study pages. It writes five HTML files, then loses its context before checking the buttons. A note saying “Day complete” creates a false starting point for the next session. A useful record instead says “files written; browser validation pending; generation number 1; repository head X.”</p><p>Use an explicit progression: planned → written → verified. The transition to verified requires observed checks. Commit the lesson files and their manifest together, so readers do not see a manifest referring to absent pages. Before a retry, inspect the repository for the same date and day number; reuse or repair it rather than allocating another day blindly.</p><p>This does not make all side effects exactly once. A crash after a remote write but before a local acknowledgment leaves uncertainty. Recovery needs to inspect authoritative remote state. A repository commit identifier, request identity, and non-forced update help resolve that ambiguity.</p><p>Design question: what is the smallest record that makes recovery deterministic? For this case: destination, generation key, file list, verified checks, source references, and the next unresolved action.</p>

</details>

## Explore (remaining exploration time)

Write an artifact, reset the session, and inspect whether it is considered verified. Repeat after verification. Explain why the durable state must not simply copy whatever the model says. Name a remote action whose outcome you would inspect before retrying.

Open genai-engineering.html for the executable model.

Model limits: This is an executable in-memory state machine. “New session” clears only working memory while retaining the simulated durable record; reloading the whole page resets the model. Verification is simulated, not a real code test or an LLM call.

## Quiz (4 minutes)

1. Session stops after files are written, before checks. Next step?
   - Assume complete
   - Inspect artifacts and run missing checks
   - Allocate a duplicate day

2. Why tie evidence to a commit or artifact version?
   - A passing check of old content does not validate changed content
   - To make notes longer
   - To eliminate all failures

3. Remote write succeeded but acknowledgment was lost. Retry immediately?
   - Always
   - Delete remote content
   - Inspect remote state using the operation identity first

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. Inspect artifacts and run missing checks. Written and verified are separate states. Recovery should resolve the missing evidence.

2. A passing check of old content does not validate changed content. Evidence only establishes something about the artifact that was checked.

3. Inspect remote state using the operation identity first. The outcome is uncertain. Inspect authoritative state to avoid repeating a completed action.

</details>

## Sources

- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — 2025-11-26; checked 2026-09-21.
