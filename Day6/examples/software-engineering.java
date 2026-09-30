// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int originalMs = 900;
emit(0,"originalMs",String.valueOf(originalMs));
int hedgeDelayMs = 100;
emit(1,"originalMs",String.valueOf(originalMs),"hedgeDelayMs",String.valueOf(hedgeDelayMs));
int backupMs = 70;
emit(2,"originalMs",String.valueOf(originalMs),"hedgeDelayMs",String.valueOf(hedgeDelayMs),"backupMs",String.valueOf(backupMs));
boolean launchBackup = originalMs > hedgeDelayMs;
emit(3,"originalMs",String.valueOf(originalMs),"hedgeDelayMs",String.valueOf(hedgeDelayMs),"backupMs",String.valueOf(backupMs),"launchBackup",String.valueOf(launchBackup));
int completionMs = Math.min(originalMs, hedgeDelayMs + backupMs);
emit(4,"originalMs",String.valueOf(originalMs),"hedgeDelayMs",String.valueOf(hedgeDelayMs),"backupMs",String.valueOf(backupMs),"launchBackup",String.valueOf(launchBackup),"completionMs",String.valueOf(completionMs));
boolean hedgeNormalRead = 50 > hedgeDelayMs;
emit(5,"originalMs",String.valueOf(originalMs),"hedgeDelayMs",String.valueOf(hedgeDelayMs),"backupMs",String.valueOf(backupMs),"launchBackup",String.valueOf(launchBackup),"completionMs",String.valueOf(completionMs),"hedgeNormalRead",String.valueOf(hedgeNormalRead));
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
