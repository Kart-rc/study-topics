-- Run in an existing, authorized sandbox catalog/schema.
CREATE TABLE sandbox.study17.receipts (id STRING, amount INT) USING DELTA;
INSERT INTO sandbox.study17.receipts VALUES ('base', 10);
-- Run the Python stream once. Then add the next receipts:
INSERT INTO sandbox.study17.receipts VALUES ('r2', 2), ('r3', 3);
-- Run the SAME Python stream again, using the SAME checkpoint.
SELECT SUM(amount) FROM sandbox.study17.receipts_copy; -- expected: 15
