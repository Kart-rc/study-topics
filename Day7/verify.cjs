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
 assert(html.includes('Day4:')&&html.includes('Day6:')&&html.match(/Recall first, then reveal/g).length===2,'two due refreshers missing');
 click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete quiz guard');
 L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
 radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
 nodes.rationale.value='Synthetic test response';nodes.recall.value='Synthetic recall';click('save');assert(Object.values(storage)[0].includes('Synthetic test response'),'save serialization');
 click('export');const exported=JSON.parse(blob);assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day7/'+L.slug,'export and attempt history');
 if(L.slug==='data-engineering'){
  assert(world().includes('ELIGIBLE stateless shape')&&world().includes('utilization: 63%')&&world().includes('headroom exists'),'eligible RTM path');
  nodes.stateful.checked=true;nodes.stateful.oninput();assert(world().includes('INELIGIBLE')&&world().includes('supported stateful execution path'),'stateful boundary');
  nodes.stateful.checked=false;nodes.inputRate.value='50000';nodes.inputRate.oninput();assert(world().includes('utilization: 156%')&&world().includes('OVERLOADED'),'sustained overload');
 }
 if(L.slug==='software-engineering'){
  assert(world().includes('Child budget: 360 ms')&&world().includes('Work after caller budget: 0 ms'),'propagated budget');
  nodes.propagate.checked=false;nodes.propagate.oninput();assert(world().includes('Child budget: 500 ms')&&world().includes('Work after caller budget: 60 ms'),'fresh timeout waste');
  nodes.propagate.checked=true;nodes.downstreamMs.value='300';nodes.downstreamMs.oninput();assert(world().includes('SUCCESS at 440 ms'),'successful deadline path');
 }
 if(L.slug==='distinguished-engineer'){
  assert(world().includes('Admitted critical: 60/60')&&world().includes('Admitted background: 40/80')&&world().includes('Rejected early: 40'),'priority shedding');
  nodes.priority.checked=false;nodes.priority.oninput();assert(world().includes('Admitted critical: 42/60')&&world().includes('proportional sharing'),'equal sharing tradeoff');
  nodes.capacity.value='200';nodes.capacity.oninput();assert(world().includes('No shedding needed'),'capacity headroom');
 }
 if(L.slug==='genai-engineering'){
  assert(world().includes('Outcome: MET')&&world().includes('Remaining failures: 0')&&world().includes('4,800'),'verified completion');
  nodes.fixRate.value='1';nodes.fixRate.oninput();assert(world().includes('BUDGET_EXHAUSTED')&&world().includes('Remaining failures: 3'),'budget boundary');
  nodes.fixRate.value='0';nodes.fixRate.oninput();assert(world().includes('STALLED')&&world().includes('Turn 2'),'stall detection');
  nodes.evaluator.checked=false;nodes.evaluator.oninput();assert(world().includes('UNVERIFIED SELF-REPORT'),'no-evaluator boundary');
 }
 if(L.slug==='technology-breakthroughs'){
  assert(world().includes('Total gate time: 17.0 μs')&&world().includes('91.7%')&&world().includes('paper simulations'),'paper point plus caveat');
  nodes.gateCount.value='10000';nodes.gateCount.oninput();const p=Number(world().match(/zero modeled failures: ([\d.]+)%/)[1]);assert(world().includes('170.0 μs')&&p<45&&p>40,'composition at 10000 gates');
  nodes.infidelity.value='17.4';nodes.infidelity.oninput();const p2=Number(world().match(/zero modeled failures: ([\d.]+)%/)[1]);assert(p2<p,'higher infidelity reduces toy survival');
 }
 console.log('PASS',L.slug,'model, quiz, export, local serialization, Day4/Day6 refreshers');
}
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout/download behavior is not established.');
