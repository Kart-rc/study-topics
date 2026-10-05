// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int arrivals = 120;
emit(0,"arrivals",String.valueOf(arrivals));
int service = 100;
emit(1,"arrivals",String.valueOf(arrivals),"service",String.valueOf(service));
int growth = arrivals - service;
emit(2,"arrivals",String.valueOf(arrivals),"service",String.valueOf(service),"growth",String.valueOf(growth));
int secondsToFill = 300 / growth;
emit(3,"arrivals",String.valueOf(arrivals),"service",String.valueOf(service),"growth",String.valueOf(growth),"secondsToFill",String.valueOf(secondsToFill));
arrivals = 80;
emit(4,"arrivals",String.valueOf(arrivals),"service",String.valueOf(service),"growth",String.valueOf(growth),"secondsToFill",String.valueOf(secondsToFill));
int secondsToDrain = 300 / (service - arrivals);
emit(5,"arrivals",String.valueOf(arrivals),"service",String.valueOf(service),"growth",String.valueOf(growth),"secondsToFill",String.valueOf(secondsToFill),"secondsToDrain",String.valueOf(secondsToDrain));
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
