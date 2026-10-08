// Concept-specific visual checks use synthetic lesson data only.
const {test,expect}=require('@playwright/test');
const slugs=['data-engineering','software-engineering','distinguished-engineer','genai-engineering','technology-breakthroughs','ci-cd-github-actions','apis-microservices'];
async function setRange(control,steps){await control.focus();await control.press('Home');for(let i=0;i<steps;i++)await control.press('ArrowRight');}
for(const slug of slugs){
 test('Day17 visual reasoning: '+slug,async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/Day17/'+slug+'.html');
  if(await page.locator('#coreExtension').count()) await page.locator('#coreExtension > summary').click();
  const world=page.locator('#world'),lab=page.locator('.lab');
  if(slug==='data-engineering'){
   await page.locator('#checkpointNext').click();
   await expect(page.locator('.cp-durable')).toContainText('R1 +2');
   await page.locator('#checkpointNext').click();
   await expect(page.locator('.cp-memory .cp-total')).toHaveText('lost');
   await expect(page.locator('.cp-durable .cp-total')).toHaveText('10');
   await lab.screenshot({path:testInfo.outputPath('checkpoint-crash.png')});
   await page.locator('#checkpointNext').click();
   await page.locator('#checkpointNext').click();
   await expect(page.locator('.cp-memory .cp-total')).toHaveText('12');
   await expect(page.locator('.cp-memory .cp-record')).toHaveCount(1);
   await page.locator('#checkpointNext').click();
   await page.locator('#checkpointNext').click();
   await expect(world).toContainText('Restored total: 14');
   await page.locator('#checkpointMode').selectOption('aligned');
   await page.locator('#checkpointNext').click();
   await expect(page.locator('.cp-durable .cp-total')).toHaveText('14');
   await expect(page.locator('.cp-durable .cp-record')).toHaveCount(0);
   await page.locator('#checkpointMode').selectOption('broken');
   for(let i=0;i<4;i++)await page.locator('#checkpointNext').click();
   await expect(world).toContainText('Lost contribution: 4');
  }
  if(slug==='software-engineering'){
   await expect(page.locator('#bitView svg')).toHaveAttribute('aria-label',/positions 1 and 4/);
   await expect(page.locator('.bf-path')).toContainText('ID 1 set both');
   await page.locator('#trustMaybe').check();
   await expect(page.locator('.bf-path')).toContainText('Wrong answer');
   await page.locator('#lookupId').selectOption('3');
   await expect(page.locator('.bf-path')).toContainText('One zero');
   await page.locator('#lookupId').selectOption('9');
   await page.locator('#trustMaybe').uncheck();
  }
  if(slug==='distinguished-engineer'){
   await expect(page.locator('#effortView svg')).toHaveAttribute('data-payback-weeks','8.0');
   const original=await page.locator('[data-effort-line="manual"]').getAttribute('d');
   await setRange(page.locator('#requestVolume'),5);
   await expect(page.locator('#effortView svg')).toHaveAttribute('data-payback-weeks','never');
   await expect(page.locator('#effortView figcaption')).toContainText('parallel');
   expect(await page.locator('[data-effort-line="manual"]').getAttribute('d')).not.toBe(original);
   await setRange(page.locator('#requestVolume'),20);
  }
  if(slug==='genai-engineering'){
   await expect(page.locator('#trialView .trial-matrix tbody tr')).toHaveCount(4);
   await expect(page.locator('.trial-count').nth(0)).toContainText('3/4');
   await expect(page.locator('.trial-count').nth(1)).toContainText('1/4');
   await page.locator('#flipTrial').click();
   await expect(page.locator('.trial-count').nth(0)).toContainText('3/4');
   await expect(page.locator('.trial-count').nth(1)).toContainText('2/4');
   await expect(page.locator('.trial-focus')).toHaveText('Pass');
  }
  if(slug==='technology-breakthroughs'){
   const charge=await page.locator('[data-energy-bar="charge-return"]').getAttribute('width');
   const useful=await page.locator('[data-energy-bar="useful"]').getAttribute('width');
   await setRange(page.locator('#outVoltage'),0);
   await expect(page.locator('#energyView svg')).toHaveAttribute('data-useful-energy','6.93');
   await expect(page.locator('[data-energy-bar="charge-return"]')).toHaveAttribute('width',charge);
   expect(Number(await page.locator('[data-energy-bar="useful"]').getAttribute('width'))).toBeLessThan(Number(useful));
   await setRange(page.locator('#auxEnergy'),2);
   await expect(page.locator('#energyView svg')).toHaveAttribute('data-system-input','16');
   await expect(page.locator('#energyView svg')).toHaveAttribute('data-useful-energy','6.93');
  }
  if(slug==='ci-cd-github-actions'){
   await page.locator('#enqueueRun').click();await page.locator('#enqueueRun').click();
   const single=page.locator('.deploy-policy').nth(0),max=page.locator('.deploy-policy').nth(1);
   await expect(single.locator('.deploy-waiting .deploy-run')).toHaveText(['R3']);
   await expect(single.locator('.deploy-canceled')).toHaveText('R2');
   await expect(max.locator('.deploy-waiting .deploy-run')).toHaveText(['R2','R3']);
   await lab.screenshot({path:testInfo.outputPath('queue-policies.png')});
   await page.locator('#finishRun').click();
   await expect(single.locator('.deploy-running .deploy-run')).toHaveText('R3');
   await expect(max.locator('.deploy-running .deploy-run')).toHaveText('R2');
  }
  if(slug==='apis-microservices'){
   await expect(page.locator('.pg-cursor')).toContainText('(10,B)');
   await expect(page.locator('.pg-method').nth(0)).toContainText('B,C');
   await expect(page.locator('.pg-method').nth(1)).toContainText('C,D');
   await lab.screenshot({path:testInfo.outputPath('pagination-shift.png')});
   await page.locator('#pageScenario').selectOption('tie');
   await expect(page.locator('.pg-method').nth(1)).toContainText('(10,B) follows (10,A)');
   await expect(page.locator('.pg-bookmark').last()).toContainText('skips B');
  }
  await lab.scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await lab.screenshot({path:testInfo.outputPath('concept-model.png')});
  await page.locator('main > section').nth(1).screenshot({path:testInfo.outputPath('concept-explanation.png')});
  expect(errors).toEqual([]);
 });
}

