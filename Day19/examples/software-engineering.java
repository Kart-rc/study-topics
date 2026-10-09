// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var ref = new java.util.concurrent.atomic.AtomicStampedReference<String>("A", 0);
String seen = ref.getReference();
int seenStamp = ref.getStamp();
emit(0,"ref",String.valueOf(ref),"seen",String.valueOf(seen),"seenStamp",String.valueOf(seenStamp));
ref.compareAndSet("A", "B", 0, 1);
ref.compareAndSet("B", "A", 1, 2);
boolean valueMatches = ref.getReference().equals(seen);
emit(1,"ref",String.valueOf(ref),"seen",String.valueOf(seen),"seenStamp",String.valueOf(seenStamp),"valueMatches",String.valueOf(valueMatches));
boolean staleUpdate = ref.compareAndSet(seen, "C", seenStamp, seenStamp + 1);
String finalValue = ref.getReference();
int finalStamp = ref.getStamp();
emit(2,"ref",String.valueOf(ref),"seen",String.valueOf(seen),"seenStamp",String.valueOf(seenStamp),"valueMatches",String.valueOf(valueMatches),"staleUpdate",String.valueOf(staleUpdate),"finalValue",String.valueOf(finalValue),"finalStamp",String.valueOf(finalStamp));
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
