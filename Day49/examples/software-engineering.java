// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
String customer = "customer-42";
emit(0,"customer",String.valueOf(customer));
java.util.concurrent.CompletableFuture<java.util.concurrent.CompletableFuture<String>> nested = java.util.concurrent.CompletableFuture.completedFuture(customer).thenApply(id -> java.util.concurrent.CompletableFuture.completedFuture("order-7")); boolean innerStageRequired = nested.join() instanceof java.util.concurrent.CompletionStage;
emit(1,"customer",String.valueOf(customer),"innerStageRequired",String.valueOf(innerStageRequired));
java.util.concurrent.CompletableFuture<String> flat = java.util.concurrent.CompletableFuture.completedFuture(customer).thenCompose(id -> java.util.concurrent.CompletableFuture.completedFuture("order-7")); String order = flat.join();
emit(2,"customer",String.valueOf(customer),"innerStageRequired",String.valueOf(innerStageRequired),"order",String.valueOf(order));
String result = "nested needs inner stage=" + innerStageRequired + "; flat value=" + order;
emit(3,"customer",String.valueOf(customer),"innerStageRequired",String.valueOf(innerStageRequired),"order",String.valueOf(order),"result",String.valueOf(result));
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
