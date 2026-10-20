// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var lock = new java.util.concurrent.locks.StampedLock(); int x = 10;
emit(0,"lock",String.valueOf(lock),"x",String.valueOf(x));
long stamp = lock.tryOptimisticRead(); int observed = x;
emit(1,"lock",String.valueOf(lock),"x",String.valueOf(x),"observed",String.valueOf(observed));
long ws = lock.writeLock(); x = 11; lock.unlockWrite(ws);
emit(2,"lock",String.valueOf(lock),"x",String.valueOf(x),"observed",String.valueOf(observed));
boolean valid = lock.validate(stamp); int safe = valid ? observed : x;
emit(3,"lock",String.valueOf(lock),"x",String.valueOf(x),"observed",String.valueOf(observed),"valid",String.valueOf(valid),"safe",String.valueOf(safe));
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
