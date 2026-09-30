// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int tokenA = 1;
emit(0,"tokenA",String.valueOf(tokenA));
int tokenB = 2;
emit(1,"tokenA",String.valueOf(tokenA),"tokenB",String.valueOf(tokenB));
int newestAccepted = tokenB;
emit(2,"tokenA",String.valueOf(tokenA),"tokenB",String.valueOf(tokenB),"newestAccepted",String.valueOf(newestAccepted));
String snapshot = "B corrected";
emit(3,"tokenA",String.valueOf(tokenA),"tokenB",String.valueOf(tokenB),"newestAccepted",String.valueOf(newestAccepted),"snapshot",String.valueOf(snapshot));
boolean allowA = tokenA >= newestAccepted;
emit(4,"tokenA",String.valueOf(tokenA),"tokenB",String.valueOf(tokenB),"newestAccepted",String.valueOf(newestAccepted),"snapshot",String.valueOf(snapshot),"allowA",String.valueOf(allowA));
snapshot = allowA ? "A stale" : snapshot;
emit(5,"tokenA",String.valueOf(tokenA),"tokenB",String.valueOf(tokenB),"newestAccepted",String.valueOf(newestAccepted),"snapshot",String.valueOf(snapshot),"allowA",String.valueOf(allowA));
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
