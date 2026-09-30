// Dependency-free execution checks for embedded scripts. Simulated DOM, not visual browser QA.
const vm=require('vm'),fs=require('fs'),path=require('path');
const root=__dirname;
const lessons=JSON.parse(fs.readFileSync(path.join(root,'lessons.json')));
function assert(value,message){if(!value)throw Error(message)}
assert(lessons.length===5,'expected five lessons');
for(const L of lessons){
  const html=fs.readFileSync(path.join(root,L.slug+'.html'),'utf8');
  const md=fs.readFileSync(path.join(root,L.slug+'.md'),'utf8');
  const match=html.match(/<script>([\s\S]*)<\/script>/);assert(match,'embedded script missing');
  const nodes={},radios={};
  for(const id of html.matchAll(/id="([\w]+)"/g))nodes[id[1]]={value:'',textContent:'',checked:false,style:{},className:''};
  for(const tag of html.matchAll(/<input ([^>]+)>/g)){
    const id=tag[1].match(/id="([^"]+)"/),value=tag[1].match(/value="([^"]+)"/);
    if(id){if(value)nodes[id[1]].value=value[1];if(/\bchecked\b/.test(tag[1]))nodes[id[1]].checked=true;}
  }
  for(const select of html.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
    const chosen=select[2].match(/<option selected>([^<]+)<\/option>/)||select[2].match(/<option>([^<]+)<\/option>/);
    nodes[select[1]].value=chosen?chosen[1]:'';
  }
  let downloaded=false,blob='',storage={};
  const ctx={document:{getElementById:id=>nodes[id],querySelector:s=>{const q=s.match(/name="q(\d+)"/);return q?radios[q[1]]||null:null},createElement:()=>({click:()=>downloaded=true})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Blob:class{constructor(data){blob=data.join('')}},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
  vm.createContext(ctx);vm.runInContext(match[1],ctx);
  const click=id=>nodes[id].onclick(),world=()=>nodes.world.textContent;
  assert(html.includes('Day6:')&&html.includes('Day8:')&&html.match(/Recall first, then reveal/g).length===2,'Day6/Day8 refreshers missing');
  assert(md.includes('## Sources')&&md.includes('checked 2026-09-29'),'Markdown sources/check date missing');
  click('grade');assert(nodes.score.textContent.includes('Answer all'),'incomplete quiz guard');
  L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'),'correct score');
  radios[0].value=String((L.questions[0][2]+1)%3);click('grade');assert(nodes.score.textContent.startsWith('2/3'),'incorrect score');
  nodes.rationale.value='Synthetic response';nodes.recall.value='Synthetic recall';nodes.boundaryAnswer.value='Synthetic boundary';click('save');
  assert(Object.values(storage)[0].includes('Synthetic response'),'save serialization');
  click('export');const exported=JSON.parse(blob);
  assert(downloaded&&exported.attempts.length===2&&exported.recall==='Synthetic recall'&&exported.lesson==='Day10/'+L.slug,'export and attempt history');
  if(L.slug==='data-engineering'){
    click('sendEvent');assert(nodes.brokerView.textContent==='0 copies of E7','cannot send absent ticket');
    click('saveOrder');click('sendEvent');click('crashRelay');click('markSent');assert(nodes.dbView.textContent.includes('pending'),'crash loses acknowledgement');
    click('sendEvent');click('markSent');click('deliver');assert(nodes.brokerView.textContent==='2 copies of E7'&&nodes.shipView.textContent.includes('1 shipments'),'event dedup across publications');
    click('resetLab');nodes.dedup.checked=false;click('saveOrder');click('sendEvent');click('crashRelay');click('sendEvent');click('deliver');assert(nodes.shipView.textContent.includes('2 shipments'),'unprotected duplicate effect');
  }
  if(L.slug==='software-engineering'){
    for(let i=0;i<4;i++)click('callService');assert(nodes.counts.textContent.includes('Forwarded 3 · Blocked 1'),'breaker stops forwarding');
    click('advance');assert(nodes.probeCard.className.includes('active'),'half-open state');click('callService');assert(nodes.openCard.className.includes('active'),'failed probe reopens');
    click('advance');nodes.healthy.checked=true;click('callService');assert(nodes.closedCard.className.includes('active'),'successful probe closes');
  }
  if(L.slug==='distinguished-engineer'){
    nodes.moveTracking.checked=true;nodes.moveTracking.onchange();click('requestOrders');assert(world().includes('old system'),'orders stay old');
    click('requestTracking');assert(world().includes('new system')&&world().includes('returned'),'tracking moves');nodes.newHealthy.checked=false;click('requestTracking');assert(world().includes('FAILED'),'new failure visible');
    nodes.moveTracking.checked=false;nodes.moveTracking.onchange();click('requestTracking');assert(world().includes('returned'),'compatible fallback');nodes.oldCompatible.checked=false;click('requestTracking');assert(world().includes('old reader cannot'),'incompatible fallback fails');
  }
  if(L.slug==='genai-engineering'){
    assert(nodes.shapeGate.textContent.includes('PASS')&&nodes.intentGate.textContent.includes('STOP'),'valid shape wrong intent');click('execute');assert(world().includes('Blocked'),'wrong units blocked');
    click('wrongOrder');assert(nodes.permissionGate.textContent.includes('STOP'),'wrong owner blocked');click('negativeInput');assert(nodes.shapeGate.textContent.includes('STOP'),'range validation');
    click('correctInput');assert(nodes.balanceView.textContent==='5000 cents','validation no side effect');click('execute');assert(nodes.balanceView.textContent==='2500 cents','correct refund');click('execute');assert(nodes.balanceView.textContent==='2500 cents'&&world().includes('already ran'),'duplicate guard');
  }
  if(L.slug==='technology-breakthroughs'){
    click('program');assert(nodes.storedView.textContent==='10 of 15'&&nodes.readView.textContent.includes('0.400'),'worked arithmetic');nodes.writePower.checked=false;nodes.writePower.onchange();assert(nodes.storedView.textContent==='10 of 15','retention');
    nodes.level.value='15';nodes.level.oninput();click('program');assert(nodes.storedView.textContent==='10 of 15','cannot write without power');nodes.readLight.checked=false;nodes.readLight.onchange();assert(nodes.readView.textContent.includes('No optical reading'),'read power distinct');
  }
  console.log('PASS',L.slug,'model, quiz, save, export, sources, Day6/Day8 refreshers');
}
for(const name of ['index.html',...lessons.flatMap(L=>[L.slug+'.html',L.slug+'.md'])])assert(fs.existsSync(path.join(root,name)),name+' missing');
console.log('All five embedded scripts passed simulated-DOM checks. Real browser layout and native download behavior are not established.');

// Verify relative navigation and generation identity without contacting remote sites.
for(const name of ['index.html',...lessons.map(L=>L.slug+'.html')]){
 const h=fs.readFileSync(path.join(root,name),'utf8');
 for(const [,href] of h.matchAll(/href="([^"]+)"/g)){if(!href.startsWith('https:')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(root,href)),'broken link '+href);}
 const ids=[...h.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert(new Set(ids).size===ids.length,'duplicate DOM IDs');
 assert(!/<script[^>]+src=|<link[^>]+stylesheet/.test(h),'external runtime dependency');
}
const state=JSON.parse(fs.readFileSync(path.join(root,'../study-state.json')));
assert(state.days.filter(d=>d.generation_key==='2026-09-30').length===1,'unique generation key');
assert(state.days.at(-1).review_keys.join(',')==='Day6+3,Day8+1','oldest due reviews');
console.log('PASS local links, standalone pages, unique date and oldest-due review queue.');
