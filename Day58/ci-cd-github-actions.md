# workflow_dispatch keeps booleans typed in inputs—github.event.inputs turns them into strings

CI/CD & GitHub Actions · Day58 · 15 minutes

Read manual-workflow inputs from the typed inputs context so false does not accidentally behave like a non-empty string.

## Recall (2 minutes)

<p><a href="../Day38/ci-cd-github-actions.html">Day38: Separate queue time from run time before buying faster runners</a></p><p>Queue is 9 minutes and execution is 2. Best first hypothesis?</p><details><summary>Recall first, then reveal the refresher</summary><p>Runner capacity, labels or scheduling pressure. Most latency occurs before execution.</p></details><p><a href="../Day26/ci-cd-github-actions.html">Day26: Give every matrix job its own artifact name</a></p><p>Why is one name unsafe across v4 matrix uploads?</p><details><summary>Recall first, then reveal the refresher</summary><p>Artifacts are immutable and parallel jobs collide. Each job should create its own artifact.</p></details>

## Understand (4 minutes)

A form checkbox and the word “false” look related, but one is a Boolean value and the other is five characters of text.

A workflow_dispatch input can declare type: boolean. GitHub exposes it in two places. The inputs context preserves the Boolean. The github.event.inputs context converts it to a string. A condition should use inputs.print_tags; treating a non-empty string as truthy can send the workflow down the wrong branch in scripts or transformations.



An operator leaves deploy_prod=false. The typed expression if: ${{ inputs.deploy_prod }} skips production. A script that receives the literal text "false" and checks only whether it is non-empty may deploy.



## Read the visual

The same unchecked box splits into a Boolean-false path and a string-false path, exposing where a naive truthiness check changes the outcome.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use typed workflow_dispatch inputs for deliberate manual operations with Boolean, choice, number, environment, or string parameters.

**Practical example.** A data-platform release workflow lets an operator choose an environment and explicitly enable a production deployment.

**How to decide.** Keep control-flow decisions in typed Actions expressions where possible. If a value crosses into shell, JSON, or another tool, parse and validate it explicitly rather than relying on string truthiness.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
typed_input=False; event_input='false'
typed_runs=typed_input
naive_script_runs=bool(event_input)
result={'typed_runs':typed_runs,'naive_string_runs':naive_script_runs,'fix':'use typed inputs or explicit parsing'}
```

1. Represent the same operator choice in two contexts.

   Changed values: `{"typed_input": false, "event_input": "false"}`

2. The typed Boolean correctly skips the job.

   Changed values: `{"typed_runs": false}`

3. A non-empty-string check incorrectly treats 'false' as true.

   Changed values: `{"naive_script_runs": true}`

4. Make the type boundary and fix explicit.

   Changed values: `{"result": {"typed_runs": false, "naive_string_runs": true, "fix": "use typed inputs or explicit parsing"}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The model compares Boolean false with the string 'false'. It does not execute Actions expressions, cover API dispatch payload validation, environment approvals, reusable-workflow inputs, shell quoting, secrets, branch restrictions, or malicious inputs.

## Explore (remaining exploration time)

Switch the context used for a false input and predict whether the deployment job runs.

Open ci-cd-github-actions.html for the executable model.

Model limits: The model compares Boolean false with the string 'false'. It does not execute Actions expressions, cover API dispatch payload validation, environment approvals, reusable-workflow inputs, shell quoting, secrets, branch restrictions, or malicious inputs.

## Quiz (4 minutes)

1. deploy_prod is an unchecked Boolean workflow_dispatch input. Which expression preserves its type?
   - inputs.deploy_prod
   - github.event.inputs.deploy_prod parsed as any non-empty string
   - github.sha

2. Why can the string 'false' be dangerous in a script?
   - A non-empty-string check can treat it as true
   - GitHub encrypts it
   - It becomes a number automatically

3. What still protects production beyond a typed flag?
   - Environment approvals, permissions, reviewed workflow logic, and deployment controls
   - The input description alone
   - A longer variable name

4. Which manual workflow inputs currently cross from Actions expressions into shell strings?
5. Which production control must remain independent of the operator's Boolean input?

<details><summary>Answer key — attempt first</summary>

1. inputs.deploy_prod. The inputs context keeps Boolean values as Booleans.

2. A non-empty-string check can treat it as true. String truthiness is not Boolean semantics.

3. Environment approvals, permissions, reviewed workflow logic, and deployment controls. Typed input is one control, not authorization.

</details>

## Sources

- [GitHub Actions workflow syntax: workflow_dispatch inputs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onworkflow_dispatchinputs) — Official GitHub documentation; checked November 18, 2026; checked 2026-11-18.
- [GitHub Actions contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#inputs-context) — Official GitHub documentation; checked November 18, 2026; checked 2026-11-18.
