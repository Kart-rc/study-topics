"""Run small lesson examples and render truthful, offline execution replays."""
from pathlib import Path
import json, html, subprocess, types, re, os, shutil
R=Path(__file__).resolve().parents[1]
JAVA=os.environ.get('STUDY_JAVA') or shutil.which('java') or '/usr/lib/jvm/java-17-openjdk-amd64/bin/java'
def serializable(value):
 try:return json.loads(json.dumps(value))
 except (TypeError,ValueError):return None

def execute(folder,L):
 w=L['walkthrough'];steps=w['steps'];out=R/folder/'examples';out.mkdir(exist_ok=True)
 code='\n'.join(s['code'] for s in steps)+'\n'
 if w['language']=='python':
  file=out/(L['slug']+'.py');file.write_text('# Synthetic teaching example. No production services are contacted.\n'+code)
  env={};frames=[]
  for i,s in enumerate(steps):
   exec(compile(s['code'],str(file),'exec'),env)
   state={}
   for k,v in env.items():
    if k.startswith('_') or isinstance(v,types.ModuleType):continue
    try:state[k]=json.loads(json.dumps(v))
    except (TypeError,ValueError):continue
   frames.append({'step':i,'state':state})
  file.write_text(file.read_text()+'\n# Show the final values when run from a terminal.\nimport json as _json\nprint(_json.dumps({k: globals()[k] for k in '+repr(list(frames[-1]['state']))+'}, indent=2))\n')
  if 'db' in env:env['db'].close()
 else:
  # The full source contains a trace helper; the lesson shows the original core statements.
  variables=[];body=[]
  for i,s in enumerate(steps):
   body.append(s['code'])
   for name in re.findall(r'(?:^|;)\s*(?:var|int|double|boolean|String)\s+(\w+)\s*=',s['code']):
    if name not in variables:variables.append(name)
   args=','.join(json.dumps(k)+',String.valueOf('+k+')' for k in variables)
   body.append(f'emit({i}'+(','+args if args else '')+');')
  helper=r'''
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
'''
  file=out/(L['slug']+'.java')
  file.write_text('// Run with: java '+file.name+'\n// Main contains the lesson statements; emit records actual state.\nclass Example {\npublic static void main(String[] args) throws Exception {\n'+'\n'.join(body)+'\n}\n'+helper+'}\n')
  result=subprocess.run([JAVA,str(file)],capture_output=True,text=True,check=True,timeout=30)
  frames=[json.loads(x) for x in result.stdout.splitlines()]
 assert len(frames)==len(steps),(folder,L['slug'],'frame count')
 for k,v in w['expect'].items():
  actual=frames[-1]['state'][k]
  if isinstance(v,(int,float)) and not isinstance(v,bool):assert abs(actual-v)<1e-8,(folder,L['slug'],k,actual,v)
  else:assert actual==v,(folder,L['slug'],k,actual,v)
 w['frames']=frames;w['example_file']='examples/'+file.name
 return frames

CSS='''
.walkthrough{border-top:5px solid #247a68}.walkthrough pre{margin:8px 0;padding:12px;tab-size:2}.code-line{display:block;padding:4px 9px;border-left:4px solid transparent;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55}.code-line.active-line{background:#d6f4b5;border-left-color:#1b6f60;color:#102e28}.line-no{display:inline-block;min-width:2.4em;color:#465e58;user-select:none}.trace-columns{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}.trace-columns>div{min-width:0}.trace-state{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}.state-value{border:1px solid #ccd9ce;border-radius:9px;padding:10px;background:#f4f7f2;overflow-wrap:anywhere}.state-value.changed{border-left:5px solid #287c62}.state-value code{display:block;white-space:pre-wrap;font-size:.85rem;line-height:1.4}.state-value span{font-size:.8rem;color:#435d54}.trace-controls{display:flex;gap:8px;flex-wrap:wrap}.trace-controls button:disabled{opacity:.5;cursor:default}.walkthrough .step-note{min-height:3em;font-weight:600}.walkthrough details{margin:14px 0}.diagram{padding:20px;background:#edf4ee;border-radius:14px;margin:22px 0}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.tile{padding:18px;border:2px solid #779e91;border-radius:12px;background:#f5faf5;color:#183a35;overflow-wrap:anywhere}.tile p{margin-bottom:0}.dbgroup{border:3px solid #387966;border-radius:14px;padding:18px}.dbgroup .tiles{margin-top:12px}.arrow{text-align:center;font-weight:700}.active{background:#d6f4b5;border-color:#e1a02e}.meter{height:28px;background:#dce5de;border-radius:6px;overflow:hidden}.meter>div{height:100%;background:#247a68}code{overflow-wrap:anywhere}button{max-width:100%;white-space:normal}.lab .tile{font-size:1rem}.lab input[type=checkbox]{width:20px;height:20px;vertical-align:middle}@media(max-width:700px){.trace-columns,.tiles{grid-template-columns:1fr}.code-line{padding:4px 5px}}@media print{.walkthrough button{display:none}}
'''
def html_block(L):
 w=L['walkthrough'];lines=[];num=0
 for i,s in enumerate(w['steps']):
  for line in s['code'].splitlines():
   num+=1;lines.append(f'<span class="code-line" data-step="{i}"><span class="line-no">{num}</span>{html.escape(line)}</span>')
 advanced=L.get('advanced_detail','')
 advanced=('<details><summary>Optional deeper explanation and original worked example</summary>'+advanced+'</details>') if advanced else ''
 return f'''<section class="walkthrough" aria-labelledby="walkTitle"><h2 id="walkTitle">Watch the code, one step at a time</h2><p>Use 2 minutes of the 5-minute exploration time here, then 3 minutes in the lab below. Before each step, predict what will change.</p><p><strong>{w['language'].title()} teaching example.</strong> These values were captured by running this exact example during the build. The buttons replay that execution; they do not run Python or Java inside your browser.</p><div class="trace-controls"><button id="traceBack">← Previous step</button><button id="traceNext">Run next step →</button><button id="traceReset">Start again</button></div><p id="tracePosition" aria-live="polite"></p><p id="traceNote" class="step-note" aria-live="polite"></p><div class="trace-columns"><div><h3>Code</h3><pre id="traceCode"><code>{''.join(lines)}</code></pre></div><div><h3>Values after this step</h3><div id="traceState" class="trace-state" aria-live="polite"></div></div></div><p><a href="{w['example_file']}">Open the full runnable example</a>. The original inputs are synthetic. Resetting this replay does not reset the separate lab below.</p><details><summary>What this code proves—and what it leaves out</summary><p>{html.escape(w['limit'])}</p></details>{advanced}</section>'''

