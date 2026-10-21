#!/usr/bin/env python3
"""Author Day31. Rendering, execution capture, and validation run separately."""
from pathlib import Path
import json

R = Path(__file__).resolve().parent
DAY = "Day31"
DATE = "2026-10-21"

STYLE = '''<style>
.world{background:#f1f7f4;color:#173934;border-radius:14px;padding:16px;margin:14px 0;overflow:hidden}.row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;align-items:center}.node{border:2px solid #73988b;border-radius:12px;padding:12px;background:#fbfdfb;overflow-wrap:anywhere}.ok{background:#dff3ce;border-color:#277761}.fail{background:#ffe1db;border-color:#a43d32}.wait{background:#fff0b7;border-color:#bb7917}.arrow{text-align:center;font-size:1.2rem;font-weight:850}.timeline{display:grid;grid-template-columns:repeat(5,minmax(105px,1fr));gap:7px;align-items:stretch}.tick{border:2px solid #78958b;border-radius:10px;padding:10px;background:#fbfdfb}.tick.active{background:#dff3ce;border-color:#26745d}.stripe{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.cell{border:2px solid #78958b;border-radius:10px;padding:12px;text-align:center;background:#fbfdfb}.plane{display:grid;grid-template-columns:minmax(170px,1fr) 54px minmax(170px,1fr);gap:8px;align-items:center}.trace-tree{display:grid;grid-template-columns:repeat(3,minmax(145px,1fr));gap:9px}.span{border:2px solid #668f82;border-radius:12px;padding:12px;background:#fbfdfb}.redacted{background:#e7e9e7;color:#43524d}.bins{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.bin{border:2px solid #76948a;border-radius:10px;padding:9px;text-align:center;background:#fbfdfb}.chain{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.artifact{border:2px solid #6f9287;border-radius:11px;padding:12px;min-width:150px}.tree{display:grid;grid-template-columns:repeat(3,minmax(140px,1fr));gap:9px}.field{border:2px solid #749389;border-radius:11px;padding:11px;background:#fbfdfb}.field.gone{opacity:.35;text-decoration:line-through}.status{font-weight:800;padding:10px;border-radius:9px}select,input{font:inherit;padding:7px;max-width:100%}table{width:100%;border-collapse:collapse}th,td{border:1px solid #b6c7bf;padding:8px;text-align:left;overflow-wrap:anywhere;word-break:break-word}pre{max-width:100%;overflow-x:auto}pre code span{display:block;padding:4px}@media(max-width:680px){.timeline,.plane,.trace-tree,.bins,.tree,.stripe{grid-template-columns:1fr}.chain{display:grid}table{display:block;overflow-x:auto;max-width:100%}}
</style>'''

def q(prompt, choices, answer, why):
    return [prompt, choices, answer, why]

def lesson(slug, track, title, goal, tag, concept, example, use_case, practice,
           boundary, sim, js, questions, steps, expect, sources, visual,
           written, language="python"):
    return {
        "slug": slug, "track": track, "title": title, "goal": goal,
        "tag": tag, "concept": concept, "example": example,
        "use_case": use_case, "practice": practice, "boundary": boundary,
        "sim": STYLE + sim, "js": js, "questions": questions,
        "walkthrough": {"language": language, "steps": steps,
                        "expect": expect, "limit": boundary},
        "sources": sources, "visual_explanation": visual,
        "written_questions": written, "source_checked_on": DATE,
    }

L = []

