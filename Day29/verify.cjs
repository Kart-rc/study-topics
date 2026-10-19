// Semantic checks for Day29 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 for(const [,id] of h.matchAll(/<input id="([^"]+)"[^>]*checked/g))nodes[id].checked=true;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node(),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': expected '+s+' in '+text(id));
 if(L.slug==='data-engineering'){has('releaseWorld','PUBLISH CERTIFIED VIEW');nodes.identityOk.checked=false;nodes.identityOk.onchange();has('releaseWorld','first failed gate: identity');has('dbCase','scale up');nodes.dbLoad.value='many';nodes.dbLoad.onchange();has('dbCase','scale out');has('sfCase','multi-cluster');nodes.productQ0.value='1';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('piWorld','H is still blocked');nodes.piOn.checked=true;nodes.piOn.onchange();has('piWorld','H runs at t4');}
 if(L.slug==='distinguished-engineer'){has('wipWorld','Completed evidence exists for 2');nodes.wipLimit.value='6';nodes.wipLimit.oninput();has('wipWorld','nothing reaches done');}
 if(L.slug==='genai-engineering'){has('approvalWorld','BLOCKED');nodes.approveCall.onclick();has('approvalWorld','EXECUTE after guardrail');nodes.newCall.onclick();has('approvalWorld','no matching decision');}
 if(L.slug==='technology-breakthroughs'){has('opticWorld','detector sum2');nodes.optBit.value='1';nodes.optBit.oninput();has('opticWorld','detector sum1');}
 if(L.slug==='ci-cd-github-actions'){has('checkWorld','PENDING');nodes.gateDesign.value='gate';nodes.gateDesign.onchange();has('checkWorld','SUCCESS · expensive job skipped');nodes.changeType.value='code';nodes.changeType.onchange();has('checkWorld','SUCCESS · tests ran');}
 if(L.slug==='apis-microservices'){has('retryWorld','allowed by policy');nodes.rpcFailure.value='after';nodes.rpcFailure.onchange();has('retryWorld','not created');has('retryWorld','application owns the outcome');}
 assert(h.includes('checked 2026-10-19'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===29);assert.deepEqual(day.review_keys,['Day18+7','Day22+3']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-19').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day29/data-engineering');assert.equal(cov.session_type,'consolidation_case');assert.equal(cov.cycle_position,6);assert.equal(cov.cycle_origin,'Day24');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===29&&x.key==='Day21/data-engineering+products+3'));console.log('PASS date, duration, review and certification coverage state');
