// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var incoming = new java.util.LinkedHashMap<Integer, String>();
emit(0,"incoming",String.valueOf(incoming));
incoming.put(1, "orders"); incoming.put(2, "data-team"); incoming.put(3, "restricted");
emit(1,"incoming",String.valueOf(incoming));
var binaryRelay = new java.util.LinkedHashMap<Integer, String>(incoming);
emit(2,"incoming",String.valueOf(incoming),"binaryRelay",String.valueOf(binaryRelay));
var knownOnly = new java.util.LinkedHashMap<Integer, String>();
emit(3,"incoming",String.valueOf(incoming),"binaryRelay",String.valueOf(binaryRelay),"knownOnly",String.valueOf(knownOnly));
knownOnly.put(1, incoming.get(1)); knownOnly.put(2, incoming.get(2));
emit(4,"incoming",String.valueOf(incoming),"binaryRelay",String.valueOf(binaryRelay),"knownOnly",String.valueOf(knownOnly));
boolean classificationSurvives = knownOnly.containsKey(3);
emit(5,"incoming",String.valueOf(incoming),"binaryRelay",String.valueOf(binaryRelay),"knownOnly",String.valueOf(knownOnly),"classificationSurvives",String.valueOf(classificationSurvives));
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
