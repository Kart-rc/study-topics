// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
java.util.concurrent.locks.ReentrantLock lock=new java.util.concurrent.locks.ReentrantLock(); java.util.concurrent.CountDownLatch waiting=new java.util.concurrent.CountDownLatch(1); java.util.concurrent.atomic.AtomicBoolean entered=new java.util.concurrent.atomic.AtomicBoolean(false); java.util.concurrent.atomic.AtomicReference<String> outcome=new java.util.concurrent.atomic.AtomicReference<>("waiting"); lock.lock();
emit(0);
Thread worker=Thread.ofPlatform().start(() -> { waiting.countDown(); try { lock.lockInterruptibly(); try { entered.set(true); } finally { lock.unlock(); } } catch(InterruptedException e) { outcome.set("interrupted-before-owning"); } });
emit(1);
waiting.await(); while(worker.getState()!=Thread.State.WAITING){ Thread.onSpinWait(); } worker.interrupt(); worker.join(); lock.unlock();
emit(2);
String result="outcome="+outcome.get()+", entered="+entered.get();
emit(3,"result",String.valueOf(result));
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
