// Semantic checks for Day28 teaching worlds. Native layout remains a browser concern.
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
 if(L.slug==='data-engineering'){has('repairGraph','100 business keys');nodes.repairMode.value='append';nodes.repairMode.onchange();has('repairGraph','160');has('dbRepair','100 keys');nodes.sfChanged.value='yes';nodes.sfChanged.onchange();has('sfRepair','graph changed');nodes.productQ0.value='1';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('poolWorld','none');nodes.parents.value='1';nodes.parents.oninput();has('poolWorld','a child can start');}
 if(L.slug==='distinguished-engineer'){has('journeyWorld','Activation: 45%');nodes.prodTeams.value='30';nodes.prodTeams.oninput();has('journeyWorld','30%');}
 if(L.slug==='genai-engineering'){has('memoryWorld','QUARANTINE');nodes.memSource.value='user';nodes.memType.value='preference';nodes.memSource.onchange();has('memoryWorld','ACCEPT + TTL');nodes.memType.value='instruction';nodes.memType.onchange();has('memoryWorld','HUMAN REVIEW');}
 if(L.slug==='technology-breakthroughs'){has('tandemWorld','= 19');nodes.topCurrent.value='17';nodes.topCurrent.oninput();has('tandemWorld','Perovskite limits');}
 if(L.slug==='ci-cd-github-actions'){has('summaryWorld','BLOCKED');nodes.budget.value='30';nodes.budget.oninput();has('summaryWorld','DEPLOY');}
 if(L.slug==='apis-microservices'){has('schemaWorld','VALID: exactly one');nodes.hasIban.checked=true;nodes.hasIban.onchange();has('schemaWorld','INVALID: 2 matches');has('schemaWorld','VALID: at least one');}
 assert(h.includes('checked 2026-10-18'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===28);assert.deepEqual(day.review_keys,['Day11+14','Day23+1']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-18').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day28/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,5);assert.equal(cov.cycle_origin,'Day24');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===28&&x.key==='Day22/data-engineering+products+1'));console.log('PASS date, duration, review and certification coverage state');
