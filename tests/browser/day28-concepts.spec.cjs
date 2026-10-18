const {test,expect}=require('@playwright/test');
const {openLesson,expectNoHorizontalOverflow}=require('./bundle.cjs');
test('Day28 concept worlds respond and remain readable',async({page})=>{
 await openLesson(page,'Day28/data-engineering.html');await expect(page.locator('#repairGraph')).toContainText('100 business keys');await page.selectOption('#repairMode','append');await expect(page.locator('#repairGraph')).toContainText('160');await expectNoHorizontalOverflow(page);
 await openLesson(page,'Day28/software-engineering.html');await expect(page.locator('#poolWorld')).toContainText('none');await page.locator('#parents').fill('1');await expect(page.locator('#poolWorld')).toContainText('a child can start');
 await openLesson(page,'Day28/genai-engineering.html');await expect(page.locator('#memoryWorld')).toContainText('QUARANTINE');await page.selectOption('#memSource','user');await page.selectOption('#memType','preference');await expect(page.locator('#memoryWorld')).toContainText('ACCEPT + TTL');
 await openLesson(page,'Day28/technology-breakthroughs.html');await page.locator('#topCurrent').fill('17');await expect(page.locator('#tandemWorld')).toContainText('Perovskite limits');
 await openLesson(page,'Day28/ci-cd-github-actions.html');await page.locator('#budget').fill('30');await expect(page.locator('#summaryWorld')).toContainText('DEPLOY');
 await openLesson(page,'Day28/apis-microservices.html');await page.locator('#hasIban').check();await expect(page.locator('#schemaWorld')).toContainText('INVALID: 2 matches');await expectNoHorizontalOverflow(page);
});
