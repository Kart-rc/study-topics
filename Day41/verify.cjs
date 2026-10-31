// Semantic checks for Day41 teaching worlds. Native layout remains a browser concern.
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
  has('qualityWorld','100 rows published');nodes.qualityAction.value='drop';nodes.qualityAction.onchange();has('qualityWorld','96 rows published');nodes.qualityAction.value='fail';nodes.qualityAction.onchange();has('qualityWorld','old version remains');
  has('dbQualityWorld','100 rows');nodes.dbQuality.value='fail';nodes.dbQuality.onchange();has('dbQualityWorld','update rolled back');
  has('sfQualityWorld','NULL_COUNT = 4');nodes.sfNulls.value='0';nodes.sfNulls.oninput();has('sfQualityWorld','expectation passes');
  nodes.productQ0.value='0';nodes.productQ1.value='0';nodes.productGrade.onclick();has('productScore','2/2');
 }
 if(L.slug==='software-engineering'){has('completionWorld','B first');nodes.taskA.value='20';nodes.taskA.oninput();has('completionWorld','A first');}
 if(L.slug==='distinguished-engineer'){has('failbackWorld','gap 27');nodes.reverseSync.checked=true;nodes.reverseSync.onchange();has('failbackWorld','gap 0');}
 if(L.slug==='genai-engineering'){has('hookWorld','6 of 6');nodes.hookScope.value='refund';nodes.hookScope.onchange();has('hookWorld','4 of 6');}
 if(L.slug==='technology-breakthroughs'){has('carrierWorld','75% delayed');nodes.suppression.value='20';nodes.suppression.oninput();has('carrierWorld','20% delayed');}
 if(L.slug==='ci-cd-github-actions'){has('outputWorld','job output');nodes.outputChars.value='800000';nodes.outputChars.oninput();has('outputWorld','upload artifact');nodes.secretLike.checked=true;nodes.secretLike.onchange();has('outputWorld','do not publish output');}
 if(L.slug==='apis-microservices'){has('nullWorld','valid');nodes.requiredField.checked=true;nodes.requiredField.onchange();has('nullWorld','invalid');nodes.payloadState.value='null';nodes.payloadState.onchange();has('nullWorld','valid');nodes.nullableField.checked=false;nodes.nullableField.onchange();has('nullWorld','invalid');}
 nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
 assert(h.includes('2026-10-31'));assert(h.includes('Use case: when to use this'));assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert(h.includes('Export answers'));
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);}
 console.log('PASS',L.slug,'interaction, quiz, save, export and local links');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===41);assert.equal(state.days.filter(x=>x.generation_key==='2026-10-31').length,1);assert.equal(day.lesson_slugs.length,7);assert.deepEqual(day.review_keys,['Day24+7','Day28+3']);assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('120 minutes total'));
const cert=JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))),cov=cert.coverage.find(x=>x.lesson==='Day41/data-engineering');assert.equal(cov.session_type,'focused');assert.equal(cov.cycle_position,4);assert.equal(cov.cycle_origin,'Day38');assert.equal(cov.mastery,'not_assessed');assert(cert.product_review_deliveries.some(x=>x.day_number===41&&x.key==='Day21/data-engineering+products+7'));console.log('PASS date, duration, review and certification state');
