// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var inventory = new java.util.concurrent.CompletableFuture<String>(); var payment = new java.util.concurrent.CompletableFuture<String>(); var shipping = new java.util.concurrent.CompletableFuture<String>();
emit(0,"inventory",String.valueOf(inventory),"payment",String.valueOf(payment),"shipping",String.valueOf(shipping));
var all = java.util.concurrent.CompletableFuture.allOf(inventory, payment, shipping); inventory.complete("in-stock"); payment.completeExceptionally(new RuntimeException("declined"));
emit(1,"inventory",String.valueOf(inventory),"payment",String.valueOf(payment),"shipping",String.valueOf(shipping),"all",String.valueOf(all));
boolean doneAfterFailure = all.isDone(); shipping.complete("overnight");
emit(2,"inventory",String.valueOf(inventory),"payment",String.valueOf(payment),"shipping",String.valueOf(shipping),"all",String.valueOf(all),"doneAfterFailure",String.valueOf(doneAfterFailure));
boolean doneAfterAll = all.isDone(); boolean aggregateExceptional = all.isCompletedExceptionally(); String inventoryValue = inventory.join(); String shippingValue = shipping.join();
emit(3,"inventory",String.valueOf(inventory),"payment",String.valueOf(payment),"shipping",String.valueOf(shipping),"all",String.valueOf(all),"doneAfterFailure",String.valueOf(doneAfterFailure),"doneAfterAll",String.valueOf(doneAfterAll),"aggregateExceptional",String.valueOf(aggregateExceptional),"inventoryValue",String.valueOf(inventoryValue),"shippingValue",String.valueOf(shippingValue));
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
