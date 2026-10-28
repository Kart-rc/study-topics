// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var lock = new java.util.concurrent.locks.ReentrantReadWriteLock();
emit(0,"lock",String.valueOf(lock));
lock.readLock().lock(); boolean upgraded = lock.writeLock().tryLock();
emit(1,"lock",String.valueOf(lock),"upgraded",String.valueOf(upgraded));
lock.readLock().unlock(); boolean acquiredAfterRelease = lock.writeLock().tryLock();
emit(2,"lock",String.valueOf(lock),"upgraded",String.valueOf(upgraded),"acquiredAfterRelease",String.valueOf(acquiredAfterRelease));
String outcome = acquiredAfterRelease ? "release-read-then-recheck" : "blocked"; lock.writeLock().unlock();
emit(3,"lock",String.valueOf(lock),"upgraded",String.valueOf(upgraded),"acquiredAfterRelease",String.valueOf(acquiredAfterRelease),"outcome",String.valueOf(outcome));
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
