// Semantic checks for Day19 teaching worlds. A simulated DOM is not a browser layout test.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,attrs] of h.matchAll(/<input ([^>]+)>/g)){const id=attrs.match(/id="([^"]+)"/),val=attrs.match(/value="([^"]+)"/);if(id){if(val)nodes[id[1]].value=val[1];nodes[id[1]].checked=/\bchecked\b/.test(attrs);}}
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const first=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/);nodes[id].value=first[1]||first[2];}
 const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node()},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');const has=(id,s)=>assert(text(id).includes(s),id+': '+s+' in '+text(id));
 if(L.slug==='data-engineering'){
  has('world','Candidate chunks: 6/6');nodes.layoutMode.value='clustered';nodes.layoutMode.onchange();has('world','Candidate chunks: 1/6');nodes.predicateMode.value='wrapped';nodes.predicateMode.onchange();has('world','Candidate chunks: 6/6');
  nodes.dbLayout.value='clustered';nodes.dbLayout.onchange();for(let i=0;i<3;i++)nodes.dbNext.onclick();has('dbState','scan 1 chunk');assert(nodes.dbNext.disabled);nodes.dbReset.onclick();has('dbState','Step 0/3');
  nodes.sfLayout.value='clustered';nodes.sfLayout.onchange();for(let i=0;i<3;i++)nodes.sfNext.onclick();has('sfState','scan 1 chunk');assert(nodes.sfNext.disabled);nodes.sfReset.onclick();has('sfState','Step 0/3');
  nodes.productQ0.value='';nodes.productQ1.value='';nodes.productGrade.onclick();has('productScore','Answer both');nodes.productQ0.value='0';nodes.productQ1.value='1';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){nodes.abaNext.onclick();nodes.abaNext.onclick();has('world','Current: A, v2');has('world','WOULD PASS');nodes.abaCheck.value='stamp';nodes.abaCheck.onchange();has('world','REJECTED');nodes.abaReset.onclick();has('world','Current: A, v0');}
 if(L.slug==='distinguished-engineer'){has('world','two-way door');nodes.rollbackTested.value='no';nodes.rollbackTested.onchange();has('world','not-yet-reversible');nodes.destructive.value='yes';nodes.destructive.onchange();has('world','risk signals 5');}
 if(L.slug==='genai-engineering'){has('world','INFRA ERROR');nodes.memoryCeiling.value='2';nodes.memoryCeiling.onchange();has('world','PASS');nodes.agentDemand.value='5';nodes.agentDemand.onchange();has('world','INFRA ERROR');}
 if(L.slug==='technology-breakthroughs'){has('world','key released: true');nodes.attestationMatch.value='mismatch';nodes.attestationMatch.onchange();has('world','key released: false');has('world','Raw upload visible to operator in this model: never');}
 if(L.slug==='ci-cd-github-actions'){has('world','Deployment gate → PASS');nodes.artifactDigest.value='bbb';nodes.artifactDigest.onchange();has('world','Deployment gate → BLOCK');nodes.artifactDigest.value='aaa';nodes.artifactDigest.onchange();nodes.signerRepo.value='other';nodes.signerRepo.onchange();has('world','UNTRUSTED');}
 if(L.slug==='apis-microservices'){has('world','ACCEPT amount 50');nodes.bodyVersion.value='tampered';nodes.bodyVersion.onchange();has('world','REJECT before effect');nodes.verifyOrder.value='after';nodes.verifyOrder.onchange();has('world','UNSAFE');}
 assert.equal((h.match(/Recall first, then reveal the refresher/g)||[]).length,2);assert(h.includes('checked 2026-10-09'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);console.log('PASS',L.slug,'mechanism, boundary and due reviews');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===19);assert.deepEqual(day.review_keys,['Day10+7','Day12+7','Day17+1','Day4+14']);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-09').length,1);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json')));const cov=cert.coverage.find(x=>x.lesson==='Day19/data-engineering');assert.equal(cov.product_material_added_on,'2026-10-09');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===19&&x.key==='Day17/data-engineering+products+1'));console.log('PASS date key, duration, product refresher and coverage-only record');
