// Semantic checks for Day14 teaching worlds. A simulated DOM is not a browser layout test.
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
  const click=id=>nodes[id].onclick(),text=id=>nodes[id].textContent;
  if(L.slug==='data-engineering'){
    assert(text('world').includes('"O42":"paid"')&&text('world').includes('101, 102'));
    nodes.startAfter.value='101';nodes.startAfter.onchange();assert(text('world').includes('Missing live changes: 101'));
    nodes.startAfter.value='99';nodes.startAfter.onchange();assert(text('world').includes('Repeated boundary changes: 100'));
  }
  if(L.slug==='software-engineering'){
    nodes.crashPoint.value='middle';nodes.crashPoint.onchange();assert(text('world').includes('REDO available: true')&&text('world').includes('Recovered stock: 4'));
    nodes.crashPoint.value='before';nodes.crashPoint.onchange();assert(text('world').includes('Recovered stock: 5'));
    nodes.breakRule.checked=true;nodes.breakRule.onchange();assert(text('world').includes('UNSAFE ORDER'));
  }
  if(L.slug==='distinguished-engineer'){
    assert(text('world').includes('Healthy cells: 2 of 3'));
    nodes.waveSize.value='2';nodes.waveSize.oninput();assert(text('world').includes('Healthy cells: 1 of 3'));
    nodes.needHealthy.value='2';nodes.needHealthy.oninput();assert(text('world').includes('MISSED'));
  }
  if(L.slug==='genai-engineering'){
    assert(text('world').includes('PASS TO MODEL'));
    nodes.toolCase.value='error';nodes.toolCase.onchange();assert(text('world').includes('tool execution error'));
    nodes.toolCase.value='malformed';nodes.toolCase.onchange();assert(text('world').includes('schema mismatch'));
    nodes.toolCase.value='timeout';nodes.toolCase.onchange();assert(text('world').includes('deadline exceeded'));
  }
  if(L.slug==='technology-breakthroughs'){
    nodes.dnaCandidate.value='1';nodes.dnaCandidate.oninput();assert(text('world').includes('Digital parity target: 1')&&text('world').includes('favored target'));
    nodes.dnaBits.value='00000000';nodes.dnaCandidate.value='0';nodes.dnaBits.oninput();
    assert(text('world').includes('Digital parity target: 0'));
  }
  if(L.slug==='ci-cd-github-actions'){
    assert(text('world').includes('Decision: ACCEPT'));
    nodes.workflowInput.value='true';nodes.workflowInput.onchange();assert(text('world').includes('Decision: REJECT'));
    nodes.workflowInput.value='staging';nodes.workflowSecret.value='missing';nodes.workflowSecret.onchange();assert(text('world').includes('Required secret present: false'));
  }
  if(L.slug==='apis-microservices'){
    assert(text('world').includes('Naive total: 4')&&text('world').includes('Batched total: 2'));
    nodes.post3.checked=false;nodes.post3.onchange();assert(text('world').includes('Resolver loads: ["u1","u2"]'));
    nodes.post1.checked=false;nodes.post2.checked=false;nodes.post2.onchange();assert(text('world').includes('Posts selected: 0'));
  }
  const reviews=(h.match(/Recall first, then reveal/g)||[]).length;
  if(['ci-cd-github-actions','apis-microservices'].includes(L.slug)){
    assert.equal(reviews,2);assert(h.includes('Day11:')&&h.includes('Day13:'));
  }else{
    assert.equal(reviews,2);assert(h.includes('Day5:')&&h.includes('Day9:'));
  }
  assert(h.includes('checked 2026-10-04'));assert(h.includes('15 minutes'));
  assert(h.includes('What this model does and does not represent'));
  console.log('PASS',L.slug,'mechanism, boundary and review allocation');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),d=state.days.find(x=>x.number===14);
assert.equal(state.days.filter(x=>x.generation_key==='2026-10-04').length,1);
assert.deepEqual(d.review_keys,['Day11+3','Day13+1','Day5+7','Day9+3']);
assert.equal(d.lesson_slugs.length,7);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('105 minutes total'));
for(const name of ['index.html',...lessons.map(x=>x.slug+'.html')]){
  const h=fs.readFileSync(path.join(__dirname,name),'utf8');
  for(const [,href] of h.matchAll(/href="([^"]+)"/g)){
    if(!/^https?:|^#/.test(href))assert(fs.existsSync(path.resolve(__dirname,href)),'missing '+href);
  }
}
console.log('PASS seven tracks, 105 minutes, unique generation key and track-aware spaced reviews.');
