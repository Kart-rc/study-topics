// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int applyCalls=0; int emails=0; String current="v1";
emit(0,"applyCalls",String.valueOf(applyCalls),"emails",String.valueOf(emails),"current",String.valueOf(current));
applyCalls++; emails++; String candidate="v2";
emit(1,"applyCalls",String.valueOf(applyCalls),"emails",String.valueOf(emails),"current",String.valueOf(current),"candidate",String.valueOf(candidate));
boolean contention=true; if(contention){applyCalls++; emails++; candidate="v2";}
emit(2,"applyCalls",String.valueOf(applyCalls),"emails",String.valueOf(emails),"current",String.valueOf(current),"candidate",String.valueOf(candidate),"contention",String.valueOf(contention));
current=candidate; String result="value="+current+", calls="+applyCalls+", emails="+emails;
emit(3,"applyCalls",String.valueOf(applyCalls),"emails",String.valueOf(emails),"current",String.valueOf(current),"candidate",String.valueOf(candidate),"contention",String.valueOf(contention),"result",String.valueOf(result));
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
