// Semantic checks for Day21 teaching worlds. Native layout remains a browser concern.
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
 if(L.slug==='data-engineering'){has('world','Visible gold rows: 0');nodes.qualityOutcome.value='pass';nodes.qualityOutcome.onchange();has('world','Visible gold rows: 1,000');for(let i=0;i<3;i++)nodes.dbNext.onclick();has('dbWorld','notify_failure = RUNNING');for(let i=0;i<3;i++)nodes.sfNext.onclick();has('sfWorld','finalizer attached to root');nodes.productQ0.value='1';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('world','Impossible mixture');nodes.configMode.value='snapshot';nodes.configMode.onchange();has('world','Coherent version observed');}
 if(L.slug==='distinguished-engineer'){has('world','PII must be encrypted');nodes.encrypted.value='yes';nodes.exposure.value='private';nodes.exposure.onchange();has('world','No selected violation');has('world','PASS');}
 if(L.slug==='genai-engineering'){has('world','Confounded comparison');nodes.catalogB.value='same';nodes.catalogB.onchange();has('world','Controlled comparison');}
 if(L.slug==='technology-breakthroughs'){has('world','0.63');nodes.ensembleCase.value='wrong';nodes.ensembleCase.onchange();has('world','0.10');has('world','Agreement did not create independent evidence');}
 if(L.slug==='ci-cd-github-actions'){has('world','PWN REQUEST PATH');nodes.runFork.value='no';nodes.runFork.onchange();has('world','No modeled secret-execution crossing');}
 if(L.slug==='apis-microservices'){has('world','Earliest retry: 1s');nodes.retryMode.value='jitter';nodes.retryMode.onchange();has('world','Earliest retry: 3s');has('world','Peak simultaneous retries: 2');}
 assert(h.includes('checked 2026-10-11'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===21);assert.deepEqual(day.review_keys,['Day13+7','Day17+3','Day6+14']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-11').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day21/data-engineering');assert.equal(cov.product_material_added_on,'2026-10-11');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===21&&x.key==='Day19/data-engineering+products+1'));console.log('PASS date, duration, review and coverage-only state');
