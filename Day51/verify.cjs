// Semantic checks for Day51 teaching worlds. Native layout remains a browser concern.
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
  has('recoverWorld','recover 1,000');nodes.recoverHistory.checked=false;nodes.recoverHistory.onchange();has('recoverWorld','history unavailable');nodes.recoverIncident.value='mask';nodes.recoverIncident.onchange();has('recoverWorld','no restore needed');
  has('dbRestoreWorld','RESTORE_FROM_40');nodes.dbRestore.value='vacuum';nodes.dbRestore.onchange();has('dbRestoreWorld','restore incomplete/fails');
  has('sfRestoreWorld','clone recovered');nodes.sfRestore.value='expired';nodes.sfRestore.onchange();has('sfRestoreWorld','historical clone unavailable');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('scopeWorld','repository reads bank-a');nodes.scopeStep.value='after';nodes.scopeStep.onchange();has('scopeWorld','CTX unbound');}
 if(L.slug==='distinguished-engineer'){has('wipWorld','new slots');nodes.wipDone.value='0';nodes.wipDone.oninput();has('wipWorld','new slots 0');}
 if(L.slug==='genai-engineering'){has('handleWorld','add item');nodes.handleMode.value='missing';nodes.handleMode.onchange();has('handleWorld','reject: state not identified');}
 if(L.slug==='technology-breakthroughs'){has('fetWorld','366 mV');nodes.fetSs.value='79';nodes.fetSs.onchange();has('fetWorld','474 mV');}
 if(L.slug==='ci-cd-github-actions'){has('secretWorld','C · fails closed');nodes.secretBC.checked=true;nodes.secretBC.onchange();has('secretWorld','C · deploys');nodes.secretAB.checked=false;nodes.secretAB.onchange();has('secretWorld','B · missing');}
 if(L.slug==='apis-microservices'){has('grpcWorld','response total 12');nodes.grpcEnd.value='cancel';nodes.grpcEnd.onchange();has('grpcWorld','CANCEL');has('grpcWorld','subtotal 7 persists');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-11'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===51);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-11').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day29+7','Day33+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day51/data-engineering');assert.equal(cov.session_type,'retrieval_gap');assert.equal(cov.cycle_position,7);assert.equal(cov.cycle_origin,'Day45');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,57);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,58);assert(cert.product_review_deliveries.some(x=>x.day_number===51&&x.key==='Day28/data-engineering+products+3'));console.log('PASS date, duration, review and certification state');
