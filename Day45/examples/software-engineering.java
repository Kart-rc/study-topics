// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var latch = new java.util.concurrent.CountDownLatch(3); int remaining = 3; String shardA = "PENDING"; String shardB = "PENDING"; String shardC = "PENDING";
emit(0,"latch",String.valueOf(latch),"remaining",String.valueOf(remaining),"shardA",String.valueOf(shardA),"shardB",String.valueOf(shardB),"shardC",String.valueOf(shardC));
shardA = "READY"; latch.countDown(); remaining = (int) latch.getCount();
emit(1,"latch",String.valueOf(latch),"remaining",String.valueOf(remaining),"shardA",String.valueOf(shardA),"shardB",String.valueOf(shardB),"shardC",String.valueOf(shardC));
shardB = "FAILED"; latch.countDown(); remaining = (int) latch.getCount();
emit(2,"latch",String.valueOf(latch),"remaining",String.valueOf(remaining),"shardA",String.valueOf(shardA),"shardB",String.valueOf(shardB),"shardC",String.valueOf(shardC));
shardC = "READY"; latch.countDown(); remaining = (int) latch.getCount();
emit(3,"latch",String.valueOf(latch),"remaining",String.valueOf(remaining),"shardA",String.valueOf(shardA),"shardB",String.valueOf(shardB),"shardC",String.valueOf(shardC));
boolean allArrived = latch.await(1, java.util.concurrent.TimeUnit.MILLISECONDS); boolean startupAllowed = allArrived && shardA.equals("READY") && shardB.equals("READY") && shardC.equals("READY");
emit(4,"latch",String.valueOf(latch),"remaining",String.valueOf(remaining),"shardA",String.valueOf(shardA),"shardB",String.valueOf(shardB),"shardC",String.valueOf(shardC),"allArrived",String.valueOf(allArrived),"startupAllowed",String.valueOf(startupAllowed));
}

  static String quote(String s) {
    return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t") + "\"";
  }
  static void emit(int step, String... pairs) {
    StringBuilder b = new StringBuilder("{\"step\":" + step + ",\"state\":{");
    for (int i=0; i<pairs.length; i+=2) {
      if(i>0)b.append(",");
      b.append(quote(pairs[i])).append(":").append(quote(pairs[i+1]));
    }
    System.out.println(b.append("}}").toString());
  }
  static String hash(String text) throws Exception {
    return java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(text.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
  }
}