# Certification cycle 3, position 1: focused ingestion/transformation lesson.
data = lesson(
    "data-engineering", "Data engineering",
    "Read only what changed: Delta CDF and Snowflake Streams",
    "Move a durable change boundary forward without rereading the whole table.",
    "Certification focus · cycle 3, position 1",
    '''<p>Imagine a librarian who keeps a slip showing the last shelf update you processed. On the next visit, you read only the newer slips. Incremental change processing does the same thing for rows.</p><p>The important idea is not “CDC is fast.” It is a <strong>bounded interval</strong>: read changes after a known position, write the result safely, then advance the position. If the change history disappears before you read it, the shortcut is gone and you must recover from a snapshot or another durable source.</p>''',
    '''<p>Version 100 contains orders A and B. Version 101 updates A and inserts C. A downstream job whose last successful position is 100 reads only the update for A and the insert for C. It writes both idempotently, records 101, and stops. A retry from 100 may see the same two changes again, so the sink still needs a repeat-safe key or transaction.</p>''',
    {"when":"Use a change feed when a large table changes in small batches and downstream work can be expressed as inserts, updates, and deletes.","example":"A customer-360 table changes every minute, while a serving cache needs only the rows that changed since its last successful refresh.","decision":"Choose it when the source retains enough change history, consumers can keep independent progress, deletes matter, and the sink is repeat-safe. Prefer a full snapshot when the dataset is small or recovery simplicity matters more than incremental cost."},
    "Move the consumer position and retention window. Predict which rows are readable and when recovery must fall back to a snapshot.",
    "This is a local JavaScript interval model over five synthetic versions. It does not run Delta Lake or Snowflake, model schema evolution, prove exactly-once delivery, measure cost, or recover missing history. Vendor SQL below is sourced but unexecuted.",
    '''<div id="world"><label>Last successful version <input id="lastVersion" type="range" min="100" max="103" value="100"></label><label>Oldest retained version <input id="oldestVersion" type="range" min="100" max="103" value="100"></label><div id="changeWorld" class="world" aria-live="polite"></div></div>''',
    "const changes={101:['A UPDATE','C INSERT'],102:['B DELETE'],103:['D INSERT']};function paintChange(){const last=+lastVersion.value,oldest=+oldestVersion.value,missing=last<oldest-1,rows=[];for(let v=last+1;v<=103;v++)rows.push(...(changes[v]||[]));changeWorld.innerHTML='<div class=timeline>'+[99,100,101,102,103].map(v=>'<div class=\"tick '+(v>last?'active':'')+'\"><strong>v'+v+'</strong><br>'+(changes[v]?.join('<br>')||'snapshot')+'</div>').join('')+'</div><p class=\"status '+(missing?'fail':'ok')+'\">'+(missing?'Gap: required history is older than retention. Rebuild from a trusted snapshot.':'Readable interval: ('+last+', 103] → '+(rows.join(', ')||'no rows'))+'</p>';};lastVersion.oninput=paintChange;oldestVersion.oninput=paintChange;paintChange();",
    [
        q("A consumer last committed version 100 and version 101 contains an update and insert. What should it read?", ["Only changes after 100, including both operations", "Every historical row", "Only inserts"], 0, "The interval begins after the last successful position and preserves operation types."),
        q("What happens when required change history has already expired?", ["Recover from a trusted snapshot or other durable source", "Guess the missing rows", "Advance the position silently"], 0, "A position cannot recreate change records that retention removed."),
        q("Why must the sink still be repeat-safe?", ["A retry can deliver the same change interval again", "Change feeds remove all network failures", "Deletes never repeat"], 0, "Incremental reading does not by itself make the cross-system write atomic."),
    ],
    [
        {"code":"changes = {101: ['A:update', 'C:insert'], 102: ['B:delete'], 103: ['D:insert']}","note":"Represent each table version as the row operations introduced at that version."},
        {"code":"last_success = 100","note":"The durable consumer position records only completed work."},
        {"code":"pending = [op for version in sorted(changes) if version > last_success for op in changes[version]]","note":"Read the open-closed interval after the saved position."},
        {"code":"last_success = 103 if pending else last_success","note":"Advance only after the synthetic sink accepts the pending operations."},
    ], {"last_success":103},
    [
        ["Databricks change data feed","https://docs.databricks.com/aws/en/tables/features/change-data-feed","Updated October 9, 2026"],
        ["Snowflake streams introduction","https://docs.snowflake.com/en/user-guide/streams-intro","Living documentation"],
        ["Snowflake CHANGES clause","https://docs.snowflake.com/en/sql-reference/constructs/changes","Living documentation"],
    ],
    "The timeline makes the interval concrete: the saved position closes the left side, the latest version closes the right side, and retention can cut away the left edge before a consumer catches up.",
    ["How would you make the downstream write and position update repeat-safe across a crash?", "Which retention, lag, and schema-change signals would prove your incremental pipeline can recover?"])
