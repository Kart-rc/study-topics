// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var pool=java.util.concurrent.Executors.newFixedThreadPool(3); var cs=new java.util.concurrent.ExecutorCompletionService<String>(pool);
emit(0,"pool",String.valueOf(pool),"cs",String.valueOf(cs));
cs.submit(() -> {Thread.sleep(120); return "A";}); cs.submit(() -> {Thread.sleep(20); return "B";}); cs.submit(() -> {Thread.sleep(60); return "C";});
emit(1,"pool",String.valueOf(pool),"cs",String.valueOf(cs));
String first=cs.take().get(); String second=cs.take().get(); String third=cs.take().get();
emit(2,"pool",String.valueOf(pool),"cs",String.valueOf(cs),"first",String.valueOf(first),"second",String.valueOf(second),"third",String.valueOf(third));
String order=first+second+third; pool.shutdownNow();
emit(3,"pool",String.valueOf(pool),"cs",String.valueOf(cs),"first",String.valueOf(first),"second",String.valueOf(second),"third",String.valueOf(third),"order",String.valueOf(order));
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
