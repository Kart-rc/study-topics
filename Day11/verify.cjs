// Semantic checks for the seven teaching worlds. Run: node Day11/verify.cjs
// A simulated DOM is not a browser layout or native-download test.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));
assert.equal(lessons.length,7);
for(const L of lessons){
 const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
 for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
 for(const [,attrs] of h.matchAll(/<input ([^>]+)>/g)){const id=attrs.match(/id="([^"]+)"/),val=attrs.match(/value="([^"]+)"/);if(id){if(val)nodes[id[1]].value=val[1];nodes[id[1]].checked=/\bchecked\b/.test(attrs);}}
 for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes[id].value=inside.match(/<option value="([^"]+)"/)[1];
 const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node()},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
 extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
 const click=id=>nodes[id].onclick(),text=id=>nodes[id].textContent;
 if(L.slug==='data-engineering'){
  assert(text('world').includes('Pages read: 1/3')&&text('world').includes('[42]'));
  nodes.targetId.value='45';nodes.targetId.oninput();assert(text('world').includes('1/3')&&text('world').includes('[]'));
  nodes.targetId.value='42';nodes.layout.value='scattered';nodes.layout.onchange();assert(text('world').includes('3/3')&&text('world').includes('[42]'));
  nodes.layout.value='grouped';nodes.useStats.checked=false;nodes.useStats.onchange();assert(text('world').includes('3/3')&&text('world').includes('[42]'));
  nodes.useStats.checked=true;nodes.targetId.value='0';nodes.targetId.oninput();assert(text('world').includes('0/3'));
  // Exhaustively compare pruning against a full scan over both synthetic layouts.
  for(const layout of ['grouped','scattered'])for(const stats of [true,false])for(let id=0;id<=110;id++){
   nodes.layout.value=layout;nodes.useStats.checked=stats;nodes.targetId.value=String(id);nodes.targetId.oninput();
   const expected=[10,12,20,40,42,50,80,90,100].includes(id)?[id]:[];
   assert(text('world').includes('Matching IDs: '+JSON.stringify(expected)));
  }
 }
 if(L.slug==='software-engineering'){
  click('sendFive');assert(text('world').includes('Admitted 3 · Refused 2'));assert.equal(text('ticketView'),'0 / 3');
  click('waitHalf');click('sendOne');assert(text('world').includes('Admitted 4 · Refused 2'));assert.equal(text('activeView'),'4');
  click('waitLong');assert.equal(text('ticketView'),'3 / 3');click('sendFive');assert.equal(text('activeView'),'7');
  click('finishAll');assert.equal(text('activeView'),'0');assert.equal(text('ticketView'),'0 / 3');
  click('resetLab');assert.equal(text('ticketView'),'3 / 3');
 }
 if(L.slug==='distinguished-engineer'){
  assert.equal(text('decisionView'),'Drill meets all three checks');nodes.dataAge.value='10';nodes.dataAge.oninput();assert(text('dataView').includes('outside target'));assert(text('timeView').includes('within target'));
  nodes.dataAge.value='5';nodes.restoreMins.value='19';nodes.restoreMins.oninput();assert(text('timeView').includes('31 minutes · outside target'));
  nodes.restoreMins.value='18';nodes.integrity.checked=false;nodes.integrity.onchange();assert(text('timeView').includes('within target'));assert(text('decisionView').startsWith('Do not'));
 }
 if(L.slug==='genai-engineering'){
  click('sendPrompt');assert(text('cacheView').startsWith('MISS'));nodes.orderQuestion.value='8';click('sendPrompt');assert(text('cacheView').startsWith('HIT'));
  nodes.policyVersion.value='v2';click('sendPrompt');assert(text('cacheView').startsWith('MISS'));
  nodes.cacheLayout.value='unstable';click('sendPrompt');assert(text('cacheView').startsWith('MISS'));click('sendPrompt');assert(text('cacheView').startsWith('MISS'));
  click('clearCache');assert.equal(text('cacheView'),'Empty');
 }
 if(L.slug==='technology-breakthroughs'){
  for(const [a,b] of [[0,0],[0,1],[1,0],[1,1]]){
   click('resetLab');if(a)click('flipA');if(b)click('flipB');click('checkParity');
   assert(text('parityView').startsWith(String(a^b)));assert(text('world').includes(a===0&&b===0?'original preserved':'CHANGED'));
  }
  assert(text('parityView').includes('accept')&&text('world').includes('CHANGED'));
 }
 if(L.slug==='ci-cd-github-actions'){
  click('advanceJob');assert.equal(text('testView'),'failure');assert.equal(text('packageView'),'pending');click('advanceJob');click('advanceJob');assert.equal(text('packageView'),'skipped');assert.equal(text('deployView'),'skipped');
  nodes.testsPass.checked=true;nodes.testsPass.onchange();for(let i=0;i<3;i++)click('advanceJob');assert.equal(text('deployView'),'success');
  nodes.testsPass.checked=false;nodes.dependencies.checked=false;nodes.dependencies.onchange();click('advanceJob');assert.equal(text('testView'),'failure');assert.equal(text('packageView'),'success');assert.equal(text('deployView'),'success');
 }
 if(L.slug==='apis-microservices'){
  const expected={valid:'PASS',missing:'Missing field: quantity',zero:'quantity must be at least 1',string:'quantity must be an integer',extra:'Unknown field is not allowed',nobody:'Body is required',null:'Body must be an object',blank:'sku must be a nonempty string',bool:'quantity must be an integer',fraction:'quantity must be an integer',float:'PASS'};
  for(const [name,result] of Object.entries(expected)){nodes.requestCase.value=name;nodes.requestCase.onchange();click('validateRequest');assert.equal(text('resultView'),result,name);}
 }
 const reviews=(h.match(/Recall first, then reveal/g)||[]).length;
 if(['ci-cd-github-actions','apis-microservices'].includes(L.slug)){assert.equal(reviews,0);assert(h.includes('No earlier lessons are due yet'));}
 else{assert.equal(reviews,2);assert(h.includes('Day3:')&&h.includes('Day7:'));}
 assert(h.includes('checked 2026-10-01'));assert(h.includes('15 minutes'));
 console.log('PASS',L.slug,'model states, boundary cases, review allocation');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),d=state.days.find(x=>x.number===11);
assert.equal(state.days.filter(x=>x.generation_key==='2026-10-01').length,1);
assert.deepEqual(d.review_keys,['Day3+7','Day7+3']);
assert.equal(d.lesson_slugs.length,7);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('105 minutes total'));
for(const name of ['index.html',...lessons.map(x=>x.slug+'.html')]){
 const h=fs.readFileSync(path.join(__dirname,name),'utf8');
 for(const [,href] of h.matchAll(/href="([^"]+)"/g))if(!/^https?:|^#/.test(href))assert(fs.existsSync(path.resolve(__dirname,href)),'missing '+href);
}
console.log('PASS seven tracks, 105 minutes, unique generation key, queued reviews and links.');
