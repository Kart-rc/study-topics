// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int core = 2; int max = 8; int submitted = 10; boolean unbounded = true;
emit(0,"core",String.valueOf(core),"max",String.valueOf(max),"submitted",String.valueOf(submitted),"unbounded",String.valueOf(unbounded));
int running = Math.min(core, submitted); int remaining = submitted - running;
emit(1,"core",String.valueOf(core),"max",String.valueOf(max),"submitted",String.valueOf(submitted),"unbounded",String.valueOf(unbounded),"running",String.valueOf(running),"remaining",String.valueOf(remaining));
int queued = unbounded ? remaining : Math.min(2, remaining); boolean queueFull = !unbounded && queued == 2;
emit(2,"core",String.valueOf(core),"max",String.valueOf(max),"submitted",String.valueOf(submitted),"unbounded",String.valueOf(unbounded),"running",String.valueOf(running),"remaining",String.valueOf(remaining),"queued",String.valueOf(queued),"queueFull",String.valueOf(queueFull));
int extraWorkers = queueFull ? Math.min(max - core, remaining - queued) : 0; running += extraWorkers; String result = running + " running, " + queued + " queued";
emit(3,"core",String.valueOf(core),"max",String.valueOf(max),"submitted",String.valueOf(submitted),"unbounded",String.valueOf(unbounded),"running",String.valueOf(running),"remaining",String.valueOf(remaining),"queued",String.valueOf(queued),"queueFull",String.valueOf(queueFull),"extraWorkers",String.valueOf(extraWorkers),"result",String.valueOf(result));
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
