// Semantic checks for Day16 teaching worlds. A simulated DOM is not a browser layout test.
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
    assert(text('world').includes('Coalesced tasks: [23,64,5]')&&text('world').includes('Task count: 5 → 3')&&text('world').includes('Total data: 92 MB'));
    nodes.advisoryMb.value='96';nodes.advisoryMb.oninput();assert(text('world').includes('Coalesced tasks: [92]')&&text('world').includes('Task count: 5 → 1'));
  }
  if(L.slug==='software-engineering'){
    assert(text('world').includes('Final on-call count: 0')&&text('world').includes('Invariant satisfied: false'));
    nodes.isolationLevel.value='serializable';nodes.isolationLevel.onchange();assert(text('world').includes('Serialization abort: Bob')&&text('world').includes('Final on-call count: 1')&&text('world').includes('Invariant satisfied: true'));
  }
  if(L.slug==='distinguished-engineer'){
    assert(text('world').includes('Normal per AZ: 40.0')&&text('world').includes('After evacuation per survivor: 60.0')&&text('world').includes('80% operating target met: false')&&text('world').includes('Minimum capacity/AZ for target: 75.0'));
    nodes.zoneCapacity.value='75';nodes.zoneCapacity.oninput();assert(text('world').includes('80% operating target met: true'));
  }
  if(L.slug==='genai-engineering'){
    assert(text('world').includes('Model/API calls made: 0')&&text('world').includes('assert_complete: PASS'));
    nodes.agentPath.value='skip';nodes.agentPath.onchange();assert(text('world').includes('assert_complete: FAIL'));
    nodes.agentPath.value='wrong';nodes.agentPath.onchange();assert(text('world').includes('First mismatch: 2')&&text('world').includes('assert_complete: FAIL'));
  }
  if(L.slug==='technology-breakthroughs'){
    assert(text('world').includes('Synthetic absolute difference: 3.0')&&text('world').includes('Agreement within uncertainty: true'));
    nodes.clockA.value='12';nodes.clockB.value='-12';nodes.clockU.value='2';nodes.clockA.oninput();assert(text('world').includes('Synthetic absolute difference: 24.0')&&text('world').includes('Agreement within uncertainty: false'));
  }
  if(L.slug==='ci-cd-github-actions'){
    assert(text('world').includes('Job state: WAITING')&&text('world').includes('Environment secret available: false'));
    nodes.deployApproval.value='approved';nodes.deployApproval.onchange();assert(text('world').includes('Job state: RUNNING')&&text('world').includes('Environment secret available: true'));
    nodes.deployBranch.value='feature';nodes.deployBranch.onchange();assert(text('world').includes('Job state: DENIED'));
    nodes.deployBranch.value='main';nodes.deployApproval.value='self';nodes.deployApproval.onchange();assert(text('world').includes('Job state: WAITING')&&text('world').includes('Environment secret available: false'));
  }
  if(L.slug==='apis-microservices'){
    assert(text('world').includes('"status": 409')&&text('world').includes('Client does: ask user to change item'));
    nodes.problemKind.value='rate';nodes.problemKind.onchange();assert(text('world').includes('"status": 429')&&text('world').includes('Client does: honor Retry-After'));
    nodes.problemKind.value='server';nodes.problemKind.onchange();assert(text('world').includes('"status": 500')&&text('world').includes('Client does: stop automatic retry storm'));
  }
  const reviews=(h.match(/Recall first, then reveal/g)||[]).length;
  assert.equal(reviews,2);
  if(['ci-cd-github-actions','apis-microservices'].includes(L.slug)) assert(h.includes('Day13:')&&h.includes('Day15:'));
  else assert(h.includes('Day1:')&&h.includes('Day7:'));
  assert(h.includes('checked 2026-10-06'));assert(h.includes('15 minutes'));
  assert(h.includes('What this model does and does not represent'));
  assert(h.includes('captured by running this exact example during the build'));
  console.log('PASS',L.slug,'mechanism, boundary and review allocation');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),d=state.days.find(x=>x.number===16);
assert.equal(state.days.filter(x=>x.generation_key==='2026-10-06').length,1);
assert.deepEqual(d.review_keys,['Day1+14','Day13+3','Day15+1','Day7+7']);
assert.equal(d.lesson_slugs.length,7);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('105 minutes total'));
for(const name of ['index.html',...lessons.map(x=>x.slug+'.html')]){
  const h=fs.readFileSync(path.join(__dirname,name),'utf8');
  for(const [,href] of h.matchAll(/href="([^"]+)"/g)){
    if(!/^https?:|^#/.test(href))assert(fs.existsSync(path.resolve(__dirname,href)),'missing '+href);
  }
}
console.log('PASS seven tracks, 105 minutes, unique generation key and track-aware spaced reviews.');
