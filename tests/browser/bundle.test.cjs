const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { discoverBundle } = require('./bundle.cjs');
const original = ['data-engineering', 'software-engineering', 'distinguished-engineer', 'genai-engineering', 'technology-breakthroughs'];
const expanded = [...original, 'ci-cd-github-actions', 'apis-microservices'];

function fixture(t, number) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'study-bundle-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const slugs = number < 11 ? original : expanded;
  const directory = path.join(root, `Day${number}`);
  fs.mkdirSync(directory);
  const write = (file, value) => fs.writeFileSync(path.join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
  const lessons = slugs.map(slug => ({ slug, track: slug, questions: Array.from({ length: 3 }, () => ['Synthetic question', ['A', 'B'], 0, 'Synthetic feedback']) }));
  const state = { tracks: expanded, track_changes: [{ effective_from_day: 1, tracks: original }, { effective_from_day: 11, tracks: expanded }], days: [{ number, lesson_slugs: slugs }] };
  write('study-state.json', state);
  write(`Day${number}/lessons.json`, lessons);
  for (const slug of slugs) for (const ext of ['html', 'md']) write(`Day${number}/${slug}.${ext}`, 'Synthetic fixture');
  write(`Day${number}/index.html`, 'Synthetic hub');
  return { root, directory, lessons, state, write };
}

for (const number of [7, 10, 11, 14]) test(`Day${number} follows its effective track policy`, t => {
  const { root } = fixture(t, number);
  const bundle = discoverBundle(root);
  assert.equal(bundle.day, `Day${number}`);
  assert.equal(bundle.lessons.length, number < 11 ? 5 : 7);
  assert.equal(bundle.pages.length, bundle.lessons.length + 1);
});
test('legacy five-track manifests remain supported', t => {
  const f = fixture(t, 7);
  delete f.state.track_changes;
  f.state.tracks = original;
  f.write('study-state.json', f.state);
  assert.equal(discoverBundle(f.root).lessons.length, 5);
});
test('an incomplete newest day never falls back', t => {
  const f = fixture(t, 14);
  fs.mkdirSync(path.join(f.root, 'Day15'));
  assert.throws(() => discoverBundle(f.root), /Day15.*lessons.json|Day15.*manifest/);
});
test('Day14 rejects five lessons even if its day record also omits the new tracks', t => {
  const f = fixture(t, 14);
  f.write('Day14/lessons.json', f.lessons.slice(0, 5));
  f.state.days[0].lesson_slugs = original;
  f.write('study-state.json', f.state);
  assert.throws(() => discoverBundle(f.root), /expected 7 distinct lessons/);
});
for (const kind of ['duplicate slug', 'wrong track', 'missing Markdown', 'invalid answer', 'manifest mismatch', 'missing manifest slugs', 'manifest ahead', 'page cap']) test(`rejects ${kind}`, t => {
  const f = fixture(t, 14);
  if (kind === 'duplicate slug') f.lessons[1].slug = f.lessons[0].slug;
  if (kind === 'wrong track') f.lessons[1].track = 'unapproved-track';
  if (kind === 'missing Markdown') fs.unlinkSync(path.join(f.directory, 'data-engineering.md'));
  if (kind === 'invalid answer') f.lessons[0].questions[0][2] = 2;
  if (kind === 'missing manifest slugs') delete f.state.days[0].lesson_slugs;
  if (kind === 'manifest mismatch') f.state.days[0].lesson_slugs = original;
  if (kind === 'manifest ahead') f.state.days.push({ number: 15 });
  if (kind === 'page cap') for (let i = 0; i < 5; i++) f.write(`Day14/extra-${i}.html`, 'Extra');
  f.write('Day14/lessons.json', f.lessons);
  f.write('study-state.json', f.state);
  assert.throws(() => discoverBundle(f.root));
});
