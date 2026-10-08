// Semantic checks for Day17 teaching worlds. A simulated DOM is not a browser layout test.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));
assert.equal(lessons.length,7);
for(const L of lessons){
  const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
  for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
  for(const [,attrs] of h.matchAll(/<input ([^>]+)>/g)){
    const id=attrs.match(/id="([^"]+)"/),val=attrs.match(/value="([^"]+)"/);
    if(id){if(val)nodes[id[1]].value=val[1];nodes[id[1]].checked=/\bchecked\b/.test(attrs);}
  }
  for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
    const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);
    nodes[id].value=first[1]||first[2];
  }
  const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node()},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
  extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
  const text=id=>nodes[id].textContent;
  if(L.slug==='data-engineering'){
    assert(text('world').includes('Stage: Working'));
    const recover=()=>{for(let i=0;i<10&&!nodes.checkpointNext.disabled;i++)nodes.checkpointNext.onclick();};
    recover();
    assert(text('world').includes('Restored total: 14')&&text('world').includes('Lost contribution: 0'));
    nodes.checkpointMode.value='broken';nodes.checkpointMode.onchange();
    recover();
    assert(text('world').includes('Restored total: 10')&&text('world').includes('Lost contribution: 4'));
    nodes.bufferCount.value='0';nodes.bufferCount.oninput();recover();assert(text('world').includes('Lost contribution: 0'));
    for(let i=0;i<5;i++)nodes.dbNext.onclick();assert(text('dbState').includes('Final total 15'));
    nodes.dbPolicy.value='new';nodes.dbPolicy.onchange();for(let i=0;i<5;i++)nodes.dbNext.onclick();assert(text('dbState').includes('Final total 30'));
    for(let i=0;i<3;i++)nodes.sfNext.onclick();assert(text('sfState').includes('Total stays 10'));nodes.sfNext.onclick();assert(text('sfState').includes('total 15'));
    nodes.sfOutcome.value='commit';nodes.sfOutcome.onchange();for(let i=0;i<4;i++)nodes.sfNext.onclick();assert(text('sfState').includes('no new inserts'));
    nodes.productQ0.value='';nodes.productQ1.value='';nodes.productGrade.onclick();assert(text('productScore').includes('Answer both'));
    nodes.productQ0.value='0';nodes.productQ1.value='1';nodes.productGrade.onclick();assert(text('productScore').includes('2/2'));
  }
  if(L.slug==='software-engineering'){
    assert(text('world').includes('Filter: MAYBE')&&text('world').includes('Database read: true')&&text('world').includes('Returned present: false'));
    nodes.trustMaybe.checked=true;nodes.trustMaybe.onchange();assert(text('world').includes('Correct answer: false'));
    nodes.trustMaybe.checked=false;nodes.lookupId.value='3';nodes.lookupId.onchange();assert(text('world').includes('Filter: ABSENT')&&text('world').includes('Database read: false'));
    nodes.lookupId.value='1';nodes.lookupId.onchange();assert(text('world').includes('Returned present: true')&&text('world').includes('Correct answer: true'));
  }
  if(L.slug==='distinguished-engineer'){
    assert(text('world').includes('Net saved/week: 3.0 h')&&text('world').includes('Payback: 8.0 weeks'));
    nodes.requestVolume.value='5';nodes.requestVolume.oninput();assert(text('world').includes('Net saved/week: 0.0 h')&&text('world').includes('Payback: never'));
    nodes.upkeep.value='6';nodes.upkeep.oninput();assert(text('world').includes('Net saved/week: -5.0 h')&&text('world').includes('Payback: never'));
  }
  if(L.slug==='genai-engineering'){
    assert(text('world').includes('At least one pass: 3/4 = 75%')&&text('world').includes('All three pass: 1/4 = 25%')&&text('world').includes('Individual passes: 7/12'));
    nodes.flipTrial.onclick();assert(text('world').includes('At least one pass: 3/4 = 75%')&&text('world').includes('All three pass: 2/4 = 50%'));
    nodes.trialFixture.value='improved';nodes.trialFixture.onchange();assert(text('world').includes('At least one pass: 3/4 = 75%')&&text('world').includes('All three pass: 3/4 = 75%'));
    nodes.trialFixture.value='failed';nodes.trialFixture.onchange();assert(text('world').includes('All three pass: 0/4 = 0%')&&text('world').includes('Model/API calls: 0'));
  }
  if(L.slug==='technology-breakthroughs'){
    assert(text('world').includes('Charge efficiency: 99.0%')&&text('world').includes('Cell energy efficiency: 77.8%'));
    nodes.auxEnergy.value='2';nodes.auxEnergy.oninput();assert(text('world').includes('Toy system efficiency: 68.1%')&&text('world').includes('Cell energy efficiency: 77.8%'));
    nodes.outVoltage.value='0.7';nodes.outVoltage.oninput();assert(text('world').includes('Cell energy efficiency: 49.5%')&&text('world').includes('Charge efficiency: 99.0%'));
  }
  if(L.slug==='ci-cd-github-actions'){
    nodes.enqueueRun.onclick();nodes.enqueueRun.onclick();assert(text('world').includes('Pending: R3')&&text('world').includes('Canceled: R2'));
    nodes.finishRun.onclick();assert(text('world').includes('Running: R3'));
    nodes.queuePolicy.value='max';nodes.queuePolicy.onchange();nodes.enqueueRun.onclick();nodes.enqueueRun.onclick();
    assert(text('world').includes('Pending: R2,R3')&&text('world').includes('Canceled: none'));
    nodes.finishRun.onclick();assert(text('world').includes('Running: R2')&&text('world').includes('Pending: R3'));
    nodes.finishRun.onclick();nodes.finishRun.onclick();assert(text('world').includes('Running: none'));
    nodes.resetQueue.onclick();assert(text('world').includes('Running: R1')&&text('world').includes('Completed: none'));
  }
  if(L.slug==='apis-microservices'){
    assert(text('world').includes('Offset page 2: B,C')&&text('world').includes('Keyset page 2: C,D'));
    nodes.pageScenario.value='none';nodes.pageScenario.onchange();assert(text('world').includes('Offset page 2: C,D'));
    nodes.pageScenario.value='tie';nodes.pageScenario.onchange();assert(text('world').includes('Keyset page 2: B')&&text('world').includes('Time-only page 2: C'));
  }
  const reviews=(h.match(/Recall first, then reveal/g)||[]).length;
  assert.equal(reviews,2);
  if(['ci-cd-github-actions','apis-microservices'].includes(L.slug)) assert(h.includes('Day14:')&&h.includes('Day16:'));
  else assert(h.includes('Day2:')&&h.includes('Day8:'));
  assert(h.includes('checked 2026-10-07'));assert(h.includes(L.slug==='data-engineering'?'30 minutes':'15 minutes'));
  assert(h.includes('What this model does and does not represent'));
  assert(h.includes('captured by running this exact example during the build'));
  assert(h.includes('id="useCaseTitle">Use case: when to use this'));
  const md=fs.readFileSync(path.join(__dirname,L.slug+'.md'),'utf8');
  assert(md.includes('## Use case: when to use this'));
  for(const key of ['when','example','decision']) assert(L.use_case[key].trim()&&md.includes(L.use_case[key]));
  console.log('PASS',L.slug,'mechanism, boundary and review allocation');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),d=state.days.find(x=>x.number===17);
assert.equal(state.days.filter(x=>x.generation_key==='2026-10-07').length,1);
assert.deepEqual(d.review_keys,['Day14+3','Day16+1','Day2+14','Day8+7']);
assert.equal(d.lesson_slugs.length,7);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
for(const name of ['index.html',...lessons.map(x=>x.slug+'.html')]){
  const h=fs.readFileSync(path.join(__dirname,name),'utf8');
  for(const [,href] of h.matchAll(/href="([^"]+)"/g)){
    if(!/^https?:|^#/.test(href))assert(fs.existsSync(path.resolve(__dirname,href)),'missing '+href);
  }
}
console.log('PASS seven tracks, 120 minutes, unique generation key and track-aware spaced reviews.');