data["minutes"] = 30
data["product_sections"] = [
    {"id":"databricks","title":"Databricks: query Delta changes between table versions","minutes":9,
     "html":'''<p><strong>Closest implementation.</strong> Databricks CDF returns row data plus change metadata. Automatic CDF computes changes at read time for eligible tables; legacy Delta CDF materializes changes at write time after table-level enablement. Both use <code>table_changes()</code> or <code>readChangeFeed</code>.</p><pre><code><span>-- sourced syntax; not executed here</span><span>SELECT order_id, status, _change_type, _commit_version</span><span>FROM table_changes('sales.orders', 100, 103)</span><span>ORDER BY _commit_version, order_id;</span></code></pre><label>Saved version <input id="dbPosition" type="range" min="100" max="103" value="100"></label><div id="dbCdfWorld" class="world" aria-live="polite"></div><p><strong>Failure/fix.</strong> If the starting version has fallen outside retained history, rebuild from a snapshot and store a new checkpoint. Non-additive schema changes and feature requirements need separate compatibility checks.</p><p><strong>Boundary.</strong> Automatic CDF requires supported Databricks Runtime/table features; legacy CDF must be enabled before the changes you want to read. This page does not execute either mode.</p>''',
     "markdown":"Databricks CDF exposes row-level inserts, updates, and deletes with commit metadata. Query an explicit version interval, store progress only after the sink succeeds, and plan snapshot recovery when history is gone. Automatic and legacy CDF share read APIs but differ in how changes are produced. SQL is unexecuted.",
     "javascript":"const dbPosition=$('dbPosition'),dbCdfWorld=$('dbCdfWorld'),dbOps={101:'A UPDATE + C INSERT',102:'B DELETE',103:'D INSERT'};function paintDbCdf(){const p=+dbPosition.value;dbCdfWorld.innerHTML='<div class=timeline>'+[100,101,102,103].map(v=>'<div class=\"tick '+(v>p?'active':'')+'\"><strong>Delta v'+v+'</strong><br>'+(dbOps[v]||'checkpoint')+'</div>').join('')+'</div><p><strong>table_changes interval:</strong> ('+p+', 103] · local teaching model; no Databricks query ran.</p>';};dbPosition.oninput=paintDbCdf;paintDbCdf();"},
    {"id":"snowflake","title":"Snowflake: consume a stream offset inside the DML transaction","minutes":9,
     "html":'''<p><strong>Closest implementation, different mechanism.</strong> A Snowflake stream stores an offset over table change metadata. Querying a stream does not advance it. Consuming it in a committed DML transaction advances the offset. Give each independent consumer its own stream.</p><pre><code><span>-- sourced pattern; not executed here</span><span>BEGIN;</span><span>MERGE INTO curated_orders t</span><span>USING orders_stream s ON t.order_id = s.order_id</span><span>WHEN MATCHED AND s.METADATA$ACTION = 'DELETE' THEN DELETE</span><span>WHEN MATCHED THEN UPDATE SET status = s.status</span><span>WHEN NOT MATCHED THEN INSERT (order_id,status) VALUES (s.order_id,s.status);</span><span>COMMIT;</span></code></pre><label><input id="sfCommit" type="checkbox"> Commit the consuming DML</label><label>Days behind retention <input id="sfLag" type="range" min="0" max="4" value="1"></label><div id="sfStreamWorld" class="world" aria-live="polite"></div><p><strong>Failure/fix.</strong> A rolled-back DML leaves the offset in place for retry. A stale stream has lost its usable offset and must be recreated with a recovery plan.</p><p><strong>Boundary.</strong> Streams are bookmarks over change metadata, not queues containing their own row copies. Shared-table streams have additional retention constraints.</p>''',
     "markdown":"A Snowflake stream is an offset over source-table change metadata. The offset advances when a consuming DML transaction commits, not when the stream is merely queried. Use one stream per independent consumer and monitor staleness. SQL is unexecuted.",
     "javascript":"const sfCommit=$('sfCommit'),sfLag=$('sfLag'),sfStreamWorld=$('sfStreamWorld');function paintSfStream(){const commit=sfCommit.checked,lag=+sfLag.value,stale=lag>=4;sfStreamWorld.innerHTML='<div class=plane><div class=\"node '+(stale?'fail':'ok')+'\"><strong>source changes</strong><br>offset 40 → 44</div><div class=arrow>→</div><div class=\"node '+(commit&&!stale?'ok':'wait')+'\"><strong>stream offset</strong><br>'+(stale?'STALE · recreate':commit?'advanced to 44':'still 40 · retryable')+'</div></div><p>Local offset model; no Snowflake transaction ran.</p>';};sfCommit.onchange=paintSfStream;sfLag.oninput=paintSfStream;paintSfStream();"},
]
data["product_comparison"] = {
    "html":'''<table><thead><tr><th>Question</th><th>Databricks CDF</th><th>Snowflake Stream</th></tr></thead><tbody><tr><td>What is the position?</td><td>Caller supplies start/end table versions or streaming checkpoint</td><td>Stream object stores an offset</td></tr><tr><td>What advances it?</td><td>Consumer checkpoint logic after processing</td><td>Committed consuming DML transaction</td></tr><tr><td>Independent consumers</td><td>Independent checkpoints/intervals</td><td>One stream per consumer</td></tr><tr><td>History lost</td><td>Snapshot/reseed from retained state</td><td>Recreate stale stream and recover</td></tr></tbody></table>''',
    "markdown":"| Question | Databricks CDF | Snowflake Stream |\n|---|---|---|\n| Position | explicit versions/checkpoint | stream object offset |\n| Advance | consumer checkpoint | committed consuming DML |\n| Independent consumers | independent checkpoints | one stream per consumer |\n| Lost history | snapshot/reseed | recreate and recover |",
}
data["product_questions"] = [
    q("A Snowflake stream is selected but the transaction rolls back. What happens to its offset?", ["It remains available for retry", "It always advances", "The table is deleted"], 0, "Only committed consuming DML advances the stream offset."),
    q("A Databricks consumer needs changes that retention already removed. What is the safe response?", ["Rebuild from a trusted snapshot and reseed progress", "Invent a starting version", "Ignore deletes"], 0, "A missing interval requires recovery, not silent advancement."),
]
data["product_sources"] = [
    ["Databricks change data feed","https://docs.databricks.com/aws/en/tables/features/change-data-feed","Updated October 9, 2026"],
    ["Databricks table_changes function","https://docs.databricks.com/aws/en/sql/language-manual/functions/table_changes","Updated October 15, 2026"],
    ["Snowflake streams introduction","https://docs.snowflake.com/en/user-guide/streams-intro","Living documentation"],
    ["Snowflake CHANGES clause","https://docs.snowflake.com/en/sql-reference/constructs/changes","Living documentation"],
]
data["certification_alignment"] = {
    "checked_on":DATE,
    "databricks":{"target":"Databricks Certified Data Engineer Associate","guide_version":"2026-05-04","domains":["data_ingestion_loading","data_transformation_modeling","troubleshooting_monitoring_optimization"],"scope":"Focused practice on incremental ingestion and transformation with CDF, version boundaries, deletion semantics, and recovery. This is delivered curriculum, not platform execution or mastery."},
    "snowflake":{"target":"SnowPro Core COF-C03","blueprint_status":"Official COF-C03 overview rechecked 2026-10-21; full objective IDs and weights remain unverified","planning_groups":["loading_unloading_transformation","performance","data_protection"],"scope":"Focused planning-group coverage of streams, change metadata, transaction-driven offset advancement, retention, and staleness. Full COF-C03 coverage and mastery are not claimed."},
    "product_lab_execution":"not_run",
}
L.append(data)

