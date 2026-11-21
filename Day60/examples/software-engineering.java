// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var p=new java.util.concurrent.Phaser(3);
emit(0,"p",String.valueOf(p));
p.arrive(); p.arrive();
emit(1,"p",String.valueOf(p));
int phase=p.arriveAndDeregister();
emit(2,"p",String.valueOf(p),"phase",String.valueOf(phase));
String result="phase="+p.getPhase()+",parties="+p.getRegisteredParties()+",returned="+phase;
emit(3,"p",String.valueOf(p),"phase",String.valueOf(phase),"result",String.valueOf(result));
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
