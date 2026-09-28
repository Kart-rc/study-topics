const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const days = fs.readdirSync(root, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && /^Day[1-9]\d*$/.test(entry.name))
  .map(entry => entry.name).sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)));
const day = days.at(-1);
if (!day) throw new Error('No DayN bundle found');
// Do not fall back to an older complete bundle: a partial newest day must fail.
const directory = path.join(root, day);
const lessons = JSON.parse(fs.readFileSync(path.join(directory, 'lessons.json'), 'utf8'));
if (lessons.length !== 5 || new Set(lessons.map(l => l.slug)).size !== 5)
  throw new Error(`${day}: expected five distinct lessons`);
for (const lesson of lessons) {
  if (!/^[a-z][a-z-]+$/.test(lesson.slug) || lesson.questions?.length !== 3)
    throw new Error(`${day}: unsupported lesson/quiz contract`);
  for (const question of lesson.questions) {
    if (!Array.isArray(question[1]) || question[1].length < 2 ||
        !Number.isInteger(question[2]) || question[2] < 0 || question[2] >= question[1].length)
      throw new Error(`${day}/${lesson.slug}: invalid answer key`);
  }
  fs.accessSync(path.join(directory, `${lesson.slug}.html`));
}
fs.accessSync(path.join(directory, 'index.html'));
const pages = fs.readdirSync(directory).filter(file => file.endsWith('.html')).sort();
if (pages.length > 12) throw new Error('Smoke budget exceeded: review coverage before raising the 12-page cap');
module.exports = { root, day, directory, lessons, pages };
if (require.main === module && process.argv.includes('--verify')) {
  const verifier = path.join(directory, 'verify.cjs');
  console.log(`Selected ${day} (${pages.length} HTML pages)`);
  if (fs.existsSync(verifier)) {
    execFileSync(process.execPath, [verifier], { cwd: root, stdio: 'inherit', timeout: 30_000 });
  } else {
    console.log(`${day} has no verify.cjs; browser checks still run (no simulated-DOM coverage).`);
  }
}