L.append(lesson(
    "software-engineering", "Software engineering",
    "Fast counters with a fuzzy snapshot: LongAdder",
    "Use striped counters for high-write statistics, not exact coordination.",
    "Java concurrency · contention",
    '''<p>Picture four cashiers each keeping a small click counter. They avoid fighting over one shared clicker. To show a dashboard total, someone adds the four counters. That is fast for writers, but the total can be slightly out of date while cashiers are still clicking.</p><p><code>LongAdder</code> follows this shape: under contention it can grow multiple variables, then <code>sum()</code> combines them. Oracle recommends it for statistics under high update contention, not fine-grained synchronization control.</p>''',
    '''<p>Three request threads update separate cells: 12, 9, and 11. A dashboard begins summing them. While it moves from cell 2 to cell 3, another request increments cell 1. The dashboard can report 32 even though the final total is 33. For a metric this is often fine; for debiting an account it is not.</p>''',
    {"when":"Use LongAdder for hot counters such as requests, cache hits, and event totals where writers are frequent and a momentarily approximate read is acceptable.","example":"A Kafka gateway counts accepted requests per route for a monitoring scrape while thousands of threads increment concurrently.","decision":"Choose AtomicLong or a lock/transaction when a read must participate in an exact invariant. Choose LongAdder when update throughput matters more than an atomic snapshot."},
    "Move the read cursor across striped cells, then inject an update behind it. Watch why the sum is useful but not an atomic snapshot.",
    "The browser uses four fixed cells and one interleaving. A real LongAdder grows cells dynamically and scheduling is nondeterministic. The Java replay proves basic increments and sum only; it does not reproduce a race or benchmark throughput.",
    '''<div id="world"><label><input id="lateIncrement" type="checkbox" checked> increment cell 1 after it was read</label><div id="adderWorld" class="world" aria-live="polite"></div></div>''',
    "function paintAdder(){const late=lateIncrement.checked;const read=[12,9,11,0],final=[12+(late?1:0),9,11,0];adderWorld.innerHTML='<div class=stripe>'+final.map((v,i)=>'<div class=\"cell '+(late&&i===0?'wait':'')+'\"><strong>cell '+(i+1)+'</strong><br>read '+read[i]+'<br>final '+v+'</div>').join('')+'</div><p class=\"status '+(late?'wait':'ok')+'\">sum() view = '+read.reduce((a,b)=>a+b,0)+' · final total = '+final.reduce((a,b)=>a+b,0)+(late?' · valid metric snapshot, not an atomic coordination value':'')+'</p>';};lateIncrement.onchange=paintAdder;paintAdder();",
    [
        q("Why can LongAdder outperform AtomicLong under heavy write contention?", ["Updates can spread across multiple variables", "It removes all memory costs", "It stores values on disk"], 0, "Striping reduces contention on one hot variable."),
        q("Which use best fits LongAdder?", ["Request-count telemetry", "Bank balance transfer invariant", "Unique sequence allocation"], 0, "Telemetry tolerates a non-atomic snapshot; coordination usually does not."),
        q("What must a reader assume about sum() during concurrent updates?", ["It is not an atomic snapshot", "It locks every writer", "It resets automatically"], 0, "Cells can change while the total is being combined."),
    ],
    [
        {"code":"var requests = new java.util.concurrent.atomic.LongAdder();","note":"Create the real Java counter."},
        {"code":"requests.increment(); requests.increment();","note":"Two increments update the counter."},
        {"code":"requests.add(3);","note":"Add three more events."},
        {"code":"var observed = requests.sum();","note":"Read the combined total after these single-threaded statements."},
    ], {"observed":"5"},
    [["Java 26 LongAdder API","https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html","Java SE 26"], ["Java 26 AtomicLong API","https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/atomic/AtomicLong.html","Java SE 26"]],
    "The striped cells show the optimization and its price at once: writers touch different cells, while the reader must walk across values that can keep changing.",
    ["What production metric could tolerate this snapshot behavior, and what alert logic would need extra smoothing?", "Name an invariant where a fuzzy sum would be unsafe and choose a stronger primitive."] ,"java"))

