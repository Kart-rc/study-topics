// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var pool=java.util.concurrent.Executors.newFixedThreadPool(3); var cs=new java.util.concurrent.ExecutorCompletionService<String>(pool);
emit(0,"pool",String.valueOf(pool),"cs",String.valueOf(cs));
cs.submit(() -> {Thread.sleep(90); return "A";}); cs.submit(() -> {Thread.sleep(40); return "B";}); cs.submit(() -> {Thread.sleep(10); return "C";});
emit(1,"pool",String.valueOf(pool),"cs",String.valueOf(cs));
var order=new java.util.ArrayList<String>(); for(int i=0;i<3;i++) order.add(cs.take().get());
emit(2,"pool",String.valueOf(pool),"cs",String.valueOf(cs),"order",String.valueOf(order));
pool.shutdown(); String result=String.join(",",order);
emit(3,"pool",String.valueOf(pool),"cs",String.valueOf(cs),"order",String.valueOf(order),"result",String.valueOf(result));
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
