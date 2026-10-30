// Semantic checks for Day40 teaching worlds. Native layout remains a browser concern.
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
  has('publishWorld','3 complete rows');nodes.publishMode.value='gap';nodes.publishMode.onchange();has('publishWorld','name missing');
  has('dbReplaceWorld','history retained');nodes.dbReplace.value='drop';nodes.dbReplace.onchange();has('dbReplaceWorld','new ID T99');
  has('sfSwapWorld','object BLUE');nodes.sfSwap.value='1';nodes.sfSwap.oninput();has('sfSwapWorld','name ORDERS_NEXT');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('cancelWorld','queue retains 6');nodes.removePolicy.checked=true;nodes.removePolicy.onchange();has('cancelWorld','queue retains 0');}
 if(L.slug==='distinguished-engineer'){has('shedWorld','80');nodes.shedCap.value='70';nodes.shedCap.oninput();has('shedWorld','checkout 70/80');}
 if(L.slug==='genai-engineering'){has('agentWorld','manager combines A+B');nodes.agentPattern.value='handoff';nodes.agentPattern.onchange();has('agentWorld','no built-in synthesis');}
 if(L.slug==='technology-breakthroughs'){has('spinWorld','path complete');nodes.stableGate.checked=false;nodes.stableGate.onchange();has('spinWorld','path broken');}
 if(L.slug==='ci-cd-github-actions'){has('runWorld','No execution path');nodes.artifactExec.checked=true;nodes.artifactExec.onchange();has('runWorld','Unsafe privilege bridge');}
 if(L.slug==='apis-microservices'){has('grpcWorld','retry after 30s');nodes.idemRequest.checked=false;nodes.idemRequest.onchange();has('grpcWorld','stop or apply client policy');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-10-30'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===40);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-30').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day1+30','Day17+14','Day29+1']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day40/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,3);assert.equal(cov.cycle_origin,'Day38');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===40&&x.key==='Day26/data-engineering+products+1'));console.log('PASS date, duration, review and certification state');