L.append(lesson(
    "distinguished-engineer", "Distinguished Engineer",
    "The failover button must survive the outage",
    "Keep emergency traffic movement on a highly available data-plane path.",
    "Resilience · recovery mechanism",
    '''<p>A fire exit is useless if its key is stored inside the burning room. Failover mechanisms have the same trap: the primary system fails, then the management path needed to change routing fails with it.</p><p>A control plane creates and configures resources. A data plane performs the service’s core function. AWS recommends data-plane operations when availability matters. For ARC routing control, configuration is separate from the highly available routing-control data plane.</p>''',
    '''<p>Before the incident, a team creates routing controls, safety rules, and credentials. During the incident, the primary region and normal console path are impaired. The runbook calls the ARC data-plane endpoint to change the routing control, then health-checked DNS moves traffic. Configuration work waits until the incident is stable.</p>''',
    {"when":"Use this design for disaster recovery actions that must work during regional, console, IAM-path, or control-plane impairment.","example":"A multi-region payments API must move traffic to its standby while the primary region and normal deployment tooling are unavailable.","decision":"Pre-provision the recovery path, credentials, safety rules, and tested runbook. Keep incident-time actions small. If failover still needs resource creation or a large deployment, the recovery mechanism is too dependent on control-plane availability."},
    "Disable the normal control path and test whether the pre-provisioned data-plane route still moves traffic.",
    "This local model has two regions and two API paths. It does not call AWS, validate ARC safety rules, model DNS TTLs, health checks, IAM, quotas, client caching, or application data recovery.",
    '''<div id="world"><label><input id="controlPlaneUp" type="checkbox"> normal control plane available</label><label><input id="recoveryPrepared" type="checkbox" checked> routing controls and credentials prepared</label><div id="failoverWorld" class="world" aria-live="polite"></div></div>''',
    "function paintFailover(){const cp=controlPlaneUp.checked,ready=recoveryPrepared.checked;const works=ready;failoverWorld.innerHTML='<div class=plane><div class=\"node fail\"><strong>primary region</strong><br>impaired</div><div class=arrow>→</div><div class=\"node '+(works?'ok':'fail')+'\"><strong>failover action</strong><br>'+(works?'data-plane routing control works':'blocked: recovery path was not prepared')+'</div></div><p><strong>Control plane:</strong> '+(cp?'available, but not required for the switch':'unavailable')+'. <strong>Standby:</strong> '+(works?'receives traffic':'waiting')+'.</p>';};controlPlaneUp.onchange=paintFailover;recoveryPrepared.onchange=paintFailover;paintFailover();",
    [
        q("Why pre-provision routing controls before an outage?", ["Incident-time switching should not depend on resource creation", "It guarantees zero data loss", "It removes health checks"], 0, "Configuration is a control-plane activity that may be unavailable during disruption."),
        q("Which path should a failover runbook prefer when AWS documents it as highly available?", ["The routing-control data-plane API", "A new CloudFormation stack", "An ad hoc console workflow"], 0, "The emergency operation belongs on the resilient data plane."),
        q("What remains outside this lesson?", ["Application data replication and correctness", "Whether primary traffic moves", "The need for runbooks"], 0, "Routing traffic does not by itself make application state correct or current."),
    ],
    [
        {"code":"primary_healthy = False","note":"The primary is impaired."},
        {"code":"control_plane_available = False","note":"Assume the normal management path is unavailable too."},
        {"code":"routing_control_prepared = True","note":"The recovery data-plane path was provisioned and tested beforehand."},
        {"code":"traffic_target = 'standby' if routing_control_prepared else 'primary'","note":"The small emergency action moves traffic without creating resources."},
    ], {"traffic_target":"standby"},
    [["AWS ARC data and control planes","https://docs.aws.amazon.com/r53recovery/latest/dg/data-and-control-planes.html","Living documentation"], ["AWS Well-Architected REL06-BP01","https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_monitor_aws_resources.html","Living documentation"]],
    "The diagram deliberately removes the normal control path. If the standby still becomes reachable, the recovery mechanism does not share the outage’s main dependency.",
    ["Which management dependency could block one of your current recovery runbooks?", "What pre-provisioned evidence would let an incident commander trust the emergency data-plane action?"]))

L.append(lesson(
    "genai-engineering", "GenAI engineering",
    "Keep the span, drop the prompt",
    "Preserve trace topology and timing while excluding sensitive model inputs and outputs.",
    "Harness engineering · trace privacy",
    '''<p>A parcel tracker can show that a package visited three hubs, how long each step took, and where it failed without printing the letter inside the package. Agent traces can do the same.</p><p>The OpenAI Agents SDK creates traces and spans for runs, model generations, tools, handoffs, and guardrails. Sensitive payload capture is a separate choice. Setting <code>trace_include_sensitive_data=False</code> keeps the trace structure while excluding potentially sensitive model and tool inputs and outputs.</p>''',
    '''<p>A support agent calls <code>lookup_order</code>, then a model generates a reply. The trace still shows the parent run, the tool span, the model span, durations, and an error. The customer email and full order record are redacted. Operators can diagnose where time went without copying payloads into the tracing backend.</p>''',
    {"when":"Use payload exclusion when trace topology, latency, and failure type are valuable but prompts, tool arguments, or model outputs may contain customer or regulated data.","example":"A production support agent handles order and payment records while SREs need span timing and failure location.","decision":"Start from data minimization. Disable sensitive capture or add a custom redacting processor before export. If policy forbids tracing entirely, do not treat redaction as permission to trace."},
    "Switch payload capture off. Watch the trace tree and timings remain while sensitive values disappear.",
    "This browser renders a synthetic trace and does not run the Agents SDK, export telemetry, prove redaction completeness, classify secrets, model custom processors, or satisfy zero-data-retention policy.",
    '''<div id="world"><label><input id="includePayload" type="checkbox"> include sensitive payload fields</label><div id="traceWorld" class="world" aria-live="polite"></div></div>''',
    "function paintTracePrivacy(){const show=includePayload.checked;const payload=show?'customer=ada@example.com':'[payload excluded]';traceWorld.innerHTML='<div class=trace-tree><div class=span><strong>agent run</strong><br>820 ms</div><div class=span><strong>lookup_order</strong><br>120 ms<br><span class=\"'+(show?'':'redacted')+'\">'+payload+'</span></div><div class=span><strong>model</strong><br>650 ms<br><span class=\"'+(show?'':'redacted')+'\">'+(show?'reply=Order 42 is late':'[payload excluded]')+'</span></div></div><p>Topology, duration, and error status remain '+(show?'with payload exposure.':'without payload text.')+'</p>';};includePayload.onchange=paintTracePrivacy;paintTracePrivacy();",
    [
        q("What remains useful when sensitive trace data is excluded?", ["Span relationships, durations, and status", "Full prompt text", "Raw customer records"], 0, "Operational shape can remain even when payload content is withheld."),
        q("Where should custom redaction happen?", ["Before export to the tracing backend", "After every analyst downloads the trace", "Only in the UI"], 0, "Sensitive material should be removed before it crosses the export boundary."),
        q("What is the boundary of payload exclusion?", ["It is not permission to trace where policy forbids tracing", "It guarantees every custom processor is safe", "It makes authorization unnecessary"], 0, "Governance and trace availability still apply."),
    ],
    [
        {"code":"trace = {'run_ms': 820, 'tool_ms': 120, 'model_ms': 650, 'prompt': 'customer email'}","note":"Start with a synthetic trace that mixes operational and payload fields."},
        {"code":"sensitive_fields = {'prompt'}","note":"Classify the field that must not leave the process."},
        {"code":"exported = {k: v for k, v in trace.items() if k not in sensitive_fields}","note":"Remove sensitive data before export."},
        {"code":"topology_kept = all(k in exported for k in ['run_ms', 'tool_ms', 'model_ms'])","note":"Keep the values needed to diagnose timing."},
    ], {"topology_kept":True},
    [["OpenAI Agents SDK tracing","https://openai.github.io/openai-agents-python/tracing/","Living documentation"], ["Agents SDK RunConfig reference","https://openai.github.io/openai-agents-python/ref/run/","Living documentation"]],
    "The same three-span tree is shown twice conceptually: payloads change from visible to excluded, while the shape and timings stay fixed. That makes the privacy trade-off inspectable.",
    ["Which trace fields are necessary for your incident questions, and which are merely convenient?", "How would you test that a custom tool payload is redacted before a third-party exporter receives it?"]))

