const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const defaultRoot = path.resolve(__dirname, '../..');
const sameMembers = (left, right) => JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());

function discoverBundle(root = defaultRoot) {
  const days = fs.readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^Day[1-9]\d*$/.test(entry.name))
    .map(entry => entry.name).sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)));
  const day = days.at(-1);
  if (!day) throw new Error('No DayN bundle found');
  // Do not fall back to an older complete bundle: a partial newest day must fail.
  const directory = path.join(root, day);
  const state = JSON.parse(fs.readFileSync(path.join(root, 'study-state.json'), 'utf8'));
  const number = Number(day.slice(3));
  const policy = (state.track_changes || []).filter(item => item.effective_from_day <= number)
    .sort((a, b) => b.effective_from_day - a.effective_from_day)[0];
  const tracks = policy ? policy.tracks : state.tracks;
  if (!Array.isArray(tracks) || !tracks.length || new Set(tracks).size !== tracks.length)
    throw new Error(`${day}: missing or invalid day-specific track policy`);
  const lessons = JSON.parse(fs.readFileSync(path.join(directory, 'lessons.json'), 'utf8'));
  if (!Array.isArray(lessons) || lessons.length !== tracks.length ||
      new Set(lessons.map(lesson => lesson?.slug)).size !== tracks.length ||
      !sameMembers(lessons.map(lesson => lesson?.track), tracks))
    throw new Error(`${day}: expected ${tracks.length} distinct lessons matching the day-specific track policy`);
  const record = state.days?.find(item => item.number === number);
  if (!record || state.days.some(item => item.number > number) ||
      !Array.isArray(record.lesson_slugs) || !sameMembers(record.lesson_slugs, lessons.map(lesson => lesson.slug)))
    throw new Error(`${day}: bundle does not match the study-state manifest`);
  function requireFile(file) {
    if (!fs.statSync(path.join(directory, file)).isFile()) throw new Error(`${day}/${file}: expected a file`);
  }
  for (const lesson of lessons) {
    if (!/^[a-z][a-z-]+$/.test(lesson.slug) || lesson.questions?.length !== 3)
      throw new Error(`${day}: unsupported lesson/quiz contract`);
    for (const question of lesson.questions) {
      if (!Array.isArray(question[1]) || question[1].length < 2 ||
          !Number.isInteger(question[2]) || question[2] < 0 || question[2] >= question[1].length)
        throw new Error(`${day}/${lesson.slug}: invalid answer key`);
    }
    requireFile(`${lesson.slug}.html`);
    requireFile(`${lesson.slug}.md`);
  }
  requireFile('index.html');
  const pages = fs.readdirSync(directory).filter(file => file.endsWith('.html')).sort();
  if (pages.length > 12) throw new Error('Smoke budget exceeded: review coverage before raising the 12-page cap');
  return { root, day, directory, lessons, pages };
}

module.exports = { discoverBundle };
if (require.main === module && process.argv.includes('--verify')) {
  const { root, day, directory, lessons, pages } = discoverBundle();
  const verifier = path.join(directory, 'verify.cjs');
  console.log(`Selected ${day} (${lessons.length} lessons, ${pages.length} HTML pages)`);
  if (fs.existsSync(verifier)) {
    execFileSync(process.execPath, [verifier], { cwd: root, stdio: 'inherit', timeout: 30_000 });
  } else {
    console.log(`${day} has no verify.cjs; browser checks still run (no simulated-DOM coverage).`);
  }
}
