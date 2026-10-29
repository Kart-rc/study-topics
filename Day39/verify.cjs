// Semantic checks for Day39 teaching worlds. Native layout remains a browser concern.
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
  has('pruneWorld','1 of 6 blocks scanned');nodes.overlap.value='2';nodes.overlap.oninput();has('pruneWorld','5 of 6 blocks scanned');
  has('dbPruneWorld','skip 4 files');nodes.dbCandidates.value='5';nodes.dbCandidates.oninput();has('dbPruneWorld','skip 1 files');
  has('sfPruneWorld','average depth 3');nodes.sfDepth.value='8';nodes.sfDepth.oninput();has('sfPruneWorld','about 9 candidates');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('barrierWorld','barrier broken');nodes.thirdArrives.checked=true;nodes.thirdArrives.onchange();has('barrierWorld','all pass');}
 if(L.slug==='distinguished-engineer'){has('gameDayWorld','continue bounded test');nodes.successRate.value='97.8';nodes.successRate.oninput();has('gameDayWorld','STOP + restore');}
 if(L.slug==='genai-engineering'){has('sessionWorld','B appears later but missed A');nodes.serializeTurns.checked=true;nodes.serializeTurns.onchange();has('sessionWorld','order matches context');}
 if(L.slug==='technology-breakthroughs'){has('waveWorld','2 domains');nodes.waveStep.value='3';nodes.waveStep.oninput();has('waveWorld','1 domain');nodes.friction.checked=true;nodes.friction.onchange();has('waveWorld','Friction arrested');}
 if(L.slug==='ci-cd-github-actions'){has('cacheWorld','mode read');nodes.cacheMode.value='write';nodes.cacheMode.onchange();has('cacheWorld','poison');nodes.cacheTrigger.value='trusted';nodes.cacheTrigger.onchange();has('cacheWorld','No low-trust write path');}
 if(L.slug==='apis-microservices'){has('protoWorld','priority=EXPRESS');nodes.protoPath.value='json';nodes.protoPath.onchange();has('protoWorld','priority missing');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-10-29'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===39);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-29').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day23+7','Day27+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day39/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,2);assert.equal(cov.cycle_origin,'Day38');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===39&&x.key==='Day24/data-engineering+products+3'));console.log('PASS date, duration, review and certification state');
