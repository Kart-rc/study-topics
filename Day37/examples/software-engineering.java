// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var cache = new java.util.concurrent.ConcurrentHashMap<String,String>();
emit(0,"cache",String.valueOf(cache));
String value = cache.computeIfAbsent("acme", key -> "policy-holder-v1");
emit(1,"cache",String.valueOf(cache),"value",String.valueOf(value));
boolean secondCallHits = cache.computeIfAbsent("acme", key -> "other") == value;
emit(2,"cache",String.valueOf(cache),"value",String.valueOf(value),"secondCallHits",String.valueOf(secondCallHits));
String outcome = secondCallHits ? "one holder" : "unexpected";
emit(3,"cache",String.valueOf(cache),"value",String.valueOf(value),"secondCallHits",String.valueOf(secondCallHits),"outcome",String.valueOf(outcome));
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
