// Semantic checks for Day58 teaching worlds. Native layout remains a browser concern.
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
  has('evidenceWorld','Five claims, five matching pieces of evidence');nodes.evidenceSet.value='green';nodes.evidenceSet.onchange();has('evidenceWorld','green run does not prove');has('evidenceWorld','verified shareunproven');
  has('dbRetrieveWorld','window + row checks');has('dbRetrieveWorld','recipient read verified');nodes.dbRetrieve.value='badge';nodes.dbRetrieve.onchange();has('dbRetrieveWorld','other claims assumed');has('dbRetrieveWorld','share unknown');
  has('sfRetrieveWorld','row invariant checked');has('sfRetrieveWorld','consumer read verified');nodes.sfRetrieve.value='task';nodes.sfRetrieve.onchange();has('sfRetrieveWorld','rows assumed');has('sfRetrieveWorld','share unknown');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('conditionWorld','signaler enters');has('conditionWorld','ready=true');nodes.conditionWait.value='sleep';nodes.conditionWait.onchange();has('conditionWorld','signaler blocked');has('conditionWorld','ready stays false');}
 if(L.slug==='distinguished-engineer'){has('debtWorld','12h weekly drag');has('debtWorld','payback 0.67 weeks');nodes.debtReleases.value='1';nodes.debtReleases.onchange();has('debtWorld','2h weekly drag');has('debtWorld','payback 4.00 weeks');}
 if(L.slug==='genai-engineering'){has('cancelWorld','terminal completed');nodes.cancelRace.value='cancelled';nodes.cancelRace.onchange();has('cancelWorld','terminal cancelled');}
 if(L.slug==='technology-breakthroughs'){has('polaritonWorld','toy output80 units');nodes.polaritonPump.value='off';nodes.polaritonPump.onchange();has('polaritonWorld','toy output1 units');}
 if(L.slug==='ci-cd-github-actions'){has('dispatchWorld','job skipped');nodes.dispatchContext.value='event';nodes.dispatchContext.onchange();has('dispatchWorld','naive truthy check runs');}
 if(L.slug==='apis-microservices'){has('createWorld','412 precondition');has('createWorld','stored owner=A');nodes.createMode.value='plain';nodes.createMode.onchange();has('createWorld','200 overwrite');has('createWorld','stored owner=B');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-18'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===58);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-18').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day10+30','Day26+14','Day38+1']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day58/data-engineering');assert.equal(cov.session_type,'retrieval_gap');assert.equal(cov.cycle_position,7);assert.equal(cov.cycle_origin,'Day52');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,64);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,65);assert(cert.product_review_deliveries.some(x=>x.day_number===58&&x.key==='Day19/data-engineering+products+14'));assert(fs.readFileSync(path.join(__dirname,'../CERTIFICATION_ROADMAP.md'),'utf8').includes('Checked **2026-11-18**'));
console.log('PASS date, duration, review, guide-check and certification state');
