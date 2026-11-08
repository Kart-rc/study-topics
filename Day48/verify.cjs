// Semantic checks for Day48 teaching worlds. Native layout remains a browser concern.
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
  has('maskWorld','a***@example.com');nodes.maskRole.value='fraud';nodes.maskRole.onchange();has('maskWorld','alex@example.com');
  has('dbMaskWorld','a***@example.com');nodes.dbMaskRole.value='fraud';nodes.dbMaskRole.onchange();has('dbMaskWorld','alex@example.com');
  has('sfMaskWorld','a***@example.com');nodes.sfMaskRole.value='FRAUD';nodes.sfMaskRole.onchange();has('sfMaskWorld','alex@example.com');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('vtWorld','carrier pinning');nodes.vtJdk.value='24';nodes.vtJdk.onchange();has('vtWorld','database permits');has('vtWorld','Modeled concurrent progress: 8');}
 if(L.slug==='distinguished-engineer'){has('decisionWorld','74.5h');has('decisionWorld','97%');nodes.decisionWait.value='0';nodes.decisionWait.oninput();has('decisionWorld','Work is now the larger component');}
 if(L.slug==='genai-engineering'){has('cacheWorld','HIT');nodes.cacheTenant.value='B';nodes.cacheTenant.onchange();has('cacheWorld','MISS · isolated');nodes.cacheScope.value='public';nodes.cacheScope.onchange();has('cacheWorld','Safe only if');nodes.cacheInvalidated.checked=true;nodes.cacheInvalidated.onchange();has('cacheWorld','MISS · invalidated');}
 if(L.slug==='technology-breakthroughs'){has('co2World','response 0.00');nodes.co2Step.onclick();has('co2World','response 0.06');nodes.co2Flow.value='0';nodes.co2Flow.oninput();nodes.co2Step.onclick();has('co2World','response 0.00');}
 if(L.slug==='ci-cd-github-actions'){has('ghaWorld','outcome=failure');has('ghaWorld','conclusion=success');nodes.ghaTolerate.checked=false;nodes.ghaTolerate.onchange();has('ghaWorld','conclusion=failure');}
 if(L.slug==='apis-microservices'){has('grpcWorld','initial metadata');has('grpcWorld','traceparent');nodes.grpcField.value='customer';nodes.grpcField.onchange();has('grpcWorld','protobuf message');nodes.grpcField.value='cost';nodes.grpcField.onchange();has('grpcWorld','trailing metadata');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-08'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===48);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-08').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day21+14','Day33+1','Day5+30']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day48/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,4);assert.equal(cov.cycle_origin,'Day45');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,50);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,51);assert(cert.product_review_deliveries.some(x=>x.day_number===48&&x.key==='Day27/data-engineering+products+3'));console.log('PASS date, duration, review and certification state');
