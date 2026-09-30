// Dependency-free execution checks for embedded scripts. Simulated DOM, not visual browser QA.
const vm=require('vm'),fs=require('fs'),path=require('path');
const root=__dirname;
const lessons=JSON.parse(fs.readFileSync(path.join(root,'lessons.json')));
function assert(value,message){if(!value)throw Error(message)}
assert(lessons.length===5,'expected five lessons');
for(const L of lessons){
  const html=fs.readFileSync(path.join(root,L.slug+'.html'),'utf8');
  const md=fs.readFileSync(path.join(root,L.slug+'.md'),'utf8');
  const match=html.match(/<script>([\s\S]*)<\/script>/);assert(match,'embedded script missing');
  const nodes={},radios={};
  for(const id of html.matchAll(/id="([\w]+)"/g))nodes[id[1]]={value:'',textContent:'',checked:false};
  for(const tag of html.matchAll(/<input ([^>]+)>/g)){
    const id=tag[1].match(/id="([^"]+)"/),value=tag[1].match(/value="([^"]+)"/);
    if(id){if(value)nodes[id[1]].value=value[1];if(/\bchecked\b/.test(tag[1]))nodes[id[1]].checked=true;}
  }
  let downloaded=false,blob='',storage={};
  const ctx={document:{getElementById:id=>nodes[id],querySelector:s=>{const q=s.match(/name="q(\d+)"/);return q?radios[q[1]]||null:null},createElement:()=>({click:()=>downloaded=true})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Blob:class{constructor(data){blob=data.join('')}},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
  require('../scripts/trace-dom.cjs').extend(ctx,nodes,html); vm.createContext(ctx);vm.runInContext(match[1],ctx);
  const click=id=>nodes[id].onclick(),world=()=>nodes.world.textContent;
  assert(html.includes('Day1:')&&html.includes('Day5:')&&html.match(/Recall first, then reveal/g).length===2,'Day1/Day5 refreshers missing');
  assert(md.includes('## Sources')&&md.includes('checked 2026-09-28'),'Markdown sources/check date missing');
  click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete quiz guard');
  L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
  radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
  nodes.rationale.value='Synthetic response';nodes.recall.value='Synthetic recall';click('save');assert(Object.values(storage)[0].includes('Synthetic response'),'save serialization');
  click('export');const exported=JSON.parse(blob);assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day8/'+L.slug,'export and attempt history');
  if(L.slug==='data-engineering'){
    assert(world().includes('Traditional foreground changed-SST upload: 14.1 GB')&&world().includes('Changelog foreground upload: 4.7 GB')&&world().includes('CHANGELOG'),'checkpoint byte comparison');
    nodes.failureBatch.value='11';nodes.failureBatch.oninput();assert(world().includes('Latest completed base: batch 6')&&world().includes('Deltas to replay: 5 (2.0 GB)'),'replay bound');
    nodes.deltaMb.value='2000';nodes.sstMb.value='100';nodes.deltaMb.oninput();assert(world().includes('INCREMENTAL SNAPSHOT'),'tradeoff reversal');
  }
  if(L.slug==='software-engineering'){
    assert(world().includes('Blind read-modify-write final quantity: 9')&&world().includes('Versioned conditional-write final quantity: 6')&&world().includes('Total conditional attempts in synchronized rounds: 10'),'lost-update comparison');
    nodes.writers.value='10';nodes.writers.oninput();assert(world().includes('final quantity: 0')&&world().includes('Total conditional attempts in synchronized rounds: 55'),'contention growth');
  }
  if(L.slug==='distinguished-engineer'){
    assert(world().includes('Guardrail: TRIGGERS')&&world().includes('28 s')&&world().includes('112 %-seconds'),'stop-condition latency');
    nodes.errorPct.value='0.5';nodes.errorPct.oninput();assert(world().includes('DOES NOT TRIGGER')&&world().includes('120 s')&&world().includes('60 %-seconds'),'nonbreach full duration');
  }
  if(L.slug==='genai-engineering'){
    assert(world().includes('Harness decision: BLOCK / require path redesign')&&world().includes('Automatic retry: PERMITTED'),'composed-risk block');
    nodes.openWorld.checked=false;nodes.openWorld.oninput();assert(world().includes('ALLOW UNDER LEAST-PRIVILEGE POLICY'),'trusted closed-world path');
    nodes.trustedServer.checked=false;nodes.trustedServer.oninput();assert(world().includes('UNTRUSTED — pessimistic defaults')&&world().includes('BLOCK / require path redesign'),'untrusted annotation path');
    nodes.privateData.checked=false;nodes.idempotent.checked=false;nodes.idempotencyKey.checked=false;nodes.privateData.oninput();assert(world().includes('REQUIRE EXPLICIT APPROVAL')&&world().includes('NOT PERMITTED'),'pessimistic mutation and retry');
  }
  if(L.slug==='technology-breakthroughs'){
    assert(world().includes('Toy runtime: 28.0 hours')&&world().includes('1.84 V peak open circuit')&&world().includes('does not predict'),'research point and caveat');
    nodes.loadUa.value='200';nodes.loadUa.oninput();assert(world().includes('Toy runtime: 14.0 hours'),'load/runtime relation');
  }
  console.log('PASS',L.slug,'model, quiz, save, export, sources, Day1/Day5 refreshers');
}
for(const name of ['index.html',...lessons.flatMap(L=>[L.slug+'.html',L.slug+'.md'])])assert(fs.existsSync(path.join(root,name)),name+' missing');
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout and native download behavior are not established.');