L.append(lesson(
    "technology-breakthroughs", "Technology breakthroughs",
    "Bias-correct the probability, not the weather physics",
    "Understand how a 2026 study recalibrates subseasonal forecast probabilities.",
    "New research · published October 14, 2026",
    '''<p>A weather model says “70% chance of above-normal rain.” Across similar past cases, rain happened only 50% of the time. The forecast may rank risky weeks well but still be overconfident. Calibration learns a correction from past forecasts and observations.</p><p>A 2026 Nature paper reports machine-learning probabilistic bias correction for weeks 3–5 weather forecasts. It combines dynamical/AI forecast information with hindcasts, climatology, and recent observations. The correction changes the probability, not the underlying atmospheric simulation.</p>''',
    '''<p>In a synthetic bin of ten historical 0.7 forecasts, rain occurred five times. A simple calibration map changes the new probability from 0.70 to 0.50. For an event that occurs, Brier loss falls from <code>(0.70-1)^2=0.09</code> to <code>(0.50-1)^2=0.25</code>—worse for that one event. Across many cases, calibration is judged by the average, not by a single lucky outcome.</p>''',
    {"when":"Consider probability calibration when users act on forecast likelihoods and hindcast/reforecast data shows systematic bias by variable, location, or lead time.","example":"An energy planner buys reserves from week-4 heat probabilities and needs 70% forecasts to occur roughly 70% of the time.","decision":"Measure out-of-sample reliability and decision value. Do not deploy a correction merely because it improves one event or one metric; check drift, extremes, regions, lead times, and operational baselines."},
    "Change the raw probability and observed historical frequency. Watch the reliability gap and Brier score rather than a decorative forecast map.",
    "This is an original one-bin calibration model, not the paper’s system, code, datasets, or reported evaluation. It ignores spatial structure, multiple variables, lead times, ensembles, climatology drift, extreme-event rarity, and uncertainty in the calibration map.",
    '''<div id="world"><label>Raw probability <input id="rawProb" type="range" min="5" max="95" value="70"></label><label>Observed frequency in comparable cases <input id="observedFreq" type="range" min="5" max="95" value="50"></label><div id="forecastWorld" class="world" aria-live="polite"></div></div>''',
    "function paintForecast(){const raw=+rawProb.value/100,cal=+observedFreq.value/100,gap=Math.abs(raw-cal);forecastWorld.innerHTML='<div class=bins><div class=bin><strong>raw</strong><br>'+Math.round(raw*100)+'%</div><div class=bin><strong>historical frequency</strong><br>'+Math.round(cal*100)+'%</div><div class=\"bin '+(gap>.15?'fail':'ok')+'\"><strong>reliability gap</strong><br>'+Math.round(gap*100)+' points</div><div class=bin><strong>calibrated</strong><br>'+Math.round(cal*100)+'%</div></div><p>For a non-event: raw Brier '+(raw*raw).toFixed(3)+' → calibrated '+(cal*cal).toFixed(3)+'. One case is not an evaluation.</p>';};rawProb.oninput=paintForecast;observedFreq.oninput=paintForecast;paintForecast();",
    [
        q("What does probabilistic bias correction change?", ["The forecast probability mapping", "The past weather observations", "The laws in the dynamical model"], 0, "The correction recalibrates probabilities produced from forecast information."),
        q("Why is one event insufficient to validate calibration?", ["Reliability is a repeated-case property", "Probabilities are always exact", "Brier scores cannot be averaged"], 0, "Calibration compares forecast frequencies with outcomes over many comparable cases."),
        q("How should the paper’s reported gains be described?", ["Research claims on the evaluated datasets and setup", "A universal operational guarantee", "A certified weather service"], 0, "Publication results do not automatically transfer to every region or decision."),
    ],
    [
        {"code":"raw_probability = 0.70","note":"Start with a model probability."},
        {"code":"historical_frequency = 0.50","note":"Use a synthetic observed frequency for comparable past forecasts."},
        {"code":"calibrated_probability = historical_frequency","note":"Apply a deliberately simple calibration map."},
        {"code":"reliability_gap = abs(raw_probability - calibrated_probability)","note":"Measure how far the raw bin is from the empirical frequency."},
    ], {"reliability_gap":0.2},
    [["Advancing subseasonal forecasting with machine learning","https://www.nature.com/articles/s41586-026-11126-x","Published October 14, 2026"]],
    "The probability bins focus attention on what calibration changes: the stated confidence. They avoid implying that the browser reproduces a global weather model.",
    ["Which operational decision needs calibrated probabilities rather than only rank ordering?", "What temporal or regional drift would make yesterday’s calibration map unsafe?"]))

