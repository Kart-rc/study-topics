// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int totalBudgetMs = 500;
emit(0,"totalBudgetMs",String.valueOf(totalBudgetMs));
int spentMs = 140;
emit(1,"totalBudgetMs",String.valueOf(totalBudgetMs),"spentMs",String.valueOf(spentMs));
int remainingMs = Math.max(0, totalBudgetMs - spentMs);
emit(2,"totalBudgetMs",String.valueOf(totalBudgetMs),"spentMs",String.valueOf(spentMs),"remainingMs",String.valueOf(remainingMs));
int downstreamNeedMs = 420;
emit(3,"totalBudgetMs",String.valueOf(totalBudgetMs),"spentMs",String.valueOf(spentMs),"remainingMs",String.valueOf(remainingMs),"downstreamNeedMs",String.valueOf(downstreamNeedMs));
int totalWithDeadline = spentMs + Math.min(remainingMs, downstreamNeedMs);
emit(4,"totalBudgetMs",String.valueOf(totalBudgetMs),"spentMs",String.valueOf(spentMs),"remainingMs",String.valueOf(remainingMs),"downstreamNeedMs",String.valueOf(downstreamNeedMs),"totalWithDeadline",String.valueOf(totalWithDeadline));
int totalWithFreshTimeout = spentMs + downstreamNeedMs;
emit(5,"totalBudgetMs",String.valueOf(totalBudgetMs),"spentMs",String.valueOf(spentMs),"remainingMs",String.valueOf(remainingMs),"downstreamNeedMs",String.valueOf(downstreamNeedMs),"totalWithDeadline",String.valueOf(totalWithDeadline),"totalWithFreshTimeout",String.valueOf(totalWithFreshTimeout));
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
