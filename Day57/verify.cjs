// Semantic checks for Day57 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={},saved=[];
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
  const options=[...inside.matchAll(/<option([^>]*)>([^<]*)<\/option>/g)].map(m=>({value:m[1].match(/value="([^"]+)"/)?.[1]||m[2],text:m[2],selected:/selected/.test(m[1])}));
  nodes[id].options=options;nodes[id].selectedIndex=Math.max(0,options.findIndex(o=>o.selected));nodes[id].value=options[nodes[id].selectedIndex].value;
 }
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 for(const [,id] of h.matchAll(/<input id="([^"]+)"[^>]*checked/g))nodes[id].checked=true;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:sel=>sel.includes(':checked')?node({value:'0'}):null,createElement:()=>node({click:()=>{}}),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:(k,v)=>saved.push([k,v])},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': expected '+s+' in '+text(id));
 if(L.slug==='data-engineering'){
  has('recoveryWorld','1 current row');has('recoveryWorld','publish verified');nodes.recoveryPlan.value='wake';nodes.recoveryPlan.onchange();has('recoveryWorld','not proven');has('recoveryWorld','publish stale/unknown');
  has('dbConsolidateWorld','share verified');nodes.dbConsolidate.value='start';nodes.dbConsolidate.onchange();has('dbConsolidateWorld','start time drifts');has('dbConsolidateWorld','consumer sees unknown');
  has('sfConsolidateWorld','1 current row');nodes.sfConsolidate.value='split';nodes.sfConsolidate.onchange();has('sfConsolidateWorld','0 current rows');has('sfConsolidateWorld','share must stay closed');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('lockWaitWorld','protected work skipped');nodes.lockWait.value='plain';nodes.lockWait.onchange();has('lockWaitWorld','enters after release');}
 if(L.slug==='distinguished-engineer'){has('escapeWorld','controls retained');has('escapeWorld','re-enter at image v12');nodes.escapePlan.value='fork';nodes.escapePlan.onchange();has('escapeWorld','controls drift');has('escapeWorld','no route back');}
 if(L.slug==='genai-engineering'){has('requestDedupeWorld','already presented');nodes.requestDedupe.value='naive';nodes.requestDedupe.onchange();has('requestDedupeWorld','dialog shown #2');}
 if(L.slug==='technology-breakthroughs'){has('fiWorld','central FI toy0');has('fiWorld','energy proxy2');nodes.fiPhase.value='aligned';nodes.fiPhase.onchange();has('fiWorld','central FI toy4');}
 if(L.slug==='ci-cd-github-actions'){has('queueWorld','queue 8m');has('queueWorld','Capacity or label matching dominates');nodes.queueWait.value='0';nodes.queueWait.onchange();has('queueWorld','Execution dominates');}
 if(L.slug==='apis-microservices'){has('traceWorld','tenant red allowed');nodes.traceCase.value='noauth';nodes.traceCase.onchange();has('traceWorld','request denied');nodes.traceCase.value='badtrace';nodes.traceCase.onchange();has('traceWorld','invalid → new root');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-17'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===57);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-17').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day32+7','Day36+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day57/data-engineering');assert.equal(cov.session_type,'consolidation_case');assert.equal(cov.cycle_position,6);assert.equal(cov.cycle_origin,'Day52');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,57);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,58);assert(cert.product_review_deliveries.some(x=>x.day_number===57&&x.key==='Day31/data-engineering+products+1'));console.log('PASS date, duration, review and certification state');
