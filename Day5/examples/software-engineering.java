// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var ring = new java.util.TreeMap<Integer, String>();
emit(0,"ring",String.valueOf(ring));
ring.put(20, "A"); ring.put(50, "B"); ring.put(80, "C");
emit(1,"ring",String.valueOf(ring));
String owner25Before = ring.ceilingEntry(25).getValue();
emit(2,"ring",String.valueOf(ring),"owner25Before",String.valueOf(owner25Before));
ring.put(40, "D");
emit(3,"ring",String.valueOf(ring),"owner25Before",String.valueOf(owner25Before));
String owner25After = ring.ceilingEntry(25).getValue();
emit(4,"ring",String.valueOf(ring),"owner25Before",String.valueOf(owner25Before),"owner25After",String.valueOf(owner25After));
String owner45After = ring.ceilingEntry(45).getValue();
emit(5,"ring",String.valueOf(ring),"owner25Before",String.valueOf(owner25Before),"owner25After",String.valueOf(owner25After),"owner45After",String.valueOf(owner45After));
String owner90 = ring.firstEntry().getValue();
emit(6,"ring",String.valueOf(ring),"owner25Before",String.valueOf(owner25Before),"owner25After",String.valueOf(owner25After),"owner45After",String.valueOf(owner45After),"owner90",String.valueOf(owner90));
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
