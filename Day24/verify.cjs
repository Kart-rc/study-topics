// Semantic checks for Day24 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 for(const [,id] of h.matchAll(/<input id="([^"]+)"[^>]*checked/g))nodes[id].checked=true;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node(),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': '+s+' in '+text(id));
 if(L.slug==='data-engineering'){has('fileWorld','predict');nodes.fileReveal.onclick();has('fileWorld','LOAD');nodes.fileCase.value='overwrite';nodes.fileCase.onchange();nodes.fileReveal.onclick();has('fileWorld','SKIP');nodes.dbStep.onclick();has('dbWorld','checkpoint adds');nodes.sfArrival.value='late';nodes.sfArrival.onchange();nodes.sfStep.onclick();has('sfWorld','MAY LOAD');nodes.productQ0.value='1';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('interruptWorld','STOP');nodes.restoreFlag.checked=false;nodes.restoreFlag.onchange();has('interruptWorld','CONTINUE');}
 if(L.slug==='distinguished-engineer'){has('retireWorld','KEEP OLD PATH');nodes.unknownDeps.value='0';nodes.unknownDeps.oninput();has('retireWorld','RETIRE');}
 if(L.slug==='genai-engineering'){has('routeWorld','DEPRECATED');nodes.mcpEra.value='modern';nodes.mcpEra.onchange();has('routeWorld','NO BACKCHANNEL');nodes.modelRoute.value='provider';nodes.modelRoute.onchange();has('routeWorld','EXPLICIT SERVER CALL');}
 if(L.slug==='technology-breakthroughs'){has('opticsWorld','6.87 nm');nodes.na.value='75';nodes.na.oninput();has('opticsWorld','5.04 nm');has('opticsWorld','19.4%');}
 if(L.slug==='ci-cd-github-actions'){has('queueWorld','NOT REPORTED');nodes.ghaTrigger.value='both';nodes.ghaTrigger.onchange();has('queueWorld','RUNS');}
 if(L.slug==='apis-microservices'){has('traceWorld','DENY');nodes.traceCase.value='zero';nodes.traceCase.onchange();has('traceWorld','invalid');nodes.authOk.checked=true;nodes.authOk.onchange();has('traceWorld','ALLOW');}
 assert(h.includes('checked 2026-10-14'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===24);assert.deepEqual(day.review_keys,['Day15+7','Day19+3','Day8+14']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-14').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day24/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,1);assert.equal(cov.cycle_origin,'Day24');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===24&&x.key==='Day20/data-engineering+products+1'));console.log('PASS date, duration, review and certification coverage state');
