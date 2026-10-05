# Synthetic teaching example. No production services are contacted.
import sqlite3
db = sqlite3.connect(":memory:"); db.executescript("CREATE TABLE orders(id TEXT PRIMARY KEY); CREATE TABLE outbox(event_id TEXT PRIMARY KEY, status TEXT);")
with db:
    db.execute("INSERT INTO orders VALUES (?)", ("A100",))
    db.execute("INSERT INTO outbox VALUES (?, ?)", ("E7", "pending"))
order_rows = db.execute("SELECT * FROM orders").fetchall(); tickets = db.execute("SELECT * FROM outbox").fetchall()
kafka = ["E7"]; relay_ack = True
relay_ack = False
kafka.append("E7")
db.execute("UPDATE outbox SET status = ? WHERE event_id = ?", ("sent", "E7")); db.commit()
tickets = db.execute("SELECT * FROM outbox").fetchall(); distinct_events = list(dict.fromkeys(kafka))

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['order_rows', 'tickets', 'kafka', 'relay_ack', 'distinct_events']}, indent=2))
