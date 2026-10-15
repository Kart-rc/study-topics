// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int t1First=7; int t1Second=9;
int t2First=9; int t2Second=7;
emit(0,"t1First",String.valueOf(t1First),"t1Second",String.valueOf(t1Second),"t2First",String.valueOf(t2First),"t2Second",String.valueOf(t2Second));
boolean cycle=(t1First==t2Second && t2First==t1Second);
emit(1,"t1First",String.valueOf(t1First),"t1Second",String.valueOf(t1Second),"t2First",String.valueOf(t2First),"t2Second",String.valueOf(t2Second),"cycle",String.valueOf(cycle));
int orderedFirst=Math.min(7,9);
int orderedSecond=Math.max(7,9);
emit(2,"t1First",String.valueOf(t1First),"t1Second",String.valueOf(t1Second),"t2First",String.valueOf(t2First),"t2Second",String.valueOf(t2Second),"cycle",String.valueOf(cycle),"orderedFirst",String.valueOf(orderedFirst),"orderedSecond",String.valueOf(orderedSecond));
boolean sameOrder=(orderedFirst==7 && orderedSecond==9);
emit(3,"t1First",String.valueOf(t1First),"t1Second",String.valueOf(t1Second),"t2First",String.valueOf(t2First),"t2Second",String.valueOf(t2Second),"cycle",String.valueOf(cycle),"orderedFirst",String.valueOf(orderedFirst),"orderedSecond",String.valueOf(orderedSecond),"sameOrder",String.valueOf(sameOrder));
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
