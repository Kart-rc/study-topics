// Dependency-free checks of actual embedded scripts. Simulated DOM, not browser QA.
const vm=require('vm'),fs=require('fs'),path=require('path');
const root=__dirname;
const lessons=JSON.parse(fs.readFileSync(path.join(root,'lessons.json')));
function assert(v,m){if(!v)throw Error(m)}
for(const L of lessons){
 const html=fs.readFileSync(path.join(root,L.slug+'.html'),'utf8');
 const script=html.match(/<script>([\s\S]*)<\/script>/)[1];
 const nodes={},radios={};
 for(const id of html.matchAll(/id="([\w]+)"/g))nodes[id[1]]={value:'',textContent:'',checked:false};
 for(const tag of html.matchAll(/<input ([^>]+)>/g)){const id=tag[1].match(/id="([^"]+)"/),val=tag[1].match(/value="([^"]+)"/);if(id){if(val)nodes[id[1]].value=val[1];if(/\bchecked\b/.test(tag[1]))nodes[id[1]].checked=true}}
 for(const tag of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=tag[2].match(/<option value="([^"]+)"/);if(first)nodes[tag[1]].value=first[1]}
 let downloaded=false,blob,storage={};
 const ctx={document:{getElementById:id=>nodes[id],querySelector:s=>{const q=s.match(/name="q(\d+)"/);return q?radios[q[1]]||null:null},createElement:()=>({click:()=>downloaded=true})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Blob:class{constructor(data){blob=data.join('')}},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 vm.createContext(ctx);vm.runInContext(script,ctx);const click=id=>nodes[id].onclick();const world=()=>nodes.world.textContent;
 assert(html.includes('Day2:')&&html.includes('Recall first, then reveal'),'Day2 refresher missing');
 click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete guard');
 L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
 radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
 nodes.rationale.value='Synthetic test response';nodes.recall.value='Synthetic recall';click('save');assert(Object.values(storage)[0].includes('Synthetic test response'),'save serialization');
 click('export');const exported=JSON.parse(blob);assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day3/'+L.slug,'export and attempt history');
 if(L.slug==='data-engineering'){
  assert(world().includes('effective boundary: 256.0 MB')&&world().includes('Modeled pieces: 15 × 60.0 MB')&&world().includes('Largest task input after adaptation: 60.0 MB'),'default skew split');
  nodes.threshold.value='1024';nodes.threshold.oninput();assert(world().includes('Skewed? no')&&world().includes('Modeled pieces: 1 × 900.0 MB'),'absolute threshold gate');
  nodes.threshold.value='256';nodes.advisory.value='32';nodes.advisory.oninput();assert(world().includes('Modeled pieces: 29 × 31.0 MB'),'advisory split');
 }
 if(L.slug==='software-engineering'){
  click('grantA');click('expireA');click('grantB');click('writeB');click('resumeA');assert(world().includes('REJECT A token 1 < 2')&&world().includes('Resource value: snapshot-B'),'fencing rejection');
  click('reset');nodes.fencing.checked=false;click('grantA');click('expireA');click('grantB');click('writeB');click('resumeA');assert(world().includes('Resource value: stale-snapshot-A'),'unfenced stale write');
 }
 if(L.slug==='distinguished-engineer'){
  assert(world().includes('Modeled tenants per cell: ≤ 200')&&world().includes('Maximum affected in this model: 200 (20.0%)'),'cell bound');
  nodes.cells.value='10';nodes.cells.oninput();assert(world().includes('Maximum affected in this model: 100 (10.0%)'),'more cells');
  nodes.shared.checked=true;nodes.shared.oninput();assert(world().includes('Maximum affected in this model: 1000 (100.0%)'),'shared dependency');
 }
 if(L.slug==='genai-engineering'){
  assert(world().includes('MCP decision: ACCEPT')&&world().includes('token passthrough'),'naive passthrough');
  nodes.strict.checked=true;nodes.strict.oninput();assert(world().includes('MCP decision: ACCEPT')&&world().includes('principal=catalog-server'),'strict separate credential');
  nodes.aud.value='storage.api';nodes.aud.oninput();assert(world().includes('MCP decision: REJECT'),'audience rejection');
 }
 if(L.slug==='technology-breakthroughs'){
  assert(world().includes('7-day total: 701.0')&&world().includes('history-only baseline'),'history baseline');
  nodes.include.checked=true;nodes.include.oninput();assert(world().includes('7-day total: 781.0')&&world().includes('known future covariate'),'covariate forecast');
 }
 console.log('PASS',L.slug,'model, quiz, export, local serialization, refresher');
}
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout/download behavior is not established.');
