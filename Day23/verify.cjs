// Semantic checks for Day23 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node(),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': '+s+' in '+text(id));
 if(L.slug==='data-engineering'){has('world','Predict before reveal');nodes.revealControl.onclick();has('world','Recovery identity');nodes.incidentSymptom.value='publish';nodes.incidentSymptom.onchange();nodes.revealControl.onclick();has('world','Dependency gate');nodes.dbNext.onclick();has('dbWorld','Run tolerant parse');nodes.sfGap.value='denied';nodes.sfGap.onchange();nodes.sfNext.onclick();has('sfWorld','SHOW GRANTS');nodes.productQ0.value='1';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('world','AVAILABLE');nodes.silence.value='40';nodes.silence.oninput();has('world','SUSPECT');nodes.jitter.value='50';nodes.jitter.onchange();}
 if(L.slug==='distinguished-engineer'){has('world','Safe mismatch evidence');nodes.effects.value='live';nodes.effects.onchange();has('world','LIVE EFFECT RISK');}
 if(L.slug==='genai-engineering'){has('world','tools/call book_table');for(let i=0;i<4;i++)nodes.mrtrNext.onclick();has('world','final booking b-900');}
 if(L.slug==='technology-breakthroughs'){has('world','phone scan');nodes.robotStage.value='4';nodes.robotStage.oninput();has('world','Transfer boundary');}
 if(L.slug==='ci-cd-github-actions'){has('world','BLOCK');nodes.schemaCompat.value='yes';nodes.schemaCompat.onchange();has('world','deploy good22 again');}
 if(L.slug==='apis-microservices'){has('world','SUPPORTED');nodes.lifecycleDay.value='deprecated';nodes.lifecycleDay.onchange();has('world','DEPRECATED');nodes.lifecycleDay.value='sunset';nodes.lifecycleDay.onchange();has('world','PAST SUNSET');}
 assert(h.includes('checked 2026-10-13'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===23);assert.deepEqual(day.review_keys,['Day18+3','Day20+1']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-13').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day23/data-engineering');assert.equal(cov.session_type,'retrieval_gap');assert.equal(cov.cycle_position,7);assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===23&&x.key==='Day18/data-engineering+products+3'));console.log('PASS date, duration, review and retrieval-only coverage state');
