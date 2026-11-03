// Run with: node --test tests/
const test = require('node:test');
const assert = require('node:assert');
const A = require('../js/engine/analysis.js');
const M = require('../js/engine/mentor.js');
const F = require('../js/engine/forge.js');
const S = require('../js/engine/srs.js');
global.window = {};
require('../js/content/curriculum.js');
require('../js/content/practice.js');
const RC = global.window.RC;

// Synthetic audio frames: speech bursts with optional pauses and a final pitch contour.
function frames(plan) {
  const out = []; let t = 0;
  for (const p of plan) {
    for (let k = 0; k < p.ms; k += 40) {
      const f = p.speech ? (p.f0 + (p.f1 - p.f0) * (k / p.ms)) : 0;
      out.push({ t, rms: p.speech ? 0.08 : 0.002, peak: p.speech ? 0.3 : 0.01, pitch: f });
      t += 40;
    }
  }
  return out;
}

test('text metrics: fillers, hedges, opening, grammar, weak words', () => {
  const r = A.analyzeText('Sorry, um, so I think we should just maybe do it. He don\'t knows the answer. It was very important.', { durationMs: 15000, grammar: RC.grammar });
  assert.ok(r.fillerCount >= 1);
  assert.ok(r.hedgeCount >= 3);
  assert.ok(r.openingIssues.includes('sorry'));
  assert.ok(r.grammar.length >= 1, 'catches "he don\'t"');
  assert.ok(r.weakWords.some(w => w.word === 'very important'));
});

test('"like" as a verb is not a filler', () => {
  const r = A.analyzeText('I like this plan and I would like to start.', { durationMs: 5000 });
  assert.strictEqual(r.fillers.like, undefined);
});

test('script comparison flags substituted word (they/there)', () => {
  const c = A.compareScript('Put the box over there.', 'put the box over they');
  assert.ok(c.subs.some(s => s.word === 'there' && s.heard === 'they'));
  assert.ok(c.matchRate < 1);
});

test('structure detection finds PREP parts', () => {
  const r = A.analyzeText('My point is we should hire. Because the queue doubled. For example, last week 40 tickets waited. That\'s why we should hire.');
  assert.strictEqual(r.structure.prep, true);
});

test('audio: pauses, leading silence and falling ending are measured', () => {
  const fr = frames([{ ms: 1200 }, { ms: 2000, speech: true, f0: 160, f1: 160 }, { ms: 1500 }, { ms: 2000, speech: true, f0: 170, f1: 110 }, { ms: 500 }]);
  const a = A.analyzeAudio(fr);
  assert.ok(a.quality.ok);
  assert.ok(a.leadingSilenceMs >= 1000);
  assert.ok(a.pauseCount >= 1 && a.longestPauseMs >= 1200);
  assert.strictEqual(a.finalEnding, 'falling');
});

test('audio quality gate refuses near-silent takes', () => {
  const fr = frames([{ ms: 3000 }]).map(f => ({ ...f, rms: 0.003 }));
  assert.strictEqual(A.analyzeAudio(fr).quality.ok, false);
});

test('pitch detector finds a 150 Hz tone', () => {
  const sr = 24000, buf = new Float32Array(1024);
  for (let i = 0; i < buf.length; i++) buf[i] = 0.5 * Math.sin(2 * Math.PI * 150 * i / sr);
  const hz = A.detectPitch(buf, sr);
  assert.ok(Math.abs(hz - 150) < 5, 'got ' + hz);
});

test('mentor gives exactly one big fix, a strength, and evidence-linked quotes', () => {
  const fr = frames([{ ms: 500 }, { ms: 8000, speech: true, f0: 150, f1: 150 }, { ms: 400 }]);
  const ev = A.buildEvidence({ frames: fr, durationMs: 8900, transcript: 'Sorry um I think we should just maybe probably do it I think', segments: [{ text: 'Sorry um I think we should just maybe probably do it I think', startMs: 500, endMs: 8500 }], transcriptSource: 'typed', grammar: RC.grammar });
  const fb = M.coach(ev, { style: 'direct' });
  assert.ok(fb.quality.ok);
  assert.ok(fb.bigFix && fb.bigFix.title);
  assert.ok(fb.minorNotes.length <= 2);
  assert.ok(fb.strength.text);
  assert.ok(fb.bigFix.evidence && typeof fb.bigFix.evidence.startMs === 'number', 'fix points to a moment');
});

test('stutter-friendly mode never scores fillers or pace', () => {
  const ev = A.buildEvidence({ durationMs: 20000, transcript: 'um um uh I I I went went to the the shop um uh um um', transcriptSource: 'typed' });
  const fb = M.coach(ev, { settings: { stutterFriendly: true } });
  assert.ok(!fb.bigFix || !['fillers', 'pace', 'repetition'].includes(fb.bigFix.key));
  assert.ok(!fb.minorNotes.some(n => ['fillers', 'pace', 'repetition'].includes(n.key)));
});

test('read-aloud mode does not blame the speaker for the script\'s words', () => {
  const ev = A.buildEvidence({ durationMs: 10000, transcript: 'I think maybe it is very important', transcriptSource: 'typed', targetText: 'I think maybe it is very important' });
  const fb = M.coach(ev, { kind: 'read' });
  assert.ok(!fb.bigFix || fb.bigFix.key !== 'hedges');
});

test('A/B comparison reports improvement', () => {
  const e1 = A.buildEvidence({ durationMs: 10000, transcript: 'Sorry um I think maybe we should just go', transcriptSource: 'typed' });
  const e2 = A.buildEvidence({ durationMs: 10000, transcript: 'We should go today', transcriptSource: 'typed' });
  const c = M.compareTakes(e1, e2);
  assert.ok(c.wins > c.losses);
});

test('Phrase Forge keeps meaning, removes hedges, never invents facts', () => {
  const f = F.forge('I think maybe we should probably try to reduce the delay somehow.');
  assert.strictEqual(f.clear.text, 'We should reduce the delay.');
  assert.match(f.commanding.text, /reduce the delay/);
  assert.ok(f.vivid.placeholder && /\[.*\]/.test(f.vivid.text), 'vivid uses a placeholder, not an invented fact');
});

test('SRS intervals grow with successful reviews and reset on lapse', () => {
  let c = S.newCard(0); const iv = [];
  for (const r of [3, 3, 3]) { c = S.review(c, r, c.due); iv.push(c.intervalDays); }
  assert.ok(iv[2] > iv[0]);
  c = S.review(c, 1, c.due);
  assert.ok(c.intervalDays < 1 && c.lapses === 1);
});

test('content integrity', () => {
  assert.strictEqual(RC.levels.length, 4);
  assert.strictEqual(RC.lessons.length, 56);
  for (const l of RC.lessons) assert.ok(l.exercises.some(e => e.type === 'speak' || e.type === 'read'), l.id);
  for (const p of RC.paths) for (const w of p.weeks) for (const id of w.lessonIds) assert.ok(RC.lessons.find(l => l.id === id), id);
  for (const g of RC.grammar) if (g.detect) { const re = new RegExp(g.detect, 'i'); assert.ok(re.test(g.wrong), g.id); assert.ok(!re.test(g.right), g.id); }
  for (const s of RC.scenarios) for (const p of s.personas) assert.ok(RC.personas.find(x => x.id === p), s.id + ':' + p);
});
