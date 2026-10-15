// Semantic checks for Day25 teaching worlds. Native layout remains a browser concern.
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
 if(L.slug==='data-engineering'){has('shareWorld','queries v3');nodes.shareVersion.value='4';nodes.shareVersion.oninput();has('shareWorld','queries v4');nodes.shareGrant.checked=false;nodes.shareGrant.oninput();has('shareWorld','no rows');nodes.dbMode.value='revoked';nodes.dbMode.onchange();has('dbShareWorld','DENY');nodes.sfShareCase.value='write';nodes.sfShareCase.onchange();has('sfShareWorld','UPDATE DENIED');nodes.productQ0.value='0';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('lockWorld','opposite order');nodes.lockStep.onclick();has('lockWorld','7 → 9 → 7');nodes.orderedLocks.checked=true;nodes.orderedLocks.onchange();has('lockWorld','no cycle');}
 if(L.slug==='distinguished-engineer'){has('sloWorld','99.8501%');has('sloWorld','misses estimate');nodes.depCount.value='1';nodes.depCount.oninput();has('sloWorld','fits estimate');}
 if(L.slug==='genai-engineering'){has('pairWorld','B wins 2');has('pairWorld','A wins 1');has('pairWorld','net 1');}
 if(L.slug==='technology-breakthroughs'){has('flashWorld','Full score cells: 64');has('flashWorld','peak tile cells in this model: 16');nodes.seqN.value='16';nodes.seqN.oninput();has('flashWorld','256');}
 if(L.slug==='ci-cd-github-actions'){has('attemptWorld','ci/815/2');nodes.attemptNo.value='3';nodes.attemptNo.oninput();has('attemptWorld','ci/815/3');}
 if(L.slug==='apis-microservices'){has('maskWorld','America/New_York');nodes.maskChoice.value='both';nodes.maskChoice.onchange();has('maskWorld','false');}
 assert(h.includes('checked 2026-10-15'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===25);assert.deepEqual(day.review_keys,['Day16+7','Day21+1','Day9+14']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-15').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day25/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,2);assert.equal(cov.cycle_origin,'Day24');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===25&&x.key==='Day19/data-engineering+products+3'));console.log('PASS date, duration, review and certification coverage state');
