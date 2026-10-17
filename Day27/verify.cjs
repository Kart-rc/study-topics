// Semantic checks for Day27 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 for(const [,id] of h.matchAll(/<input id="([^"]+)"[^>]*checked/g))nodes[id].checked=true;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node(),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': expected '+s+' in '+text(id));
 if(L.slug==='data-engineering'){has('winnerWorld','SHIPPED only');nodes.eventMinute.value='1';nodes.eventMinute.oninput();has('winnerWorld','PACKED only');has('dbMergeWorld','one source action');nodes.sfStrict.value='false';nodes.sfStrict.onchange();has('sfMergeWorld','undefined winner risk');nodes.productQ0.value='1';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('dlqWorld','processing failed');nodes.receiveCount.value='4';nodes.receiveCount.oninput();has('dlqWorld','quarantined');nodes.failureKind.value='transient';nodes.failureKind.onchange();has('dlqWorld','timeout cleared');}
 if(L.slug==='distinguished-engineer'){has('guardrailWorld','PASS');nodes.serviceOwner.checked=false;nodes.serviceOwner.onchange();has('guardrailWorld','BLOCK');nodes.exceptionActive.checked=true;nodes.exceptionActive.onchange();has('guardrailWorld','temporary exception');}
 if(L.slug==='genai-engineering'){has('replayWorld','read-only');nodes.agentAction.value='refund';nodes.agentAction.onchange();has('replayWorld','STUB');nodes.replayMode.value='live';nodes.replayMode.onchange();has('replayWorld','LIVE');}
 if(L.slug==='technology-breakthroughs'){has('dnaWorld','Archive reconstructed');nodes.dropletSet.value='noA';nodes.dropletSet.onchange();has('dnaWorld','Cannot start peeling');}
 if(L.slug==='ci-cd-github-actions'){has('cacheWorld','latest prefix: h1');nodes.cacheAvailable.value='exact';nodes.cacheAvailable.onchange();has('cacheWorld','exact h2');}
 if(L.slug==='apis-microservices'){has('bolaWorld','ALLOW owner');nodes.orderId.value='43';nodes.orderId.onchange();has('bolaWorld','DENY');nodes.objectCheck.checked=false;nodes.objectCheck.onchange();has('bolaWorld','VULNERABLE');}
 assert(h.includes('checked 2026-10-17'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===27);assert.deepEqual(day.review_keys,['Day10+14','Day17+7','Day21+3']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-17').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day27/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,4);assert.equal(cov.cycle_origin,'Day24');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===27&&x.key==='Day20/data-engineering+products+3'));console.log('PASS date, duration, review and certification coverage state');