L.append(lesson(
    "ci-cd-github-actions", "CI/CD & GitHub Actions",
    "Attest the digest, not the tag",
    "Bind build provenance to immutable artifact bytes and verify before promotion.",
    "Supply chain · artifact attestations",
    '''<p>A luggage tag saying “release-latest” can be moved to another suitcase. A fingerprint of the suitcase contents cannot. Container tags and filenames are convenient names; a SHA-256 digest identifies the actual bytes.</p><p>GitHub artifact attestations establish where and how an artifact was built. The workflow grants the attestation action the needed permissions and signs provenance for a subject digest. Verification checks the downloaded bytes against that evidence.</p>''',
    '''<p>A workflow builds <code>service.tar.gz</code>, computes SHA-256 <code>abc…</code>, and attests that digest. Someone later replaces the file but keeps the name. The new digest is <code>def…</code>. Verification fails because the attestation is about <code>abc…</code>, not the reusable filename.</p>''',
    {"when":"Use artifact attestations when binaries or images cross trust boundaries, enter release environments, or need auditable build provenance.","example":"A reusable release workflow builds a Kafka connector image, attests its digest, and a deployment gate verifies provenance before production promotion.","decision":"Attest after the final artifact bytes are produced and verify the exact promoted subject. Keep least-privilege permissions, protected builders, dependency controls, and environment approvals; an attestation does not prove the code is safe."},
    "Change one artifact byte. Watch the digest change and the provenance check reject the substituted subject.",
    "The browser compares short synthetic digests. The Python replay computes real SHA-256 values for two byte strings, but it does not invoke GitHub Actions, actions/attest, OIDC, Sigstore, gh attestation verify, or a policy engine.",
    '''<div id="world"><label><input id="tamperArtifact" type="checkbox"> replace one byte after attestation</label><div id="attestWorld" class="world" aria-live="polite"></div></div>''',
    "function paintAttest(){const bad=tamperArtifact.checked;attestWorld.innerHTML='<div class=chain><div class=artifact><strong>built bytes</strong><br>sha256: a31f…</div><div class=arrow>→</div><div class=artifact><strong>attestation</strong><br>subject a31f…</div><div class=arrow>→</div><div class=\"artifact '+(bad?'fail':'ok')+'\"><strong>promoted bytes</strong><br>sha256: '+(bad?'9c02… · REJECT':'a31f… · VERIFY')+'</div></div>';};tamperArtifact.onchange=paintAttest;paintAttest();",
    [
        q("Why attest a digest rather than a tag?", ["A digest identifies the artifact bytes", "Tags cannot be displayed", "Digests grant deployment permission"], 0, "A mutable name can be reused; a content digest changes with the bytes."),
        q("Which permission is needed for GitHub OIDC token issuance?", ["id-token: write", "issues: write", "pages: write"], 0, "The official workflow requires id-token: write along with attestation permissions."),
        q("What does a valid provenance attestation not prove?", ["That the source and dependencies are free of vulnerabilities", "Which artifact digest was attested", "Which workflow created the evidence"], 0, "Provenance answers origin and process questions, not complete software safety."),
    ],
    [
        {"code":"import hashlib\noriginal = b'release-v1'","note":"Create synthetic artifact bytes."},
        {"code":"attested_digest = hashlib.sha256(original).hexdigest()","note":"Bind provenance to the SHA-256 digest."},
        {"code":"promoted = b'release-v2'","note":"Simulate a same-name artifact whose bytes changed."},
        {"code":"verified = hashlib.sha256(promoted).hexdigest() == attested_digest","note":"Verification rejects the substituted bytes."},
    ], {"verified":False},
    [["GitHub artifact attestations","https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations","Living documentation"], ["GitHub artifact attestation concepts","https://docs.github.com/en/actions/concepts/security/artifact-attestations","Living documentation"]],
    "The chain ties three concrete objects together: built bytes, the attested subject digest, and the bytes presented for promotion. The failure is visible exactly where the digest diverges.",
    ["Where in your pipeline can artifact bytes still change after attestation?", "What verification policy should a deployment gate enforce in addition to digest provenance?"]))

