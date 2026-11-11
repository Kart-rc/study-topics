// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int requested = 10;
emit(0,"requested",String.valueOf(requested));
int bufferCapacity = 4; int processedImmediately = 3;
emit(1,"requested",String.valueOf(requested),"bufferCapacity",String.valueOf(bufferCapacity),"processedImmediately",String.valueOf(processedImmediately));
int delivered = Math.min(requested, bufferCapacity + processedImmediately); int queued = Math.max(0, delivered - processedImmediately);
emit(2,"requested",String.valueOf(requested),"bufferCapacity",String.valueOf(bufferCapacity),"processedImmediately",String.valueOf(processedImmediately),"delivered",String.valueOf(delivered),"queued",String.valueOf(queued));
int notDelivered = requested - delivered; String result = "delivered=" + delivered + ", queued=" + queued + ", notDelivered=" + notDelivered;
emit(3,"requested",String.valueOf(requested),"bufferCapacity",String.valueOf(bufferCapacity),"processedImmediately",String.valueOf(processedImmediately),"delivered",String.valueOf(delivered),"queued",String.valueOf(queued),"notDelivered",String.valueOf(notDelivered),"result",String.valueOf(result));
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
