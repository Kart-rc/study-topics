// Semantic checks for Day55 teaching worlds. Native layout remains a browser concern.
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
  has('promoteWorld','matches source');nodes.promoteMode.value='manual';nodes.promoteMode.onchange();has('promoteWorld','drifted');
  has('dbDeployWorld','source = running job');nodes.dbDeploy.value='edit';nodes.dbDeploy.onchange();has('dbDeployWorld','source ≠ running job');
  has('sfDeployWorld','orders-55 ready');nodes.sfDeploy.value='apply';nodes.sfDeploy.onchange();has('sfDeployWorld','state unknown');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('permitWorld','permit leaked');has('permitWorld','permits 1');nodes.permitCleanup.value='finally';nodes.permitCleanup.onchange();has('permitWorld','finally releases');has('permitWorld','permits 2');}
 if(L.slug==='distinguished-engineer'){has('budgetWorld','80%');has('budgetWorld','pauses risky launches');nodes.budgetFailures.value='500';nodes.budgetFailures.oninput();has('budgetWorld','50%');has('budgetWorld','normal change policy');}
 if(L.slug==='genai-engineering'){has('deprecationWorld','works; use counted');nodes.deprecationPolicy.value='remove';nodes.deprecationPolicy.onchange();has('deprecationWorld','breaks early');}
 if(L.slug==='technology-breakthroughs'){has('pianoWorld','Total toy error = 7');nodes.pianoMode.value='shifted';nodes.pianoMode.onchange();has('pianoWorld','Total toy error = 0');}
 if(L.slug==='ci-cd-github-actions'){has('cancelWorld','still persists; mixed state');nodes.cancelPolicy.value='queue';nodes.cancelPolicy.onchange();has('cancelWorld','traffic aligned');}
 if(L.slug==='apis-microservices'){has('lifeWorld','future');has('lifeWorld','behavior not changed by warning');nodes.lifeDate.value='2027-02-15';nodes.lifeDate.onchange();has('lifeWorld','effective');nodes.lifeDate.value='2027-04-02';nodes.lifeDate.onchange();has('lifeWorld','resource may be unavailable');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-15'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===55);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-15').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day31+7','Day35+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day55/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,4);assert.equal(cov.cycle_origin,'Day52');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,57);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,58);assert(cert.product_review_deliveries.some(x=>x.day_number===55&&x.key==='Day25/data-engineering+products+7'));console.log('PASS date, duration, review and certification state');
