"""Rebuild Day10 with the shared renderer and its plain-language visual additions."""
import sys,json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(R/'scripts'))
import render
render.CSS+='''.diagram{padding:20px;background:#edf4ee;border-radius:14px;margin:22px 0}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.tile{padding:18px;border:2px solid #779e91;border-radius:12px;background:#f5faf5;color:#183a35;overflow-wrap:anywhere}.tile p{margin-bottom:0}.dbgroup{border:3px solid #387966;border-radius:14px;padding:18px}.dbgroup .tiles{margin-top:12px}.arrow{text-align:center;font-weight:700}.active{background:#d6f4b5;border-color:#e1a02e;box-shadow:0 0 0 3px #e1a02e}.meter{height:28px;background:#dce5de;border-radius:6px;overflow:hidden}.meter>div{height:100%;background:#247a68;transition:width .2s}code{overflow-wrap:anywhere}.lab .tile{font-size:1rem}.lab input[type=checkbox]{width:20px;height:20px;vertical-align:middle}@media(max-width:600px){.tiles{grid-template-columns:1fr}}'''
render.render('Day10')
lessons=json.loads((R/'Day10/lessons.json').read_text())
for L in lessons:
 for ext in ['html','md']:
  p=R/'Day10'/f'{L["slug"]}.{ext}';s=p.read_text().replace('checked 2026-09-30','checked 2026-09-29').replace('Start with retrieval · 2 min','Recall earlier lessons · 2 min').replace('Build the mental model · 4 min','Understand the idea · 4 min')
  s=s.replace('Explain one design decision to a skeptical engineer.',L['written_questions'][0]).replace('Change one assumption. What breaks, and how would you detect it?',L['written_questions'][1])
  p.write_text(s)
p=R/'Day10/index.html';s=p.read_text().replace('Day10: build a reliable mental model.','Day10: see what changes.').replace('Five lessons. 15 minutes each. Predict the behavior, explore an example, then retrieve what you learned.','Plain language. Real examples. Click to send, crash, retry, route, and check. Five lessons, 15 minutes each.')
s=s.replace('<div class="grid">','<p>Prepared in advance for September 30 at your request. Sources checked September 29.</p><div class="grid">',1);p.write_text(s)
