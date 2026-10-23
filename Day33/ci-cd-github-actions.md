# Do not paste a pull-request title into a shell script

CI/CD & GitHub Actions · Day33 · 15 minutes

Keep untrusted GitHub context out of generated runner code.

## Recall (2 minutes)

<p><a href="../Day20/ci-cd-github-actions.html">Day20: A tag can move; a full commit SHA cannot</a></p><p>v1 moves aaa→bbb. @v1 does what?</p><details><summary>Recall first, then reveal the refresher</summary><p>Can run bbb without workflow diff. Ref resolves at run time.</p></details><p><a href="../Day24/ci-cd-github-actions.html">Day24: A merge queue needs tests for the merge group</a></p><p>Which event makes Actions run for a GitHub merge queue candidate?</p><details><summary>Recall first, then reveal the refresher</summary><p>merge_group. The merge_group event targets the temporary queued candidate.</p></details>

## Understand (4 minutes)

A shipping label is data. If a warehouse robot reads the label as a program, an attacker can print “open every door” on the box.

GitHub expressions inside run: are expanded before the temporary shell script executes. A malicious title can therefore become shell syntax. Pass the value through an environment variable and quote it, or use an action that treats the input as data.



The title a"; echo PWNED; # is substituted into title="...". It closes the quote and adds a command. With env: TITLE: ${{ ... }}, the generated script contains "$TITLE"; the title arrives as one environment value.



## Read the visual

The visual shows the runner's generated script, because the security boundary is code generation—not a generic shield icon.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use this control whenever workflow scripts consume attacker-influenced titles, bodies, branch names, labels, commit messages, or email fields.

**Practical example.** A required PR-title check runs with repository permissions and must evaluate fork-authored titles safely.

**How to decide.** Prefer a maintained action for complex parsing. For inline shell, put the expression in an intermediate environment variable, quote expansions, grant minimum permissions, and test hostile values. Avoid privileged workflows for untrusted code.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
title = 'a\"; echo PWNED; #'
direct_script = 'title=\"' + title + '\"'
safe_script = 'if [[ \"$TITLE\" =~ ^feat: ]]'
script_contains_payload = 'PWNED' in direct_script and 'PWNED' not in safe_script
```

1. Use a harmless string representation of hostile input; do not execute it.

   Changed values: `{"title": "a\"; echo PWNED; #"}`

2. Direct templating lets input alter the script text.

   Changed values: `{"direct_script": "title=\"a\"; echo PWNED; #\""}`

3. The fixed script references a quoted environment variable.

   Changed values: `{"safe_script": "if [[ \"$TITLE\" =~ ^feat: ]]"}`

4. Only the directly generated script contains attacker text.

   Changed values: `{"script_contains_payload": true}`

[Full runnable example](examples/ci-cd-github-actions.py).

Limits: The browser never launches a shell and intentionally does not execute the payload. It only renders two strings. Shells, quoting rules, operating systems, action implementations, permissions, events, and runner isolation need separate validation.

## Explore (remaining exploration time)

Switch between direct expression substitution and an environment binding. Inspect the exact temporary script shape before it would run.

Open ci-cd-github-actions.html for the executable model.

Model limits: The browser never launches a shell and intentionally does not execute the payload. It only renders two strings. Shells, quoting rules, operating systems, action implementations, permissions, events, and runner isolation need separate validation.

## Quiz (4 minutes)

1. Why is ${{ github.event.pull_request.title }} dangerous inside run:?
   - GitHub substitutes it into generated shell code
   - Titles are always secret
   - Expressions disable runners

2. What does an intermediate environment variable improve?
   - The generated script no longer contains the title text
   - It grants more permissions
   - It validates every title automatically

3. What is still required after using env:?
   - Correct shell quoting and least privilege
   - Running arbitrary fork code as admin
   - Removing all tests

4. Which untrusted GitHub context values enter your workflows today?
5. How would you test hostile titles across Bash, PowerShell, and called actions?

<details><summary>Answer key — attempt first</summary>

1. GitHub substitutes it into generated shell code. Attacker-controlled text can change the script's grammar.

2. The generated script no longer contains the title text. The value reaches the shell as data rather than template-generated code.

3. Correct shell quoting and least privilege. Environment binding prevents this substitution path, not every command-injection or privilege risk.

</details>

## Sources

- [GitHub Docs: script injections](https://docs.github.com/en/actions/concepts/security/script-injections) — Living documentation; checked October 23, 2026; checked 2026-10-23.
- [GitHub Actions secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) — Living documentation; checked 2026-10-23.
