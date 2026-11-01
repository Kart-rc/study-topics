// Semantic checks for Day42 teaching worlds. Native layout remains a browser concern.
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
  has('scaleWorld','20 waiting');has('scaleWorld','6 GB over');nodes.clusterCount.value='3';nodes.clusterCount.oninput();has('scaleWorld','0 waiting');has('scaleWorld','6 GB over');
  has('dbScaleWorld','Peak queued20');nodes.dbClusters.value='3';nodes.dbClusters.oninput();has('dbScaleWorld','Peak queued0');
  has('sfScaleWorld','queued 20');nodes.sfClusters.value='3';nodes.sfClusters.oninput();has('sfScaleWorld','queued 0');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('phaserWorld','0 still expected');nodes.readerLeaves.checked=false;nodes.readerLeaves.onchange();has('phaserWorld','1 still expected');has('phaserWorld','stalled');}
 if(L.slug==='distinguished-engineer'){has('actionWorld','unsafe path open');nodes.actionStrength.value='gate';nodes.actionStrength.onchange();has('actionWorld','bad publish blocked');nodes.actionStrength.value='safe';nodes.actionStrength.onchange();has('actionWorld','unsafe route removed');}
 if(L.slug==='genai-engineering'){has('toolWorld','extra paraphrase risk');nodes.toolBehavior.value='stop';nodes.toolBehavior.onchange();has('toolWorld','exact receipt');nodes.toolKind.value='search';nodes.toolKind.onchange();has('toolWorld','raw fragments exposed');nodes.toolBehavior.value='again';nodes.toolBehavior.onchange();has('toolWorld','synthesized answer');}
 if(L.slug==='technology-breakthroughs'){has('grapheneWorld','Toy current asymmetry 100');has('grapheneWorld','Cloud center 76.0');nodes.wavePhase.value='270';nodes.wavePhase.oninput();has('grapheneWorld','Toy current asymmetry -100');has('grapheneWorld','Cloud center 24.0');}
 if(L.slug==='ci-cd-github-actions'){has('matrixWorld','cancelled');nodes.failFast.checked=false;nodes.failFast.onchange();has('matrixWorld','mac / 22passed');nodes.failingLeg.value='experimental';nodes.failingLeg.onchange();has('matrixWorld','failed (tolerated)');nodes.failFast.checked=true;nodes.failFast.onchange();has('matrixWorld','required siblings running');}
 if(L.slug==='apis-microservices'){has('problemWorld','HTTP 403');has('problemWorld','no debug internals');nodes.problemKind.value='validation';nodes.problemKind.onchange();has('problemWorld','HTTP 422');nodes.debugLeak.checked=true;nodes.debugLeak.onchange();has('problemWorld','implementation leaked');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-01'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===42);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-01').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day18+14','Day2+30','Day30+1']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day42/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,5);assert.equal(cov.cycle_origin,'Day38');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert(cert.product_review_deliveries.some(x=>x.day_number===42&&x.key==='Day25/data-engineering+products+3'));console.log('PASS date, duration, review and certification state');
