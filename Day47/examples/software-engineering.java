// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
java.util.concurrent.ConcurrentHashMap<String,Integer> m=new java.util.concurrent.ConcurrentHashMap<>(); m.put("A",5); m.put("B",7);
emit(0);
int seenA=m.get("A");
emit(1,"seenA",String.valueOf(seenA));
m.put("A",4); m.put("C",9);
emit(2,"seenA",String.valueOf(seenA));
int seenB=m.get("B"); int seenC=m.get("C"); String report="A="+seenA+", B="+seenB+", C="+seenC;
emit(3,"seenA",String.valueOf(seenA),"seenB",String.valueOf(seenB),"seenC",String.valueOf(seenC),"report",String.valueOf(report));
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
