// Run with: java software-engineering.java
// Main contains the lesson statements; emit records actual state.
class Example {
public static void main(String[] args) throws Exception {
var phaser=new java.util.concurrent.Phaser(3); int phase0=phaser.getPhase();
emit(0,"phaser",String.valueOf(phaser),"phase0",String.valueOf(phase0));
phaser.arrive(); phaser.arrive();
emit(1,"phaser",String.valueOf(phaser),"phase0",String.valueOf(phase0));
phaser.arriveAndAwaitAdvance(); int phase1=phaser.getPhase();
emit(2,"phaser",String.valueOf(phaser),"phase0",String.valueOf(phase0),"phase1",String.valueOf(phase1));
phaser.arriveAndDeregister(); int registered=phaser.getRegisteredParties();
emit(3,"phaser",String.valueOf(phaser),"phase0",String.valueOf(phase0),"phase1",String.valueOf(phase1),"registered",String.valueOf(registered));
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
