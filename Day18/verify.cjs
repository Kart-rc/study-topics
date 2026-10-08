// Semantic checks for Day18 teaching worlds. A simulated DOM is not a browser layout test.
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
  const text=id=>nodes[id].textContent || (nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');
  const has=(id,s)=>assert(text(id).includes(s),id+': '+s+' in '+text(id));
  if(L.slug==='data-engineering'){
    has('world','denied');nodes.gateMode.value='granted';nodes.gateMode.onchange();has('world','sum 50');nodes.tableChoice.value='payroll';nodes.tableChoice.onchange();has('world','denied');
    for(let i=0;i<4;i++)nodes.dbNext.onclick();has('dbState','sum 50');assert(nodes.dbNext.disabled);
    nodes.dbMissing.value='schema';nodes.dbMissing.onchange();for(let i=0;i<4;i++)nodes.dbNext.onclick();has('dbState','denied');nodes.dbReset.onclick();has('dbState','Step 0/4');
    for(let i=0;i<6;i++)nodes.sfNext.onclick();has('sfState','sum 50');assert(nodes.sfNext.disabled);
    nodes.sfMissing.value='warehouse';nodes.sfMissing.onchange();for(let i=0;i<6;i++)nodes.sfNext.onclick();has('sfState','warehouse unavailable');nodes.sfReset.onclick();has('sfState','Step 0/6');
    nodes.productQ0.value='';nodes.productQ1.value='';nodes.productGrade.onclick();has('productScore','Answer both');nodes.productQ0.value='0';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');
  }
  if(L.slug==='software-engineering'){
    for(let i=0;i<3;i++)nodes.sendRequest.onclick();has('world','Available permits: 0');has('world','Refused before DB: R3');nodes.finishRequest.onclick();has('world','Available permits: 1');nodes.sendRequest.onclick();has('world','R4');
    nodes.releasePolicy.value='leak';nodes.releasePolicy.onchange();nodes.sendRequest.onclick();nodes.finishRequest.onclick();has('world','leaked: 1');nodes.resetSlots.onclick();has('world','Available permits: 2');
  }
  if(L.slug==='distinguished-engineer'){
    assert(nodes.acceptDecision.disabled);nodes.freshness.value='0.25';nodes.freshness.onchange();has('world','ADR-8: proposed');nodes.acceptDecision.onclick();has('world','ADR-7: superseded');has('world','ADR-8: accepted');nodes.resetDecision.onclick();has('world','Review needed: false');
  }
  if(L.slug==='genai-engineering'){
    has('world','Reported passes: 2/2');nodes.workspaceMode.value='fresh';nodes.workspaceMode.onchange();has('world','Reported passes: 1/2');has('world','FAIL');
  }
  if(L.slug==='technology-breakthroughs'){
    has('world','Final output: A 60%, B 40%');has('world','reassigned to B');nodes.correction.value='blind';nodes.correction.onchange();has('world','Final output: A 80%, B 20%');nodes.draftShape.value='0.4';nodes.draftShape.onchange();has('world','reassigned to A');nodes.correction.value='correct';nodes.correction.onchange();has('world','Final output: A 60%, B 40%');
  }
  if(L.slug==='ci-cd-github-actions'){
    has('world','Sibling cancellation: false');nodes.failedLane.value='J17';nodes.failedLane.onchange();has('world','Sibling cancellation: true');nodes.failFast.value='false';nodes.failFast.onchange();has('world','Sibling cancellation: false');has('world','Required failure present: true');
  }
  if(L.slug==='apis-microservices'){
    nodes.jobNext.onclick();has('world','job state: running');nodes.jobNext.onclick();has('world','HTTP 200; job state: failed');has('world','Original POST: 202');assert(nodes.jobNext.disabled);nodes.jobOutcome.value='succeeded';nodes.jobOutcome.onchange();nodes.jobNext.onclick();nodes.jobNext.onclick();has('world','Download ready');nodes.jobReset.onclick();has('world','job state: queued');
  }
  assert.equal((h.match(/Recall first, then reveal the refresher/g)||[]).length,2);
  const newer=['ci-cd-github-actions','apis-microservices'].includes(L.slug);
  assert(h.includes(newer?'Day11:':'Day3:')&&h.includes(newer?'Day15:':'Day9:'));
  assert(h.includes('checked 2026-10-08'));
  assert(h.includes('Use case: when to use this'));
  assert(L.written_questions.length===2&&L.questions.length===3);
  console.log('PASS',L.slug,'prediction, failure boundary, reset and review');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),d=state.days.find(x=>x.number===18);
assert.deepEqual(d.review_keys,['Day11+7','Day15+3','Day3+14','Day9+7']);
assert.equal(state.days.filter(x=>x.generation_key==='2026-10-08').length,1);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json')));
const coverage=cert.coverage.find(x=>x.lesson==='Day18/data-engineering');assert.equal(coverage.product_material_added_on,'2026-10-08');assert.equal(coverage.mastery,'not_assessed');
assert(!cert.product_review_deliveries.some(x=>x.day_number===18),'Day17 product additions are today, not yesterday');
console.log('PASS dates, 120-minute budget, product addition dates and coverage-only record');
