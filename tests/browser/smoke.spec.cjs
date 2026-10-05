const { test: base, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const { day, lessons, pages } = require('./bundle.cjs').discoverBundle();
const origin = 'http://127.0.0.1:4173';

// Every test gets Playwright's new, non-persistent context. Never load a profile,
// exported learner answers, storageState, secrets, or a remote lesson URL.
const test = base.extend({
  browserHealth: [async ({ page, context }, use) => {
    const errors = [];
    page.on('pageerror', error => errors.push(`JavaScript: ${error.message}`));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(`Console: ${message.text()}`);
    });
    page.on('response', response => {
      if (response.url().startsWith(origin + '/') && response.status() >= 400)
        errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    page.on('requestfailed', request => {
      if (new URL(request.url()).origin === origin) errors.push(`Request failed: ${request.url()}`);
    });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin || ['blob:', 'data:'].includes(url.protocol))
        return route.continue();
      errors.push(`Unexpected external request: ${url.origin}`);
      return route.abort('blockedbyclient');
    });
    await use();
    expect(errors, 'Browser errors or unexpected network activity').toEqual([]);
  }, { auto: true }],
});

async function assertLayout(page) {
  await expect(page.locator('h1')).toBeVisible();
  const overflow = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return {
      document: document.documentElement.scrollWidth - width,
      controls: [...document.querySelectorAll('button, input, select, textarea, summary')]
        .filter(el => el.getClientRects().length)
        .filter(el => { const box = el.getBoundingClientRect(); return box.left < -1 || box.right > width + 1; })
        .map(el => el.id || el.tagName),
    };
  });
  expect(overflow.document, 'Page must not scroll horizontally').toBeLessThanOrEqual(1);
  expect(overflow.controls, 'Controls must fit the viewport').toEqual([]);
}

async function assertLocalLinks(page, request) {
  const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => a.href));
  const local = [...new Set(links)].map(href => new URL(href)).filter(url => url.origin === origin);
  expect(local.length, 'Bound local link work per page').toBeLessThanOrEqual(200);
  const fetched = new Map();
  for (const url of local) {
    const fragment = decodeURIComponent(url.hash.slice(1));
    url.hash = '';
    const target = url.href;
    if (!fetched.has(target)) {
      const response = await request.get(target, { timeout: 5_000, maxRedirects: 0 });
      expect(response.status(), `Broken local link: ${target}`).toBe(200);
      fetched.set(target, await response.text());
    }
    if (fragment) {
      const exists = await page.evaluate(({ html, fragment }) => {
        const document = new DOMParser().parseFromString(html, 'text/html');
        return !!document.getElementById(fragment) || [...document.querySelectorAll('a[name]')]
          .some(anchor => anchor.getAttribute('name') === fragment);
      }, { html: fetched.get(target), fragment });
      expect(exists, `Missing fragment: ${target}#${fragment}`).toBe(true);
    }
  }
}

async function exportAnswers(page) {
  const pending = page.waitForEvent('download');
  await page.locator('#export').click();
  const download = await pending;
  expect(await download.failure()).toBeNull();
  // Read the actual Chromium download, not a mocked Blob or click handler.
  const payload = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  const filename = download.suggestedFilename();
  await download.delete(); // Do not retain answer JSON in reports/artifacts.
  return { payload, filename };
}

test('root navigation opens the latest daily hub', async ({ page, request }, testInfo) => {
  await page.goto('/index.html');
  await assertLocalLinks(page, request);
  await page.locator(`a[href="${day}/index.html"]`).click();
  await expect(page).toHaveURL(`${origin}/${day}/index.html`);
  for (const lesson of lessons)
    await expect(page.locator(`a[href="${lesson.slug}.html"]`)).toBeVisible();
  await assertLayout(page);
  await page.screenshot({ path: testInfo.outputPath('hub.png') });
});

