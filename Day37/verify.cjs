// Semantic checks for Day37 teaching worlds. Native layout remains a browser concern.
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
  has('triageWorld','identity/path');nodes.incidentSymptom.value='cursor';nodes.incidentSymptom.selectedIndex=3;nodes.incidentSymptom.onchange();has('triageWorld','durable cursor');
  has('dbRetrievalWorld','reconcile snapshot');nodes.dbIncident.value='filtered';nodes.dbIncident.selectedIndex=1;nodes.dbIncident.onchange();has('dbRetrievalWorld','split internal CDF');
  has('sfRetrievalWorld','reconcile missed interval');nodes.sfIncident.value='policy';nodes.sfIncident.selectedIndex=1;nodes.sfIncident.onchange();has('sfRetrievalWorld','mapping table');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('mapWorld','may wait');nodes.remoteLoad.checked=false;nodes.mapLoadMs.value='20';nodes.mapLoadMs.oninput();has('mapWorld','quickly observes holder');}
 if(L.slug==='distinguished-engineer'){has('doorWorld','local guarded experiment');nodes.oldPathKept.checked=false;nodes.oldPathKept.onchange();has('doorWorld','methodical review');}
 if(L.slug==='genai-engineering'){has('idempotencyWorld','one refund result');nodes.reuseActionKey.checked=false;nodes.reuseActionKey.onchange();has('idempotencyWorld','duplicate refund risk');nodes.sameArguments.checked=false;nodes.sameArguments.onchange();has('idempotencyWorld','do not execute');}
 if(L.slug==='technology-breakthroughs'){has('moleculeWorld','rotation forward');nodes.moleculeVoltage.value='-12';nodes.moleculeVoltage.oninput();has('moleculeWorld','rotation reverse');nodes.moleculeVoltage.value='5';nodes.moleculeVoltage.oninput();has('moleculeWorld','below toy threshold');}
 if(L.slug==='ci-cd-github-actions'){has('deployWorld','rollback still required');nodes.externalChanged.checked=false;nodes.externalChanged.onchange();has('deployWorld','not needed yet');nodes.deployPolicy.value='queue';nodes.deployPolicy.onchange();has('deployWorld','waits');}
 if(L.slug==='apis-microservices'){has('acceptedWorld','waits / polls');nodes.jobState.value='failed';nodes.jobState.selectedIndex=2;nodes.jobState.onchange();has('acceptedWorld','shows failure');nodes.jobState.value='succeeded';nodes.jobState.selectedIndex=3;nodes.jobState.onchange();has('acceptedWorld','downloads');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-10-27'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===37);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-27').length,1);assert.equal(day.lesson_slugs.length,7);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day37/data-engineering');assert.equal(cov.session_type,'retrieval_gap');assert.equal(cov.cycle_position,7);assert.equal(cov.cycle_origin,'Day31');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===37));console.log('PASS date, duration, review and certification state');
