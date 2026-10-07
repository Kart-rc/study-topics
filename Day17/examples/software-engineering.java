// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var bits = new java.util.BitSet(8);
var inserted = java.util.Set.of(1, 2);
emit(0,"bits",String.valueOf(bits),"inserted",String.valueOf(inserted));
for (int id : inserted) { bits.set(id % 8); bits.set((3 * id + 1) % 8); }
emit(1,"bits",String.valueOf(bits),"inserted",String.valueOf(inserted));
int query = 9;
boolean maybe = bits.get(query % 8) && bits.get((3 * query + 1) % 8);
emit(2,"bits",String.valueOf(bits),"inserted",String.valueOf(inserted),"query",String.valueOf(query),"maybe",String.valueOf(maybe));
boolean exact = inserted.contains(query);
boolean falsePositive = maybe && !exact;
emit(3,"bits",String.valueOf(bits),"inserted",String.valueOf(inserted),"query",String.valueOf(query),"maybe",String.valueOf(maybe),"exact",String.valueOf(exact),"falsePositive",String.valueOf(falsePositive));
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
