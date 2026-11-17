// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
String[] names={"A","B","C"}; String[] values={"fail","order-56","order-56"};
emit(0);
String failures=names[0];
emit(1,"failures",String.valueOf(failures));
int winnerIndex=1; String winner=names[winnerIndex]; String value=values[winnerIndex];
emit(2,"failures",String.valueOf(failures),"winnerIndex",String.valueOf(winnerIndex),"winner",String.valueOf(winner),"value",String.valueOf(value));
String cancelRequested=names[2]; String result="winner="+winner+", value="+value+", failures="+failures+", cancel="+cancelRequested;
emit(3,"failures",String.valueOf(failures),"winnerIndex",String.valueOf(winnerIndex),"winner",String.valueOf(winner),"value",String.valueOf(value),"cancelRequested",String.valueOf(cancelRequested),"result",String.valueOf(result));
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