for (const file of pages) {
  test(`${day}/${file}: render, links and interactions`, async ({ page, request }, testInfo) => {
    await page.goto(`/${day}/${file}`);
    await assertLayout(page);
    await assertLocalLinks(page, request);
    await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
    const lesson = lessons.find(item => `${item.slug}.html` === file);
    if (!lesson) return; // The hub/extra HTML still receives render/link/error checks.

    // Refresher and model-limit disclosures must really open and close in Chromium.
    const details = page.locator('details');
    expect(await details.count()).toBeGreaterThan(0);
    for (const disclosure of await details.all()) {
      await expect(disclosure).not.toHaveAttribute('open', '');
      await disclosure.locator('summary').click();
      await expect(disclosure).toHaveAttribute('open', '');
      await expect(disclosure.locator('p').first()).toBeVisible();
      await disclosure.locator('summary').click();
      await expect(disclosure).not.toHaveAttribute('open', '');
    }

    if (lesson.walkthrough) await checkWalkthrough(page, lesson.walkthrough);

    // Exercise actual controls with keyboard/click input, without invoking handlers.
    const world = page.locator('#world');
    await expect(world).not.toBeEmpty();
    const controls = page.locator('.lab input[type="range"], .lab input[type="checkbox"], .lab select, .lab button');
    expect(await controls.count()).toBeGreaterThan(0);
    expect(await controls.count()).toBeLessThanOrEqual(20);
    let changed = false;
    for (const control of await controls.all()) {
      const before = await world.innerText();
      const type = await control.getAttribute('type');
      const tag = await control.evaluate(el => el.tagName);
      if (tag === 'SELECT') {
        const options = await control.locator('option:not([disabled])').evaluateAll(items => items.map(item => item.value));
        expect(options.length, 'Bound select interaction work').toBeLessThanOrEqual(20);
        for (const value of options) {
          await control.selectOption(value);
          changed ||= before !== await world.innerText();
        }
      } else if (type === 'range') {
        await control.focus();
        await control.press('End');
        changed ||= before !== await world.innerText();
        await control.press('Home');
      } else {
        await control.click();
      }
      changed ||= before !== await world.innerText();
    }
    expect(changed, 'At least one model control must change the rendered result').toBe(true);
    await assertLayout(page);
    await page.locator('.lab').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath('interactive-model.png') });
    await page.reload(); // Return model to defaults before the scored scenario checks.

    if (day === 'Day7') await checkDay7Model(page, lesson.slug);
    if (day === 'Day14') await checkDay14Model(page, lesson.slug);
    await assertLayout(page);

    // Empty AND partial quizzes must not disclose feedback or record attempts.
    for (const partiallyAnswered of [false, true]) {
      if (partiallyAnswered) await page.locator('input[name="q0"][value="0"]').check();
      await page.locator('#grade').click();
      await expect(page.locator('#score')).toContainText('Answer all three');
      for (let i = 0; i < 3; i++) await expect(page.locator(`#feedback${i}`)).toBeEmpty();
    }
    expect((await exportAnswers(page)).payload.attempts).toEqual([]);

    const correct = lesson.questions.map(question => String(question[2]));
    const wrong = lesson.questions.map(question => String((question[2] + 1) % question[1].length));
    const mixed = [wrong[0], ...correct.slice(1)];
    for (const [answers, score] of [[wrong, 0], [correct, 3], [mixed, 2]]) {
      for (let i = 0; i < answers.length; i++)
        await page.locator(`input[name="q${i}"][value="${answers[i]}"]`).check();
      await page.locator('#grade').click();
      await expect(page.locator('#score')).toHaveText(new RegExp(`^${score}/3`));
      for (let i = 0; i < answers.length; i++) {
        await expect(page.locator(`#feedback${i}`)).toContainText(
          answers[i] === correct[i] ? 'Correct.' : 'Revisit.');
      }
    }
    const responses = {
      recall: 'Synthetic CI recall', rationale: 'Synthetic CI rationale',
      boundary: 'Synthetic CI boundary',
    };
    await page.locator('#recall').fill(responses.recall);
    await page.locator('#rationale').fill(responses.rationale);
    await page.locator('#boundaryAnswer').fill(responses.boundary);
    await page.locator('#save').click();
    await expect(page.locator('#saved')).toHaveText('Saved in this browser.');
    await page.reload();
    await expect(page.locator('#recall')).toHaveValue(responses.recall);
    await expect(page.locator('#rationale')).toHaveValue(responses.rationale);
    await expect(page.locator('#boundaryAnswer')).toHaveValue(responses.boundary);
    for (let i = 0; i < mixed.length; i++)
      await expect(page.locator(`input[name="q${i}"][value="${mixed[i]}"]`)).toBeChecked();
    const { payload, filename } = await exportAnswers(page);
    expect(filename).toBe(`${day}-${lesson.slug}-answers.json`);
    expect(payload).toMatchObject({ lesson: `${day}/${lesson.slug}`, answers: mixed, ...responses });
    expect(payload.attempts.map(attempt => attempt.score)).toEqual([0, 3, 2]);
    expect(payload.attempts.map(attempt => attempt.answers)).toEqual([wrong, correct, mixed]);
    expect(Number.isNaN(Date.parse(payload.exported_at))).toBe(false);
    await assertLayout(page);
    await page.locator('nav a[href="index.html"]').first().click();
    await expect(page).toHaveURL(`${origin}/${day}/index.html`);
    await page.goBack();
    await expect(page.locator('#rationale')).toHaveValue(responses.rationale);
    await page.goForward();
    await expect(page).toHaveURL(`${origin}/${day}/index.html`);
  });
}

