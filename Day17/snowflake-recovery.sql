-- Use an authorized sandbox schema and an active small warehouse.
CREATE TABLE study17_receipts (id STRING, amount INTEGER);
INSERT INTO study17_receipts VALUES ('base', 10);
CREATE TABLE study17_copy AS SELECT * FROM study17_receipts;
CREATE STREAM study17_changes
  ON TABLE study17_receipts APPEND_ONLY = TRUE;
INSERT INTO study17_receipts VALUES ('r2', 2), ('r3', 3);

SELECT * FROM study17_changes; -- inspect; position does not advance
BEGIN TRANSACTION;
INSERT INTO study17_copy SELECT id, amount FROM study17_changes;
ROLLBACK; -- rehearsal: neither target rows nor stream advance persist

BEGIN TRANSACTION;
INSERT INTO study17_copy SELECT id, amount FROM study17_changes;
COMMIT;
SELECT SUM(amount) FROM study17_copy; -- expected: 15
SELECT COUNT(*) FROM study17_changes; -- expected: 0

-- After inspecting results, clean up ONLY these sandbox objects:
-- DROP STREAM study17_changes;
-- DROP TABLE study17_copy;
-- DROP TABLE study17_receipts;
