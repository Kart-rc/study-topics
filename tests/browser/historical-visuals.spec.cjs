// Bounded historical visual sweep, only when an explicit tranche is requested.
const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'../..');
const range=process.env.STUDY_VISUAL_DAYS,days=[];
if(range){
 const m=range.match(/^(\d+)-(\d+)$/);
 if(!m||+m[1]<1||+m[2]>16||+m[2]<+m[1]||+m[2]-+m[1]>5)throw Error('Expected bounded range within Days1–16');
 for(let d=+m[1];d<=+m[2];d++)days.push(d);
}
for(const day of days)for(const lesson of JSON.parse(fs.readFileSync(path.join(root,'Day'+day,'lessons.json')))){
 test('Day'+day+'/'+lesson.slug+': visual learning and retained quiz',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname==='127.0.0.1'||['blob:','data:'].includes(u.protocol))return route.continue();errors.push('Unexpected external request');return route.abort();});
  const response=await page.goto('/Day'+day+'/'+lesson.slug+'.html');expect(response.status()).toBe(200);
  expect(lesson.visual_explanation?.length).toBeGreaterThan(40);
  await expect(page.locator('h1')).toHaveText(lesson.title);await expect(page.locator('#world')).not.toBeEmpty();
  const layout=async()=>{
   const r=await page.evaluate(()=>{const width=document.documentElement.clientWidth;return {overflow:document.documentElement.scrollWidth-width,controls:[...document.querySelectorAll('button,input,select,textarea')].filter(e=>e.getClientRects().length).filter(e=>{const b=e.getBoundingClientRect();return b.left<0||b.right>width+1;}).map(e=>e.id)};});
   expect(r.overflow,'Page overflow').toBeLessThanOrEqual(1);expect(r.controls,'Controls outside viewport').toEqual([]);
   const clipped=await page.locator('svg text').evaluateAll(items=>items.filter(t=>{const a=t.getBoundingClientRect(),b=t.ownerSVGElement.getBoundingClientRect();return a.width>0&&(a.left<b.left-2||a.right>b.right+2||a.top<b.top-2||a.bottom>b.bottom+2);}).map(t=>t.textContent));
   expect(clipped,'SVG labels must remain inside the diagram').toEqual([]);
  };
  await layout();const lab=page.locator('.lab');
  await lab.screenshot({path:testInfo.outputPath('model-default.png')});
  await page.locator('main > section').nth(1).screenshot({path:testInfo.outputPath('concept.png')});
  const controls=lab.locator('input[type="range"], input[type="checkbox"], select, button');
  expect(await controls.count()).toBeLessThanOrEqual(24);let changed=false;
  for(const c of await controls.all()){
   if(!await c.isEnabled())continue;
   const before=await lab.innerText(),tag=await c.evaluate(e=>e.tagName),type=await c.getAttribute('type');
   if(tag==='SELECT'){
    const options=await c.locator('option:not([disabled])').evaluateAll(os=>os.map(o=>o.value));
    for(const value of [...new Set([options.at(-1),options[0]])]){await c.selectOption(value);changed ||= before!==await lab.innerText();}
   }else if(type==='range'){await c.focus();await c.press('End');changed ||= before!==await lab.innerText();await c.press('Home');}
   else await c.click();
   changed ||= before!==await lab.innerText();
  }
  expect(changed,'Model responds visibly').toBe(true);await layout();
  await lab.screenshot({path:testInfo.outputPath('model-changed.png')});
  await page.locator('#traceNext').click();
  await expect(page.locator('#tracePosition')).toHaveText('Step 1 of '+lesson.walkthrough.frames.length);
  const actual=await page.locator('#traceState .state-value').evaluateAll(rs=>Object.fromEntries(rs.map(r=>[r.querySelector('strong').textContent,JSON.parse(r.querySelector('code').textContent)])));
  expect(actual).toEqual(lesson.walkthrough.frames[0].state);
  await page.locator('#grade').click();await expect(page.locator('#score')).toContainText('Answer all three');
  for(let i=0;i<3;i++)await page.locator('input[name="q'+i+'"][value="'+lesson.questions[i][2]+'"]').check();
  await page.locator('#grade').click();await expect(page.locator('#score')).toContainText('3/3');
  await page.locator('#rationale').fill('Synthetic historical visual regression');
  await page.locator('#save').click();await page.reload();
  await expect(page.locator('#rationale')).toHaveValue('Synthetic historical visual regression');
  const pending=page.waitForEvent('download');await page.locator('#export').click();const download=await pending;
  const data=JSON.parse(fs.readFileSync(await download.path(),'utf8'));await download.delete();
  expect(data.lesson).toBe('Day'+day+'/'+lesson.slug);expect(data.attempts[0].score).toBe(3);expect(errors).toEqual([]);
 });
}

