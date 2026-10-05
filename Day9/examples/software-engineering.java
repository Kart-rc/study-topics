// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
String leftA = hash("A|B");
emit(0,"leftA",String.valueOf(leftA));
String leftB = hash("A|B");
emit(1,"leftA",String.valueOf(leftA),"leftB",String.valueOf(leftB));
String rightA = hash("C|D");
emit(2,"leftA",String.valueOf(leftA),"leftB",String.valueOf(leftB),"rightA",String.valueOf(rightA));
String rightB = hash("C|X");
emit(3,"leftA",String.valueOf(leftA),"leftB",String.valueOf(leftB),"rightA",String.valueOf(rightA),"rightB",String.valueOf(rightB));
boolean rootsMatch = hash(leftA + rightA).equals(hash(leftB + rightB));
emit(4,"leftA",String.valueOf(leftA),"leftB",String.valueOf(leftB),"rightA",String.valueOf(rightA),"rightB",String.valueOf(rightB),"rootsMatch",String.valueOf(rootsMatch));
boolean skipLeft = leftA.equals(leftB);
emit(5,"leftA",String.valueOf(leftA),"leftB",String.valueOf(leftB),"rightA",String.valueOf(rightA),"rightB",String.valueOf(rightB),"rootsMatch",String.valueOf(rootsMatch),"skipLeft",String.valueOf(skipLeft));
String inspectNext = rightA.equals(rightB) ? "none" : "right branch";
emit(6,"leftA",String.valueOf(leftA),"leftB",String.valueOf(leftB),"rightA",String.valueOf(rightA),"rightB",String.valueOf(rightB),"rootsMatch",String.valueOf(rootsMatch),"skipLeft",String.valueOf(skipLeft),"inspectNext",String.valueOf(inspectNext));
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
