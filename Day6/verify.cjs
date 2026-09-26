// Dependency-free checks of actual embedded scripts. Simulated DOM, not browser QA.
const vm=require('vm'),fs=require('fs'),path=require('path');
const root=__dirname;
const lessons=JSON.parse(fs.readFileSync(path.join(root,'lessons.json')));
function assert(v,m){if(!v)throw Error(m)}
for(const L of lessons){
 const html=fs.readFileSync(path.join(root,L.slug+'.html'),'utf8');
 const match=html.match(/<script>([\s\S]*)<\/script>/);assert(match,'embedded script missing');
 const script=match[1],nodes={},radios={};
 for(const id of html.matchAll(/id="([\w]+)"/g))nodes[id[1]]={value:'',textContent:'',checked:false};
 for(const tag of html.matchAll(/<input ([^>]+)>/g)){const id=tag[1].match(/id="([^"]+)"/),val=tag[1].match(/value="([^"]+)"/);if(id){if(val)nodes[id[1]].value=val[1];if(/\bchecked\b/.test(tag[1]))nodes[id[1]].checked=true}}
 let downloaded=false,blob,storage={};
 const ctx={document:{getElementById:id=>nodes[id],querySelector:s=>{const q=s.match(/name="q(\d+)"/);return q?radios[q[1]]||null:null},createElement:()=>({click:()=>downloaded=true})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Blob:class{constructor(data){blob=data.join('')}},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 vm.createContext(ctx);vm.runInContext(script,ctx);const click=id=>nodes[id].onclick(),world=()=>nodes.world.textContent;
 assert(html.includes('Day3:')&&html.includes('Day5:')&&html.match(/Recall first, then reveal/g).length===2,'two due refreshers missing');
 click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete quiz guard');
 L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
 radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
 nodes.rationale.value='Synthetic test response';nodes.recall.value='Synthetic recall';click('save');assert(Object.values(storage)[0].includes('Synthetic test response'),'save serialization');
 click('export');const exported=JSON.parse(blob);assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day6/'+L.slug,'export and attempt history');
 if(L.slug==='data-engineering'){
  assert(world().includes('Rewind 24h: REMOTE')&&world().includes('7.4 TiB'),'cold retained rewind and local sizing');
  nodes.rewindHours.value='6';nodes.rewindHours.oninput();assert(world().includes('Rewind 6h: LOCAL'),'hot rewind');
  nodes.remoteDays.value='1';nodes.remoteDays.oninput();nodes.rewindHours.value='168';nodes.rewindHours.oninput();assert(world().includes('EXPIRED'),'overall retention boundary');
 }
 if(L.slug==='software-engineering'){
  assert(world().includes('Toy p95/max: 170 ms')&&world().includes('Hedges sent: 1/6'),'delayed tail hedge');
  nodes.hedgeDelay.value='0';nodes.hedgeDelay.oninput();assert(world().includes('Hedges sent: 6/6')&&world().includes('Every request duplicates'),'eager hedge overhead');
  nodes.hedgeDelay.value='300';nodes.backupLatency.value='200';nodes.hedgeDelay.oninput();assert(world().includes('Hedges sent: 1/6')&&world().includes('Toy p95/max: 500 ms'),'late hedge');
 }
 if(L.slug==='distinguished-engineer'){
  assert(world().includes('CONDITIONAL'),'default staged review');
  nodes.irreversible.value='0';nodes.blast.value='0';nodes.uncertainty.value='0';nodes.irreversible.oninput();assert(world().includes('TWO-WAY DOOR'),'lightweight path');
  nodes.irreversible.value='3';nodes.blast.value='3';nodes.uncertainty.value='3';nodes.rollback.checked=false;nodes.rollback.oninput();assert(world().includes('ONE-WAY DOOR')&&world().includes('incomplete or untested'),'heavy review path');
 }
 if(L.slug==='genai-engineering'){
  assert(world().includes('BLOCK: filesystem denies'),'filesystem boundary');
  nodes.fsIsolation.checked=false;nodes.fsIsolation.oninput();assert(world().includes('BLOCK: network denies'),'network boundary');
  nodes.networkIsolation.checked=false;nodes.networkIsolation.oninput();assert(world().includes('EXFILTRATION PATH OPEN')&&world().includes('not present'),'open data path with external credentials');
  nodes.externalCredentials.checked=false;nodes.scopedProxy.checked=false;nodes.externalCredentials.oninput();assert(world().includes('Ambient credential is exposed')&&world().includes('broadly usable'),'ambient-authority risk');
 }
 if(L.slug==='technology-breakthroughs'){
  assert(world().includes('True positives: 70')&&world().includes('False positives: 99')&&world().includes('41.4%'),'base-rate example');
  nodes.specificity.value='99.9';nodes.specificity.oninput();assert(Number(world().match(/predictive value: ([\d.]+)%/)[1])>85,'specificity sensitivity');
  nodes.prevalence.value='5';nodes.prevalence.oninput();assert(Number(world().match(/predictive value: ([\d.]+)%/)[1])>95,'prevalence sensitivity');
 }
 console.log('PASS',L.slug,'model, quiz, export, local serialization, Day3/Day5 refreshers');
}
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout/download behavior is not established.');
