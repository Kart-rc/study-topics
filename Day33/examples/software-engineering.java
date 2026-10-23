// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var tenant = new ThreadLocal<String>();
emit(0,"tenant",String.valueOf(tenant));
tenant.set("east");
emit(1,"tenant",String.valueOf(tenant));
var leakedTenant = tenant.get();
emit(2,"tenant",String.valueOf(tenant),"leakedTenant",String.valueOf(leakedTenant));
tenant.remove(); var cleanedTenant = String.valueOf(tenant.get());
emit(3,"tenant",String.valueOf(tenant),"leakedTenant",String.valueOf(leakedTenant),"cleanedTenant",String.valueOf(cleanedTenant));
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
