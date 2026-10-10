// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var startWall=12000000L; var startMono=1000000000L;
emit(0,"startWall",String.valueOf(startWall),"startMono",String.valueOf(startMono));
var endWall=11998250L; var endMono=1250000000L;
emit(1,"startWall",String.valueOf(startWall),"startMono",String.valueOf(startMono),"endWall",String.valueOf(endWall),"endMono",String.valueOf(endMono));
var wallElapsed=endWall-startWall; var monoElapsed=(endMono-startMono)/1000000L;
emit(2,"startWall",String.valueOf(startWall),"startMono",String.valueOf(startMono),"endWall",String.valueOf(endWall),"endMono",String.valueOf(endMono),"wallElapsed",String.valueOf(wallElapsed),"monoElapsed",String.valueOf(monoElapsed));
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
