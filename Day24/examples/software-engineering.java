// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
Thread.currentThread().interrupt(); boolean beforeSleep=Thread.currentThread().isInterrupted();
emit(0,"beforeSleep",String.valueOf(beforeSleep));
boolean caught=false;
try { Thread.sleep(1); } catch (InterruptedException e) { caught=true; }; boolean afterCatch=Thread.currentThread().isInterrupted();
emit(1,"beforeSleep",String.valueOf(beforeSleep),"caught",String.valueOf(caught),"afterCatch",String.valueOf(afterCatch));
Thread.currentThread().interrupt();
boolean restored=Thread.currentThread().isInterrupted();
String action=restored ? "stop" : "continue";
emit(2,"beforeSleep",String.valueOf(beforeSleep),"caught",String.valueOf(caught),"afterCatch",String.valueOf(afterCatch),"restored",String.valueOf(restored),"action",String.valueOf(action));
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
