// Semantic checks for Day43 teaching worlds. Native layout remains a browser concern.
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
  has('releaseWorld','Live table: v43');has('releaseWorld','toy queue is empty');
  nodes.releaseCondition.value='quality';nodes.releaseCondition.onchange();has('releaseWorld','Live table: v42');has('releaseWorld','Release stopped');
  nodes.releaseCondition.value='drop';nodes.releaseCondition.onchange();has('releaseWorld','Live table: missing');has('releaseWorld','Release stopped');
  nodes.releaseCondition.value='queue';nodes.releaseCondition.onchange();has('releaseWorld','20 queries still wait');
  has('dbReleaseWorld','v43');nodes.dbCase.value='quality';nodes.dbCase.onchange();has('dbReleaseWorld','v42 retained');has('dbReleaseWorld','FAIL UPDATE');
  nodes.dbCase.value='queue';nodes.dbCase.onchange();has('dbReleaseWorld','20 queued');
  has('sfReleaseWorld','v43 visible');nodes.sfCase.value='quality';nodes.sfCase.onchange();has('sfReleaseWorld','blocked; v42 live');
  nodes.sfGate.checked=false;nodes.sfGate.onchange();has('sfReleaseWorld','Unsafe');has('sfReleaseWorld','v43 visible');
  nodes.sfCase.value='queue';nodes.sfCase.onchange();has('sfReleaseWorld','20 queued');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){
  has('callerWorld','producer slows');nodes.callerKind.value='event';nodes.callerKind.onchange();has('callerWorld','caller stalls dangerously');nodes.callerKind.value='lock';nodes.callerKind.onchange();has('callerWorld','caller stalls dangerously');
 }
 if(L.slug==='distinguished-engineer'){
  has('controlWorld','golden path');nodes.controlCase.value='catastrophic';nodes.controlCase.onchange();has('controlWorld','guardrail');nodes.controlCase.value='residual';nodes.controlCase.onchange();has('controlWorld','safety net');nodes.controlCase.value='ambiguous';nodes.controlCase.onchange();has('controlWorld','manual checkpoint');
 }
 if(L.slug==='genai-engineering'){
  has('elicitationWorld','form mode');has('elicitationWorld','retry original call');nodes.inputKind.value='secret';nodes.inputKind.onchange();has('elicitationWorld','URL mode');has('elicitationWorld','Credential stays outside');nodes.inputAction.value='decline';nodes.inputAction.onchange();has('elicitationWorld','stop without inventing');nodes.inputAction.value='cancel';nodes.inputAction.onchange();has('elicitationWorld','stop without inventing');
 }
 if(L.slug==='technology-breakthroughs'){
  has('fftWorld','Direct toy relationships: 64');has('fftWorld','FFT butterfly combines: 12');has('fftWorld','Stages: 3');nodes.fftPoints.value='16';nodes.fftPoints.onchange();has('fftWorld','Direct toy relationships: 256');has('fftWorld','FFT butterfly combines: 32');has('fftWorld','Stages: 4');nodes.fftPoints.value='32';nodes.fftPoints.onchange();has('fftWorld','Direct toy relationships: 1024');has('fftWorld','FFT butterfly combines: 80');has('fftWorld','Stages: 5');
 }
 if(L.slug==='ci-cd-github-actions'){
  has('timeoutWorld','Production: v42');has('timeoutWorld','no rollback');nodes.reconciler.checked=true;nodes.reconciler.onchange();has('timeoutWorld','Production: v41');has('timeoutWorld','restored v41');nodes.timeoutMinute.value='2';nodes.timeoutMinute.oninput();has('timeoutWorld','not started');has('timeoutWorld','Production: v41');
 }
 if(L.slug==='apis-microservices'){
  has('ownershipWorld','own read model');has('ownershipWorld','order_total=50');nodes.ownershipMode.value='shared';nodes.ownershipMode.onchange();has('ownershipWorld','query broken');nodes.renameColumn.checked=false;nodes.renameColumn.onchange();has('ownershipWorld','query works');
 }
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-02'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===43);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-02').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day25+7','Day29+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day43/data-engineering');assert.equal(cov.session_type,'consolidation_case');assert.equal(cov.cycle_position,6);assert.equal(cov.cycle_origin,'Day38');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,50);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,44);assert(cert.product_review_deliveries.some(x=>x.day_number===43&&x.key==='Day27/data-engineering+products+1'));console.log('PASS date, duration, review and certification state');
