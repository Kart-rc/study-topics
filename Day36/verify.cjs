// Semantic checks for Day36 teaching worlds. Native layout remains a browser concern.
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
  has('pipelineWorld','Ready to publish');nodes.gatePolicy.checked=false;nodes.gatePolicy.onchange();has('pipelineWorld','tenant rows blocks');nodes.gatePolicy.checked=true;nodes.gatePolicy.onchange();
  has('dbWorld','internal CDF table');nodes.dbArchitecture.value='combined';nodes.dbArchitecture.onchange();has('dbWorld','filtered CDF conflict');nodes.dbArchitecture.value='split';nodes.dbRetention.checked=false;nodes.dbRetention.onchange();has('dbWorld','starting version expired');
  has('sfWorld','QA clone verified');nodes.sfPolicy.checked=false;nodes.sfPolicy.onchange();has('sfWorld','policy reference missing');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('futureWorld','still runs');nodes.cooperative.checked=true;nodes.cooperative.onchange();has('futureWorld','stops cooperatively');nodes.timeoutMs.value='900';nodes.timeoutMs.oninput();has('futureWorld','result at 800 ms');}
 if(L.slug==='distinguished-engineer'){has('ownerWorld','escalate now');nodes.hasAuthority.checked=true;nodes.hasAuthority.onchange();has('ownerWorld','pause now');}
 if(L.slug==='genai-engineering'){has('guardWorld','side-effect risk');nodes.guardMode.value='blocking';nodes.guardMode.onchange();has('guardWorld','blocked before start');}
 if(L.slug==='technology-breakthroughs'){has('magnetWorld','SNR 2.0');nodes.sensorNoise.value='5';nodes.sensorNoise.oninput();has('magnetWorld','too noisy');}
 if(L.slug==='ci-cd-github-actions'){has('envWorld','withheld');nodes.envReview.value='approved';nodes.envReview.onchange();has('envWorld','available to job');}
 if(L.slug==='apis-microservices'){has('schemaDirectionWorld','runtime payload');nodes.apiDirection.value='response';nodes.apiDirection.onchange();has('schemaDirectionWorld','password');nodes.runtimeEnforcement.checked=true;nodes.runtimeEnforcement.onchange();has('schemaDirectionWorld','matches enforced direction');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-10-26'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===36);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-26').length,1);assert.equal(day.lesson_slugs.length,7);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day36/data-engineering');assert.equal(cov.session_type,'consolidation_case');assert.equal(cov.cycle_position,6);assert.equal(cov.cycle_origin,'Day31');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===36));console.log('PASS date, duration, review and certification state');
