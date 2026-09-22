#!/usr/bin/env python3
"""Render the named Day folder from reviewed lessons.json; no network or AI calls."""
from pathlib import Path
from datetime import date,timedelta
import json,html,re,sys
R=Path(__file__).resolve().parents[1]
CSS='''*{box-sizing:border-box}body{margin:0;background:#f4f4ee;color:#192d32;font:17px/1.7 system-ui,sans-serif}main{max-width:960px;margin:auto;padding:32px 24px 80px}a{color:#096b73}header{padding:35px 0;border-bottom:2px solid #c4d3ce}h1{font-size:clamp(2.1rem,5vw,3.5rem);line-height:1.12;letter-spacing:-.035em;max-width:800px}h2{font-size:1.4rem;margin-top:0}p{max-width:78ch}.eyebrow{font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;font-weight:750;color:#316c69}.lead{font-size:1.2rem}section,.card{background:white;border:1px solid #d9e2da;border-radius:18px;padding:26px;margin:24px 0}.lab{background:#17363b;color:#f3f7f4}.lab button{background:#d6f4b5;color:#15373a}.lab label{display:block;margin:14px 0}.lab pre{background:#0c2429;color:#d6f4b5}button{background:#185c61;color:white;border:0;border-radius:8px;padding:12px 16px;font:inherit;cursor:pointer;margin:6px 6px 6px 0}button:hover{filter:brightness(1.13)}button:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible{outline:3px solid #d18621;outline-offset:3px}input[type=range]{width:min(95%,420px);display:block}input[type=number]{font:inherit;width:110px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#edf3ee;border-radius:10px;padding:20px}small,.muted{color:#56666b}.lab .muted{color:#c5d8d5}fieldset{border:1px solid #d9e2da;border-radius:12px;margin:20px 0;padding:20px}legend{font-weight:700}fieldset label{display:block;padding:6px}textarea{width:100%;min-height:90px;font:inherit;padding:12px;border:1px solid #9caaa6;border-radius:8px}details{padding:12px 0}summary{cursor:pointer;font-weight:650}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}.grid .card{margin:0}nav{display:flex;gap:16px;flex-wrap:wrap}.feedback{font-weight:600}.pill{border-radius:50px;background:#e5f0d5;padding:7px 15px;display:inline-block;font-size:.85rem}.timing{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0}.timing span{background:#e8eeea;padding:6px 10px;border-radius:6px}@media(max-width:520px){main{padding:20px 15px}section{padding:20px}h1{font-size:2.2rem}}@media print{body{background:white}.lab,button{display:none}section{break-inside:avoid}main{max-width:none}}'''
def esc(x):return html.escape(str(x))
def page(title,body,js=''):
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><style>'+CSS+'</style></head><body><main>'+body+'</main><script>'+js+'</script></body></html>'
def render(folder):
 manifest=json.loads((R/'study-state.json').read_text());day=next(d for d in manifest['days'] if d['folder']==folder)
 lessons=json.loads((R/folder/'lessons.json').read_text());due=[]
 for prior in manifest['days']:
  if prior['number']>=day['number']:continue
  age=(date.fromisoformat(day['date'])-date.fromisoformat(prior['date'])).days
  # Include missed intervals once at the next generated date; prior deliveries record covered intervals.
  for offset in manifest['review_offsets_days']:
   key=f"{prior['folder']}+{offset}"
   previously={k for d in manifest['days'] if d['number']<day['number'] for k in d.get('review_keys',[])}
   if age>=offset and key not in previously:due.append((prior,key))
 # Two source topics per track fit the two-minute recall budget; defer the rest.
 due.sort(key=lambda pair: (date.fromisoformat(pair[0]['date'])+timedelta(days=int(pair[1].split('+')[1])),pair[0]['number']))
 chosen=[]
 for prior,key in due:
  if prior['folder'] not in chosen and len(chosen)<2: chosen.append(prior['folder'])
 due=[(p,k) for p,k in due if p['folder'] in chosen]
 day['review_keys']=sorted({k for _,k in due})
 for L in lessons:
  slug=L['slug'];qs=L['questions'];quiz=''
  for i,(q,options,answer,why) in enumerate(qs):
   quiz+=f'<fieldset><legend>{i+1}. {esc(q)}</legend>'+''.join(f'<label><input type="radio" name="q{i}" value="{j}"> {esc(o)}</label>' for j,o in enumerate(options))+f'<p id="feedback{i}" class="feedback" aria-live="polite"></p></fieldset>'
  sources=''.join(f'<li><a href="{esc(u)}">{esc(t)}</a> — {esc(d)}; checked {day["date"]}.</li>' for t,u,d in L['sources'])
  review=''
  seen=set()
  for prior,key in due:
   if prior['folder'] in seen:continue
   seen.add(prior['folder'])
   old=json.loads((R/prior['folder']/'lessons.json').read_text())
   p=next((x for x in old if x['track']==L['track']),None)
   if p:
    q,options,a,why=p['questions'][0]
    review+=f'<p><a href="../{prior["folder"]}/{p["slug"]}.html">{prior["folder"]}: {esc(p["title"])}</a></p><p>{esc(q)}</p><details><summary>Recall first, then reveal the refresher</summary><p>{esc(options[a])}. {esc(why)}</p></details>'
  if not review:review='<p>No earlier lessons are due yet. Start with the prediction exercise below. This topic returns after 1, 3, 7, 14, and 30 days.</p>'
  body=f'''<nav><a href="index.html">← {folder}</a><a href="../index.html">All days</a></nav><header><p class="eyebrow">{folder} / {esc(L['track'])}</p><h1>{esc(L['title'])}</h1><p class="lead">{esc(L['goal'])}</p><span class="pill">{esc(L['tag'])}</span><div class="timing"><span>2 min · Recall</span><span>4 min · Understand</span><span>5 min · Explore</span><span>4 min · Quiz</span></div></header><section><h2>Start with retrieval · 2 min</h2>{review}<label>Your recall or prediction<textarea id="recall" placeholder="Write before looking at the explanation."></textarea></label></section><section><h2>Build the mental model · 4 min</h2>{L['concept']}<h2>A worked example</h2>{L['example']}</section><section class="lab"><p class="eyebrow" style="color:#d6f4b5">Explore · 5 min</p><h2>Predict, change, explain</h2><p>{esc(L['practice'])}</p>{L['sim']}<details><summary>What this model does and does not represent</summary><p>{esc(L['boundary'])}</p></details></section><section><h2>Check understanding · 4 min</h2><p>Three scored questions plus two short responses keep this to 15 minutes. Commit to an answer before checking. The score records only the multiple-choice answers; it does not establish mastery.</p>{quiz}<button id="grade">Check 3 answers</button><p id="score" aria-live="polite"></p><label>4. Explain one design decision to a skeptical engineer.<textarea id="rationale"></textarea></label><label>5. Change one assumption. What breaks, and how would you detect it?<textarea id="boundaryAnswer"></textarea></label><button id="save">Save answers locally</button><button id="export">Export answers</button><p id="saved" aria-live="polite"></p><small>Local saving depends on your browser. Export downloads JSON; upload it in ChatGPT for feedback and targeted review. Nothing here sends answers to GitHub or ChatGPT. Do not put work secrets in these pages.</small></section><section><h2>Read the originals</h2><ul>{sources}</ul><p class="muted">Examples and calculator inputs are original, synthetic teaching material. Source dates distinguish established foundations from new research.</p></section><nav><a href="index.html">Back to {folder}</a></nav>'''
  js='''const $=id=>document.getElementById(id);'''+''.join(f'const {id}=$({json.dumps(id)});' for id in re.findall(r'id="([\w]+)"',L['sim']))+L['js']
  js+='\nconst quizData='+json.dumps(qs)+';const lessonKey='+json.dumps(folder+'/'+slug)+';'+'''
let attemptsHistory=[];
const capture=()=>({lesson:lessonKey,exported_at:new Date().toISOString(),answers:quizData.map((q,i)=>document.querySelector(`input[name="q${i}"]:checked`)?.value??null),recall:$('recall').value,rationale:$('rationale').value,boundary:$('boundaryAnswer').value,attempts:attemptsHistory});
$('grade').onclick=()=>{let score=0;const answers=capture().answers;if(answers.some(a=>a===null)){ $('score').textContent='Answer all three questions before checking.';return;}quizData.forEach((q,i)=>{const ok=Number(answers[i])===q[2];score+=ok?1:0;$('feedback'+i).textContent=(ok?'Correct. ':'Revisit. ')+q[3]});attemptsHistory.push({at:new Date().toISOString(),answers,score});$('score').textContent=`${score}/3 — ${score===3?'now explain your reasoning in your own words.':'revisit the example, then retake.'}`};
$('save').onclick=()=>{try{localStorage.setItem('study:'+lessonKey,JSON.stringify(capture()));$('saved').textContent='Saved in this browser.'}catch{$('saved').textContent='Local storage unavailable. Use Export answers.'}};
try{const s=JSON.parse(localStorage.getItem('study:'+lessonKey)||'null');if(s){['recall','rationale'].forEach(k=>$(k).value=s[k]||'');$('boundaryAnswer').value=s.boundary||'';s.answers.forEach((a,i)=>{if(a!==null){const el=document.querySelector(`input[name="q${i}"][value="${a}"]`);if(el)el.checked=true}});attemptsHistory=s.attempts||[]}}catch{}
$('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(capture(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=lessonKey.replace('/','-')+'-answers.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
'''
  (R/folder/f'{slug}.html').write_text(page(L['title'],body,js))
  plain=lambda s:html.unescape(re.sub('<[^>]+>','',re.sub(r'</(?:p|pre|h2)>', '\n\n', s)))
  md=f"# {L['title']}\n\n{L['track']} · {folder} · 15 minutes\n\n{L['goal']}\n\n## Recall (2 minutes)\n\n{review}\n\n## Understand (4 minutes)\n\n{plain(L['concept'])}\n\n{plain(L['example'])}\n\n## Explore (5 minutes)\n\n{L['practice']}\n\nOpen {slug}.html for the executable model.\n\nModel limits: {L['boundary']}\n\n## Quiz (4 minutes)\n\n"
  for i,(q,options,a,why) in enumerate(qs):md+=f'{i+1}. {q}\n'+''.join(f'   - {o}\n' for o in options)+'\n'
  md+='4. Explain one design decision to a skeptical engineer.\n5. Change one assumption. What breaks, and how would you detect it?\n\n<details><summary>Answer key — attempt first</summary>\n\n'+ '\n\n'.join(f'{i+1}. {o[a]}. {w}' for i,(q,o,a,w) in enumerate(qs))+'\n\n</details>\n\n## Sources\n\n'+''.join(f'- [{t}]({u}) — {d}; checked {day["date"]}.\n' for t,u,d in L['sources'])
  (R/folder/f'{slug}.md').write_text(md)
 cards=''.join(f'<article class="card"><p class="eyebrow">{esc(l["track"])}</p><h2><a href="{l["slug"]}.html">{esc(l["title"])}</a></h2><p>{esc(l["goal"])}</p><span class="pill">15 minutes</span></article>' for l in lessons)
 (R/folder/'index.html').write_text(page(folder,f'<nav><a href="../index.html">← All days</a></nav><header><p class="eyebrow">Engineering field notes / {day["date"]}</p><h1>{folder}: build a reliable mental model.</h1><p class="lead">Five lessons. 15 minutes each. Predict the behavior, explore an example, then retrieve what you learned.</p><p>75 minutes total. Each lesson includes its own recall and quiz time.</p></header><div class="grid">{cards}</div><section><h2>Make it stick</h2><p>Review intervals: 1, 3, 7, 14, and 30 days after delivery. Future lessons include due questions and refreshers. Export answers and upload them in ChatGPT to target weak areas. Generation does not imply completion.</p></section>'))
 (R/'study-state.json').write_text(json.dumps(manifest,indent=2)+'\n')
 cards=''.join(f'<article class="card"><h2><a href="{d["folder"]}/index.html">{d["folder"]}</a></h2><p>{d["date"]} · Five lessons · 75 minutes</p></article>' for d in reversed(manifest['days']))
 (R/'index.html').write_text(page('Engineering field notes',f'<header><p class="eyebrow">Daily study / five tracks</p><h1>Engineering field notes.</h1><p class="lead">A daily practice in systems, software, technical judgment, AI engineering, and emerging research.</p><p>New material is scheduled for 6:50 PM America/New_York. Open any day below. All lessons work offline once downloaded.</p></header><div class="grid">{cards}</div>'))
if __name__=='__main__':render(sys.argv[1] if len(sys.argv)>1 else 'Day1')
