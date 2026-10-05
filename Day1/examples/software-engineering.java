// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int userRequests = 100;
emit(0,"userRequests",String.valueOf(userRequests));
int apiAttempts = 3;
emit(1,"userRequests",String.valueOf(userRequests),"apiAttempts",String.valueOf(apiAttempts));
int serviceAttempts = 3;
emit(2,"userRequests",String.valueOf(userRequests),"apiAttempts",String.valueOf(apiAttempts),"serviceAttempts",String.valueOf(serviceAttempts));
int adapterAttempts = 3;
emit(3,"userRequests",String.valueOf(userRequests),"apiAttempts",String.valueOf(apiAttempts),"serviceAttempts",String.valueOf(serviceAttempts),"adapterAttempts",String.valueOf(adapterAttempts));
int catalogCalls = userRequests * apiAttempts * serviceAttempts * adapterAttempts;
emit(4,"userRequests",String.valueOf(userRequests),"apiAttempts",String.valueOf(apiAttempts),"serviceAttempts",String.valueOf(serviceAttempts),"adapterAttempts",String.valueOf(adapterAttempts),"catalogCalls",String.valueOf(catalogCalls));
int oneOwnerCalls = userRequests * 3;
emit(5,"userRequests",String.valueOf(userRequests),"apiAttempts",String.valueOf(apiAttempts),"serviceAttempts",String.valueOf(serviceAttempts),"adapterAttempts",String.valueOf(adapterAttempts),"catalogCalls",String.valueOf(catalogCalls),"oneOwnerCalls",String.valueOf(oneOwnerCalls));
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
