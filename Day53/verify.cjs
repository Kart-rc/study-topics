// Semantic checks for Day53 teaching worlds. Native layout remains a browser concern.
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
  has('layoutWorld','4/4 units read');nodes.layoutMode.value='grouped';nodes.layoutMode.onchange();has('layoutWorld','1/4 units read');has('layoutWorld','unit 4c90, c91skip');
  has('dbClusterWorld','read 4 files');nodes.dbCluster.value='after';nodes.dbCluster.onchange();has('dbClusterWorld','read 1 file');
  has('sfClusterWorld','scan 4');nodes.sfCluster.value='maintained';nodes.sfCluster.onchange();has('sfClusterWorld','scan 1');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('adderWorld','reported 75');has('adderWorld','live 80');nodes.adderWhen.value='before';nodes.adderWhen.onchange();has('adderWorld','reported 80');}
 if(L.slug==='distinguished-engineer'){has('excWorld','governable');nodes.excOwner.checked=false;nodes.excOwner.onchange();has('excWorld','parallel standard');has('excWorld','owner missing');}
 if(L.slug==='genai-engineering'){has('defaultWorld','input limit missing');has('defaultWorld','10');nodes.defaultHarness.checked=false;nodes.defaultHarness.onchange();has('defaultWorld','absent');}
 if(L.slug==='technology-breakthroughs'){has('mosWorld','lasing-like emission evidence');has('mosWorld','not commercial laser proof');nodes.mosCavity.checked=false;nodes.mosCavity.onchange();has('mosWorld','insufficient for reported setup');}
 if(L.slug==='ci-cd-github-actions'){has('cacheWorld','restore lock51 partial');has('cacheWorld','package manager verifies lock53');nodes.cacheKey.value='51';nodes.cacheKey.onchange();has('cacheWorld','Exact cache hit');}
 if(L.slug==='apis-microservices'){has('httpWorld','HTTP 409');nodes.httpVersion.value='8';nodes.httpVersion.onchange();has('httpWorld','HTTP 200');nodes.httpQuantity.value='-2';nodes.httpQuantity.onchange();has('httpWorld','HTTP 422');has('httpWorld','repair quantity');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-13'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===53);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-13').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day30+7','Day34+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day53/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,2);assert.equal(cov.cycle_origin,'Day52');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,57);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,58);assert(cert.product_review_deliveries.some(x=>x.day_number===53&&x.key==='Day17/data-engineering+products+14'));console.log('PASS date, duration, review and certification state');
