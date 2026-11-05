// Semantic checks for Day45 teaching worlds. Native layout remains a browser concern.
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
  has('ingestWorld','accepted');has('ingestWorld','2');has('ingestWorld','allowed with exception evidence');nodes.requireComplete.checked=true;nodes.requireComplete.onchange();has('ingestWorld','blocked');nodes.ingestPolicy.value='abort';nodes.ingestPolicy.onchange();has('ingestWorld','No target rows');
  has('dbRowWorld','bronze columns');nodes.dbRow.value='P-2';nodes.dbRow.onchange();has('dbRowWorld','twelve');nodes.dbRow.value='P-3';nodes.dbRow.onchange();has('dbRowWorld','raw truncated input');
  has('sfModeWorld','target unchanged');nodes.sfMode.value='abort';nodes.sfMode.onchange();has('sfModeWorld','statement aborted');nodes.sfMode.value='continue';nodes.sfMode.onchange();has('sfModeWorld','good rows loaded');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){
  has('latchWorld','latch count');has('latchWorld','0');has('latchWorld','shard B failed');nodes.latchB.value='ready';nodes.latchB.onchange();has('latchWorld','all outcomes succeeded');nodes.latchReports.value='2';nodes.latchReports.oninput();has('latchWorld','Await is still blocked');
 }
 if(L.slug==='distinguished-engineer'){
  has('incidentWorld','Marco / Ops only');has('incidentWorld','Lee every 15 min');nodes.incidentSplit.value='one';nodes.incidentSplit.onchange();has('incidentWorld','competing responders');has('incidentWorld','interrupts owner');
 }
 if(L.slug==='genai-engineering'){
  has('pathWorld','ALLOW');has('pathWorld','mounted /workspace/payments');nodes.pathRequest.value='traversal';nodes.pathRequest.onchange();has('pathWorld','/secrets.txt');has('pathWorld','DENY');nodes.pathControl.value='hint';nodes.pathControl.onchange();has('pathWorld','ALLOW');has('pathWorld','hint does not enforce');
 }
 if(L.slug==='technology-breakthroughs'){
  has('inductanceWorld','18');has('inductanceWorld','630,000');has('inductanceWorld','35,000×');nodes.inductanceTarget.value='252';nodes.inductanceTarget.oninput();has('inductanceWorld','36');has('inductanceWorld','1,260,000');
 }
 if(L.slug==='ci-cd-github-actions'){
  has('envWorld','(unset)');has('envWorld','not processed');nodes.envReader.value='next';nodes.envReader.onchange();has('envWorld','blue');has('envWorld','injected');nodes.envReader.value='job';nodes.envReader.onchange();has('envWorld','does not cross job boundaries');
 }
 if(L.slug==='apis-microservices'){
  has('cacheWorld','304');has('cacheWorld','0 body bytes');has('cacheWorld','keeps its cached body');nodes.cacheTag.value='v6';nodes.cacheTag.onchange();has('cacheWorld','200');has('cacheWorld','5,120 body bytes');nodes.serverTag.value='v8';nodes.serverTag.onchange();has('cacheWorld','v8');
 }
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-04'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===45);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-04').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day26+7','Day30+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day45/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,1);assert.equal(cov.cycle_origin,'Day45');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,50);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,51);assert(cert.product_review_deliveries.some(x=>x.day_number===45&&x.key==='Day26/data-engineering+products+3'));console.log('PASS date, duration, review and certification state');
