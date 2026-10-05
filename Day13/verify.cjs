// Semantic checks for Day13 teaching worlds. A simulated DOM is not a browser layout test.
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
    assert(text('world').includes('SUCCESS')&&text('world').includes('(2)'));
    nodes.followerA.checked=false;nodes.followerA.onchange();assert(text('world').includes('REJECTED'));
    nodes.acksMode.value='1';nodes.acksMode.onchange();assert(text('world').includes('SUCCESS'));
  }
  if(L.slug==='software-engineering'){
    assert(text('world').includes('overlap: B')&&text('world').includes('guaranteed'));
    nodes.readCount.value='1';nodes.readCount.oninput();assert(text('world').includes('overlap: none'));
    nodes.writeCount.value='3';nodes.writeCount.oninput();assert(text('world').includes('overlap: C'));
  }
  if(L.slug==='distinguished-engineer'){
    assert(text('world').includes('Rainbow: fully impacted')&&text('world').includes('Rose: service path remains'));
    nodes.failureSet.value='one';nodes.failureSet.onchange();assert(!text('world').includes('fully impacted'));
    nodes.failureSet.value='other';nodes.failureSet.onchange();assert(text('world').includes('Sunflower: fully impacted'));
  }
  if(L.slug==='genai-engineering'){
    assert(text('world').includes('VIOLATION'));
    nodes.consistentModel.checked=true;nodes.consistentModel.onchange();assert(text('world').includes('PASS'));
    nodes.transformKind.value='reorder';nodes.transformKind.onchange();assert(text('world').includes('PASS'));
  }
  if(L.slug==='technology-breakthroughs'){
    assert(text('world').includes('H − V = +24'));
    nodes.horizontalSignal.value='20';nodes.verticalSignal.value='60';nodes.horizontalSignal.oninput();
    assert(text('world').includes('H − V = -40')&&text('world').includes('V-weighted'));
  }
  if(L.slug==='ci-cd-github-actions'){
    click('runUntrusted');click('runTrusted');assert(text('world').includes('NO · clean start'));
    click('resetRunner');nodes.runnerMode.value='persistent';nodes.runnerMode.onchange();
    click('runUntrusted');click('runTrusted');assert(text('world').includes('YES · unsafe carryover'));
  }
  if(L.slug==='apis-microservices'){
    assert(text('world').includes('Result: Mug'));
    nodes.serverPhase.value='break';nodes.serverPhase.onchange();assert(text('world').includes('ERROR'));
    nodes.clientGeneration.value='new';nodes.clientGeneration.onchange();assert(text('world').includes('Result: Coffee Mug'));
  }
  const reviews=(h.match(/Recall first, then reveal/g)||[]).length;
  if(['ci-cd-github-actions','apis-microservices'].includes(L.slug)){
    assert.equal(reviews,1);assert(h.includes('Day12:'));
  }else{
    assert.equal(reviews,2);assert(h.includes('Day8:')&&h.includes('Day10:'));
  }
  assert(h.includes('checked 2026-10-03'));assert(h.includes('15 minutes'));
  assert(h.includes('What this model does and does not represent'));
  console.log('PASS',L.slug,'mechanism, boundary and review allocation');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),d=state.days.find(x=>x.number===13);
assert.equal(state.days.filter(x=>x.generation_key==='2026-10-03').length,1);
assert.deepEqual(d.review_keys,['Day10+1','Day12+1','Day8+3']);
assert.equal(d.lesson_slugs.length,7);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('105 minutes total'));
for(const name of ['index.html',...lessons.map(x=>x.slug+'.html')]){
  const h=fs.readFileSync(path.join(__dirname,name),'utf8');
  for(const [,href] of h.matchAll(/href="([^"]+)"/g)){
    if(!/^https?:|^#/.test(href))assert(fs.existsSync(path.resolve(__dirname,href)),'missing '+href);
  }
}
console.log('PASS seven tracks, 105 minutes, unique generation key and track-aware spaced reviews.');
