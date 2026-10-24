// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
record OrderKey(String tenant, int orderId) {}
emit(0);
var cache = new java.util.HashMap<OrderKey, String>();
emit(1,"cache",String.valueOf(cache));
var east42 = new OrderKey("east", 42); cache.put(east42, "shipped");
emit(2,"cache",String.valueOf(cache),"east42",String.valueOf(east42));
var lookup = cache.get(new OrderKey("east", 42));
emit(3,"cache",String.valueOf(cache),"east42",String.valueOf(east42),"lookup",String.valueOf(lookup));
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
