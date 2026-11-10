// Semantic checks for Day49 teaching worlds. Native layout remains a browser concern.
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
  has('wifWorld','SELECT allowed');nodes.wifGrant.checked=false;nodes.wifGrant.onchange();has('wifWorld','DENY · no grant');nodes.wifSubject.value='other';nodes.wifSubject.onchange();has('wifWorld','subject mismatch');
  has('dbWifWorld','SELECT orders');nodes.dbWifClaim.value='aud';nodes.dbWifClaim.onchange();has('dbWifWorld','audience denied');
  has('sfWifWorld','query allowed');nodes.sfWifGrant.checked=false;nodes.sfWifGrant.onchange();has('sfWifWorld','privilege denied');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('composeWorld','CompletionStage&lt;CompletionStage&lt;Order&gt;&gt;');has('composeWorld','inner stage');nodes.composeOp.value='compose';nodes.composeOp.onchange();has('composeWorld','one stage layer');nodes.composeStep.value='sync';nodes.composeStep.onchange();has('composeWorld','compose expects');}
 if(L.slug==='distinguished-engineer'){has('boundaryWorld','cross-team pairs');has('boundaryWorld','5');nodes.boundaryPlan.value='capability';nodes.boundaryPlan.onchange();has('boundaryWorld','same checkout owner');has('boundaryWorld','1');}
 if(L.slug==='genai-engineering'){has('progressWorld','20% → 70% → final result');nodes.progressDrop.checked=true;nodes.progressDrop.onchange();has('progressWorld','No durable task state');}
 if(L.slug==='technology-breakthroughs'){has('shgWorld','1.00');nodes.shgPol.value='-1';nodes.shgPol.onchange();has('shgWorld','0.16');nodes.shgDetune.value='-3';nodes.shgDetune.oninput();has('shgWorld','1.00');}
 if(L.slug==='ci-cd-github-actions'){has('matrixWorld','Only the last finisher');has('matrixWorld','windows-sha');nodes.matrixOrder.value='wml';nodes.matrixOrder.onchange();has('matrixWorld','linux-sha');nodes.matrixNames.value='unique';nodes.matrixNames.onchange();has('matrixWorld','All three values survive');}
 if(L.slug==='apis-microservices'){has('digestWorld','integrity value matches');has('digestWorld','sender not authenticated');nodes.digestBody.value='400';nodes.digestBody.onchange();has('digestWorld','MISMATCH');nodes.digestRecompute.checked=true;nodes.digestRecompute.onchange();has('digestWorld','recomputed digest');nodes.digestSignature.checked=true;nodes.digestSignature.onchange();has('digestWorld','trusted sender');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-09'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===49);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-09').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day28+7','Day32+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day49/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,5);assert.equal(cov.cycle_origin,'Day45');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,50);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,51);assert(cert.product_review_deliveries.some(x=>x.day_number===49&&x.key==='Day29/data-engineering+products+1'));console.log('PASS date, duration, review and certification state');
