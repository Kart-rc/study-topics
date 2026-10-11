// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
record Config(int timeoutMs, int retries, String route) {}
var config=new java.util.concurrent.atomic.AtomicReference<>(new Config(1000,2,"A"));
emit(0);
var before=config.get();
emit(1,"before",String.valueOf(before));
config.set(new Config(400,0,"B"));
var after=config.get();
emit(2,"before",String.valueOf(before),"after",String.valueOf(after));
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
