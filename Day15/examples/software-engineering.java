// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int workSecondsRemaining = 8;
int graceSeconds = 10;
boolean acceptingNew = true;
emit(0,"workSecondsRemaining",String.valueOf(workSecondsRemaining),"graceSeconds",String.valueOf(graceSeconds),"acceptingNew",String.valueOf(acceptingNew));
acceptingNew = false;
int drainedSeconds = Math.min(workSecondsRemaining, graceSeconds);
emit(1,"workSecondsRemaining",String.valueOf(workSecondsRemaining),"graceSeconds",String.valueOf(graceSeconds),"acceptingNew",String.valueOf(acceptingNew),"drainedSeconds",String.valueOf(drainedSeconds));
workSecondsRemaining -= drainedSeconds;
boolean completed = workSecondsRemaining == 0;
emit(2,"workSecondsRemaining",String.valueOf(workSecondsRemaining),"graceSeconds",String.valueOf(graceSeconds),"acceptingNew",String.valueOf(acceptingNew),"drainedSeconds",String.valueOf(drainedSeconds),"completed",String.valueOf(completed));
boolean forceKilled = !completed;
String recovery = completed ? "none" : "retry-idempotently";
emit(3,"workSecondsRemaining",String.valueOf(workSecondsRemaining),"graceSeconds",String.valueOf(graceSeconds),"acceptingNew",String.valueOf(acceptingNew),"drainedSeconds",String.valueOf(drainedSeconds),"completed",String.valueOf(completed),"forceKilled",String.valueOf(forceKilled),"recovery",String.valueOf(recovery));
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
