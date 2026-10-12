// Semantic checks for Day22 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node(),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': '+s+' in '+text(id));
 if(L.slug==='data-engineering'){has('world','Gold=5');for(let i=0;i<5;i++)nodes.incidentNext.onclick();has('world','Gold candidate promoted: 3 rows');for(let i=0;i<5;i++)nodes.dbNext.onclick();has('dbWorld','validation passed; publish eligible');for(let i=0;i<5;i++)nodes.sfNext.onclick();has('sfWorld','validate succeeded; task may publish');nodes.productQ0.value='0';nodes.productQ1.value='2';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('world','reply HLC (100,1)');nodes.bClock.value='105';nodes.bClock.oninput();has('world','reply HLC (105,0)');}
 if(L.slug==='distinguished-engineer'){has('world','customer correction still in progress');nodes.recoveryPoint.value='2';nodes.recoveryPoint.onchange();has('world','preventive control verified');}
 if(L.slug==='genai-engineering'){has('world','reject + record error');nodes.toolResult.value='valid';nodes.toolResult.onchange();has('world','pass to model');}
 if(L.slug==='technology-breakthroughs'){has('world','0.750');has('world','0.045');nodes.vValue.value='20';nodes.vValue.oninput();has('world','0.500');}
 if(L.slug==='ci-cd-github-actions'){has('world','sha256:bbb');nodes.deployMode.value='promote';nodes.deployMode.onchange();has('world','tested artifact crossed');}
 if(L.slug==='apis-microservices'){nodes.sendRequest.onclick();has('world','CREATE o-900');nodes.requestCase.value='retry';nodes.sendRequest.onclick();has('world','REPLAY o-900');has('world','orders created1');nodes.requestCase.value='mismatch';nodes.sendRequest.onclick();has('world','REJECT key reuse');}
 assert(h.includes('checked 2026-10-12'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===22);assert.deepEqual(day.review_keys,['Day14+7','Day19+1','Day7+14']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-12').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day22/data-engineering');assert.equal(cov.product_material_added_on,'2026-10-12');assert.equal(cov.session_type,'consolidation');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===22&&x.key==='Day17/data-engineering+products+3'));console.log('PASS date, duration, review and coverage-only state');