L.append(lesson(
    "apis-microservices", "APIs & Microservices",
    "A null child can erase its non-null parent",
    "Design GraphQL nullability with failure propagation in mind.",
    "GraphQL · response semantics",
    '''<p>Imagine a shipping form where apartment number is optional, but the entire address is declared mandatory. If a mandatory child cannot be produced, GraphQL does not quietly put <code>null</code> there. The field error bubbles to the nearest nullable parent.</p><p>Non-null is therefore more than documentation. It defines a failure boundary. A deeply nested chain of non-null fields can turn one resolver failure into a much larger missing subtree—or even <code>data: null</code>.</p>''',
    '''<p>Schema: <code>Query.order: Order</code>, <code>Order.customer: Customer!</code>, <code>Customer.name: String!</code>. If <code>name</code> resolves null, GraphQL cannot return <code>customer.name: null</code>. It nulls <code>customer</code>; because customer is non-null, the error continues to <code>order</code>. Since <code>order</code> is nullable, the response can return <code>order: null</code> plus an error.</p>''',
    {"when":"Use non-null when the field is truly guaranteed for every authorized object and clients should treat its absence as an error.","example":"An order query exposes optional delivery instructions but requires an order ID and customer relationship.","decision":"Draw the propagation path before adding <code>!</code>. Keep nullable boundaries where partial data is valuable. Do not use non-null to hide unreliable upstream dependencies or force client convenience."},
    "Toggle nullability along the response path. Watch the exact subtree that collapses when the leaf resolver returns null.",
    "This local model covers one object path and one field error. It does not execute a GraphQL server, model lists, multiple errors, authorization, deferred/streamed delivery, federation, custom error masking, or client cache behavior.",
    '''<div id="world"><label><input id="customerNonNull" type="checkbox" checked> Order.customer is non-null</label><label><input id="orderNonNull" type="checkbox"> Query.order is non-null</label><div id="nullWorld" class="world" aria-live="polite"></div></div>''',
    "function paintNull(){const c=customerNonNull.checked,o=orderNonNull.checked;const data=o&&c?'data: null':c?'order: null':'order survives; customer: null';nullWorld.innerHTML='<div class=tree><div class=\"field '+(o&&c?'gone':'')+'\"><strong>order '+(o?'!':'nullable')+'</strong></div><div class=\"field '+(c?'gone':'')+'\"><strong>customer '+(c?'!':'nullable')+'</strong></div><div class=\"field fail gone\"><strong>name!</strong><br>resolver returned null</div></div><p class=\"status '+(o&&c?'fail':'wait')+'\">Result: '+data+' plus a field error.</p>';};customerNonNull.onchange=paintNull;orderNonNull.onchange=paintNull;paintNull();",
    [
        q("A non-null leaf resolves to null. What happens first?", ["A field error propagates to the nearest nullable parent", "GraphQL silently returns the null leaf", "The schema changes automatically"], 0, "The non-null contract forces error propagation."),
        q("Why keep a parent nullable?", ["It can bound failure and preserve unrelated partial data", "It prevents all resolver errors", "It makes every child non-null"], 0, "A nullable ancestor is where bubbling can stop."),
        q("What should guide adding ! to a field?", ["A real server guarantee and desired failure boundary", "Client preference alone", "The field name length"], 0, "Nullability must match runtime guarantees and failure semantics."),
    ],
    [
        {"code":"path = [('order', False), ('customer', True), ('name', True)]","note":"Represent nullable order and non-null descendants."},
        {"code":"failed_index = 2","note":"The name resolver violates its non-null contract."},
        {"code":"nearest_nullable = next(name for name, non_null in reversed(path[:failed_index + 1]) if not non_null)","note":"Walk upward until propagation reaches a nullable boundary."},
        {"code":"result = {nearest_nullable: None, 'errors': ['name resolved null']}","note":"Return a null order plus an error instead of an invalid non-null leaf."},
    ], {"nearest_nullable":"order"},
    [["GraphQL Specification October 2021","https://spec.graphql.org/October2021/#sec-Handling-Field-Errors","Published October 2021"], ["GraphQL Specification: Non-Null","https://spec.graphql.org/October2021/#sec-Non-Null","Published October 2021"]],
    "The response tree disappears from the failed leaf upward. Changing one nullable boundary visibly changes how much useful data survives.",
    ["Which field in one of your GraphQL schemas has a stronger non-null promise than its backing service can meet?", "How would list item nullability change the blast radius for one failing element?"]))

(R / DAY).mkdir(exist_ok=True)
(R / DAY / "lessons.json").write_text(json.dumps(L, indent=2, ensure_ascii=False) + "\n")

state = json.loads((R / "study-state.json").read_text())
if not any(d.get("generation_key") == DATE for d in state["days"]):
    state["days"].append({
        "number":31, "folder":DAY, "date":DATE, "generation_key":DATE,
        "status":"generated", "completion":"not_assessed", "review_keys":[],
        "lesson_slugs":[x["slug"] for x in L],
        "validation":"Pending local validation; vendor commands not run; mastery not assessed.",
    })
state["last_generated_day"] = max(d["number"] for d in state["days"])
(R / "study-state.json").write_text(json.dumps(state, indent=2) + "\n")

cert = json.loads((R / "certification-plan.json").read_text())
if not any(x["lesson"] == DAY + "/data-engineering" for x in cert["coverage"]):
    cert["coverage"].append({
        "lesson":DAY + "/data-engineering", "product_material_added_on":DATE,
        "session_type":"focused", "cycle_position":1, "cycle_origin":"Day31",
        "databricks_guide_version":"2026-05-04",
        "databricks_domains":["data_ingestion_loading","data_transformation_modeling","troubleshooting_monitoring_optimization"],
        "snowflake_exam_code":"COF-C03",
        "snowflake_blueprint_status":"Official current overview verified 2026-10-21; full objective IDs and weights still unverified; planning groups only",
        "snowflake_planning_groups":["loading_unloading_transformation","performance","data_protection"],
        "source_checked_on":DATE,
        "source_versions":{"databricks":"Certification overview rechecked 2026-10-21; official guide dated 2026-05-04; CDF docs updated 2026-10-09 and table_changes docs updated 2026-10-15","snowflake":"COF-C03 overview rechecked 2026-10-21; streams and CHANGES living documentation; full guide objective IDs/weights unverified"},
        "depth":"Focused comparison of incremental row-change processing, durable positions, retention failure, and recovery. No complete exam coverage or mastery claim.",
        "execution_status":{"browser_models":"local JavaScript","recorded_example":"Python executed locally","vendor_sql_or_python":"not_run"},
        "product_lab_execution":"not_run", "mastery":"not_assessed",
    })
cert["bundle_cycle_policy"]["next_consolidation_day"] = 36
cert["bundle_cycle_policy"]["next_retrieval_day"] = 37
(R / "certification-plan.json").write_text(json.dumps(cert, indent=2) + "\n")
print("Authored", DAY, "with", len(L), "lessons")
