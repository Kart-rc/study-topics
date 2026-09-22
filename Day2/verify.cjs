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
 for(const tag of html.matchAll(/<input ([^>]+)>/g)){const id=tag[1].match(/id="([^"]+)"/),val=tag[1].match(/value="([^"]+)"/);if(id&&val)nodes[id[1]].value=val[1]}
 let downloaded=false,blob,storage={};
 const ctx={document:{getElementById:id=>nodes[id],querySelector:s=>{const q=s.match(/name="q(\d+)"/);return q?radios[q[1]]||null:null},createElement:()=>({click:()=>downloaded=true})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Blob:class{constructor(data){blob=data.join('')}},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 vm.createContext(ctx);vm.runInContext(script,ctx);const click=id=>nodes[id].onclick();const world=()=>nodes.world.textContent;
 assert(html.includes('Day1:')&&html.includes('Recall first, then reveal'),'Day1 refresher missing');
 click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete guard');
 L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
 radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
 nodes.rationale.value='Synthetic test response';nodes.recall.value='Synthetic recall';click('save');assert(Object.values(storage)[0].includes('Synthetic test response'),'save serialization');
 click('export');const exported=JSON.parse(blob);assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day2/'+L.slug,'export and attempt history');
 if(L.slug==='data-engineering'){
  click('step');click('step');click('step');assert(world().includes('Watermark used: 7'),'watermark');assert(world().includes('Not counted: event 3'),'retired window');assert(world().includes('Counted event 8'),'retained window');
  nodes.delay.value='15';nodes.delay.oninput();click('step');click('step');click('step');assert(world().includes('Counted event 3')&&world().includes('"0":3'),'larger delay');
  for(let i=0;i<8;i++)click('step');assert(world().includes('Batches processed: 5/5'),'bounded replay');click('reset');assert(world().includes('Batches processed: 0/5'),'reset');
 }
 if(L.slug==='software-engineering'){
  click('twenty');assert(world().includes('Backlog: 300 / 300')&&world().includes('Rejected: 100'),'overload accounting');
  nodes.arrivals.value='80';for(let i=0;i<15;i++)click('step');assert(world().includes('Backlog: 0 / 300'),'drain time');
  click('reset');nodes.arrivals.value='120';nodes.cooperate.checked=true;click('twenty');assert(world().includes('Backlog: 0 / 300')&&world().includes('Deferred upstream: 400')&&world().includes('Rejected: 0'),'cooperative quota');
 }
 if(L.slug==='distinguished-engineer'){
  assert(world().includes('Overall failures: 0.139%')&&world().includes('not triggered')&&world().includes('REGRESSION'),'masked regression');
  nodes.exposure.value='10';nodes.exposure.oninput();assert(world().includes('Overall failures: 0.490%')&&world().includes('TRIGGERED'),'expansion');
  nodes.easy.checked=true;nodes.easy.oninput();assert(world().includes('UNTESTED')&&world().includes('Overall failures: 0.100%'),'unrepresentative cohort');
 }
 if(L.slug==='genai-engineering'){
  assert(world().includes('Score: 4/4'),'claim grader');nodes.strict.checked=true;nodes.strict.oninput();assert(world().includes('Score: 1/4')&&world().includes('FAIL Unauthorized write'),'contract grader');click('inspect');assert(world().includes('"approved":false'),'fixture inspection');
 }
 if(L.slug==='technology-breakthroughs'){
  assert(world().includes('Selected: freshness-A, freshness-B, volume')&&world().includes('Distinct facets: 2/3'),'independent relevance');nodes.bonus.value='0.2';nodes.bonus.oninput();assert(world().includes('Selected: freshness-A, volume, lineage')&&world().includes('Distinct facets: 3/3'),'set diversity');
 }
 console.log('PASS',L.slug,'model, quiz, export, local serialization, refresher');
}
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout/download behavior is not established.');