// Known model boundaries supplement the generic future-bundle interaction checks.
// Keep new lesson-specific expectations here, not in the teaching HTML.
async function checkDay7Model(page, slug) {
  const world = page.locator('#world');
  if (slug === 'data-engineering') {
    await expect(world).toContainText('ELIGIBLE stateless shape');
    await page.locator('#stateful').check();
    await expect(world).toContainText('INELIGIBLE');
    await page.locator('#stateful').uncheck();
    await page.locator('#inputRate').focus();
    await page.locator('#inputRate').press('End');
    await expect(world).toContainText('OVERLOADED');
  } else if (slug === 'software-engineering') {
    await expect(world).toContainText('Child budget: 360 ms');
    await page.locator('#propagate').uncheck();
    await expect(world).toContainText('Work after caller budget: 60 ms');
  } else if (slug === 'distinguished-engineer') {
    await expect(world).toContainText('Admitted critical: 60/60');
    await page.locator('#priority').uncheck();
    await expect(world).toContainText('Admitted critical: 42/60');
  } else if (slug === 'genai-engineering') {
    await expect(world).toContainText('Outcome: MET');
    await page.locator('#fixRate').focus();
    await page.locator('#fixRate').press('Home');
    await expect(world).toContainText('STALLED');
    await page.locator('#evaluator').uncheck();
    await expect(world).toContainText('UNVERIFIED SELF-REPORT');
  } else if (slug === 'technology-breakthroughs') {
    await expect(world).toContainText('Total gate time: 17.0 μs');
    await page.locator('#gateCount').focus();
    await page.locator('#gateCount').press('End');
    await expect(world).not.toContainText('Total gate time: 17.0 μs');
    await expect(world).toContainText('paper simulations');
  }
}


