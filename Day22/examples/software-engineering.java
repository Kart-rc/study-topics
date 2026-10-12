// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
record Hlc(long physical, int logical) {}
emit(0);
var request=new Hlc(100,0);
long bWall=95;
emit(1,"request",String.valueOf(request));
long p=Math.max(bWall,request.physical());
emit(2,"request",String.valueOf(request));
int l=(p==request.physical())?request.logical()+1:0;
var reply=new Hlc(p,l);
emit(3,"request",String.valueOf(request),"l",String.valueOf(l),"reply",String.valueOf(reply));
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
