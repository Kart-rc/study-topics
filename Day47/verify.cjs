// Semantic checks for Day47 teaching worlds. Native layout remains a browser concern.
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
  has('joinWorld','32 MB');nodes.dimSize.value='2048';nodes.dimSize.onchange();has('joinWorld','8,192 MB');has('joinWorld','Unsafe');
  has('dbJoinWorld','32 MB');nodes.dbJoinSize.value='2048';nodes.dbJoinSize.onchange();has('dbJoinWorld','8192 MB');has('dbJoinWorld','memory risk');
  has('sfJoinWorld','10M output rows');nodes.sfJoinRows.value='15';nodes.sfJoinRows.oninput();has('sfJoinWorld','15M output rows');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('mapWorld','A=5, B=7, C=9');nodes.mapTiming.value='after';nodes.mapTiming.onchange();has('mapWorld','A=5, B=7');has('mapWorld','pre-update');}
 if(L.slug==='distinguished-engineer'){has('pathWorld','day 12');nodes.saveMigration.value='2';nodes.saveMigration.oninput();has('pathWorld','day 10');}
 if(L.slug==='genai-engineering'){has('mcpWorld','modern per-request _meta');has('mcpWorld','task UX disabled');nodes.taskCap.checked=true;nodes.taskCap.onchange();has('mcpWorld','task UX enabled');nodes.mcpEra.value='legacy';nodes.allowFallback.checked=false;nodes.mcpEra.onchange();has('mcpWorld','fail closed');}
 if(L.slug==='technology-breakthroughs'){has('photonWorld','retained state 0.20');nodes.applyPulse.onclick();nodes.applyPulse.onclick();nodes.applyPulse.onclick();has('photonWorld','retained state 0.65');nodes.pulseDir.value='down';nodes.pulseDir.onchange();nodes.applyPulse.onclick();has('photonWorld','retained state 0.50');}
 if(L.slug==='ci-cd-github-actions'){has('deployStatusWorld','Deployment truth is');has('deployStatusWorld','failure');nodes.clusterHealth.value='ok';nodes.clusterHealth.onchange();has('deployStatusWorld','success');}
 if(L.slug==='apis-microservices'){has('earlyWorld','425 Too Early');nodes.earlyData.checked=false;nodes.earlyData.onchange();has('earlyWorld','process request');has('earlyWorld','idempotency ledger checks key');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-06'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===47);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-06').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day27+7','Day31+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day47/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,3);assert.equal(cov.cycle_origin,'Day45');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,50);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,51);assert(cert.product_review_deliveries.some(x=>x.day_number===47&&x.key==='Day23/data-engineering+products+7'));console.log('PASS date, duration, review and certification state');
