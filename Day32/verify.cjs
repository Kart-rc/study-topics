// Semantic checks for Day32 teaching worlds. Native layout remains a browser concern.
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
  has('policyWorld','east-42');has('policyWorld','east-99');nodes.policyCaller.value='west';nodes.policyCaller.onchange();has('policyWorld','Visible rows: west-77');
  has('dbPolicyWorld','UDF');nodes.dbRole.value='admin';nodes.dbRole.onchange();has('dbPolicyWorld','TRUE');
  has('sfPolicyWorld','policy');nodes.sfRole.value='west';nodes.sfRole.onchange();has('sfPolicyWorld','west-77');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('cowWorld','Old iterator sees 2');nodes.addListener.checked=true;nodes.addListener.onchange();has('cowWorld','new iterator sees 3');}
 if(L.slug==='distinguished-engineer'){has('toilWorld','overflow 36h');nodes.toilHours.value='60';nodes.toilHours.oninput();has('toilWorld','headroom 12h');}
 if(L.slug==='genai-engineering'){has('handoffWorld','Email and tool plumbing stay behind');nodes.filterHandoff.checked=false;nodes.filterHandoff.onchange();has('handoffWorld','Full history crosses');}
 if(L.slug==='technology-breakthroughs'){has('phosphateWorld','35 units');nodes.enrichment.value='20';nodes.enrichment.oninput();has('phosphateWorld','20 units');}
 if(L.slug==='ci-cd-github-actions'){has('depWorld','PASS');nodes.depSeverity.value='high';nodes.depSeverity.onchange();has('depWorld','BLOCK MERGE');}
 if(L.slug==='apis-microservices'){has('grpcWorld','2s budget remains');nodes.rpcDeadline.value='2';nodes.rpcDeadline.oninput();has('grpcWorld','DEADLINE_EXCEEDED');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('checked 2026-10-22'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'interaction, quiz, save and export');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===32);assert.deepEqual(day.review_keys,['Day13+14','Day25+1']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-22').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day32/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,2);assert.equal(cov.cycle_origin,'Day31');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===32&&x.key==='Day18/data-engineering+products+7'));console.log('PASS date, duration, review and certification state');
