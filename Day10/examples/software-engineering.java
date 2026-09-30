// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
String state = "closed"; int failures = 0;
emit(0,"state",String.valueOf(state),"failures",String.valueOf(failures));
failures += 1;
emit(1,"state",String.valueOf(state),"failures",String.valueOf(failures));
failures += 1;
emit(2,"state",String.valueOf(state),"failures",String.valueOf(failures));
failures += 1;
emit(3,"state",String.valueOf(state),"failures",String.valueOf(failures));
state = failures >= 3 ? "open" : state;
emit(4,"state",String.valueOf(state),"failures",String.valueOf(failures));
boolean forwardFourthCall = !state.equals("open");
emit(5,"state",String.valueOf(state),"failures",String.valueOf(failures),"forwardFourthCall",String.valueOf(forwardFourthCall));
state = "half-open";
emit(6,"state",String.valueOf(state),"failures",String.valueOf(failures),"forwardFourthCall",String.valueOf(forwardFourthCall));
boolean probeSucceeded = true;
emit(7,"state",String.valueOf(state),"failures",String.valueOf(failures),"forwardFourthCall",String.valueOf(forwardFourthCall),"probeSucceeded",String.valueOf(probeSucceeded));
state = probeSucceeded ? "closed" : "open";
emit(8,"state",String.valueOf(state),"failures",String.valueOf(failures),"forwardFourthCall",String.valueOf(forwardFourthCall),"probeSucceeded",String.valueOf(probeSucceeded));
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
