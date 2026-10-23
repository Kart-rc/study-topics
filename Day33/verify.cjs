// Semantic checks for Day33 teaching worlds. Native layout remains a browser concern.
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
 if(L.slug==='data-engineering'){
  has('trustWorld','READ ALLOWED');nodes.prefix.value='hr';nodes.prefix.onchange();has('trustWorld','READ DENIED');
  has('dbTrustWorld','inside URL');nodes.dbPath.value='hr';nodes.dbPath.onchange();has('dbTrustWorld','outside URL');
  has('sfTrustWorld','URL aligned');nodes.sfPath.value='hr';nodes.sfPath.onchange();has('sfTrustWorld','URL rejected');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('threadWorld','local=null');nodes.cleanup.checked=false;nodes.cleanup.onchange();has('threadWorld','east ← leaked');}
 if(L.slug==='distinguished-engineer'){has('quotaWorld','headroom 350');nodes.mlJobs.value='750';nodes.mlJobs.oninput();has('quotaWorld','100 rejected');}
 if(L.slug==='genai-engineering'){has('contextWorld','db_client');nodes.unsafeReturn.checked=true;nodes.unsafeReturn.onchange();has('contextWorld','dsn=db.internal');}
 if(L.slug==='technology-breakthroughs'){has('fiberWorld','13/14 signals live');nodes.damaged.value='6';nodes.damaged.oninput();has('fiberWorld','8/14 signals live');}
 if(L.slug==='ci-cd-github-actions'){has('scriptWorld','changes shell grammar');nodes.binding.value='env';nodes.binding.onchange();has('scriptWorld','remains data');}
 if(L.slug==='apis-microservices'){has('deleteWorld','exists');nodes.deleteOnce.onclick();has('deleteWorld','204');nodes.deleteOnce.onclick();has('deleteWorld','404');has('deleteWorld','absent');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('checked 2026-10-23'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));console.log('PASS',L.slug,'interaction, quiz, save and export');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===33);assert.deepEqual(day.review_keys,['Day20+7','Day24+3']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-23').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day33/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,3);assert.equal(cov.cycle_origin,'Day31');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===33&&x.key==='Day22/data-engineering+products+3'));console.log('PASS date, duration, review and certification state');
