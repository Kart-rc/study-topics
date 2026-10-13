// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
double mean=1.0, sd=0.5, elapsed=1.2;
emit(0,"mean",String.valueOf(mean));
double z=(elapsed-mean)/sd;
double cdf=1.0/(1.0+Math.exp(-1.702*z));
emit(1,"mean",String.valueOf(mean),"z",String.valueOf(z),"cdf",String.valueOf(cdf));
double phi=-Math.log10(Math.max(1e-9,1-cdf));
boolean suspect=phi>=3.0;
emit(2,"mean",String.valueOf(mean),"z",String.valueOf(z),"cdf",String.valueOf(cdf),"phi",String.valueOf(phi),"suspect",String.valueOf(suspect));
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
