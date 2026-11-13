// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
int totalSteps=3; int completedSteps=1;
emit(0,"totalSteps",String.valueOf(totalSteps),"completedSteps",String.valueOf(completedSteps));
boolean futureCancelled=true; boolean mayInterruptIfRunning=true;
emit(1,"totalSteps",String.valueOf(totalSteps),"completedSteps",String.valueOf(completedSteps),"futureCancelled",String.valueOf(futureCancelled),"mayInterruptIfRunning",String.valueOf(mayInterruptIfRunning));
boolean implementationUsesInterrupts=false; completedSteps=implementationUsesInterrupts ? completedSteps : totalSteps;
emit(2,"totalSteps",String.valueOf(totalSteps),"completedSteps",String.valueOf(completedSteps),"futureCancelled",String.valueOf(futureCancelled),"mayInterruptIfRunning",String.valueOf(mayInterruptIfRunning),"implementationUsesInterrupts",String.valueOf(implementationUsesInterrupts));
String result="futureCancelled="+futureCancelled+", workerSteps="+completedSteps;
emit(3,"totalSteps",String.valueOf(totalSteps),"completedSteps",String.valueOf(completedSteps),"futureCancelled",String.valueOf(futureCancelled),"mayInterruptIfRunning",String.valueOf(mayInterruptIfRunning),"implementationUsesInterrupts",String.valueOf(implementationUsesInterrupts),"result",String.valueOf(result));
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
