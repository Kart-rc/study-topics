// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var kept = new java.util.concurrent.ScheduledThreadPoolExecutor(1); var a = new java.util.ArrayList<java.util.concurrent.ScheduledFuture<?>>();
emit(0,"kept",String.valueOf(kept),"a",String.valueOf(a));
for (int i=0;i<3;i++) a.add(kept.schedule(() -> {}, 1, java.util.concurrent.TimeUnit.HOURS)); for (var f:a) f.cancel(false); int defaultQueue = kept.getQueue().size();
emit(1,"kept",String.valueOf(kept),"a",String.valueOf(a),"defaultQueue",String.valueOf(defaultQueue));
var removed = new java.util.concurrent.ScheduledThreadPoolExecutor(1); removed.setRemoveOnCancelPolicy(true); var b = new java.util.ArrayList<java.util.concurrent.ScheduledFuture<?>>();
emit(2,"kept",String.valueOf(kept),"a",String.valueOf(a),"defaultQueue",String.valueOf(defaultQueue),"removed",String.valueOf(removed),"b",String.valueOf(b));
for (int i=0;i<3;i++) b.add(removed.schedule(() -> {}, 1, java.util.concurrent.TimeUnit.HOURS)); for (var f:b) f.cancel(false); int removeQueue = removed.getQueue().size(); kept.shutdownNow(); removed.shutdownNow();
emit(3,"kept",String.valueOf(kept),"a",String.valueOf(a),"defaultQueue",String.valueOf(defaultQueue),"removed",String.valueOf(removed),"b",String.valueOf(b),"removeQueue",String.valueOf(removeQueue));
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