async function checkWalkthrough(page, walkthrough) {
  const frames = walkthrough.frames;
  expect(frames.length, 'Bound execution replay work').toBeGreaterThan(0);
  expect(frames.length).toBeLessThanOrEqual(40);
  await expect(page.locator('#tracePosition')).toContainText('Ready');
  await expect(page.locator('#traceBack')).toBeDisabled();
  for (let i = 0; i < frames.length; i++) {
    await page.locator('#traceNext').click();
    await expect(page.locator('#tracePosition')).toHaveText(`Step ${i + 1} of ${frames.length}`);
    await expect(page.locator('#traceNote')).toHaveText(walkthrough.steps[i].note);
    const state = await page.locator('#traceState .state-value').evaluateAll(rows => Object.fromEntries(
      rows.map(row => [row.querySelector('strong').textContent, JSON.parse(row.querySelector('code').textContent)])));
    expect(state).toEqual(frames[i].state);
    await expect(page.locator(`#traceCode .active-line[data-step="${i}"]`).first()).toBeVisible();
    await assertLayout(page);
  }
  await expect(page.locator('#traceNext')).toBeDisabled();
  await page.locator('#traceBack').click();
  await expect(page.locator('#tracePosition')).toHaveText(frames.length === 1 ? 'Ready · no statements executed' : `Step ${frames.length - 1} of ${frames.length}`);
  const priorState = await page.locator('#traceState .state-value').evaluateAll(rows => Object.fromEntries(
    rows.map(row => [row.querySelector('strong').textContent, JSON.parse(row.querySelector('code').textContent)])));
  expect(priorState).toEqual(frames.length === 1 ? {} : frames[frames.length - 2].state);
  await page.locator('#traceReset').click();
  await page.locator('#traceReset').click(); // Repeated reset remains safe.
  await expect(page.locator('#tracePosition')).toContainText('Ready');
  await expect(page.locator('#traceBack')).toBeDisabled();
  await expect(page.locator('#traceCode .active-line')).toHaveCount(0);
  await expect(page.locator('#traceState .state-value')).toHaveCount(0);
  await expect(page.locator('#traceState')).toHaveText('No values yet.');
  await page.locator('#traceNext').click();
  await expect(page.locator('#tracePosition')).toHaveText(`Step 1 of ${frames.length}`);
}

async function checkDay14Model(page, slug) {
  const world = page.locator('#world');
  if (slug === 'data-engineering') {
    await expect(world).toContainText('"O42":"paid"');
    await page.locator('#startAfter').selectOption('101');
    await expect(world).toContainText('Missing live changes: 101');
    await page.locator('#startAfter').selectOption('99');
    await expect(world).toContainText('Repeated boundary changes: 100');
  } else if (slug === 'software-engineering') {
    await expect(world).toContainText('REDO available: true');
    await expect(world).toContainText('Recovered stock: 4');
    await page.locator('#crashPoint').selectOption('before');
    await expect(world).toContainText('Recovered stock: 5');
    await page.locator('#breakRule').check();
    await expect(world).toContainText('UNSAFE ORDER');
  } else if (slug === 'distinguished-engineer') {
    await expect(world).toContainText('Healthy cells: 2 of 3');
    await page.locator('#waveSize').focus();
    await page.locator('#waveSize').press('ArrowRight');
    await expect(world).toContainText('Healthy cells: 1 of 3');
    await expect(world).toContainText('MISSED');
  } else if (slug === 'genai-engineering') {
    await expect(world).toContainText('PASS TO MODEL');
    for (const [value, result] of [['error', 'tool execution error'], ['malformed', 'schema mismatch'], ['timeout', 'deadline exceeded']]) {
      await page.locator('#toolCase').selectOption(value);
      await expect(world).toContainText(result);
    }
  } else if (slug === 'technology-breakthroughs') {
    await expect(world).toContainText('Digital parity target: 1');
    await expect(world).toContainText('favored target');
    await page.locator('#dnaBits').fill('00000000');
    await page.locator('#dnaCandidate').selectOption('0');
    await page.locator('#foldDna').click();
    await expect(world).toContainText('Digital parity target: 0');
    await expect(world).toContainText('favored target');
  } else if (slug === 'ci-cd-github-actions') {
    await expect(world).toContainText('Decision: ACCEPT');
    await page.locator('#workflowInput').selectOption('true');
    await expect(world).toContainText('Decision: REJECT');
    await page.locator('#workflowInput').selectOption('staging');
    await page.locator('#workflowSecret').selectOption('missing');
    await expect(world).toContainText('Required secret present: false');
    await expect(world).toContainText('Decision: REJECT');
    await page.locator('#workflowSecret').selectOption('named');
    await expect(world).toContainText('Decision: ACCEPT');
  } else if (slug === 'apis-microservices') {
    await expect(world).toContainText('Naive total: 4');
    await expect(world).toContainText('Batched total: 2');
    await page.locator('#post3').uncheck();
    await expect(world).toContainText('Resolver loads: ["u1","u2"]');
    await page.locator('#post1').uncheck();
    await page.locator('#post2').uncheck();
    await expect(world).toContainText('Posts selected: 0');
  }
}
