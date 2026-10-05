// Semantic checks for Day12 teaching worlds. A simulated DOM is not a browser layout test.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));
assert.equal(lessons.length,7);
for(const L of lessons){
  const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={};
  for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
  for(const [,attrs] of h.matchAll(/<input ([^>]+)>/g)){
    const id=attrs.match(/id="([^"]+)"/),val=attrs.match(/value="([^"]+)"/);
    if(id){if(val)nodes[id[1]].value=val[1];nodes[id[1]].checked=/\bchecked\b/.test(attrs);}
  }
  for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g))nodes[id].value=inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]+)/).slice(1).filter(Boolean)[0];
  const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>null,createElement:()=>node()},localStorage:{getItem:()=>null,setItem:()=>{}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
  extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
  const click=id=>nodes[id].onclick(),text=id=>nodes[id].textContent;
  if(L.slug==='data-engineering'){
    assert(text('world').includes('Hidden row: O11'));
    nodes.deleteFile.value='orders-B.parquet';nodes.deleteFile.onchange();assert(text('world').includes('Hidden row: O21'));
    nodes.deletePos.value='3';nodes.deletePos.oninput();assert(text('world').includes('nothing is hidden'));
  }
  if(L.slug==='software-engineering'){
    assert(text('world').includes('Actual loader calls: 2'));
    nodes.keyC.value='MUG';nodes.keyC.onchange();assert(text('world').includes('Actual loader calls: 1'));
    nodes.loaderOk.checked=false;nodes.loaderOk.onchange();assert(text('world').includes('ERROR timeout'));
  }
  if(L.slug==='distinguished-engineer'){
    nodes.controlHealthy.checked=false;nodes.controlHealthy.onchange();click('publishRoute');assert(text('requestView').includes('rejected'));
    click('serveRequest');assert(text('requestView').includes('200 OK via cell-a'));
    nodes.perRequestLookup.checked=true;nodes.perRequestLookup.onchange();click('serveRequest');assert(text('requestView').includes('FAILED'));
  }
  if(L.slug==='genai-engineering'){
    assert(text('world').includes('1 root span')&&text('world').includes('execute_tool / timeout'));
    nodes.linkParent.checked=false;nodes.linkParent.onchange();assert(text('world').includes('2 root span'));
    nodes.toolFails.checked=false;nodes.toolFails.onchange();assert(text('world').includes('Failure location: none'));
  }
  if(L.slug==='technology-breakthroughs'){
    assert.equal(text('amplitudeView'),'15.0');click('sampleLight');assert.equal(text('amplitudeView'),'0.0');
    nodes.brightness.value='15';nodes.inhibition.value='0';nodes.eventThreshold.value='5';click('sampleLight');assert.equal(text('amplitudeView'),'20.0');
  }
  if(L.slug==='ci-cd-github-actions'){
    assert(text('cacheView').startsWith('MISS'));click('runBuild');assert(text('cacheView').startsWith('HIT'));click('runDeploy');assert(text('deployView').includes('DEPLOY'));
    click('resetPipeline');nodes.uploadArtifact.checked=false;click('runBuild');click('runDeploy');assert(text('deployView').includes('BLOCKED'));
  }
  if(L.slug==='apis-microservices'){
    click('aliceUpdate');click('bobUpdate');assert(text('responseView').startsWith('412'));assert(text('resourceView').includes('"address":"B"'));
    click('resetOrder');click('aliceUpdate');nodes.useIfMatch.checked=false;click('bobUpdate');assert(text('responseView').startsWith('200'));assert(text('resourceView').includes('"address":"A"'));
  }
  const reviews=(h.match(/Recall first, then reveal/g)||[]).length;
  if(['ci-cd-github-actions','apis-microservices'].includes(L.slug)){assert.equal(reviews,1);assert(h.includes('Day11:'));}
  else{assert.equal(reviews,2);assert(h.includes('Day9:')&&h.includes('Day4:'));}
  assert(h.includes('checked 2026-10-02'));assert(h.includes('15 minutes'));
  console.log('PASS',L.slug,'mechanism, boundary and review allocation');
}
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),d=state.days.find(x=>x.number===12);
assert.equal(state.days.filter(x=>x.generation_key==='2026-10-02').length,1);
assert.deepEqual(d.review_keys,['Day11+1','Day4+7','Day9+1']);
assert.equal(d.lesson_slugs.length,7);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('105 minutes total'));
for(const name of ['index.html',...lessons.map(x=>x.slug+'.html')]){
  const h=fs.readFileSync(path.join(__dirname,name),'utf8');
  for(const [,href] of h.matchAll(/href="([^"]+)"/g))if(!/^https?:|^#/.test(href))assert(fs.existsSync(path.resolve(__dirname,href)),'missing '+href);
}
console.log('PASS seven tracks, 105 minutes, unique generation key and track-aware spaced reviews.');
