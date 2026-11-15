# Share the live table by reference—but assume readers can still make a copy

Data engineering · Day54 · 30 minutes

Separate revocable access to a provider-owned table from any downstream copy a recipient creates after reading it.

Budget: 6 minutes concept/recall, 9 Databricks, 9 Snowflake, 6 comparison/quiz.

## Recall (2 minutes)

<p><a href="../Day36/data-engineering.html">Day36: Consolidation case: land, evolve, govern, publish changes, and clone one orders feed</a></p><p>The new column is approved, but the S3 role can read every company bucket. Publish?</p><details><summary>Recall first, then reveal the refresher</summary><p>No; fix the identity/path scope first. Identity and schema are independent controls.</p></details><p><a href="../Day8/data-engineering.html">Day8: Spark changelog checkpoints: persist the delta, snapshot in the background</a></p><p>A 300 GB state store changes 100 MB per trigger, while compaction produces 900 MB of new SST files. What should you predict?</p><details><summary>Recall first, then reveal the refresher</summary><p>Changelog checkpointing can reduce foreground durable bytes. The benefit comes from persisting the small change instead of the larger set of changed physical files.</p></details>

## Understand (4 minutes)

A library can revoke your card and stop future borrowing. It cannot make the notes you already wrote disappear.

Governed sharing works the same way. The provider exposes a read-only object without first sending a second managed copy. The recipient queries the provider-controlled data through a share. Revoking the grant stops future reads through that path. It does not erase data the recipient was legitimately allowed to export or copy earlier.



The provider shares order o54 with status review. Auditor A sees the live value. A also writes a local snapshot. The provider changes the source to approved; the live share now shows approved, while the snapshot still says review. Revocation closes the live path, not the snapshot.



## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use governed sharing when another organization or account needs current, read-only access without a scheduled export pipeline.

**Practical example.** A regulated data platform exposes a filtered orders view to an external auditor and must be able to revoke future access quickly.

**How to decide.** Share the minimum object or filtered view, bind access to a named recipient, monitor use, and agree contractually on downstream retention. Use a copied export only when isolation, offline processing, or a fixed historical handoff is the actual requirement.

<details><summary>Optional: original concept code replay and lab</summary>

## Read the visual

