const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
async function fits(page){
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 const clipped=await page.locator('.mechanism svg text').evaluateAll(ts=>ts.filter(t=>{const a=t.getBoundingClientRect(),b=t.ownerSVGElement.getBoundingClientRect();return a.left<b.left-2||a.right>b.right+2||a.top<b.top-2||a.bottom>b.bottom+2;}).map(t=>t.textContent));expect(clipped).toEqual([]);
}
for(const slug of ['data-engineering','software-engineering','distinguished-engineer','genai-engineering','technology-breakthroughs','ci-cd-github-actions','apis-microservices'])test('Day18 mechanism '+slug,async({page},info)=>{
 await page.goto('/Day18/'+slug+'.html');
 if(slug==='data-engineering')await page.locator('#coreExtension > summary').click();
 const world=page.locator('#world');await expect(world).not.toBeEmpty();
 if(slug==='data-engineering'){
  await expect(world).toContainText('denied');await page.locator('#gateMode').selectOption('granted');await expect(world).toContainText('sum 50');await page.locator('#tableChoice').selectOption('payroll');await expect(world).toContainText('denied');
 }
 if(slug==='software-engineering'){
  for(let i=0;i<3;i++)await page.locator('#sendRequest').click();await expect(world).toContainText('Refused before DB: R3');await expect(world.locator('.slot.busy')).toHaveCount(2);
  await page.locator('#finishRequest').click();await expect(world.locator('.slot.free')).toHaveCount(1);
  await page.locator('#releasePolicy').selectOption('leak');await page.locator('#sendRequest').click();await page.locator('#finishRequest').click();await expect(world).toContainText('leaked: 1');
 }
 if(slug==='distinguished-engineer'){
  await expect(page.locator('#acceptDecision')).toBeDisabled();await page.locator('#freshness').selectOption('0.25');await expect(world).toContainText('ADR-8: proposed');await page.locator('#acceptDecision').click();await expect(world).toContainText('ADR-7: superseded');await expect(world).toContainText('ADR-8: accepted');
 }
 if(slug==='genai-engineering'){
  await expect(world).toContainText('Reported passes: 2/2');await page.locator('#workspaceMode').selectOption('fresh');await expect(world).toContainText('Reported passes: 1/2');await expect(world).toContainText('FAIL — report absent');
 }
 if(slug==='technology-breakthroughs'){
  await expect(world).toContainText('Final output: A 60%, B 40%');await page.locator('#correction').selectOption('blind');await expect(world).toContainText('Final output: A 80%, B 20%');await page.locator('#draftShape').selectOption('0.4');await page.locator('#correction').selectOption('correct');await expect(world).toContainText('Final output: A 60%, B 40%');
  const bars=await world.locator('.barrow .barpart:first-child').evaluateAll(ns=>ns.map(n=>n.style.width));expect(bars).toEqual(['60%','40%','60%']);
 }
 if(slug==='ci-cd-github-actions'){
  await expect(world).toContainText('Sibling cancellation: false');await page.locator('#failedLane').selectOption('J17');await expect(world).toContainText('Sibling cancellation: true');await page.locator('#failFast').selectOption('false');await expect(world).toContainText('Required failure present: true');await expect(world).not.toContainText('CANCELED');
 }
 if(slug==='apis-microservices'){
  await page.locator('#jobNext').click();await page.locator('#jobNext').click();await expect(world).toContainText('HTTP 200; job state: failed');await expect(world).toContainText('Original POST: 202');await page.locator('#jobOutcome').selectOption('succeeded');await page.locator('#jobNext').click();await page.locator('#jobNext').click();await expect(world).toContainText('Download ready');
 }
 await fits(page);await world.screenshot({path:info.outputPath(slug+'.png')});
});
test('Day18 product grants, code highlight and private answers',async({page},info)=>{
 await page.goto('/Day18/data-engineering.html');await fits(page);
 for(let i=0;i<4;i++)await page.locator('#dbNext').click();await expect(page.locator('#dbState')).toContainText('sum 50');await expect(page.locator('#dbLine3')).toHaveClass('active');
 await page.locator('#dbMissing').selectOption('schema');for(let i=0;i<4;i++)await page.locator('#dbNext').click();await expect(page.locator('#dbState')).toContainText('denied');await fits(page);await page.locator('#dbMap').screenshot({path:info.outputPath('db-missing-schema.png')});
 for(let i=0;i<6;i++)await page.locator('#sfNext').click();await expect(page.locator('#sfState')).toContainText('sum 50');await expect(page.locator('#sfLine5')).toHaveClass('active');
 await page.locator('#sfMissing').selectOption('warehouse');for(let i=0;i<6;i++)await page.locator('#sfNext').click();await expect(page.locator('#sfState')).toContainText('warehouse unavailable');await fits(page);await page.locator('#sfMap').screenshot({path:info.outputPath('sf-missing-warehouse.png')});
 await page.locator('#productGrade').click();await expect(page.locator('#productScore')).toContainText('Answer both');await page.locator('#productQ0').selectOption('0');await page.locator('#productQ1').selectOption('0');await page.locator('#productGrade').click();await expect(page.locator('#productScore')).toContainText('1/2');await page.locator('#productQ1').selectOption('1');await page.locator('#productGrade').click();await expect(page.locator('#productScore')).toContainText('2/2');
 await page.locator('#save').click();await page.reload();await expect(page.locator('#productQ1')).toHaveValue('1');
 const pending=page.waitForEvent('download');await page.locator('#export').click();const download=await pending;const data=JSON.parse(fs.readFileSync(await download.path(),'utf8'));await download.delete();expect(data.product_assessment.attempts.map(a=>a.score)).toEqual([1,2]);expect(data.product_assessment.answers).toEqual(['0','1']);
});
