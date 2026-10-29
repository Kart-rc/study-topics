// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var barrier = new java.util.concurrent.CyclicBarrier(3); var pool = java.util.concurrent.Executors.newFixedThreadPool(2);
emit(0,"barrier",String.valueOf(barrier),"pool",String.valueOf(pool));
var a = pool.submit(() -> { try { barrier.await(100, java.util.concurrent.TimeUnit.MILLISECONDS); return "passed"; } catch (java.util.concurrent.TimeoutException e) { return "timed-out"; } catch (Exception e) { return "other"; } });
emit(1,"barrier",String.valueOf(barrier),"pool",String.valueOf(pool),"a",String.valueOf(a));
var b = pool.submit(() -> { try { barrier.await(5, java.util.concurrent.TimeUnit.SECONDS); return "passed"; } catch (java.util.concurrent.BrokenBarrierException e) { return "broken"; } catch (Exception e) { return "other"; } });
emit(2,"barrier",String.valueOf(barrier),"pool",String.valueOf(pool),"a",String.valueOf(a),"b",String.valueOf(b));
String first = a.get(); String second = b.get(); boolean broken = barrier.isBroken(); pool.shutdownNow();
emit(3,"barrier",String.valueOf(barrier),"pool",String.valueOf(pool),"a",String.valueOf(a),"b",String.valueOf(b),"first",String.valueOf(first),"second",String.valueOf(second),"broken",String.valueOf(broken));
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
