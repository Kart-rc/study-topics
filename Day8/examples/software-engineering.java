// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int remaining = 10; int version = 7;
emit(0,"remaining",String.valueOf(remaining),"version",String.valueOf(version));
int seenA = version; int seenB = version;
emit(1,"remaining",String.valueOf(remaining),"version",String.valueOf(version),"seenA",String.valueOf(seenA),"seenB",String.valueOf(seenB));
remaining -= 1; version += 1;
emit(2,"remaining",String.valueOf(remaining),"version",String.valueOf(version),"seenA",String.valueOf(seenA),"seenB",String.valueOf(seenB));
boolean allowB = seenB == version;
emit(3,"remaining",String.valueOf(remaining),"version",String.valueOf(version),"seenA",String.valueOf(seenA),"seenB",String.valueOf(seenB),"allowB",String.valueOf(allowB));
seenB = version;
emit(4,"remaining",String.valueOf(remaining),"version",String.valueOf(version),"seenA",String.valueOf(seenA),"seenB",String.valueOf(seenB),"allowB",String.valueOf(allowB));
remaining -= 1; version += 1;
emit(5,"remaining",String.valueOf(remaining),"version",String.valueOf(version),"seenA",String.valueOf(seenA),"seenB",String.valueOf(seenB),"allowB",String.valueOf(allowB));
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
