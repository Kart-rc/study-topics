# OpenAPI oneOf means exactly one schema

APIs & Microservices · Day28 · 15 minutes

Model mutually exclusive payload shapes without accidentally accepting a payload that matches both.

## Recall (2 minutes)

<p><a href="../Day23/apis-microservices.html">Day23: Deprecated is a warning; Sunset is the shutdown date</a></p><p>What does Deprecation communicate?</p><details><summary>Recall first, then reveal the refresher</summary><p>The resource is discouraged now or from a stated time. Deprecation and shutdown time are separate signals.</p></details><p><a href="../Day11/apis-microservices.html">Day11: Write the order form down: an OpenAPI request contract</a></p><p>A body contains only sku: MUG. Both required settings are present. What fails?</p><details><summary>Recall first, then reveal the refresher</summary><p>The required quantity field check. The body exists, so its presence check passes. The object lacks quantity. A properties declaration neither requires a field nor inserts a default.</p></details>

## Understand (4 minutes)

At a checkout, “choose exactly one payment method” means card or bank transfer—not neither, and not both. In OpenAPI Schema, oneOf requires exactly one listed schema to validate. anyOf requires at least one, so a payload matching both may still pass.

The branches themselves must be mutually distinguishable. Require a method-specific field or use a type tag with a const.



A payment object with cardNumber matches Card; one with iban matches Bank. A payload containing both fields can match both loose schemas. oneOf correctly rejects it; anyOf would accept it. A discriminator may help tooling choose a branch, but OpenAPI 3.2.1 says it does not change the validation result.



## Read the visual

Two overlapping circles make the dangerous case tangible: the intersection is valid for anyOf but invalid for oneOf. The result table separates those semantics.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use oneOf when an API value must conform to one and only one variant, such as payment method or event body.

**Practical example.** POST /payments accepts either a card payment or a bank transfer, but never a hybrid payload.

**How to decide.** Choose oneOf for exclusivity, anyOf for legitimate overlap, and allOf for combined constraints. Test zero-match and multi-match examples in contract tests.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
payload={'cardNumber':'4111','iban':None}
matches=[payload.get('cardNumber') is not None,payload.get('iban') is not None]
match_count=sum(matches)
one_of_valid=match_count==1
any_of_valid=match_count>=1
```

1. Start with one present variant field.

   Changed values: `{"payload": {"cardNumber": "4111", "iban": null}}`

2. Validate each branch independently.

   Changed values: `{"matches": [true, false]}`

3. Count successful branches.

   Changed values: `{"match_count": 1}`

4. Apply exact-one versus at-least-one semantics.

   Changed values: `{"one_of_valid": true, "any_of_valid": true}`

[Full runnable example](examples/apis-microservices.py).

Limits: This local checker models only presence of two fields. Real JSON Schema validation includes types, required fields, additionalProperties, references, dialect/tool support, and annotations. Generated clients may represent unions differently; test your actual validator and generator.

## Explore (remaining exploration time)

Toggle cardNumber and IBAN. The overlap picture and oneOf/anyOf results update separately.

Open apis-microservices.html for the executable model.

Model limits: This local checker models only presence of two fields. Real JSON Schema validation includes types, required fields, additionalProperties, references, dialect/tool support, and annotations. Generated clients may represent unions differently; test your actual validator and generator.

## Quiz (4 minutes)

1. A payload matches both branches. Does oneOf accept it?
   - Yes
   - No
   - Only with a discriminator

2. What does anyOf require?
   - Exactly one match
   - At least one match
   - Every schema

3. Can a discriminator make an otherwise invalid oneOf valid?
   - Yes
   - No; it is a hint and does not change validation
   - Only for JSON

4. Where does your API need exclusive variants rather than overlapping schemas?
5. Which ambiguous example should be added to your contract test suite?

<details><summary>Answer key — attempt first</summary>

1. No. oneOf requires exactly one valid branch.

2. At least one match. Overlap is allowed under anyOf.

3. No; it is a hint and does not change validation. OpenAPI 3.2.1 explicitly separates the hint from validation.

</details>

## Sources

- [OpenAPI Specification 3.2.1: schema composition](https://spec.openapis.org/oas/latest.html#schema-composition) — Version 3.2.1; checked 2026-10-18.
- [JSON Schema 2020-12 validation](https://json-schema.org/draft/2020-12/json-schema-validation) — Draft 2020-12; checked 2026-10-18.
- [OpenAPI Specification 3.2.1: discriminator](https://spec.openapis.org/oas/latest.html#discriminator-object) — Version 3.2.1; checked 2026-10-18.
