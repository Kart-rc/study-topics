// Semantic checks for Day35 teaching worlds. Native layout remains a browser concern.
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
  has('schemaWorld','Stream pauses');nodes.schemaPolicy.value='rescue';nodes.schemaPolicy.onchange();has('schemaWorld','_rescued_data');
  has('dbWorld','restart missing');nodes.dbRestart.checked=true;nodes.dbRestart.onchange();has('dbWorld','coupon_code column');nodes.dbMode.value='rescue';nodes.dbMode.onchange();has('dbWorld','_rescued_data');
  has('sfWorld','0/3');nodes.sfFlag.checked=true;nodes.sfMatch.checked=true;nodes.sfPrivilege.checked=true;nodes.sfPrivilege.onchange();has('sfWorld','3/3');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('failureWorld','Suppressed');nodes.bodyFails.checked=false;nodes.bodyFails.onchange();has('failureWorld','close failed');nodes.closeFails.checked=false;nodes.closeFails.onchange();has('failureWorld','Success');}
 if(L.slug==='distinguished-engineer'){has('adrWorld','accepted');nodes.tenantShare.value='45';nodes.tenantShare.oninput();has('adrWorld','revisit required');nodes.replacementWritten.checked=true;nodes.replacementWritten.onchange();has('adrWorld','superseded');}
 if(L.slug==='genai-engineering'){has('toolWorld','Policy matches');nodes.toolFailure.value='auth';nodes.toolFailure.onchange();has('toolWorld','Unsafe');nodes.failurePolicy.value='failfast';nodes.failurePolicy.onchange();has('toolWorld','Policy matches');}
 if(L.slug==='technology-breakthroughs'){has('catWorld','160×');nodes.squeeze.value='2';nodes.squeeze.oninput();has('catWorld','teaching flip time');}
 if(L.slug==='ci-cd-github-actions'){has('actionWorld','runs');nodes.testStatus.value='failure';nodes.testStatus.onchange();has('actionWorld','skipped');nodes.uploadIf.value='failure';nodes.uploadIf.onchange();has('actionWorld','runs');nodes.testStatus.value='cancelled';nodes.uploadIf.value='always';nodes.uploadIf.onchange();has('actionWorld','Runs even on cancellation');}
 if(L.slug==='apis-microservices'){has('httpWorld','412');nodes.bobRefresh.checked=true;nodes.bobRefresh.onchange();has('httpWorld','now v9');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('checked 2026-10-25'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===35);assert.deepEqual(day.review_keys,['Day21+7','Day25+3']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-25').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day35/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,5);assert.equal(cov.cycle_origin,'Day31');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===35&&x.key==='Day19/data-engineering+products+7'));console.log('PASS date, duration, review and certification state');
