// Semantic checks for Day54 teaching worlds. Native layout remains a browser concern.
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
  has('shareWorld','live shareapproved');has('shareWorld','snapshotreview persists');nodes.shareGrant.value='revoked';nodes.shareGrant.onchange();has('shareWorld','access denied');has('shareWorld','earlier copy');
  has('dbShareWorld','live read approved');nodes.dbShare.value='copied';nodes.dbShare.onchange();has('dbShareWorld','snapshot review persists');
  has('sfShareWorld','query approved');nodes.sfShare.value='removed';nodes.sfShare.onchange();has('sfShareWorld','query fails');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('atomicWorld','function calls2');has('atomicWorld','emails sent2');nodes.atomicRace.value='none';nodes.atomicRace.onchange();has('atomicWorld','function calls1');has('atomicWorld','emails sent1');}
 if(L.slug==='distinguished-engineer'){has('metricWorld','active8');has('metricWorld','task success4 (40% eligible)');nodes.metricSuccess.value='8';nodes.metricSuccess.oninput();has('metricWorld','task success8 (80% eligible)');}
 if(L.slug==='genai-engineering'){has('mcpWorld','structured result accepted');nodes.mcpRevision.value='legacy';nodes.mcpRevision.onchange();has('mcpWorld','legacy root mismatch');nodes.mcpShape.value='object';nodes.mcpShape.onchange();has('mcpWorld','structured result accepted');}
 if(L.slug==='technology-breakthroughs'){has('scaleWorld','largest local load = 10');nodes.scaleNetwork.value='rich';nodes.scaleNetwork.onchange();has('scaleWorld','largest local load = 4');has('scaleWorld','Total = 10 units');}
 if(L.slug==='ci-cd-github-actions'){has('runnerWorld','wrapper inherited');nodes.runnerLife.value='ephemeral';nodes.runnerLife.onchange();has('runnerWorld','runner destroyed');has('runnerWorld','clean image');}
 if(L.slug==='apis-microservices'){has('schemaWorld','schema open');has('schemaWorld','application sees amount=10');nodes.schemaClosed.value='closed';nodes.schemaClosed.onchange();has('schemaWorld','reject extra key');has('schemaWorld','client repairs request');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-14'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===54);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-14').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day24+14','Day36+1','Day8+30']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day54/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,3);assert.equal(cov.cycle_origin,'Day52');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,57);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,58);assert(cert.product_review_deliveries.some(x=>x.day_number===54&&x.key==='Day18/data-engineering+products+14'));console.log('PASS date, duration, review and certification state');