One provider row fans into a revocable live path and an independent snapshot, so the boundary of revocation remains visible.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
provider={'o54':'review'}; grant=True; recipient_snapshot={}
recipient_snapshot['o54']=provider['o54']
provider['o54']='approved'; live_value=provider['o54'] if grant else None
grant=False; result={'live_after_revoke':provider['o54'] if grant else 'denied','snapshot_after_revoke':recipient_snapshot['o54']}
```

1. Create the provider row, live grant, and empty recipient storage.

   Changed values: `{"provider": {"o54": "review"}, "grant": true, "recipient_snapshot": {}}`

2. Copy the value while access is authorized.

   Changed values: `{"recipient_snapshot": {"o54": "review"}}`

3. Update the provider; the reference path sees the new value.

   Changed values: `{"provider": {"o54": "approved"}, "live_value": "approved"}`

4. Revoke future reads and inspect the independent snapshot.

   Changed values: `{"grant": false, "result": {"live_after_revoke": "denied", "snapshot_after_revoke": "review"}}`

[Full runnable example](examples/data-engineering.py).

Limits: The local Python and JavaScript worlds model one row, one grant, and one recipient copy. They do not run OpenSharing/Delta Sharing, Snowflake Secure Data Sharing, cloud identity, network controls, dynamic views, clean rooms, listings, billing, audit logs, cross-region replication, legal controls, or data deletion workflows.

## Explore (remaining exploration time)

Toggle access and the recipient snapshot. Predict which value remains visible after the provider updates and then revokes the share.

Open data-engineering.html for the executable model.

Model limits: The local Python and JavaScript worlds model one row, one grant, and one recipient copy. They do not run OpenSharing/Delta Sharing, Snowflake Secure Data Sharing, cloud identity, network controls, dynamic views, clean rooms, listings, billing, audit logs, cross-region replication, legal controls, or data deletion workflows.


</details>

## Product recall

Use the first minute of each nine-minute product block.

<p>Product recall from <a href="../Day18/data-engineering.html">Day18</a>; product material added 2026-10-08.</p><p>Databricks: SELECT and USE CATALOG exist, but USE SCHEMA is absent. What repairs the modeled read?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Grant USE SCHEMA on study18.sales to orders_readers. The schema gate is missing. Compute size and an unrelated table grant do not supply it. Other effective grants are intentionally excluded in this fixture.</p></details><p>Snowflake: the active role has table and container grants but lacks warehouse USAGE. What is the narrow repair?</p><details><summary>Recall first, then reveal the product refresher</summary><p>Grant USAGE on study_wh to orders_reader. This fresh table query needs usable compute. Warehouse USAGE supplies the missing permission; admin access is unnecessarily broad and retention is unrelated.</p></details>

## Databricks: OpenSharing grants read-only access to named recipients · 9 minutes

Recall Day18's provider/consumer boundary. OpenSharing uses a Unity Catalog share and named recipient; shared assets are read-only and provider grants are revocable. A recipient-controlled copy is outside that live path. SQL not executed in Databricks.

## Snowflake: an imported database is a read-only view through the share · 9 minutes

Recall Day18's provider/consumer boundary. Secure Data Sharing exposes a read-only imported database without copying shared storage. Removing the consumer invalidates that path; a separately materialized table remains consumer-owned. SQL not executed in Snowflake.

## Compare and predict (2 minutes)

Both products provide revocable, read-only sharing paths without a scheduled export copy. Their objects, identity models, SQL, and cross-platform options differ. Neither can erase a recipient-owned copy made during authorized access.

A Databricks recipient loses SELECT on audit_share after copying o54. What is accurate?

- The live share is denied; the copied row needs separate recipient-side governance
- The copy is remotely erased
- The provider table is deleted

<details><summary>Reveal after predicting</summary>

The live share is denied; the copied row needs separate recipient-side governance. Share revocation closes the governed path, not storage the recipient independently created.

</details>

A Snowflake provider removes the consumer account from audit_s. What happens to the imported database?

- It becomes invalid for queries; recreating access requires a new imported database
- It becomes writable
- It moves into provider storage

<details><summary>Reveal after predicting</summary>

It becomes invalid for queries; recreating access requires a new imported database. Provider removal invalidates the imported database immediately; a later re-add does not restore the old imported database.

</details>

## Certification connection

Unity Catalog OpenSharing objects, recipients, read-only assets, revocation, filtered exposure, and downstream-copy boundary. Secure Data Sharing, imported read-only databases, provider/consumer grants, revocation, and downstream-copy boundary. Planning groups only; full COF-C03 IDs and weights remain unverified. [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: not_run; browser models are local JavaScript and recorded example is local Python.

- [Databricks: What is OpenSharing?](https://docs.databricks.com/aws/en/opensharing) — Official Databricks documentation; checked November 14, 2026; checked 2026-11-14.
- [Databricks: Create shares for OpenSharing](https://docs.databricks.com/aws/en/opensharing/create-share) — Official Databricks documentation; checked November 14, 2026; checked 2026-11-14.
- [Snowflake: About Secure Data Sharing](https://docs.snowflake.com/en/user-guide/data-sharing-intro) — Official Snowflake documentation; checked November 14, 2026; checked 2026-11-14.
- [Snowflake: Create and configure shares](https://docs.snowflake.com/en/user-guide/data-sharing-provider) — Official Snowflake documentation; checked November 14, 2026; checked 2026-11-14.
- [Databricks Data Engineer Associate exam guide](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) — Official May 4, 2026 guide; last weekly check November 11, 2026; checked 2026-11-14.
- [SnowPro Core COF-C03 overview](https://learn.snowflake.com/en/certifications/snowpro-core-c03/) — Official overview; last weekly check November 11, 2026; full study-guide objective IDs and weights remain unverified; checked 2026-11-14.

## Quiz (4 minutes)

1. The provider revokes o54 after the auditor copied it. What changes?
   - Future shared queries fail; the auditor's earlier snapshot does not vanish automatically
   - Every downstream byte is remotely erased
   - The provider table is dropped

2. Why choose reference-style sharing over a nightly export?
   - Recipients can read current provider-governed data without another scheduled managed copy
   - It prevents all screenshots and copies
   - It removes recipient identity

3. When is a fixed copy the clearer design?
   - When the consumer needs an immutable historical handoff or offline isolation
   - Whenever revocation matters
   - Whenever the provider updates often

4. Which shared dataset needs an explicit downstream-retention agreement even though its live grant is revocable?
5. What evidence would prove a revocation stopped future reads without claiming that prior copies were erased?

<details><summary>Answer key — attempt first</summary>

1. Future shared queries fail; the auditor's earlier snapshot does not vanish automatically. A provider controls the share path, not arbitrary downstream storage created during authorized access.

2. Recipients can read current provider-governed data without another scheduled managed copy. The core benefit is a current, provider-controlled access path, not perfect control after disclosure.

3. When the consumer needs an immutable historical handoff or offline isolation. A copy is appropriate when immutability or isolation is the requirement and its retention is governed explicitly.

</details>

## Sources

- [Databricks: What is OpenSharing?](https://docs.databricks.com/aws/en/opensharing) — Official Databricks documentation; checked November 14, 2026; checked 2026-11-14.
- [Databricks: Create shares for OpenSharing](https://docs.databricks.com/aws/en/opensharing/create-share) — Official Databricks documentation; checked November 14, 2026; checked 2026-11-14.
- [Snowflake: About Secure Data Sharing](https://docs.snowflake.com/en/user-guide/data-sharing-intro) — Official Snowflake documentation; checked November 14, 2026; checked 2026-11-14.
- [Snowflake: Create and configure shares](https://docs.snowflake.com/en/user-guide/data-sharing-provider) — Official Snowflake documentation; checked November 14, 2026; checked 2026-11-14.
