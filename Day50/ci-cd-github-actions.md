# GITHUB_OUTPUT writes strings; fromJSON restores the type

CI/CD & GitHub Actions · Day50 · 15 minutes

Convert step-output text before using it as a boolean, number, object, or matrix.

## Recall (2 minutes)

<p><a href="../Day34/ci-cd-github-actions.html">Day34: A job must match every runner label</a></p><p>A job lists self-hosted, linux, x64, gpu. Which runner is eligible?</p><details><summary>Recall first, then reveal the refresher</summary><p>One matching all four labels. Array labels are combined as an AND filter.</p></details><p><a href="../Day22/ci-cd-github-actions.html">Day22: Build once, promote the same digest</a></p><p>Staging tested digest aaa; production rebuilt digest bbb. What is missing?</p><details><summary>Recall first, then reveal the refresher</summary><p>Evidence for artifact bbb. The staging result applies to aaa, not a new object.</p></details>

## Understand (4 minutes)

A shipping label that says 10 is text until a system parses it as a number.

GitHub step outputs are strings. Expressions can coerce some values, but explicit fromJSON() makes the intended type visible and supports objects, arrays, booleans, and numbers. Invalid JSON should fail rather than quietly become policy.



A planning step writes timeout=10 and experimental=false to GITHUB_OUTPUT. The consumer uses fromJSON for timeout-minutes and continue-on-error. The string false must not be treated as a nonempty truthy value by surrounding shell or application logic.



## Read the visual

The same raw characters cross an explicit parsing gate and emerge with a labeled boolean or integer type—or a visible failure.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use fromJSON when a job or step output represents a number, boolean, array, object, or dynamic matrix.

**Practical example.** A planner emits a JSON matrix and a numeric timeout for downstream test jobs.

**How to decide.** Keep plain strings as strings. Parse typed control data exactly once at the workflow boundary and validate the producer's JSON.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
raw_timeout='10'; raw_continue='false'
import json; timeout=json.loads(raw_timeout); continue_on_error=json.loads(raw_continue)
types={'timeout':type(timeout).__name__,'continue':type(continue_on_error).__name__}
result={'timeout_minutes':timeout,'continue_on_error':continue_on_error,'types':types}
```

1. Receive text values like step outputs.

   Changed values: `{"raw_timeout": "10", "raw_continue": "false"}`

2. Parse legal JSON into a number and boolean.

   Changed values: `{"timeout": 10, "continue_on_error": false}`

3. Observe the restored types.

   Changed values: `{"types": {"timeout": "int", "continue": "bool"}}`

4. Use typed values at the policy boundary.

   Changed values: `{"result": {"timeout_minutes": 10, "continue_on_error": false, "types": {"timeout": "int", "continue": "bool"}}}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser uses JavaScript JSON.parse, which illustrates JSON typing but is not GitHub's full expression evaluator. It omits YAML parsing, loose equality, NaN rules, secrets, output limits, multiline values, and runner execution.

## Explore (remaining exploration time)

Toggle raw values and parsing. Predict the resulting type and gate decision.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser uses JavaScript JSON.parse, which illustrates JSON typing but is not GitHub's full expression evaluator. It omits YAML parsing, loose equality, NaN rules, secrets, output limits, multiline values, and runner execution.

## Quiz (4 minutes)

1. A step output contains false. What type is it before fromJSON?
   - String
   - Boolean
   - Null

2. Why parse explicitly?
   - To make typed policy inputs unambiguous
   - To encrypt the output
   - To increase the output limit

3. What should invalid JSON do?
   - Fail the typed boundary and expose the producer defect
   - Become true
   - Become an empty matrix silently

4. Which workflow output currently carries typed control data as text?
5. What producer-side schema would prevent malformed JSON from reaching deployment policy?

<details><summary>Answer key — attempt first</summary>

1. String. Step output values are strings.

2. To make typed policy inputs unambiguous. fromJSON restores the intended JSON type.

3. Fail the typed boundary and expose the producer defect. Silent fallback can invert policy.

</details>

## Sources

- [GitHub Actions expressions: fromJSON](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#fromjson) — Official GitHub documentation; checked November 10, 2026; checked 2026-11-10.
- [GitHub Actions contexts: step outputs](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#steps-context) — Official GitHub documentation; step output values are strings; checked 2026-11-10.
