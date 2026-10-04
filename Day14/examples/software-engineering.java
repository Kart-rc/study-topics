// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int pageStock = 5;
int walStock = 4;
boolean walDurable = false;
emit(0,"pageStock",String.valueOf(pageStock),"walStock",String.valueOf(walStock),"walDurable",String.valueOf(walDurable));
walDurable = true;
boolean commitAcknowledged = true;
emit(1,"pageStock",String.valueOf(pageStock),"walStock",String.valueOf(walStock),"walDurable",String.valueOf(walDurable),"commitAcknowledged",String.valueOf(commitAcknowledged));
boolean crashedBeforePageWrite = true;
emit(2,"pageStock",String.valueOf(pageStock),"walStock",String.valueOf(walStock),"walDurable",String.valueOf(walDurable),"commitAcknowledged",String.valueOf(commitAcknowledged),"crashedBeforePageWrite",String.valueOf(crashedBeforePageWrite));
int recoveredStock = walDurable ? walStock : pageStock;
emit(3,"pageStock",String.valueOf(pageStock),"walStock",String.valueOf(walStock),"walDurable",String.valueOf(walDurable),"commitAcknowledged",String.valueOf(commitAcknowledged),"crashedBeforePageWrite",String.valueOf(crashedBeforePageWrite),"recoveredStock",String.valueOf(recoveredStock));
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
