// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
java.util.concurrent.locks.ReentrantLock lock=new java.util.concurrent.locks.ReentrantLock(); var ready=lock.newCondition(); var waiting=new java.util.concurrent.CountDownLatch(1); var state=new java.util.concurrent.atomic.AtomicBoolean(false); var observed=new java.util.concurrent.atomic.AtomicBoolean(false);
emit(0,"ready",String.valueOf(ready),"waiting",String.valueOf(waiting),"state",String.valueOf(state),"observed",String.valueOf(observed));
Thread worker=Thread.ofPlatform().start(() -> { lock.lock(); try { waiting.countDown(); while(!state.get()) ready.await(); observed.set(true); } catch(InterruptedException e){ Thread.currentThread().interrupt(); } finally { lock.unlock(); } });
emit(1,"ready",String.valueOf(ready),"waiting",String.valueOf(waiting),"state",String.valueOf(state),"observed",String.valueOf(observed));
waiting.await(); lock.lock(); boolean signalerEntered=true; try { state.set(true); ready.signal(); } finally { lock.unlock(); } worker.join();
emit(2,"ready",String.valueOf(ready),"waiting",String.valueOf(waiting),"state",String.valueOf(state),"observed",String.valueOf(observed),"signalerEntered",String.valueOf(signalerEntered));
String result="signalerEntered="+signalerEntered+", waiterObserved="+observed.get();
emit(3,"ready",String.valueOf(ready),"waiting",String.valueOf(waiting),"state",String.valueOf(state),"observed",String.valueOf(observed),"signalerEntered",String.valueOf(signalerEntered),"result",String.valueOf(result));
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
