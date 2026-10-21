// Semantic checks for Day31 teaching worlds. Native layout remains a browser concern.
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
  has('changeWorld','Readable interval');nodes.oldestVersion.value='103';nodes.oldestVersion.oninput();has('changeWorld','Gap:');
  has('dbCdfWorld','table_changes interval');nodes.dbPosition.value='102';nodes.dbPosition.oninput();has('dbCdfWorld','(102, 103]');
  has('sfStreamWorld','still 40');nodes.sfCommit.checked=true;nodes.sfCommit.onchange();has('sfStreamWorld','advanced to 44');nodes.sfLag.value='4';nodes.sfLag.oninput();has('sfStreamWorld','STALE');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('adderWorld','final total = 33');nodes.lateIncrement.checked=false;nodes.lateIncrement.onchange();has('adderWorld','final total = 32');}
 if(L.slug==='distinguished-engineer'){has('failoverWorld','data-plane routing control works');nodes.recoveryPrepared.checked=false;nodes.recoveryPrepared.onchange();has('failoverWorld','blocked');}
 if(L.slug==='genai-engineering'){has('traceWorld','payload excluded');nodes.includePayload.checked=true;nodes.includePayload.onchange();has('traceWorld','ada@example.com');}
 if(L.slug==='technology-breakthroughs'){has('forecastWorld','reliability gap');has('forecastWorld','20 points');nodes.observedFreq.value='70';nodes.observedFreq.oninput();has('forecastWorld','0 points');}
 if(L.slug==='ci-cd-github-actions'){has('attestWorld','VERIFY');nodes.tamperArtifact.checked=true;nodes.tamperArtifact.onchange();has('attestWorld','REJECT');}
 if(L.slug==='apis-microservices'){has('nullWorld','order: null');nodes.orderNonNull.checked=true;nodes.orderNonNull.onchange();has('nullWorld','data: null');nodes.customerNonNull.checked=false;nodes.customerNonNull.onchange();has('nullWorld','customer: null');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('checked 2026-10-21'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'interaction, quiz, save and export');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===31);assert.deepEqual(day.review_keys,['Day19+7','Day23+3']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-21').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day31/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,1);assert.equal(cov.cycle_origin,'Day31');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===31&&x.key==='Day17/data-engineering+products+7'));console.log('PASS date, duration, review and certification state');
