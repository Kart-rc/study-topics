// Semantic checks for Day44 teaching worlds. Native layout remains a browser concern.
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
  has('gapWorld','transform success');has('gapWorld','repair it and dependents');nodes.gapCase.value='quality';nodes.gapCase.onchange();has('gapWorld','quality approval');has('gapWorld','keep live v43');nodes.gapCase.value='publish';nodes.gapCase.onchange();has('gapWorld','publication success');nodes.gapCase.value='queue';nodes.gapCase.onchange();has('gapWorld','serving capacity');
  has('dbGapWorld','repair transform + dependent publish');has('dbGapWorld','current task definition');nodes.dbGap.value='publish';nodes.dbGap.onchange();has('dbGapWorld','repair publish only');nodes.dbGap.value='green';nodes.dbGap.onchange();has('dbGapWorld','no repair');
  has('sfGapWorld','TRANSFORM_PAYMENTS');has('sfGapWorld','RETRY LAST');nodes.sfGap.value='publish';nodes.sfGap.onchange();has('sfGapWorld','PUBLISH_LIVE');nodes.sfGap.value='green';nodes.sfGap.onchange();has('sfGapWorld','do not retry');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){
  has('allWorld','not done');has('allWorld','still waits');nodes.allCase.value='finished';nodes.allCase.onchange();has('allWorld','done + exceptional');nodes.allCase.value='success';nodes.allCase.onchange();has('allWorld','done + normal');
 }
 if(L.slug==='distinguished-engineer'){
  has('pageWorld','PAGE');nodes.pageSignal.value='cpu';nodes.pageSignal.onchange();has('pageWorld','TICKET');nodes.pageSignal.value='quota';nodes.pageSignal.onchange();has('pageWorld','PAGE');nodes.pageSignal.value='unknown';nodes.pageSignal.onchange();has('pageWorld','FIX MONITOR');
 }
 if(L.slug==='genai-engineering'){
  has('resourceWorld','metadata only');has('resourceWorld','fetches only if needed');nodes.resourceMode.value='embed';nodes.resourceMode.onchange();has('resourceWorld','1 MB payload');nodes.resourceSize.value='100';nodes.resourceSize.onchange();has('resourceWorld','100 MB payload');nodes.resourceMode.value='link';nodes.resourceMode.onchange();has('resourceWorld','resources/list');
 }
 if(L.slug==='technology-breakthroughs'){
  has('fibreWorld','fibre 3');has('fibreWorld','position 5');has('fibreWorld','5,184 pixels');nodes.fibreIndex.value='7';nodes.fibreIndex.oninput();nodes.pixelIndex.value='0';nodes.pixelIndex.oninput();has('fibreWorld','fibre 7');has('fibreWorld','position 0');
 }
 if(L.slug==='ci-cd-github-actions'){
  has('oidcWorld','ALLOW');nodes.oidcSource.value='feature';nodes.oidcSource.onchange();has('oidcWorld','DENY');nodes.oidcSource.value='main';nodes.oidcSource.onchange();nodes.oidcPolicy.value='legacy';nodes.oidcPolicy.onchange();has('oidcWorld','DENY');has('oidcWorld','repo:acme/payments');
 }
 if(L.slug==='apis-microservices'){
  has('sagaWorld','CANCELLED');has('sagaWorld','AVAILABLE');has('sagaWorld','history remains');nodes.sagaComp.value='fail';nodes.sagaComp.onchange();has('sagaWorld','COMPENSATING');has('sagaWorld','manual repair');nodes.sagaPayment.value='ok';nodes.sagaPayment.onchange();has('sagaWorld','CONFIRMED');has('sagaWorld','CAPTURED');
 }
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-03'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===44);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-03').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day19+14','Day3+30','Day31+1']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day44/data-engineering');assert.equal(cov.session_type,'retrieval_gap');assert.equal(cov.cycle_position,7);assert.equal(cov.cycle_origin,'Day38');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,50);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,51);assert(cert.product_review_deliveries.some(x=>x.day_number===44&&x.key==='Day22/data-engineering+products+7'));console.log('PASS date, duration, review and certification state');
