// Semantic checks for Day26 teaching worlds. Native layout remains a browser concern.
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
 if(L.slug==='data-engineering'){has('capacityWorld','Scale up');nodes.heavyNeed.value='30';nodes.heavyNeed.oninput();has('capacityWorld','worker capacity 40');nodes.dbSymptom.value='queue';nodes.dbSymptom.onchange();has('dbCapacityWorld','raise max clusters');nodes.sfSymptom.value='heavy';nodes.sfSymptom.onchange();has('sfCapacityWorld','resize warehouse');nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('saveWorld','repair marker');nodes.saveFail.value='required';nodes.saveFail.onchange();has('saveWorld','full rollback');}
 if(L.slug==='distinguished-engineer'){has('costWorld','$40/TB');nodes.teamBTb.value='400';nodes.teamBTb.oninput();has('costWorld','$20/TB');}
 if(L.slug==='genai-engineering'){has('sliceWorld','BLOCK');nodes.paymentPass.value='4';nodes.paymentPass.oninput();has('sliceWorld','PASS');}
 if(L.slug==='technology-breakthroughs'){has('cxlWorld','capacity fits');nodes.burstGb.value='128';nodes.burstGb.oninput();has('cxlWorld','capacity fits');}
 if(L.slug==='ci-cd-github-actions'){has('artifactWorld','COLLISION');nodes.uniqueNames.checked=true;nodes.uniqueNames.onchange();has('artifactWorld','SAFE');}
 if(L.slug==='apis-microservices'){has('gqlWorld','Total 1110');nodes.commentN.value='2';nodes.commentN.oninput();has('gqlWorld','within budget');}
 assert(h.includes('checked 2026-10-16'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===26);assert.deepEqual(day.review_keys,['Day20+3','Day22+1']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-16').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day26/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,3);assert.equal(cov.cycle_origin,'Day24');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===26&&x.key==='Day21/data-engineering+products+1'));console.log('PASS date, duration, review and certification coverage state');
