// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
class LoudResource implements AutoCloseable { public void close() { throw new RuntimeException("close failed"); } }
emit(0);
RuntimeException primary = null; int suppressed = 0;
emit(1,"suppressed",String.valueOf(suppressed));
try (LoudResource r = new LoudResource()) { throw new RuntimeException("work failed"); } catch (RuntimeException e) { primary = e; suppressed = e.getSuppressed().length; }
emit(2,"suppressed",String.valueOf(suppressed));
String primaryMessage = primary.getMessage(); String closeMessage = primary.getSuppressed()[0].getMessage();
emit(3,"suppressed",String.valueOf(suppressed),"primaryMessage",String.valueOf(primaryMessage),"closeMessage",String.valueOf(closeMessage));
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
