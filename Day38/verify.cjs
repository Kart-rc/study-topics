// Semantic checks for Day38 teaching worlds. Native layout remains a browser concern.
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
  has('eventWorld','2 job runs');nodes.arrivalGap.value='40';nodes.arrivalGap.oninput();has('eventWorld','1 job run');
  has('dbTriggerWorld','2 runs');nodes.dbGap.value='40';nodes.dbGap.oninput();has('dbTriggerWorld','1 run');
  has('sfTriggerWorld','Task runs once');nodes.sfRows.value='0';nodes.sfRows.oninput();has('sfTriggerWorld','Task sleeps');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('lockWorld','cannot upgrade');nodes.releaseRead.checked=true;nodes.releaseRead.onchange();has('lockWorld','write acquired');has('lockWorld','recheck: now v8');}
 if(L.slug==='distinguished-engineer'){has('riskWorld','reassess now');nodes.riskAge.value='20';nodes.riskAge.oninput();has('riskWorld','acceptance still bounded');nodes.exposureChanged.checked=true;nodes.exposureChanged.onchange();has('riskWorld','reassess now');}
 if(L.slug==='genai-engineering'){has('contextWorld','parent 2');nodes.copyContext.checked=true;nodes.copyContext.onchange();has('contextWorld','parent 3');}
 if(L.slug==='technology-breakthroughs'){has('coolingWorld','370 W/cm²');nodes.heatLoad.value='1650';nodes.heatLoad.oninput();has('coolingWorld','-80 W/cm²');}
 if(L.slug==='ci-cd-github-actions'){has('pipelineWorld','capacity / scheduling');nodes.queueMinutes.value='1';nodes.queueMinutes.oninput();nodes.runMinutes.value='8';nodes.runMinutes.oninput();has('pipelineWorld','execution work');}
 if(L.slug==='apis-microservices'){has('flowWorld','blocked 1');nodes.receiverCredits.value='4';nodes.receiverCredits.oninput();has('flowWorld','blocked 0');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-10-28'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===38);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-28').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day16+14','Day28+1']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day38/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,1);assert.equal(cov.cycle_origin,'Day38');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===38&&x.key==='Day20/data-engineering+products+7'));console.log('PASS date, duration, review and certification state');
