// Semantic checks for Day15 teaching worlds. A simulated DOM is not a browser layout test.
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
    assert(text('world').includes('"O42":"shipped"')&&text('world').includes('O17: absent'));
    nodes.compactionView.value='compact';nodes.compactionView.onchange();assert(text('world').includes('Offsets present: 22, 23'));
    nodes.compactionView.value='expired';nodes.compactionView.onchange();assert(text('world').includes('Offsets present: 22')&&text('world').includes('O17: absent'));
  }
  if(L.slug==='software-engineering'){
    assert(text('world').includes('O42 completed: true')&&text('world').includes('Force kill required: false'));
    nodes.graceSeconds.value='5';nodes.graceSeconds.oninput();assert(text('world').includes('O42 completed: false')&&text('world').includes('Force kill required: true'));
  }
  if(L.slug==='distinguished-engineer'){
    assert(text('world').includes('Decision: NO PAGE'));
    nodes.burnScenario.value='sustained';nodes.burnScenario.onchange();assert(text('world').includes('Decision: PAGE'));
    nodes.burnScenario.value='slow';nodes.burnScenario.onchange();assert(text('world').includes('Decision: NO PAGE'));
  }
  if(L.slug==='genai-engineering'){
    assert(text('world').includes('Decision: ALLOW within explicit user scope'));
    nodes.agentAction.value='send_external';nodes.agentAction.onchange();assert(text('world').includes('Decision: DENY'));
    nodes.toolContent.value='inject';nodes.toolContent.onchange();assert(text('world').includes('Decision: DENY'));
    nodes.userScope.value='send';nodes.agentAction.value='send_support';nodes.agentAction.onchange();assert(text('world').includes('Decision: ALLOW'));
  }
  if(L.slug==='technology-breakthroughs'){
    assert(text('world').includes('Toy gap: 7 μm')&&text('world').includes('GENTLE HOLD'));
    nodes.lightPower.value='0';nodes.lightPower.oninput();assert(text('world').includes('RELEASED'));
    nodes.lightPower.value='10';nodes.lightPower.oninput();assert(text('world').includes('OVER-COMPRESSED'));
  }
  if(L.slug==='ci-cd-github-actions'){
    assert(text('world').includes('Decision: ALLOW short-lived role session'));
    nodes.oidcAudience.value='wrong';nodes.oidcAudience.onchange();assert(text('world').includes('Decision: DENY'));
    nodes.oidcAudience.value='aws';nodes.oidcRepo.value='fork';nodes.oidcRepo.onchange();assert(text('world').includes('Decision: DENY'));
    nodes.oidcRepo.value='expected';nodes.oidcEnvironment.value='dev';nodes.oidcEnvironment.onchange();assert(text('world').includes('Decision: DENY'));
  }
  if(L.slug==='apis-microservices'){
    assert(text('world').includes('Child work performed: 380 ms')&&text('world').includes('DEADLINE_EXCEEDED')&&text('world').includes('Work after client deadline: 0 ms'));
    nodes.propagateDeadline.checked=false;nodes.propagateDeadline.onchange();assert(text('world').includes('Work after client deadline: 70 ms'));
    nodes.propagateDeadline.checked=true;nodes.inventoryMs.value='300';nodes.inventoryMs.oninput();assert(text('world').includes('Client result: OK'));
  }
  const reviews=(h.match(/Recall first, then reveal/g)||[]).length;
  assert.equal(reviews,2);
  if(['ci-cd-github-actions','apis-microservices'].includes(L.slug)) assert(h.includes('Day12:')&&h.includes('Day14:'));
  else assert(h.includes('Day6:')&&h.includes('Day10:'));
  assert(h.includes('checked 2026-10-05'));assert(h.includes('15 minutes'));
  assert(h.includes('What this model does and does not represent'));
  assert(h.includes('captured by running this exact example during the build'));
  console.log('PASS',L.slug,'mechanism, boundary and review allocation');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),d=state.days.find(x=>x.number===15);
assert.equal(state.days.filter(x=>x.generation_key==='2026-10-05').length,1);
assert.deepEqual(d.review_keys,['Day10+3','Day12+3','Day14+1','Day6+7']);
assert.equal(d.lesson_slugs.length,7);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('105 minutes total'));
for(const name of ['index.html',...lessons.map(x=>x.slug+'.html')]){
  const h=fs.readFileSync(path.join(__dirname,name),'utf8');
  for(const [,href] of h.matchAll(/href="([^"]+)"/g)){
    if(!/^https?:|^#/.test(href))assert(fs.existsSync(path.resolve(__dirname,href)),'missing '+href);
  }
}
console.log('PASS seven tracks, 105 minutes, unique generation key and track-aware spaced reviews.');
