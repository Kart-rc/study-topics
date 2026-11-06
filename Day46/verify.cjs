// Semantic checks for Day46 teaching worlds. Native layout remains a browser concern.
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
  has('fanWorld','3');has('fanWorld','O-11 → NULL');nodes.fanMode.value='inner';nodes.fanMode.onchange();has('fanWorld','Output rows: 2');has('fanWorld','distinct parents retained: 1');
  has('dbExplodeWorld','O-11/NULL');nodes.dbExplode.value='inner';nodes.dbExplode.onchange();has('dbExplodeWorld','2 rows');has('dbExplodeWorld','O-11 is absent');
  has('sfFlatWorld','INDEX NULL');nodes.sfOuter.value='false';nodes.sfOuter.onchange();assert(!text('sfFlatWorld').includes('INDEX NULL'));
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){
  has('queueWorld','running workers');has('queueWorld','2 / 8');has('queueWorld','queued8');nodes.queueKind.value='bounded';nodes.queueKind.onchange();has('queueWorld','8 / 8');has('queueWorld','queued2');
 }
 if(L.slug==='distinguished-engineer'){
  has('headroomWorld','Latest deterministic trigger: 720 rps');has('headroomWorld','1030 rps');has('headroomWorld','OVER');nodes.lead.value='2';nodes.lead.oninput();has('headroomWorld','860 rps');assert(!text('headroomWorld').includes('OVER'));
 }
 if(L.slug==='genai-engineering'){
  has('taskWorld','working');has('taskWorld','wait 5000 ms');nodes.taskAction.value='input';nodes.taskAction.onchange();has('taskWorld','input_required');nodes.taskAction.value='cancel';nodes.taskAction.onchange();has('taskWorld','may still finish');
 }
 if(L.slug==='technology-breakthroughs'){
  has('sensorWorld','PbS film grown in place');has('sensorWorld','327,680');nodes.sensorMode.value='bond';nodes.sensorMode.onchange();has('sensorWorld','pixel bonding/alignment');has('sensorWorld','separate bonding boundary');
 }
 if(L.slug==='ci-cd-github-actions'){
  has('deployWorld','blue old version');has('deployWorld','100 requests');nodes.greenTraffic.value='10';nodes.greenTraffic.onchange();has('deployWorld','10 requests');nodes.greenFails.checked=true;nodes.greenFails.onchange();has('deployWorld','router returned new traffic to blue');has('deployWorld','database write would still remain');
 }
 if(L.slug==='apis-microservices'){
  has('mutationWorld','RES-9');has('mutationWorld','ERROR');has('mutationWorld','still present until explicit release');nodes.chargeResult.value='ok';nodes.chargeResult.onchange();has('mutationWorld','PAID');has('mutationWorld','kept for the paid order');
 }
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-05'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===46);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-05').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day20+14','Day32+1','Day4+30']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day46/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,2);assert.equal(cov.cycle_origin,'Day45');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,50);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,51);assert(cert.product_review_deliveries.some(x=>x.day_number===46&&x.key==='Day28/data-engineering+products+1'));console.log('PASS date, duration, review and certification state');
