// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int permits=2; boolean acquired=false;
emit(0,"permits",String.valueOf(permits),"acquired",String.valueOf(acquired));
permits--; acquired=true;
emit(1,"permits",String.valueOf(permits),"acquired",String.valueOf(acquired));
boolean failed=true;
emit(2,"permits",String.valueOf(permits),"acquired",String.valueOf(acquired),"failed",String.valueOf(failed));
if(acquired) permits++; String result="failed="+failed+", permits="+permits;
emit(3,"permits",String.valueOf(permits),"acquired",String.valueOf(acquired),"failed",String.valueOf(failed),"result",String.valueOf(result));
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
