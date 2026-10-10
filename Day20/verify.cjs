// Semantic checks for Day20 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node()},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': '+s+' in '+text(id));
 if(L.slug==='data-engineering'){has('world','1 parent row');nodes.jsonView.value='flat';nodes.jsonView.onchange();has('world','2 item rows');nodes.jsonState.value='malformed';nodes.jsonState.onchange();has('world','Parse failed');for(const p of ['db','sf']){for(let i=0;i<3;i++)nodes[p+'Next'].onclick();has(p+'State','two correlated rows');assert(nodes[p+'Next'].disabled);nodes[p+'Reset'].onclick();has(p+'State','Step 0/3');}nodes.productQ0.value='1';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){nodes.clockCorrection.value='back';nodes.clockCorrection.onchange();has('world','-1750 ms');nodes.clockKind.value='mono';nodes.clockKind.onchange();has('world','250 ms');}
 if(L.slug==='distinguished-engineer'){nodes.recLatency.value='4000';nodes.recLatency.onchange();has('world','0/100');nodes.fallbackMode.value='on';nodes.fallbackMode.onchange();has('world','100/100');}
 if(L.slug==='genai-engineering'){nodes.agentArgs.value='extra';nodes.agentArgs.onchange();has('world','REJECTED');nodes.schemaMode.value='loose';nodes.schemaMode.onchange();has('world','REACHED');nodes.agentArgs.value='missing';nodes.agentArgs.onchange();has('world','NOT CALLED');}
 if(L.slug==='technology-breakthroughs'){nodes.tapRate.value='4';nodes.tapRate.onchange();has('world','1.8 TB');has('world','0.036 TB');nodes.retainPct.value='100';nodes.retainPct.onchange();has('world','1.800 TB');}
 if(L.slug==='ci-cd-github-actions'){nodes.tagState.value='bbb';nodes.tagState.onchange();has('world','CHANGED WITHOUT WORKFLOW DIFF');nodes.actionRef.value='sha';nodes.actionRef.onchange();has('world','REVIEWED');}
 if(L.slug==='apis-microservices'){nodes.backendB.value='down';nodes.backendB.onchange();has('world','A → A → A → A');nodes.healthClient.value='off';nodes.healthClient.onchange();has('world','Failed: 2/4');}
 assert(h.includes('checked 2026-10-10'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);console.log('PASS',L.slug,'mechanism and boundaries');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===20);assert.deepEqual(day.review_keys,['Day16+3','Day18+1','Day5+14']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-10').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day20/data-engineering');assert.equal(cov.product_material_added_on,'2026-10-10');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===20&&x.key==='Day18/data-engineering+products+1'));console.log('PASS date, duration, review and coverage-only state');
