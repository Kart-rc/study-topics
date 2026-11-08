// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int carriers=2; int requests=20; int dbPermits=8;
emit(0,"carriers",String.valueOf(carriers),"requests",String.valueOf(requests),"dbPermits",String.valueOf(dbPermits));
int jdk21Progress=Math.min(carriers,dbPermits);
emit(1,"carriers",String.valueOf(carriers),"requests",String.valueOf(requests),"dbPermits",String.valueOf(dbPermits),"jdk21Progress",String.valueOf(jdk21Progress));
int jdk24Progress=Math.min(requests,dbPermits);
emit(2,"carriers",String.valueOf(carriers),"requests",String.valueOf(requests),"dbPermits",String.valueOf(dbPermits),"jdk21Progress",String.valueOf(jdk21Progress),"jdk24Progress",String.valueOf(jdk24Progress));
String result="JDK21="+jdk21Progress+", JDK24="+jdk24Progress;
emit(3,"carriers",String.valueOf(carriers),"requests",String.valueOf(requests),"dbPermits",String.valueOf(dbPermits),"jdk21Progress",String.valueOf(jdk21Progress),"jdk24Progress",String.valueOf(jdk24Progress),"result",String.valueOf(result));
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
