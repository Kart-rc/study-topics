// Semantic checks for the Day67 one-track teaching world. Native layout remains a browser concern.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {node,extend}=require('../scripts/trace-dom.cjs');
const lessons=JSON.parse(fs.readFileSync(path.join(__dirname,'lessons.json')));
assert.equal(lessons.length,1);
const L=lessons[0];assert.equal(L.slug,'distinguished-engineer');
const h=fs.readFileSync(path.join(__dirname,L.slug+'.html'),'utf8'),nodes={},saved=[];
for(const [,id] of h.matchAll(/id="(\w+)"/g))nodes[id]=node({value:'',checked:false});
for(const [,id,inside] of h.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
 const options=[...inside.matchAll(/<option([^>]*)>([^<]*)<\/option>/g)].map(m=>({value:m[1].match(/value="([^"]+)"/)?.[1]||m[2],text:m[2],selected:/selected/.test(m[1])}));
 nodes[id].options=options;nodes[id].selectedIndex=Math.max(0,options.findIndex(o=>o.selected));nodes[id].value=options[nodes[id].selectedIndex].value;
}
const ctx={document:{getElementById:id=>nodes[id],querySelector:sel=>sel.includes(':checked')?node({value:'0'}):null,createElement:()=>node({click:()=>{}}),querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem:(k,v)=>saved.push([k,v])},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL:()=>{}},setTimeout:fn=>fn(),console};
extend(ctx,nodes,h);vm.createContext(ctx);vm.runInContext(h.match(/<script>([\s\S]*)<\/script>/)[1],ctx);
const text=id=>nodes[id].textContent||(nodes[id].innerHTML||'').replace(/<[^>]*>/g,'');
const has=(id,s)=>assert(text(id).includes(s),id+': expected '+s+' in '+text(id));
has('rewriteWorld','SEAM FOUND');has('rewriteWorld','92% of CPU');
nodes.rewriteCase.value='parity';nodes.rewriteCase.onchange();has('rewriteWorld','HOLD');has('rewriteWorld','96/100');
nodes.rewriteCase.value='canary';nodes.rewriteCase.onchange();has('rewriteWorld','EXPAND ONLY');has('rewriteWorld','5%');
nodes.rewriteCase.value='boundary';nodes.rewriteCase.onchange();has('rewriteWorld','STOP THE SCOPE');has('rewriteWorld','90% of eligible traffic');
nodes.grade.onclick();has('score','3/3');nodes.save.onclick();assert.equal(saved.length,1);nodes.export.onclick();
assert(h.includes('2026-11-27'));assert(h.includes('Use case: when to use this'));assert(h.includes('Day40:'));assert(h.includes('Day42:'));
assert.equal(L.questions.length,3);assert.equal(L.written_questions.length,2);assert.equal(L.walkthrough.frames.length,4);
assert.deepEqual(L.walkthrough.frames.at(-1).state.decision,L.walkthrough.expect.decision);
for(const [,href] of h.matchAll(/href="([^"]+)"/g))if(!href.startsWith('http')&&!href.startsWith('#'))assert(fs.existsSync(path.resolve(__dirname,href)),L.slug+' missing '+href);
const state=JSON.parse(fs.readFileSync(path.join(__dirname,'../study-state.json'))),day=state.days.find(x=>x.number===67);
assert.equal(state.days.filter(x=>x.generation_key==='2026-11-27').length,1);
assert.equal(state.last_generated_day,67);
assert.deepEqual(day.lesson_slugs,['distinguished-engineer']);
assert.deepEqual(day.review_keys,['Day40/distinguished-engineer+3','Day42/distinguished-engineer+1']);
assert(fs.readFileSync(path.join(__dirname,'index.html'),'utf8').includes('1 lesson. 15 minutes.'));
assert.equal(JSON.parse(fs.readFileSync(path.join(__dirname,'../certification-plan.json'))).coverage.at(-1).lesson,'Day60/data-engineering');
console.log('PASS Day67 four-state rewrite-boundary model, recorded trace, scoring, save/export, links, one-track policy, track-qualified review state, and paused certification state');
