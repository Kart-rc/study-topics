// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var slots = new java.util.concurrent.Semaphore(2);
boolean a = slots.tryAcquire();
int free = slots.availablePermits();
emit(0,"slots",String.valueOf(slots),"a",String.valueOf(a),"free",String.valueOf(free));
boolean b = slots.tryAcquire();
boolean c = slots.tryAcquire();
free = slots.availablePermits();
emit(1,"slots",String.valueOf(slots),"a",String.valueOf(a),"free",String.valueOf(free),"b",String.valueOf(b),"c",String.valueOf(c));
slots.release();
boolean d = slots.tryAcquire();
free = slots.availablePermits();
emit(2,"slots",String.valueOf(slots),"a",String.valueOf(a),"free",String.valueOf(free),"b",String.valueOf(b),"c",String.valueOf(c),"d",String.valueOf(d));
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
