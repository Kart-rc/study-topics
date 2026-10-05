// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
double capacity = 3;
double rate = 2;
double tokens = capacity;
int admitted = 0;
int refused = 0;
emit(0,"capacity",String.valueOf(capacity),"rate",String.valueOf(rate),"tokens",String.valueOf(tokens),"admitted",String.valueOf(admitted),"refused",String.valueOf(refused));
for (int i = 0; i < 5; i++) {
  if (tokens >= 1) { tokens -= 1; admitted++; }
  else { refused++; }
}
emit(1,"capacity",String.valueOf(capacity),"rate",String.valueOf(rate),"tokens",String.valueOf(tokens),"admitted",String.valueOf(admitted),"refused",String.valueOf(refused));
double elapsed = 0.5;
tokens = Math.min(capacity, tokens + rate * elapsed);
emit(2,"capacity",String.valueOf(capacity),"rate",String.valueOf(rate),"tokens",String.valueOf(tokens),"admitted",String.valueOf(admitted),"refused",String.valueOf(refused),"elapsed",String.valueOf(elapsed));
if (tokens >= 1) { tokens -= 1; admitted++; }
emit(3,"capacity",String.valueOf(capacity),"rate",String.valueOf(rate),"tokens",String.valueOf(tokens),"admitted",String.valueOf(admitted),"refused",String.valueOf(refused),"elapsed",String.valueOf(elapsed));
tokens = Math.min(capacity, tokens + rate * 10);
emit(4,"capacity",String.valueOf(capacity),"rate",String.valueOf(rate),"tokens",String.valueOf(tokens),"admitted",String.valueOf(admitted),"refused",String.valueOf(refused),"elapsed",String.valueOf(elapsed));
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
