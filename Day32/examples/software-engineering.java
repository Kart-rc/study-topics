// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var listeners = new java.util.concurrent.CopyOnWriteArrayList<String>(java.util.List.of("billing", "audit"));
emit(0,"listeners",String.valueOf(listeners));
var oldIterator = listeners.iterator();
emit(1,"listeners",String.valueOf(listeners),"oldIterator",String.valueOf(oldIterator));
listeners.add("fraud");
emit(2,"listeners",String.valueOf(listeners),"oldIterator",String.valueOf(oldIterator));
var currentCount = listeners.size(); var oldCount = 0; while (oldIterator.hasNext()) { oldIterator.next(); oldCount++; }
emit(3,"listeners",String.valueOf(listeners),"oldIterator",String.valueOf(oldIterator),"currentCount",String.valueOf(currentCount),"oldCount",String.valueOf(oldCount));
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
