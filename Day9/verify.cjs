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
  for(const select of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
    const chosen=select[2].match(/<option selected>([^<]+)<\/option>/)||select[2].match(/<option>([^<]+)<\/option>/);
    nodes[select[1]].value=chosen?chosen[1]:'';
  }
  let downloaded=false,blob='',storage={};
  const ctx={document:{getElementById:id=>nodes[id],querySelector:s=>{const q=s.match(/name="q(\d+)"/);return q?radios[q[1]]||null:null},createElement:()=>({click:()=>downloaded=true})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Blob:class{constructor(data){blob=data.join('')}},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
  vm.createContext(ctx);vm.runInContext(match[1],ctx);
  const click=id=>nodes[id].onclick(),world=()=>nodes.world.textContent;
  assert(html.includes('Day2:')&&html.includes('Day7:')&&html.match(/Recall first, then reveal/g).length===2,'Day2/Day7 refreshers missing');
  assert(md.includes('## Sources')&&md.includes('checked 2026-09-29'),'Markdown sources/check date missing');
  click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete quiz guard');
  L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
  radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
  nodes.rationale.value='Synthetic response';nodes.recall.value='Synthetic recall';nodes.boundaryAnswer.value='Synthetic boundary';click('save');
  assert(Object.values(storage)[0].includes('Synthetic response'),'save serialization');
  click('export');const exported=JSON.parse(blob);
  assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day9/'+L.slug,'export and attempt history');
  if(L.slug==='data-engineering'){
    assert(world().includes('48 partition-seconds')&&world().includes('8 partition-seconds')&&world().includes('83%'),'rebalance exposure');
    nodes.affected.value='3';nodes.affected.oninput();assert(world().includes('Affected ownership: 12 partitions')&&world().includes('24 partition-seconds'),'affected subset');
  }
  if(L.slug==='software-engineering'){
    assert(world().includes('Balanced tree depth: 10')&&world().includes('Toy hierarchical upper bound: 21 hash nodes'),'sparse divergence');
    nodes.divergent.value='64';nodes.divergent.oninput();assert(world().includes('Toy hierarchical upper bound: 1281 hash nodes'),'dense divergence');
    nodes.leaves.value='16';nodes.leaves.oninput();assert(world().includes('Whole tree size: 31 hash nodes'),'tree cap');
  }
  if(L.slug==='distinguished-engineer'){
    assert(world().includes('Old-reader success after rollback: 100%')&&world().includes('STATE-COMPATIBLE'),'dual-write safe path');
    nodes.dualWrite.checked=false;nodes.dualWrite.oninput();assert(world().includes('Old-reader success after rollback: 60%')&&world().includes('UNSAFE'),'contract unsafe path');
    nodes.backfilled.checked=true;nodes.backfilled.oninput();assert(world().includes('100%'),'backfill recovery');
  }
  if(L.slug==='genai-engineering'){
    assert(world().includes('Visible development score: 100.0%')&&world().includes('Displayed holdout score: 70.0%'),'clean holdout');
    nodes.peekHoldout.checked=true;nodes.peekHoldout.oninput();assert(world().includes('Displayed holdout score: 80.0%')&&world().includes('LEAKAGE'),'holdout leakage');
  }
  if(L.slug==='technology-breakthroughs'){
    assert(world().includes('Difference frequency: 9.5 THz')&&world().includes('Toy output: 15.1 μW')&&world().includes('WITHIN REPORTED RANGE'),'research worked example');
    nodes.f2.value='15';nodes.f2.oninput();assert(world().includes('Difference frequency: 15.0 THz')&&world().includes('OUTSIDE REPORTED RANGE'),'range boundary');
  }
  console.log('PASS',L.slug,'model, quiz, save, export, sources, Day2/Day7 refreshers');
}
for(const name of ['index.html',...lessons.flatMap(L=>[L.slug+'.html',L.slug+'.md'])])assert(fs.existsSync(path.join(root,name)),name+' missing');
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout and native download behavior are not established.');