def javascript(L):
 w=L['walkthrough'];data={'steps':w['steps'],'frames':w['frames']}
 return '\nconst traceData='+json.dumps(data).replace('</','<\\/')+';'+r'''
let traceIndex=-1;
function paintTrace(){
 const frames=traceData.frames;
 const now=traceIndex<0?{}:frames[traceIndex].state;
 const before=traceIndex<=0?{}:frames[traceIndex-1].state;
 $('tracePosition').textContent=traceIndex<0?'Ready · no statements executed':`Step ${traceIndex+1} of ${frames.length}`;
 $('traceNote').textContent=traceIndex<0?'Predict the first change, then choose Run next step.':traceData.steps[traceIndex].note;
 document.querySelectorAll('#traceCode .code-line').forEach(el=>el.classList.toggle('active-line',Number(el.dataset.step)===traceIndex));
 const target=$('traceState');target.replaceChildren();
 if(Object.keys(now).length===0){const p=document.createElement('p');p.textContent=traceIndex<0?'No values yet.':'Setup completed; no displayable values yet.';target.appendChild(p);}
 for(const key of Object.keys(now)){
  const changed=JSON.stringify(before[key])!==JSON.stringify(now[key]);
  const row=document.createElement('div');row.className='state-value'+(changed?' changed':'');
  const label=document.createElement('strong');label.textContent=key;row.appendChild(label);
  const value=document.createElement('code');value.textContent=JSON.stringify(now[key],null,2);row.appendChild(value);
  const delta=document.createElement('span');delta.textContent=changed?(Object.hasOwn(before,key)?'Changed from '+JSON.stringify(before[key]):'Created this step'):'Unchanged this step';row.appendChild(delta);target.appendChild(row);
 }
 $('traceBack').disabled=traceIndex<0;$('traceNext').disabled=traceIndex===frames.length-1;
}
$('traceNext').onclick=()=>{if(traceIndex<traceData.frames.length-1)traceIndex++;paintTrace();};
$('traceBack').onclick=()=>{if(traceIndex>=0)traceIndex--;paintTrace();};
$('traceReset').onclick=()=>{traceIndex=-1;paintTrace();};paintTrace();
'''

def markdown(L):
 w=L['walkthrough'];out='\n## Step through the code (within the 5-minute exploration)\n\nSpend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.\n\n```'+w['language']+'\n'+'\n'.join(s['code'] for s in w['steps'])+'\n```\n\n'
 for i,s in enumerate(w['steps']):
  state=w['frames'][i]['state'];previous={} if i==0 else w['frames'][i-1]['state'];changes={k:v for k,v in state.items() if k not in previous or previous[k]!=v}
  out+=f"{i+1}. {s['note']}\n\n   Changed values: `{json.dumps(changes,ensure_ascii=False)}`\n\n"
 out+=f"[Full runnable example]({w['example_file']}).\n\nLimits: {w['limit']}\n\n"
 if L.get('advanced_detail'):out+='<details><summary>Optional deeper explanation and original worked example</summary>\n\n'+L['advanced_detail']+'\n\n</details>\n\n'
 return out
if __name__=='__main__':
 manifest=json.loads((R/'study-state.json').read_text())
 for day in sorted(d['number'] for d in manifest['days']):
  p=R/f'Day{day}/lessons.json';ls=json.loads(p.read_text())
  for L in ls:execute(f'Day{day}',L);print('Executed',day,L['slug'],L['walkthrough']['language'])
  p.write_text(json.dumps(ls,indent=2,ensure_ascii=False)+'\n')
