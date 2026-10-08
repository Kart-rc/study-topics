"""Render authored product comparisons; never executes remote product code."""
import html,json
from datetime import date,timedelta
def reviews(root,day):
 """Up to one prior product pair, using its actual addition date."""
 path=root/'certification-plan.json'
 if not path.exists():return ''
 plan=json.loads(path.read_text());deliveries=plan.get('product_review_deliveries',[])
 prior_keys={d['key'] for d in deliveries if d['day_number']<day['number']}
 due=[]
 for item in plan.get('coverage',[]):
  if item['lesson'].split('/')[0]==day['folder']:continue
  added=date.fromisoformat(item['product_material_added_on'])
  for offset in plan['review_offsets_days']:
   key=item['lesson']+'+products+'+str(offset)
   due_date=added+timedelta(days=offset)
   if due_date<=date.fromisoformat(day['date']) and key not in prior_keys:due.append((due_date,key,item))
 if not due:return ''
 _,key,item=sorted(due,key=lambda x:(x[0],x[1]))[0]
 folder,slug=item['lesson'].split('/')
 old=next(l for l in json.loads((root/folder/'lessons.json').read_text()) if l['slug']==slug)
 result='<p>Product recall from <a href="../'+folder+'/'+slug+'.html">'+folder+'</a>; product material added '+item['product_material_added_on']+'.</p>'
 for q,opts,a,why in old['product_questions']:
  result+='<p>'+html.escape(q)+'</p><details><summary>Recall first, then reveal the product refresher</summary><p>'+html.escape(opts[a]+'. '+why)+'</p></details>'
 deliveries=[d for d in deliveries if d['day_number']!=day['number']]
 deliveries.append({'day_number':day['number'],'date':day['date'],'key':key})
 plan['product_review_deliveries']=deliveries
 path.write_text(json.dumps(plan,indent=2)+'\n')
 return result
def block(lesson,review=''):
 sections=lesson.get('product_sections',[])
 if not sections:return ''
 out=''.join('<section class="product-lesson" id="product-'+s['id']+'"><p class="eyebrow">'+str(s['minutes'])+' minutes · product implementation</p><h2>'+html.escape(s['title'])+'</h2>'+s['html']+'</section>' for s in sections)
 if review:out='<section><h2>Product recall</h2><p>Use the first minute of each nine-minute product block for these refreshers.</p>'+review+'</section>'+out
 out+='<section id="productComparison"><h2>Compare and predict · 2 min</h2>'+lesson['product_comparison']['html']
 for i,(q,opts,a,why) in enumerate(lesson['product_questions']):
  out+='<label class="product-question" for="productQ'+str(i)+'">'+html.escape(q)+'</label><select id="productQ'+str(i)+'"><option value="">Choose before checking</option>'+''.join('<option value="'+str(j)+'">'+html.escape(o)+'</option>' for j,o in enumerate(opts))+'</select><p id="productFeedback'+str(i)+'" aria-live="polite"></p>'
 out+='<button id="productGrade">Check product predictions</button><p id="productScore" aria-live="polite"></p><p>Your existing Save/Export buttons also include these product answers. The original three-question quiz keeps its own score.</p></section>'
 alignment=lesson['certification_alignment'];checked=html.escape(alignment['checked_on'])
 scopes=''.join('<p><strong>'+product.title()+':</strong> '+html.escape(alignment[product]['scope'])+'</p>' for product in ['databricks','snowflake'])
 out+='<section><h2>Certification connection</h2>'+scopes+'<p><a href="../CERTIFICATION_ROADMAP.md">Read the certification roadmap and readiness checks</a></p><h3>Product sources · checked '+checked+'</h3><ul>'+''.join('<li><a href="'+html.escape(u)+'">'+html.escape(t)+'</a> — '+html.escape(d)+'; checked '+checked+'.</li>' for t,u,d in lesson['product_sources'])+'</ul><p>Product lab execution: '+html.escape(alignment['product_lab_execution'])+'. See each model’s stated limits.</p></section>'
 return out
def markdown(lesson,review=''):
 if not lesson.get('product_sections'):return ''
 s='\n'.join('## '+p['title']+' · '+str(p['minutes'])+' minutes\n\n'+p['markdown']+'\n' for p in lesson['product_sections'])
 if review:s='## Product recall\n\nUse the first minute of each nine-minute product block.\n\n'+review+'\n\n'+s
 s+='\n## Compare and predict (2 minutes)\n\n'+lesson['product_comparison']['markdown']+'\n\n'
 for q,opts,a,why in lesson['product_questions']:
  s+=q+'\n\n'+''.join('- '+o+'\n' for o in opts)+'\n<details><summary>Reveal after predicting</summary>\n\n'+opts[a]+'. '+why+'\n\n</details>\n\n'
 a=lesson['certification_alignment']
 s+='## Certification connection\n\n'+a['databricks']['scope']+' '+a['snowflake']['scope']+' [Roadmap](../CERTIFICATION_ROADMAP.md). Product lab execution: '+a['product_lab_execution']+'.\n\n'+''.join('- ['+t+']('+u+') — '+d+'; checked '+a['checked_on']+'.\n' for t,u,d in lesson['product_sources'])+'\n'
 return s
def javascript(lesson):
 if not lesson.get('product_sections'):return ''
 return '\n'.join(p['javascript'] for p in lesson['product_sections'])+'\nconst productQuestions='+json.dumps(lesson['product_questions'])+''';
let productAttempts=[];
function productCapture(){return {answers:productQuestions.map((q,i)=>$('productQ'+i).value||null),attempts:productAttempts};}
$('productGrade').onclick=()=>{const a=productCapture().answers;if(a.some(x=>x===null)){$('productScore').textContent='Answer both product questions first.';return;}let score=0;productQuestions.forEach((q,i)=>{const ok=Number(a[i])===q[2];if(ok)score++;$('productFeedback'+i).textContent=(ok?'Correct. ':'Revisit. ')+q[3]});productAttempts.push({at:new Date().toISOString(),answers:a,score});$('productScore').textContent=score+'/2 product predictions — explain why before calling this learned.';};
try{const prior=JSON.parse(localStorage.getItem('study:'+lessonKey)||'null')?.product_assessment;if(prior){prior.answers.forEach((a,i)=>{if($('productQ'+i))$('productQ'+i).value=a??'';});productAttempts=prior.attempts||[];}}catch{}
'''
