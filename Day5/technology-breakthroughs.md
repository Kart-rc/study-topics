# Repeat-After-Me: visual injection reaches the tool boundary

Technology breakthroughs · Day5 · 15 minutes

Trace a multimodal prompt-injection path from untrusted pixels to a privileged tool and identify where the harness can break it.

## Recall (2 minutes)

<p><a href="../Day2/technology-breakthroughs.html">Day2: Retrieve-for-Train: optimize the set, then move work offline</a></p><p>With no novelty bonus, which three documents does the model select?</p><details><summary>Recall first, then reveal the refresher</summary><p>freshness-A, freshness-B, volume. Independent relevance ranking takes .95, .92 and .84, using two slots on freshness.</p></details><p><a href="../Day4/technology-breakthroughs.html">Day4: MaD-RL: optimize the output distribution, not only the best-looking sample</a></p><p>A per-sample optimizer always favors the slightly highest-reward mode. What population failure can follow?</p><details><summary>Recall first, then reveal the refresher</summary><p>Mode concentration. Maximizing individual rewards can push probability toward one mode even when the desired output population is broader.</p></details>

## Understand (4 minutes)

Multimodal agents turn images into context and model outputs into actions. That creates a transitive trust mistake: an image supplied as data can influence a model that is also authorized to emit exact tool calls. A visually embedded instruction is dangerous only when the rest of the path converts it into an accepted, privileged action.

Meta's September 7, 2026 paper introduces Repeat-After-Me, a black-box adaptive visual prompt-injection attack. The authors report that it can elicit long, format-compliant strings such as parseable native tool calls and demonstrate attacks across open-weight and commercial vision-language models. Those are research-author claims, not universal production rates.



Original defensive case: A support agent reads a customer screenshot. The screenshot influences the model to propose a file-write tool call unrelated to the user's request. If the harness treats model output as authorization and exposes a broad write tool, the pixels have crossed from untrusted data to durable control.

Break the chain at several independent gates: mark external content as untrusted, bind actions to the user's explicit goal, expose only task-scoped capabilities, validate structured arguments, require approval for sensitive writes, protect policy/config files, and run the tool in a sandbox with credential and network limits.

untrusted image → model interpretation → parseable tool call
→ authorization decision → side effect

A model-side refusal helps but is not a security boundary. Conversely, a single keyword filter is not a complete defense. The harness must assume the model can be influenced and enforce authority outside the model.



## Explore (5 minutes)

Run the path with every gate open. Then restrict capability and protect policy files. Explain which control prevents the action even if the model still emits a perfectly formatted call.

Open technology-breakthroughs.html for the executable model.

Model limits: A defensive Boolean attack-path tracer. It does not generate an injected image, optimize an attack, call a model or tool, estimate attack success, reproduce the paper's evaluation, or prove any defense sufficient. Gate labels are original teaching abstractions.

## Quiz (4 minutes)

1. Why is producing a parseable native tool call an important attack milestone?
   - The harness can convert model text into an executable action
   - It makes the image higher resolution
   - It proves the user authorized the action

2. Which control remains effective even if the model follows the injected instruction?
   - A task-scoped capability that cannot perform the requested write
   - A larger context window
   - A more fluent explanation

3. What is safe to conclude from the paper's reported attack success rates?
   - Every deployment has the same rate
   - The reported evaluation demonstrates a serious attack class, but each harness still needs its own threat model and tests
   - Visual input must always be disabled

4. Explain one design decision to a skeptical engineer.
5. Change one assumption. What breaks, and how would you detect it?

<details><summary>Answer key — attempt first</summary>

1. The harness can convert model text into an executable action. Exact format compliance can bridge model influence into a tool invocation; authorization is still separate.

2. A task-scoped capability that cannot perform the requested write. Authority enforced outside the model can deny a valid-looking but unauthorized call.

3. The reported evaluation demonstrates a serious attack class, but each harness still needs its own threat model and tests. Research results establish evidence, not a universal probability for every model, prompt, tool, and defense.

</details>

## Sources

- [Meta AI Research: Repeat-After-Me—Black-Box Adaptive Visual Prompt Injection](https://ai.meta.com/research/publications/repeat-after-me-black-box-adaptive-visual-prompt-injection/) — Published 2026-09-07; research claims from authors; checked 2026-09-25.
