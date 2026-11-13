// Semantic checks for Day52 teaching worlds. Native layout remains a browser concern.
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
  has('windowWorld','09:00–10:00');nodes.windowMode.value='wall';nodes.windowMode.onchange();has('windowWorld','09:07–10:07');
  has('dbWindowWorld','window ends 10:00');nodes.dbWindow.value='wall';nodes.dbWindow.onchange();has('dbWindowWorld','window drifts +7m');
  has('sfWindowWorld','read [09:00,10:00)');nodes.sfWindow.value='outside';nodes.sfWindow.onchange();has('sfWindowWorld','function error');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('cancelWorld','worker ran 3/3');nodes.cancelCoop.checked=true;nodes.cancelCoop.onchange();has('cancelWorld','worker ran 1/3');}
 if(L.slug==='distinguished-engineer'){has('exitWorld','160 unresolved; 40 ownerless');nodes.exitMoved.value='5000';nodes.exitExcept.value='0';nodes.exitUnknown.value='0';nodes.exitMoved.oninput();has('exitWorld','controlled stop candidate');}
 if(L.slug==='genai-engineering'){has('errWorld','result + isError:true');has('errWorld','model reads recovery text');nodes.errRequest.value='resource';nodes.errRequest.onchange();has('errWorld','JSON-RPC error');has('errWorld','host code handles error');}
 if(L.slug==='technology-breakthroughs'){has('llamWorld','structure-grounded interpretation');nodes.llamStructure.checked=false;nodes.llamStructure.onchange();has('llamWorld','claim exceeds supplied evidence');}
 if(L.slug==='ci-cd-github-actions'){has('artWorld','day 8: expired');nodes.artAge.value='2';nodes.artAge.oninput();has('artWorld','day 2: available');}
 if(L.slug==='apis-microservices'){has('retryWorld','wait then bounded retry');nodes.retryMethod.value='post';nodes.retryMethod.onchange();has('retryWorld','reconcile before replay');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-11-12'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));assert.equal(L.walkthrough.frames.length,4);
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, replay, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===52);assert.equal(state.days.filter(x=>x.generation_key==='2026-11-12').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day23+14','Day35+1','Day7+30']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day52/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,1);assert.equal(cov.cycle_origin,'Day52');assert.equal(cov.mastery,'not_assessed');assert.equal(cov.product_lab_execution,'not_run');assert.equal(cert.bundle_cycle_policy.next_consolidation_day,57);assert.equal(cert.bundle_cycle_policy.next_retrieval_day,58);assert(cert.product_review_deliveries.some(x=>x.day_number===52&&x.key==='Day30/data-engineering+products+1'));console.log('PASS date, duration, review and certification state');
