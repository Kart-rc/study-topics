// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var gate=new java.util.concurrent.CountDownLatch(1); var ranBy=new java.util.concurrent.atomic.AtomicReference<String>("not-run");
emit(0,"gate",String.valueOf(gate),"ranBy",String.valueOf(ranBy));
var pool=new java.util.concurrent.ThreadPoolExecutor(1,1,0L,java.util.concurrent.TimeUnit.MILLISECONDS,new java.util.concurrent.ArrayBlockingQueue<Runnable>(1),new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy()); pool.execute(() -> {try{gate.await();}catch(InterruptedException e){Thread.currentThread().interrupt();}}); Thread.sleep(50);
emit(1,"gate",String.valueOf(gate),"ranBy",String.valueOf(ranBy),"pool",String.valueOf(pool));
pool.execute(() -> {}); String caller=Thread.currentThread().getName();
emit(2,"gate",String.valueOf(gate),"ranBy",String.valueOf(ranBy),"pool",String.valueOf(pool),"caller",String.valueOf(caller));
pool.execute(() -> ranBy.set(Thread.currentThread().getName())); boolean backpressure=caller.equals(ranBy.get()); gate.countDown(); pool.shutdown(); pool.awaitTermination(2,java.util.concurrent.TimeUnit.SECONDS);
emit(3,"gate",String.valueOf(gate),"ranBy",String.valueOf(ranBy),"pool",String.valueOf(pool),"caller",String.valueOf(caller),"backpressure",String.valueOf(backpressure));
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
