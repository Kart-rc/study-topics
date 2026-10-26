// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int workMs = 800;
emit(0,"workMs",String.valueOf(workMs));
int timeoutMs = 500;
emit(1,"workMs",String.valueOf(workMs),"timeoutMs",String.valueOf(timeoutMs));
boolean callerTimedOut = timeoutMs < workMs;
emit(2,"workMs",String.valueOf(workMs),"timeoutMs",String.valueOf(timeoutMs),"callerTimedOut",String.valueOf(callerTimedOut));
boolean workerStillRunning = callerTimedOut; String outcome = callerTimedOut ? "caller timed out; worker may continue" : "result returned";
emit(3,"workMs",String.valueOf(workMs),"timeoutMs",String.valueOf(timeoutMs),"callerTimedOut",String.valueOf(callerTimedOut),"workerStillRunning",String.valueOf(workerStillRunning),"outcome",String.valueOf(outcome));
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
