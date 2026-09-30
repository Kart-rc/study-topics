const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('./trace-dom.cjs');
const root=path.join(__dirname,'..');let count=0;
for(let day=1;day<=10;day++){
 const folder=path.join(root,'Day'+day),lessons=JSON.parse(fs.readFileSync(path.join(folder,'lessons.json')));
 assert.equal(lessons.length,5);
 for(const L of lessons){
  const h=fs.readFileSync(path.join(folder,L.slug+'.html'),'utf8'),nodes={},radios={},storage={};
  for(const [,id] of h.matchAll(/id="(\w+)"/g)){assert(!nodes[id],'duplicate '+id);nodes[id]=node({value:'',checked:false});}
  for(const [,attrs] of h.matchAll(/<input ([^>]+)>/g)){const id=attrs.match(/id="([^"]+)"/),val=attrs.match(/value="([^"]+)"/);if(id){if(val)nodes[id[1]].value=val[1];nodes[id[1]].checked=/\bchecked\b/.test(attrs);}}
  for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const opt=inside.match(/<option[^>]*selected[^>]*>([^<]*)<\/option>/)||inside.match(/<option(?: value="([^"]+)")?[^>]*>([^<]*)<\/option>/);nodes[id].value=opt?(opt[1]||opt[2]):'';}
  for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
   const options=[...inside.matchAll(/<option([^>]*)>([^<]*)<\/option>/g)].map(m=>({value:m[1].match(/value="([^"]+)"/)?.[1]||m[2],text:m[2],selected:/selected/.test(m[1])}));
   nodes[id].options=options;nodes[id].selectedIndex=Math.max(0,options.findIndex(o=>o.selected));nodes[id].value=options[nodes[id].selectedIndex].value;
  }
  let downloaded=false,downloadName='',blob='';
  const ctx={document:{getElementById:id=>nodes[id],querySelector:s=>{const q=s.match(/name="q(\d+)"/);return q?radios[q[1]]||null:null},createElement:tag=>node({click(){downloaded=true;downloadName=this.download}})},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},Blob:class{constructor(parts){blob=parts.join('')}},URL:{createObjectURL:()=> 'blob:synthetic',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
  extend(ctx,nodes,h);vm.createContext(ctx);const script=h.match(/<script>([\s\S]*)<\/script>/)[1];vm.runInContext(script,ctx);
  const click=id=>nodes[id].onclick();assert(nodes.tracePosition.textContent.startsWith('Ready'));
  for(let i=0;i<L.walkthrough.frames.length;i++){
   click('traceNext');assert.equal(nodes.tracePosition.textContent,`Step ${i+1} of ${L.walkthrough.frames.length}`);
   const actual={};for(const row of nodes.traceState.children){if(row.children.length>=2)actual[row.children[0].textContent]=JSON.parse(row.children[1].textContent);}
   assert.deepEqual(actual,L.walkthrough.frames[i].state,`rendered state ${day}/${L.slug}/${i}`);
   assert.equal(nodes.traceNote.textContent,L.walkthrough.steps[i].note);
  }
  assert(nodes.traceNext.disabled);click('traceNext');assert(nodes.traceNext.disabled);
  click('traceBack');assert(nodes.tracePosition.textContent.startsWith('Step '+(L.walkthrough.frames.length-1)));
  click('traceReset');assert(nodes.tracePosition.textContent.startsWith('Ready')&&nodes.traceBack.disabled);
  click('grade');assert(nodes.score.textContent.includes('Answer all'));
  L.questions.forEach((q,i)=>radios[i]={value:String(q[2])});click('grade');assert(nodes.score.textContent.startsWith('3/3'));
  radios[0].value=String((L.questions[0][2]+1)%L.questions[0][1].length);click('grade');assert(nodes.score.textContent.startsWith('2/3'));
  nodes.rationale.value='Synthetic test only';click('save');assert(Object.values(storage)[0].includes('Synthetic test only'));click('export');
  const answer=JSON.parse(blob);assert(downloaded&&downloadName===`Day${day}-${L.slug}-answers.json`);assert.equal(answer.attempts.length,2);assert.equal(answer.lesson,`Day${day}/${L.slug}`);
  if(day===1){
   const world=()=>nodes.world.textContent;
   if(L.slug==='data-engineering'){click('blue');click('amber');assert(world().includes('CONFLICT'));click('refresh');click('amber');assert(world().includes('A, B, C, D'));}
   if(L.slug==='software-engineering'){nodes.layers.value='3';nodes.attempts.value='3';nodes.single.checked=false;nodes.layers.oninput();assert(world().includes('For 100 original requests: 2700'));nodes.single.checked=true;nodes.single.oninput();assert(world().includes('For 100 original requests: 300'));}
   if(L.slug==='distinguished-engineer'){nodes.slo.value='99.5';nodes.bad.value='30';nodes.bad.oninput();assert(world().includes('Remaining: 20.0'));nodes.bad.value='60';nodes.bad.oninput();assert(world().includes('Budget exceeded'));}
   if(L.slug==='genai-engineering'){click('verify');assert(world().includes('blocked: no artifact'));click('write');click('restart');assert(world().includes('Durable status: written'));click('verify');assert(world().includes('Durable status: verified'));}
   if(L.slug==='technology-breakthroughs'){click('fresh');assert(world().includes('Invalid dependency'));click('list');click('fresh');click('explain');assert(world().includes('18 minutes late'));}
  }
  // Reload in a new script context with the same synthetic storage.
  nodes.rationale.value='';vm.runInNewContext(script,{...ctx});assert.equal(nodes.rationale.value,'Synthetic test only');
  for(const [,href] of h.matchAll(/href="([^"]+)"/g))if(!/^https?:|^#/.test(href))assert(fs.existsSync(path.resolve(folder,href)),'missing link '+href);
  assert(!/<script[^>]+src=|<link[^>]+stylesheet/.test(h));
  assert(h.includes('These values were captured by running this exact example'));
  const md=fs.readFileSync(path.join(folder,L.slug+'.md'),'utf8');assert(md.includes('## Step through the code')&&md.includes('```'+L.walkthrough.language));
  count++;
 }
 console.log('PASS Day'+day+': five execution replays, boundaries, quiz/export/save/restore, and links');
}
console.log('PASS '+count+' lessons. Simulated DOM does not establish real-browser layout or download behavior.');
