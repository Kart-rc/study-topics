// Semantic checks for Day34 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={},saved=[];
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 for(const [,id] of h.matchAll(/<input id="([^"]+)"[^>]*checked/g))nodes[id].checked=true;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:sel=>sel.includes(':checked')?node({value:'0'}):null,createElement:()=>node({click:()=>{}}),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:(k,v)=>saved.push([k,v])},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': expected '+s+' in '+text(id));
 if(L.slug==='data-engineering'){
  has('cloneWorld','100 GB');nodes.changedFiles.value='3';nodes.changedFiles.oninput();has('cloneWorld','300 GB');
  nodes.dbSource.value='no';nodes.dbSource.onchange();has('dbCloneWorld','broken reference');nodes.dbClone.value='deep';nodes.dbClone.onchange();has('dbCloneWorld','read succeeds');
  has('sfCloneWorld','20%');nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('mapWorld','HIT');nodes.keyTenant.value='west';nodes.keyTenant.onchange();has('mapWorld','MISS');}
 if(L.slug==='distinguished-engineer'){has('planeWorld','new changes accepted');nodes.controlHealthy.checked=false;nodes.controlHealthy.onchange();has('planeWorld','existing traffic flows');nodes.cachedConfig.checked=false;nodes.cachedConfig.onchange();has('planeWorld','traffic stops');}
 if(L.slug==='genai-engineering'){has('turnWorld','Budget=4');nodes.maxTurns.value='2';nodes.maxTurns.oninput();has('turnWorld','Budget=2');}
 if(L.slug==='technology-breakthroughs'){has('corrWorld','8/10');nodes.correlation.value='2';nodes.correlation.oninput();has('corrWorld','2/10');}
 if(L.slug==='ci-cd-github-actions'){has('runnerWorld','QUEUED');nodes.runnerGpu.checked=true;nodes.runnerGpu.onchange();has('runnerWorld','ELIGIBLE');nodes.runnerGroup.checked=false;nodes.runnerGroup.onchange();has('runnerWorld','QUEUED');}
 if(L.slug==='apis-microservices'){has('corsWorld','response not shared');nodes.originAllowed.checked=true;nodes.originAllowed.onchange();has('corsWorld','Caller receives allowed data');nodes.tokenValid.checked=false;nodes.tokenValid.onchange();has('corsWorld','401/403');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('checked 2026-10-24'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===34);assert.deepEqual(day.review_keys,['Day14+14','Day26+1']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-24').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day34/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,4);assert.equal(cov.cycle_origin,'Day31');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===34&&x.key==='Day24/data-engineering+products+1'));console.log('PASS date, duration, review and certification state');
