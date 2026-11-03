/* Rostrum Gym: Pronunciation Lab, Phrase Forge, Grammar, Metaphor Gym, Own the Room, Impromptu. */
(function (root) {
  'use strict';
  var App = root.App, RC = root.RC;
  var esc = App.esc, $ = App.$, $$ = App.$$, on = App.on;

  var TILES = [
    { id: 'pron', name: 'Pronunciation Lab', glyph: '♪', sub: 'Minimal pairs, word stress, shadowing, intonation' },
    { id: 'forge', name: 'Phrase Forge', glyph: '⚒', sub: 'Your sentence → Clear, Vivid, Commanding' },
    { id: 'grammar', name: 'Grammar Clinic', glyph: '§', sub: '40 patterns with spoken retries' },
    { id: 'metaphor', name: 'Metaphor Gym', glyph: '❦', sub: 'Examples, analogies, allegories, Random Spark' },
    { id: 'room', name: 'Own the Room', glyph: '◉', sub: 'Power Pause, First 10 Seconds, Land the Ending…' },
    { id: 'impromptu', name: 'Impromptu', glyph: '⚡', sub: '60 prompts, everyday to executive' }
  ];

  App.route('gym', function (el, args) {
    var sub = args[0];
    if (sub && GYM[sub]) return GYM[sub](el, args.slice(1));
    el.innerHTML = '<h1>Gym</h1><p class="muted">Short, focused reps. Every drill ends with you speaking.</p><div class="tiles">' +
      TILES.map(function (t) { return '<a class="tile" href="#/gym/' + t.id + '"><span class="glyph big" aria-hidden="true">' + t.glyph + '</span><strong>' + esc(t.name) + '</strong><span class="muted">' + esc(t.sub) + '</span></a>'; }).join('') + '</div>';
  });

  function back(label) { return '<nav class="crumbs"><a href="#/gym">← Gym</a>' + (label ? ' / ' + esc(label) : '') + '</nav>'; }
  function tabs(base, items, cur) {
    return '<div class="tabs" role="tablist">' + items.map(function (it) { return '<a role="tab" aria-selected="' + (it[0] === cur) + '" class="' + (it[0] === cur ? 'sel' : '') + '" href="#/gym/' + base + '/' + it[0] + '">' + esc(it[1]) + '</a>'; }).join('') + '</div>';
  }
  function drillXp(id) {
    Store.update(function (s) { s.drills[id] = s.drills[id] || { count: 0 }; s.drills[id].count++; });
  }

  var GYM = {};

  // ---------- Pronunciation Lab ----------
  GYM.pron = function (el, args) {
    var tab = args[0] || 'pairs';
    var P = RC.pronunciation;
    var html = back('Pronunciation Lab') + '<h1>Pronunciation Lab</h1>' +
      '<p class="muted">Goal: <strong>clear and confident</strong>, not "native". Your accent is part of you; we only work on sounds that affect understanding. Model audio uses your device\'s built-in voice (' + esc(Store.get().profile.accent) + ').</p>' +
      tabs('pron', [['pairs', 'Minimal pairs'], ['stress', 'Word stress'], ['shadow', 'Shadowing'], ['tone', 'Intonation'], ['twisters', 'Tongue twisters']], tab) + '<div id="pl"></div>';
    el.innerHTML = html;
    var box = $('#pl', el);
    if (tab === 'pairs') {
      var idx = +(args[1] || 0) % P.minimalPairs.length, mp = P.minimalPairs[idx];
      box.innerHTML = '<div class="card"><div class="row between"><p class="eyebrow">' + esc(mp.sound) + ' · ' + (idx + 1) + '/' + P.minimalPairs.length + '</p><div><a class="btn ghost sm" href="#/gym/pron/pairs/' + ((idx - 1 + P.minimalPairs.length) % P.minimalPairs.length) + '">←</a><a class="btn ghost sm" href="#/gym/pron/pairs/' + ((idx + 1) % P.minimalPairs.length) + '">→</a></div></div>' +
        '<div class="pair"><div><h2>' + esc(mp.a) + '</h2><p class="ipa">' + esc(mp.ipaA) + '</p>' + App.ttsButton(mp.a) + App.ttsButton(mp.a, 'Slow', 0.6) + '</div><div><h2>' + esc(mp.b) + '</h2><p class="ipa">' + esc(mp.ipaB) + '</p>' + App.ttsButton(mp.b) + App.ttsButton(mp.b, 'Slow', 0.6) + '</div></div>' +
        '<p class="tip">👄 ' + esc(mp.tip) + '</p>' + (mp.commonFor && mp.commonFor.length ? '<p class="muted small">Often tricky for speakers of: ' + esc(mp.commonFor.join(', ')) + '</p>' : '') +
        '<h3>Ear training</h3><p class="muted small">Listen, then pick which word you heard.</p><div class="row"><button class="btn" data-quiz>▶ Play a mystery word</button><button class="btn ghost" data-ans="a" disabled>' + esc(mp.a) + '</button><button class="btn ghost" data-ans="b" disabled>' + esc(mp.b) + '</button></div><p class="quiz-out" aria-live="polite"></p>' +
        '<h3>Say it</h3><div class="row"><button class="btn sm sel" data-which="A">' + esc(mp.a) + ' sentence</button><button class="btn sm" data-which="B">' + esc(mp.b) + ' sentence</button></div><div id="mpst"></div></div>';
      var answer = null, score = 0, tries = 0;
      on(box, '[data-quiz]', 'click', function () {
        answer = Math.random() < 0.5 ? 'a' : 'b';
        App.speakAs(mp[answer], { rate: 0.9 });
        $$('[data-ans]', box).forEach(function (b) { b.disabled = false; });
      });
      on(box, '[data-ans]', 'click', function (e, b) {
        if (!answer) return;
        tries++; if (b.getAttribute('data-ans') === answer) score++;
        $('.quiz-out', box).textContent = (b.getAttribute('data-ans') === answer ? '✓ Yes — "' : '✗ It was "') + mp[answer] + '". Score ' + score + '/' + tries;
        answer = null; $$('[data-ans]', box).forEach(function (x) { x.disabled = true; });
      });
      var mountSay = function (which) {
        var txt = which === 'A' ? mp.sentenceA : mp.sentenceB;
        App.mountStage($('#mpst', box), { kind: 'read', targetText: txt, seconds: 12, ref: mp.id, cue: App.ttsButton(txt, 'Hear model') + App.ttsButton(txt, 'Slow', 0.65), showForge: false, onComplete: function () { drillXp(mp.id); App.go('#/gym/pron/pairs/' + ((idx + 1) % P.minimalPairs.length)); }, doneLabel: 'Next pair →' });
      };
      on(box, '[data-which]', 'click', function (e, b) { $$('[data-which]', box).forEach(function (x) { x.classList.toggle('sel', x === b); }); mountSay(b.getAttribute('data-which')); });
      mountSay('A');
    } else if (tab === 'stress') {
      box.innerHTML = '<div class="card"><p class="muted">Tap the syllable you think carries the stress, then listen. Big dot = stressed.</p><div class="stress-list">' +
        P.stress.map(function (w, i) {
          return '<div class="stress-item" data-i="' + i + '"><div class="sylls">' + w.syllables.map(function (sy, k) { return '<button class="syl" data-k="' + k + '">' + esc(sy.toLowerCase()) + '</button>'; }).join('<span class="dot-sep">·</span>') + '</div>' +
            (w.pos ? '<span class="badge">' + esc(w.pos) + '</span>' : '') + App.ttsButton(w.word, 'Listen') + '<p class="stress-out small muted"></p></div>';
        }).join('') + '</div><h3>Say the stress-shift pairs</h3><div id="stst"></div></div>';
      on(box, '.syl', 'click', function (e, b) {
        var item = b.closest('.stress-item'), w = P.stress[+item.getAttribute('data-i')], k = +b.getAttribute('data-k');
        $$('.syl', item).forEach(function (s, j) { s.classList.toggle('stressed', j === w.stressIndex); s.textContent = j === w.stressIndex ? w.syllables[j].toUpperCase() : w.syllables[j].toLowerCase(); s.disabled = true; });
        $('.stress-out', item).textContent = (k === w.stressIndex ? '✓ ' : '✗ ') + (w.note || '');
      });
      var pairs = P.stress.filter(function (w) { return w.pos; }).map(function (w) { return w.syllables.join('').toLowerCase() === w.word.toLowerCase() ? w : w; });
      var lines = pairs.slice(0, 6).map(function (w) { return w.syllables.map(function (s, j) { return j === w.stressIndex ? s.toUpperCase() : s.toLowerCase(); }).join('') + ' (' + w.pos + ')'; });
      App.mountStage($('#stst', box), { kind: 'read', targetText: lines.join(' / '), seconds: 25, ref: 'stress-pairs', showForge: false, focus: [] });
    } else if (tab === 'shadow') {
      var si = +(args[1] || 0) % P.shadowing.length, sh = P.shadowing[si];
      var clean = App.cleanScript(sh.text);
      box.innerHTML = '<div class="card"><div class="row between"><p class="eyebrow">Shadowing · ' + esc(sh.focus) + ' · level ' + sh.level + '</p><div><a class="btn ghost sm" href="#/gym/pron/shadow/' + ((si + 1) % P.shadowing.length) + '">Next →</a></div></div>' +
        '<ol class="steps"><li>Listen twice. Notice where the voice pauses (/) and which words are loud.</li><li>Listen once more and whisper along.</li><li>Record yourself, matching the rhythm — not the accent.</li></ol>' +
        '<div class="row">' + App.ttsButton(clean, 'Listen', 0.95) + App.ttsButton(clean, 'Slow', 0.7) + '</div><div id="shst"></div></div>';
      App.mountStage($('#shst', box), { kind: 'read', targetText: sh.text, seconds: 20, ref: sh.id, showForge: false, focus: ['pauses', 'ending'] });
    } else if (tab === 'tone') {
      var ti = +(args[1] || 0) % P.intonation.length, it = P.intonation[ti];
      box.innerHTML = '<div class="card"><div class="row between"><p class="eyebrow">One line, many meanings</p><a class="btn ghost sm" href="#/gym/pron/tone/' + ((ti + 1) % P.intonation.length) + '">Next →</a></div>' +
        '<h2>“' + esc(it.line) + '”</h2><p class="muted">Pick a meaning. Say the line so a listener would hear <em>that</em> meaning. Lift and lengthen the stressed word; watch the pitch line in the spotlight.</p>' +
        '<div class="variants">' + it.variants.map(function (v, k) { return '<button class="opt" data-v="' + k + '"><b>' + esc(v.emphasis) + '</b> → ' + esc(v.meaning) + '</button>'; }).join('') + '</div><div id="tost"></div></div>';
      on(box, '[data-v]', 'click', function (e, b) {
        $$('[data-v]', box).forEach(function (x) { x.classList.toggle('sel', x === b); });
        var v = it.variants[+b.getAttribute('data-v')];
        var shown = /^(rising|falling|rise|fall)$/i.test(v.emphasis) ? it.line + ' (' + v.emphasis + ')' : it.line.replace(new RegExp('\\b' + v.emphasis.replace(/[.*+?^${}()|[\]\\']/g, '\\$&') + '\\b'), v.emphasis.toUpperCase());
        App.mountStage($('#tost', box), { kind: 'read', targetText: shown, seconds: 10, ref: 'tone-' + ti, showForge: false, focus: ['ending'],
          onTake: function (take) { return '<div class="fb-card"><h4>Your pitch line</h4>' + App.pitchSvg(take.frames) + '<p class="small muted">Look for a clear peak on the word you meant to stress.</p></div>'; } });
      });
    } else if (tab === 'twisters') {
      box.innerHTML = '<div class="card"><p class="muted">Climb the ladder: say it slowly and perfectly first, then faster. Clarity beats speed.</p><ol class="twisters">' +
        P.twisters.slice().sort(function (a, b) { return a.level - b.level; }).map(function (t, i) { return '<li><button class="opt" data-t="' + i + '"><span class="badge">L' + t.level + '</span> ' + esc(t.text) + '</button></li>'; }).join('') + '</ol><div id="twst"></div></div>';
      var sorted = P.twisters.slice().sort(function (a, b) { return a.level - b.level; });
      on(box, '[data-t]', 'click', function (e, b) {
        var t = sorted[+b.getAttribute('data-t')];
        App.mountStage($('#twst', box), { kind: 'read', targetText: t.text, seconds: 15, ref: 'twister', showForge: false, cue: App.ttsButton(t.text, 'Hear it slow', 0.7) });
        $('#twst', box).scrollIntoView({ block: 'nearest' });
      });
    }
  };

  /** Small SVG pitch plot of a take — your intonation, visible. */
  App.pitchSvg = function (frames, w, h) {
    w = w || 600; h = h || 120;
    var pts = frames.filter(function (f) { return f.pitch > 60 && f.pitch < 500; });
    if (pts.length < 4) return '<p class="muted small">Not enough voiced audio to draw a pitch line.</p>';
    var t0 = frames[0].t, t1 = frames[frames.length - 1].t || 1;
    var path = '', prev = null;
    pts.forEach(function (f) {
      var x = ((f.t - t0) / (t1 - t0)) * w;
      var y = h - 8 - (Math.log2(f.pitch / 70) / Math.log2(450 / 70)) * (h - 16);
      path += (prev !== null && f.t - prev < 120 ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      prev = f.t;
    });
    return '<svg class="pitch-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Your pitch line over time"><path d="' + path + '" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
  };

  // ---------- Phrase Forge ----------
  GYM.forge = function (el) {
    var pre = App.session.get('forge-input') || '';
    App.session.remove('forge-input');
    el.innerHTML = back('Phrase Forge') + '<h1>Phrase Forge</h1><p class="muted">Bring your own sentence — ideally one you actually said. Get three upgrades, pick one, and <strong>say it</strong>.</p>' +
      '<div class="card"><label class="field"><span>Your sentence</span><textarea id="fin" rows="3" placeholder="I think maybe we should probably try to reduce the delay somehow.">' + esc(pre) + '</textarea></label><button class="btn primary" id="fgo">Forge it</button></div><div id="fout"></div>';
    function run() {
      var txt = $('#fin', el).value.trim();
      if (!txt) return;
      var f = Forge.forge(txt);
      var out = $('#fout', el);
      out.innerHTML = '<div class="forge3">' +
        card('clear', 'Clear', f.clear.text, f.clear.why) +
        card('vivid', 'Vivid', f.vivid.text, f.vivid.why + '<ul class="small">' + f.vivid.scaffold.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>', true) +
        card('commanding', 'Commanding', f.commanding.text, f.commanding.why + (f.commanding.notes.length ? '<br><span class="small">' + esc(f.commanding.notes[0]) + '</span>' : '')) +
        '</div><p class="muted small">Rule-based, offline rewrites. They keep your meaning; check that each still says what you mean. Anything in [brackets] is a placeholder only you can fill truthfully.</p><div id="fst"></div>';
      on(out, '[data-pick]', 'click', function (e, b) {
        var c = b.closest('.forge-card');
        var t = $('[contenteditable]', c).textContent.trim();
        if (/\[.*\]/.test(t)) { App.toast('Fill the [brackets] with something true first — tap the text to edit.'); $('[contenteditable]', c).focus(); return; }
        App.mountStage($('#fst', out), { kind: 'read', targetText: t, seconds: 20, ref: 'forge', title: 'Say your ' + b.getAttribute('data-pick') + ' version', showForge: false, focus: ['hedges', 'ending'], onComplete: function () { drillXp('forge'); App.toast('Forged and spoken.'); } });
        $('#fst', out).scrollIntoView({ block: 'nearest' });
      });
    }
    function card(k, name, text, why, editableHint) {
      return '<div class="card forge-card fc-' + k + '"><span class="eyebrow">' + name + '</span><p class="forged" contenteditable="true" spellcheck="true" aria-label="' + name + ' version, editable">' + esc(text) + '</p><div class="small muted">' + why + '</div>' +
        '<div class="row">' + App.ttsButton(text) + '<button class="btn sm primary" data-pick="' + k + '">Say this one</button></div>' + (editableHint ? '<p class="small">✎ Tap the text to edit.</p>' : '') + '</div>';
    }
    $('#fgo', el).onclick = run;
    if (pre) run();
  };

  // ---------- Grammar Clinic ----------
  GYM.grammar = function (el, args) {
    var s = Store.get();
    var mine = {};
    s.fingerprint.forEach(function (f) { (f.grammar || []).forEach(function (id) { mine[id] = (mine[id] || 0) + 1; }); });
    if (args[0]) {
      var g = RC.grammar.find(function (x) { return x.id === args[0]; });
      if (!g) return App.go('#/gym/grammar');
      var di = 0;
      el.innerHTML = back('Grammar') + '<h1>' + esc(g.name) + '</h1><div class="card"><div class="ba"><div class="weak"><span class="eyebrow">Common form</span><p>' + esc(g.wrong) + '</p></div><div class="strong"><span class="eyebrow">Clear form</span><p>' + esc(g.right) + '</p>' + App.ttsButton(g.right) + '</div></div><p class="why">' + esc(g.rule) + '</p></div>' +
        '<div class="card"><h3>Drill</h3><div id="gd"></div></div>';
      var drawDrill = function () {
        var d = g.drills[di];
        var box = $('#gd', el);
        if (!d) { box.innerHTML = '<p>✓ All drills done. <a href="#/gym/grammar">Back to the clinic</a></p>'; drillXp(g.id); return; }
        box.innerHTML = '<p class="q">' + esc(d.prompt) + '</p><label class="field"><span>Your fix</span><input id="gin" autocomplete="off"></label><button class="btn" id="gchk">Check</button><p id="gout" aria-live="polite"></p><div id="gst"></div>';
        $('#gchk', box).onclick = function () {
          var norm = function (x) { return Analysis.tokenize(x).join(' '); };
          var ok = norm($('#gin', box).value) === norm(d.answer);
          $('#gout', box).innerHTML = (ok ? '✓ Exactly. ' : 'One good answer: ') + '<strong>' + esc(d.answer) + '</strong> — now say it aloud.';
          App.mountStage($('#gst', box), { kind: 'read', targetText: d.answer, seconds: 12, ref: g.id, showForge: false, doneLabel: 'Next drill →', onComplete: function () { di++; drawDrill(); } });
        };
      };
      drawDrill();
      return;
    }
    var flagged = RC.grammar.filter(function (g) { return mine[g.id]; });
    el.innerHTML = back('Grammar') + '<h1>Grammar Clinic</h1><p class="muted">Rule-based checks spot these patterns in your takes. They are signals, not verdicts — and some are regional usages you may simply want to adapt for an international audience.</p>' +
      (flagged.length ? '<div class="card"><h3>From your own speech</h3><div class="pill-list">' + flagged.map(function (g) { return '<a class="pill hot" href="#/gym/grammar/' + g.id + '">' + esc(g.name) + ' ×' + mine[g.id] + '</a>'; }).join('') + '</div></div>' : '') +
      '<div class="pill-list">' + RC.grammar.map(function (g) { return '<a class="pill" href="#/gym/grammar/' + g.id + '">' + esc(g.name) + (s.drills[g.id] ? ' ✓' : '') + '</a>'; }).join('') + '</div>';
  };

  // ---------- Metaphor Gym ----------
  GYM.metaphor = function (el, args) {
    var tab = args[0] || 'ladder', G = RC.gym;
    var html = back('Metaphor Gym') + '<h1>Metaphor Gym</h1><p class="muted">Examples, analogies and stories make ideas stick. Most apps never train this. Here, you will.</p>' +
      tabs('metaphor', [['ladder', 'Example Ladder'], ['analogy', 'Analogy Builder'], ['allegory', 'Allegory Studio'], ['spark', 'Random Spark'], ['audience', 'Audience Switch']], tab) + '<div id="mg" class="card"></div>';
    el.innerHTML = html;
    var box = $('#mg', el);
    var reroll = '<button class="btn ghost sm" data-reroll>🎲 New challenge</button>';
    on(box, '[data-reroll]', 'click', function () { App.render(); });
    if (tab === 'ladder') {
      var claim = App.pick(G.ladderClaims);
      box.innerHTML = '<div class="row between"><p class="eyebrow">Climb from abstract to specific</p>' + reroll + '</div><h2>“' + esc(claim) + '”</h2>' +
        '<div class="ladder"><label class="field rung r1"><span>1 · The statement (abstract)</span><input value="' + esc(claim) + '"></label>' +
        '<label class="field rung r2"><span>2 · A category (who/what kind?)</span><input placeholder="e.g. small teams, first-time managers"></label>' +
        '<label class="field rung r3"><span>3 · A real instance — a person, place, or number</span><input placeholder="e.g. Priya, our new analyst, cut the report from 40 pages to 4"></label></div>' +
        '<button class="btn" data-go>Now say all three rungs</button><div id="mst"></div>';
      on(box, '[data-go]', 'click', function () {
        var v = $$('input', box).map(function (i) { return i.value; });
        App.mountStage($('#mst', box), { kind: 'speak', prompt: 'Say the claim, then the category, then the real instance. End by returning to the claim.', cue: '<ol class="cuecard">' + v.map(function (x) { return '<li>' + esc(x || '…') + '</li>'; }).join('') + '</ol>', seconds: 45, ref: 'ladder', focus: ['structure'], onComplete: function () { drillXp('ladder'); App.render(); }, doneLabel: 'Another claim' });
      });
    } else if (tab === 'analogy') {
      var idea = App.pick(G.analogyIdeas), dom = App.pick(G.analogyDomains);
      box.innerHTML = '<div class="row between"><p class="eyebrow">Map the parts, then find where it breaks</p>' + reroll + '</div><h2>Explain <em>' + esc(idea) + '</em> using <em>' + esc(dom) + '</em></h2>' +
        '<label class="field"><span>' + esc(idea) + ' is like…</span><input placeholder="the core comparison in one line"></label>' +
        '<div class="grid2"><label class="field"><span>Part of the idea</span><input></label><label class="field"><span>↔ maps to (in ' + esc(dom) + ')</span><input></label>' +
        '<label class="field"><span>Another part</span><input></label><label class="field"><span>↔ maps to</span><input></label></div>' +
        '<label class="field"><span>Where the analogy breaks (every analogy does)</span><input placeholder="It breaks because…"></label>' +
        '<button class="btn" data-go>Say the analogy (45s)</button><div id="mst"></div>';
      on(box, '[data-go]', 'click', function () {
        var v = $$('input', box).map(function (i) { return i.value; });
        var cue = '<ol class="cuecard"><li>' + esc(v[0] || '…') + '</li><li>' + esc(v[1] || '…') + ' ↔ ' + esc(v[2] || '…') + '</li><li>' + esc(v[3] || '…') + ' ↔ ' + esc(v[4] || '…') + '</li><li>Where it breaks: ' + esc(v[5] || '…') + '</li></ol>';
        App.mountStage($('#mst', box), { kind: 'speak', prompt: 'Explain ' + idea + ' through ' + dom + '. Name where the comparison stops working — it builds trust.', cue: cue, seconds: 45, ref: 'analogy', focus: ['structure'],
          onTake: function (take) {
            var said = (take.ev.transcript || '').toLowerCase();
            var breaks = /\b(but|break|differ|unlike|except|where it|doesn't|isn't|not quite)\b/.test(said);
            var like = /\b(like|as if|imagine|think of|similar)\b/.test(said);
            return '<div class="fb-card"><h4>Analogy check</h4><ul class="checks"><li>' + (like ? '✓ You framed a comparison ("like", "imagine"…).' : '○ I didn\'t hear a comparison word — try "It\'s like…"') + '</li><li>' + (breaks ? '✓ You named a limit — that\'s honest and persuasive.' : '○ Say where it breaks: "The analogy stops working when…"') + '</li></ul>' + (said ? '' : '<p class="small muted">(Needs a transcript to check.)</p>') + '</div>';
          },
          onComplete: function () { drillXp('analogy'); App.render(); }, doneLabel: 'New pairing' });
      });
    } else if (tab === 'allegory') {
      var moral = App.pick(G.allegoryLessons);
      box.innerHTML = '<div class="row between"><p class="eyebrow">Tell a 45-second story — never state the moral</p>' + reroll + '</div><h2>Hidden moral: <span class="blurred" tabindex="0" title="Tap to reveal">' + esc(moral) + '</span></h2>' +
        '<div class="grid2"><label class="field"><span>Character</span><input placeholder="a baker, a junior pilot, a tortoise…"></label><label class="field"><span>Their struggle</span><input></label>' +
        '<label class="field"><span>The turning point</span><input></label><label class="field"><span>The final image (show, don\'t tell)</span><input></label></div>' +
        '<button class="btn" data-go>Tell the story (45s)</button><div id="mst"></div>';
      on(box, '.blurred', 'click', function (e, b) { b.classList.toggle('show'); });
      on(box, '[data-go]', 'click', function () {
        var v = $$('input', box).map(function (i) { return i.value; });
        App.mountStage($('#mst', box), { kind: 'speak', prompt: 'Tell the story. Character → struggle → turning point → final image. Let the listener find the moral.', cue: '<ol class="cuecard">' + v.map(function (x) { return '<li>' + esc(x || '…') + '</li>'; }).join('') + '</ol>', seconds: 50, ref: 'allegory', focus: ['duration'],
          onTake: function (take) {
            var said = Analysis.tokenize(take.ev.transcript || '');
            var key = Analysis.tokenize(moral).filter(function (w) { return w.length > 4; });
            var overlap = key.filter(function (k) { return said.indexOf(k) >= 0; });
            var stated = key.length && overlap.length / key.length >= 0.5;
            var moralWords = /\b(the moral|the lesson|which teaches|this shows|the point is)\b/i.test(take.ev.transcript || '');
            return '<div class="fb-card"><h4>Allegory check</h4><ul class="checks"><li>' + (stated || moralWords ? '○ You may have stated the moral outright (' + esc(overlap.slice(0, 3).join(', ') || 'moral phrase') + '). Try ending on an image instead.' : '✓ You didn\'t spell out the moral — the listener gets to discover it.') + '</li></ul>' +
              '<p>Ask yourself (or a friend): <em>What was that story about?</em> If they say something close to "' + esc(moral) + '", it landed.</p>' + (take.ev.transcript ? '' : '<p class="small muted">(Needs a transcript to check.)</p>') + '</div>';
          },
          onComplete: function () { drillXp('allegory'); App.render(); }, doneLabel: 'New moral' });
      });
    } else if (tab === 'spark') {
      var obj = App.pick(G.sparkObjects), id2 = App.pick(G.analogyIdeas.concat(G.audienceIdeas || []));
      box.innerHTML = '<div class="row between"><p class="eyebrow">10 seconds to think. 60 to speak.</p>' + reroll + '</div><h2>Explain <em>' + esc(id2) + '</em> using <em class="spark">' + esc(obj) + '</em></h2><div id="mst"></div>';
      var st = App.mountStage($('#mst', box), { kind: 'speak', prompt: 'Start the moment you\'re ready. Find the connection out loud — that\'s the skill.', seconds: 60, ref: 'spark', focus: ['opening', 'structure'], onComplete: function () { drillXp('spark'); App.render(); }, doneLabel: 'Draw again' });
    } else if (tab === 'audience') {
      var ai = App.pick(G.audienceIdeas || G.analogyIdeas);
      var auds = G.audiences.slice(0, 3);
      var results = {};
      box.innerHTML = '<div class="row between"><p class="eyebrow">Same idea, three audiences</p>' + reroll + '</div><h2>' + esc(ai) + '</h2>' +
        '<div class="tabs small">' + auds.map(function (a, k) { return '<button class="' + (k === 0 ? 'sel' : '') + '" data-aud="' + k + '">' + esc(a.name) + '</button>'; }).join('') + '</div><p class="aud-guide tip"></p><div id="mst"></div><div id="audcmp"></div>';
      var mountAud = function (k) {
        var a = auds[k];
        $$('[data-aud]', box).forEach(function (b) { b.classList.toggle('sel', +b.getAttribute('data-aud') === k); });
        $('.aud-guide', box).textContent = a.guidance;
        App.mountStage($('#mst', box), { kind: 'speak', prompt: 'Explain "' + ai + '" to ' + a.name.toLowerCase() + '.', seconds: 45, ref: 'audience-' + a.id, focus: ['structure'],
          onTake: function (take) {
            var t = take.ev.text; if (!t) return '';
            var lw = t.tokens.reduce(function (s2, w) { return s2 + w.length; }, 0) / Math.max(1, t.tokens.length);
            results[a.name] = { words: t.wordCount, avgWordLen: lw.toFixed(1), wpm: t.wpm, hedges: t.hedgeCount, example: t.structure.example };
            var rows = Object.keys(results);
            $('#audcmp', box).innerHTML = '<table class="cmp"><thead><tr><th>Audience</th><th>Words</th><th>Avg word length</th><th>Pace</th><th>Example?</th></tr></thead><tbody>' + rows.map(function (r) { var x = results[r]; return '<tr><td>' + esc(r) + '</td><td>' + x.words + '</td><td>' + x.avgWordLen + '</td><td>' + (x.wpm || '—') + '</td><td>' + (x.example ? 'yes' : 'no') + '</td></tr>'; }).join('') + '</tbody></table><p class="small muted">Good switching usually means shorter words for the child, the bottom line first for the CEO, and evidence for the sceptic.</p>';
            return '';
          },
          onComplete: function () { if (k < auds.length - 1) mountAud(k + 1); else { drillXp('audience'); App.toast('All three audiences done.'); } }, doneLabel: k < auds.length - 1 ? 'Next audience →' : 'Finish' });
      };
      on(box, '[data-aud]', 'click', function (e, b) { mountAud(+b.getAttribute('data-aud')); });
      mountAud(0);
    }
  };

  // ---------- Own the Room ----------
  GYM.room = function (el, args) {
    if (args[0]) {
      var d = RC.roomDrills.find(function (x) { return x.id === args[0]; });
      if (!d) return App.go('#/gym/room');
      el.innerHTML = back('Own the Room') + '<p class="eyebrow">Own the Room drill</p><h1>' + esc(d.name) + '</h1><p class="lead-p">' + esc(d.goal) + '</p><div class="card"><p>' + esc(d.instructions) + '</p><div id="rd"></div></div>';
      var box = $('#rd', el);
      if (d.measure === 'warmup') {
        var steps = d.steps || [];
        var k = -1, timer = null;
        box.innerHTML = '<ol class="warmup">' + steps.map(function (s) { return '<li>' + esc(typeof s === 'string' ? s : (s.text || s.instruction || '')) + (s.seconds ? ' <small>(' + s.seconds + 's)</small>' : '') + '</li>'; }).join('') + '</ol><button class="btn primary" id="wgo">Start guided warm-up</button><p id="wnow" class="big-now" aria-live="assertive"></p>';
        $('#wgo', box).onclick = function () {
          var items = $$('.warmup li', box);
          var next = function () {
            k++;
            items.forEach(function (li, j) { li.classList.toggle('now', j === k); li.classList.toggle('past', j < k); });
            if (k >= steps.length) { $('#wnow', box).textContent = 'Voice ready. Go own the room.'; drillXp(d.id); Store.addXp(10, 'warm-up'); return; }
            var s = steps[k], txt = typeof s === 'string' ? s : (s.text || s.instruction || '');
            var secs = (s && s.seconds) || Math.round(60 / steps.length);
            $('#wnow', box).textContent = txt;
            App.speakAs(txt, { rate: 0.95 });
            timer = setTimeout(next, secs * 1000);
          };
          this.disabled = true; next();
        };
        return;
      }
      var persona = RC.personas.find(function (p) { return p.id === 'interrupter'; });
      var opts = { kind: 'speak', prompt: d.prompt, seconds: d.seconds, ref: d.id, drill: d, focus: [{ pause: 'pauses', opening: 'opening', ending: 'ending', hedges: 'hedges', fillers: 'fillers' }[d.measure]].filter(Boolean),
        onComplete: function () { drillXp(d.id); App.go('#/gym/room'); }, doneLabel: 'Back to drills' };
      if (d.measure === 'hedges' && /^["“]/.test(d.prompt)) { opts.kind = 'read'; opts.targetText = null; opts.prompt = 'Say this line WITHOUT the hedges: ' + d.prompt; }
      if (d.measure === 'recovery') {
        if (/blank/i.test(d.name)) { opts.interrupt = ['Your mind just went blank! Your notes are gone. Recover: "Let me come back to my main point…"']; opts.interruptSilent = true; }
        else { opts.interrupt = persona ? persona.interruptions : ['Sorry, can I jump in?']; opts.interruptVoice = persona ? persona.voice : null; }
        opts.cue = '<p class="small muted">🎧 Headphones help: the interruption plays through your speaker' + (opts.interruptSilent ? '' : ' (your recording may pick it up)') + '.</p>';
      }
      App.mountStage(box, opts);
      return;
    }
    var s = Store.get();
    el.innerHTML = back('Own the Room') + '<h1>Own the Room</h1><p class="muted">Presence is a set of observable behaviours you can practise: pausing, opening clean, landing endings, recovering. Not a score read from your feelings.</p>' +
      '<div class="tiles">' + RC.roomDrills.map(function (d) { return '<a class="tile" href="#/gym/room/' + d.id + '"><strong>' + esc(d.name) + '</strong><span class="muted">' + esc(d.goal) + '</span>' + (s.drills[d.id] ? '<span class="badge">×' + s.drills[d.id].count + '</span>' : '') + '</a>'; }).join('') + '</div>';
  };

  // ---------- Impromptu ----------
  GYM.impromptu = function (el, args) {
    var s = Store.get();
    var cat = App.session.get('imp-cat') || 'all';
    var pool = RC.prompts.filter(function (p) { return cat === 'all' || p.category === cat; });
    var p = args[0] ? RC.prompts.find(function (x) { return x.id === args[0]; }) : App.pick(pool);
    if (!p) p = App.pick(RC.prompts);
    var cats = ['all'].concat(RC.prompts.map(function (x) { return x.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    el.innerHTML = back('Impromptu') + '<h1>Impromptu</h1><div class="tabs small">' + cats.map(function (c) { return '<button class="' + (c === cat ? 'sel' : '') + '" data-cat="' + c + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<div class="card"><div class="row between"><p class="eyebrow">' + esc(p.category) + ' · level ' + p.level + '</p><button class="btn ghost sm" data-new>🎲 New prompt</button></div><h2>“' + esc(p.text) + '”</h2>' +
      '<p class="muted small">Quick structure: <b>Point</b> → <b>Reason</b> ("because…") → <b>Example</b> ("for example…") → <b>Point</b> again.</p><div id="ist"></div></div>';
    on(el, '[data-cat]', 'click', function (e, b) { App.session.set('imp-cat', b.getAttribute('data-cat')); App.go('#/gym/impromptu'); App.render(); });
    on(el, '[data-new]', 'click', function () { App.go('#/gym/impromptu/' + App.pick(pool).id); });
    App.mountStage($('#ist', el), { kind: 'speak', prompt: '', seconds: 60, ref: p.id, focus: ['structure', 'opening'], onComplete: function () { drillXp('impromptu'); App.go('#/gym/impromptu/' + App.pick(pool).id); }, doneLabel: 'Next prompt →' });
  };
})(window);
