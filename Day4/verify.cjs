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
 assert(html.includes('Day1:')&&html.includes('Day3:')&&html.match(/Recall first, then reveal/g).length===2,'two due refreshers missing');
 click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete guard');
 L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
 radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
 nodes.rationale.value='Synthetic test response';nodes.recall.value='Synthetic recall';click('save');assert(Object.values(storage)[0].includes('Synthetic test response'),'save serialization');
 click('export');const exported=JSON.parse(blob);assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day4/'+L.slug,'export and attempt history');
 if(L.slug==='data-engineering'){
  click('run');assert(world().includes('Aborted transactional attempts: 0')&&world().includes('Visible outputs to this consumer: 2'),'nontransactional duplicate');
  nodes.tx.checked=true;nodes.tx.oninput();click('run');assert(world().includes('Aborted transactional attempts: 1')&&world().includes('Visible outputs to this consumer: 2'),'read uncommitted visibility');
  nodes.committed.checked=true;nodes.committed.oninput();click('run');assert(world().includes('Visible outputs to this consumer: 1')&&world().includes('one committed result'),'read committed');
 }
 if(L.slug==='software-engineering'){
  assert(world().includes('safe additive evolution')&&world().includes('"classification":"restricted"'),'safe unknown preservation');
  nodes.jsonBridge.checked=true;nodes.jsonBridge.oninput();assert(world().includes('"classification":"(lost)"')&&world().includes('lossy relay path'),'json loss');
  nodes.reuse.checked=true;nodes.reuse.oninput();assert(world().includes('UNSAFE')&&world().includes('"owner":"30"'),'tag reuse ambiguity');
 }
 if(L.slug==='distinguished-engineer'){
  assert(world().includes('Normal provisioned capacity: 150%')&&world().includes('After one zone loss: 100%')&&world().includes('STATICALLY STABLE'),'static headroom');
  nodes.perZone.value='35';nodes.perZone.oninput();assert(world().includes('Immediate deficit: 30%')&&world().includes('REACTIVE RECOVERY REQUIRED'),'reactive deficit');
  nodes.control.checked=false;nodes.control.oninput();assert(world().includes('CAPACITY OUTAGE'),'control plane unavailable');
 }
 if(L.slug==='genai-engineering'){
  click('work');click('work');click('failHand');assert(world().includes('Recovered progress: 0/3'),'coupled loss');click('resume');assert(world().includes('resumed from 0'),'coupled restart');
  click('reset');nodes.mode.value='decoupled';nodes.mode.oninput();click('work');click('work');click('failHand');click('resume');assert(world().includes('Recovered progress: 2/3')&&world().includes('Durable session events: 2'),'decoupled sandbox recovery');
  click('failBrain');click('resume');assert(world().includes('resumed from 2'),'decoupled harness recovery');
 }
 if(L.slug==='technology-breakthroughs'){
  assert(world().includes('85% | 10% | 5%')&&world().includes('Expected scalar reward: 0.940')&&world().includes('L1 distance to target: 0.700'),'reward policy');
  nodes.mix.value='100';nodes.mix.oninput();assert(world().includes('50% | 30% | 20%')&&world().includes('Expected scalar reward: 0.790')&&world().includes('L1 distance to target: 0.000'),'target match');
 }
 console.log('PASS',L.slug,'model, quiz, export, local serialization, Day1/Day3 refreshers');
}
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout/download behavior is not established.');

