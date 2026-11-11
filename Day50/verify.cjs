// Semantic checks for Day50 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={},saved=[];
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
  const options=[...inside.matchAll(/<option([^>]*)>([^<]*)<\/option>/g)].map(m=>({value:m[1].match(/value="([^"]+)"/)?.[1]||m[2],text:m[2],selected:/selected/.test(m[1])}));
  nodes[id].options=options;nodes[id].selectedIndex=Math.max(0,options.findIndex(o=>o.selected));nodes[id].value=options[nodes[id].selectedIndex].value;
 }
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 for(const [,id] of h.matchAll(/<input id="([^"]+)"[^>]*checked/g))nodes[id].checked=true;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:sel=>sel.includes(':checked')?node({value:'0'}):null,createElement:()=>node({click:()=>{}}),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:(k,v)=>saved.push([k,v])},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': expected '+s+' in '+text(id));
 if(L.slug==='data-engineering'){
  has('caseWorld','Published item rows: 2');nodes.caseId.checked=false;nodes.caseId.onchange();has('caseWorld','No source bytes were read');nodes.caseId.checked=true;nodes.caseId.onchange();nodes.caseRescue.checked=false;nodes.caseRescue.onchange();has('caseWorld','inspectable errors: 0');
  has('dbCaseWorld','positions 0,1');nodes.dbCaseGate.value='grant';nodes.dbCaseGate.onchange();has('dbCaseWorld','no UC grant');
  has('sfCaseWorld','managed join');nodes.sfCaseGate.value='transform';nodes.sfCaseGate.onchange();has('sfCaseWorld','cannot transform');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('flowWorld','not delivered 3');nodes.flowDemand.value='4';nodes.flowDemand.oninput();has('flowWorld','not delivered 0');}
 if(L.slug==='distinguished-engineer'){has('pilotWorld','orders shadow');nodes.pilotCoverage.value='90';nodes.pilotCoverage.oninput();has('pilotWorld','coverage 85%');}
 if(L.slug==='genai-engineering'){has('mcpRouteWorld','can the tool execute');nodes.mcpBody.value='delete_catalog';nodes.mcpBody.onchange();has('mcpRouteWorld','-32020');}
 if(L.slug==='technology-breakthroughs'){has('topoWorld','Recommendation: A');nodes.topoPref.value='node';nodes.topoPref.onchange();has('topoWorld','Recommendation: B');}
 if(L.slug==='ci-cd-github-actions'){has('jsonWorld','type boolean');nodes.jsonRaw.value='10';nodes.jsonRaw.onchange();has('jsonWorld','type number');nodes.jsonRaw.value='bad';nodes.jsonRaw.onchange();has('jsonWorld','parse failure');}
 if(L.slug==='apis-microservices'){has('hintWorld','FINAL 200');nodes.hintFinal.value='401';nodes.hintFinal.onchange();has('hintWorld','FINAL 401');has('hintWorld','application outcome is unknown');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-10'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===50);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-10').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day22+14','Day34+1','Day6+30']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day50/data-engineering');assert.equal(cov.session_type,'consolidation_case');assert.equal(cov.cycle_position,6);assert.equal(cov.cycle_origin,'Day45');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_retrieval_day,51);assert(cert.product_review_deliveries.some(x=>x.day_number===50));console.log('PASS date, duration, review and certification state');
