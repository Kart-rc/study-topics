# Prerequisite: sandbox.study17.checkpoints is a writable UC volume.
# Use a dedicated path per query. Keep this path on subsequent runs.
q = (spark.readStream.table("sandbox.study17.receipts")
     .writeStream
     .format("delta")
     .option("checkpointLocation",
             "/Volumes/sandbox/study17/checkpoints/receipts_copy")
     .trigger(availableNow=True)
     .toTable("sandbox.study17.receipts_copy"))
q.awaitTermination()
