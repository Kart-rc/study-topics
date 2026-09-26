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
 for(const tag of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const opts=[...tag[2].matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)].map(x=>({value:x[1],text:x[2]}));nodes[tag[1]].options=opts;nodes[tag[1]].selectedIndex=0;if(opts[0])nodes[tag[1]].value=opts[0].value}
 let downloaded=false,blob,storage={};
 const ctx={document:{getElementById:id=>nodes[id],querySelector:s=>{const q=s.match(/name="q(\d+)"/);return q?radios[q[1]]||null:null},createElement:()=>({click:()=>downloaded=true})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Blob:class{constructor(data){blob=data.join('')}},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 vm.createContext(ctx);vm.runInContext(script,ctx);const click=id=>nodes[id].onclick(),world=()=>nodes.world.textContent;
 assert(html.includes('Day2:')&&html.includes('Day4:')&&html.match(/Recall first, then reveal/g).length===2,'two due refreshers missing');
 click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete quiz guard');
 L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
 radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
 nodes.rationale.value='Synthetic test response';nodes.recall.value='Synthetic recall';click('save');assert(Object.values(storage)[0].includes('Synthetic test response'),'save serialization');
 click('export');const exported=JSON.parse(blob);assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day5/'+L.slug,'export and attempt history');
 if(L.slug==='data-engineering'){
  assert(world().includes('day(event_time)')&&world().includes('24 hour(s)'),'old daily layout');
  nodes.queryDay.value='10';nodes.queryDay.oninput();assert(world().includes('hour(event_time)')&&world().includes('2 hour(s)'),'new hourly layout');
  nodes.evolve.checked=false;nodes.evolve.oninput();assert(world().includes('No evolution')&&world().includes('24 hour(s)'),'disabled evolution');
 }
 if(L.slug==='software-engineering'){
  assert(world().includes('Keys moved versus three-node baseline: 0/60'),'three-node baseline');
  nodes.nodeCount.value='4';nodes.nodeCount.oninput();const ringMoved=Number(world().match(/baseline: (\d+)\/60/)[1]);assert(ringMoved>0&&ringMoved<40,'bounded ring movement');
  nodes.mapping.value='mod';nodes.mapping.oninput();const modMoved=Number(world().match(/baseline: (\d+)\/60/)[1]);assert(modMoved>ringMoved,'modulo should move more keys');
 }
 if(L.slug==='distinguished-engineer'){
  assert(world().includes('critical path protected'),'healthy shared pool');
  nodes.bulkLatency.value='2000';nodes.bulkLatency.oninput();assert(world().includes('critical path loses capacity'),'shared slow dependency');
  nodes.isolated.checked=true;nodes.isolated.oninput();assert(world().includes('critical: 4.0/s of 4.0/s')&&world().includes('critical path protected'),'isolated critical pool');
 }
 if(L.slug==='genai-engineering'){
  assert(world().includes('Critical continuation fields missing: goal, decisions, openTasks, pointers'),'tail policy loses durable state');
  nodes.contextPolicy.value='structured';nodes.contextPolicy.selectedIndex=1;nodes.contextPolicy.oninput();assert(world().includes('Kept: goal, decisions, openTasks, pointers')&&world().includes('missing: none'),'structured handoff');
  nodes.contextBudget.value='6000';nodes.contextBudget.oninput();assert(world().includes('Critical continuation fields missing: none')&&!world().includes('recentConversation, rawToolOutput'),'low-budget prioritization');
 }
 if(L.slug==='technology-breakthroughs'){
  click('trace');assert(world().includes('untrusted pixels reached a durable control surface'),'open attack path');
  nodes.capability.value='read';nodes.capability.selectedIndex=1;nodes.capability.oninput();click('trace');assert(world().includes('Capability boundary denies file write'),'least privilege gate');
  nodes.capability.value='write';nodes.capability.selectedIndex=0;nodes.policyMutable.checked=false;nodes.policyMutable.oninput();click('trace');assert(world().includes('Protected policy path rejects mutation'),'protected policy gate');
 }
 console.log('PASS',L.slug,'model, quiz, export, local serialization, Day2/Day4 refreshers');
}
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout/download behavior is not established.');
