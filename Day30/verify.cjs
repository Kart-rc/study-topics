// Semantic checks for Day30 teaching worlds. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={},saved=[];
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 for(const [,id,value] of h.matchAll(/<input id="([^"]+)"[^>]*value="([^"]+)"/g))nodes[id].value=value;
 for(const [,id] of h.matchAll(/<input id="([^"]+)"[^>]*checked/g))nodes[id].checked=true;
 const ctx={document:{getElementById:id=>nodes[id],querySelector:sel=>sel.includes(':checked')?node({value:'0'}):null,createElement:()=>node({click:()=>{}}),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:(k,v)=>saved.push([k,v])},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': expected '+s+' in '+text(id));
 if(L.slug==='data-engineering'){has('retrievalWorld','predict first');nodes.revealControl.onclick();has('retrievalWorld','IDENTITY');nodes.incident.value='queue';nodes.incident.onchange();nodes.revealControl.onclick();has('retrievalWorld','CONCURRENCY');has('dbGapWorld','Auto Loader');nodes.dbGap.value='many';nodes.dbGap.onchange();has('dbGapWorld','max clusters');nodes.sfGap.value='dupe';nodes.sfGap.onchange();has('sfGapWorld','QUALIFY');nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');}
 if(L.slug==='software-engineering'){has('stampWorld','validate');has('stampWorld','x = 11');nodes.writeBetween.checked=false;nodes.writeBetween.onchange();has('stampWorld','x = 10');}
 if(L.slug==='distinguished-engineer'){has('orrWorld','CONDITIONAL / STOP');nodes.restore.checked=true;nodes.restore.onchange();has('orrWorld','READY');}
 if(L.slug==='genai-engineering'){has('toolWorld','delete_customer');has('toolWorld','filtered before model call');nodes.agentRole.value='refund';nodes.agentRole.onchange();has('toolWorld','create_refund');}
 if(L.slug==='technology-breakthroughs'){has('aegisWorld','REJECT + ALARM');nodes.candidateScore.value='92';nodes.candidateScore.oninput();has('aegisWorld','APPROVE + ALARM');}
 if(L.slug==='ci-cd-github-actions'){has('permissionWorld','gets none');nodes.callerPerm.value='write';nodes.callerPerm.onchange();has('permissionWorld','gets read');assert(!text('permissionWorld').includes('gets write'));}
 if(L.slug==='apis-microservices'){has('cacheWorld','Réinitialiser');nodes.varyOn.checked=false;nodes.varyOn.onchange();has('cacheWorld','cached English body');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('checked 2026-10-20'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'interaction, quiz, save and export');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===30);assert.deepEqual(day.review_keys,['Day12+14','Day24+1']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-20').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day30/data-engineering');assert.equal(cov.session_type,'retrieval_gap');assert.equal(cov.cycle_position,7);assert.equal(cov.cycle_origin,'Day24');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===30&&x.key==='Day23/data-engineering+products+1'));console.log('PASS date, duration, review and certification state');
