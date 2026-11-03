/* Rostrum views: onboarding, Today, Learn (levels/paths), Lesson player. */
(function (root) {
  'use strict';
  var App = root.App, RC = root.RC;
  var esc = App.esc, $ = App.$, $$ = App.$$, on = App.on;

  var GOALS = [
    { id: 'career', name: 'Grow my career', path: 'confident-professional' },
    { id: 'interviews', name: 'Ace interviews', path: 'interview-ready' },
    { id: 'public', name: 'Speak in public', path: 'storyteller' },
    { id: 'everyday', name: 'Everyday confidence', path: 'confident-professional' },
    { id: 'english', name: 'English clarity', path: 'clear-speaker' }
  ];
  var PLACEMENT = [
    'I can explain an idea in under a minute without losing my point.',
    'I rarely use filler words like "um" or "you know".',
    'I use examples or short stories naturally when I explain.',
    'I feel steady speaking to a group of people.',
    'I adjust my words for different audiences (a child, a boss, a client).',
    'I can handle a tough question on the spot.'
  ];

  // ---------- Onboarding ----------
  App.route('welcome', function (el) {
    var step = 0, answers = [], data = { goal: null, level: 'L1' };
    function draw() {
      var s = Store.get();
      var html = '<div class="onb">';
      if (step === 0) {
        html += '<div class="curtain-hero"><h1 class="brand-xl">Rostrum</h1><p class="tag">Say it. See exactly what happened. Say it better, right now.</p></div>' +
          '<div class="card"><h2>Before we start: your voice stays here</h2><ul class="plain">' +
          '<li>🎙 Rostrum uses your <strong>microphone</strong> only while you hold the stage. You\'ll always see when it\'s recording.</li>' +
          '<li>🔒 Recordings and progress are stored <strong>only on this device</strong>. No account, no servers, no AI service.</li>' +
          '<li>⚙ Measurements (pace, pauses, pitch, fillers) are computed <strong>in your browser</strong>.</li>' +
          '<li>✎ Transcripts use your browser\'s speech recogniser. Some browsers process that <strong>on-device</strong>; others send audio to the browser maker. You choose in a moment.</li>' +
          '<li>🗑 Unsaved recordings auto-delete after 30 days. Export or erase everything any time in Settings.</li></ul>' +
          '<label class="field"><span>What should I call you? (optional)</span><input id="nm" autocomplete="given-name" value="' + esc(s.profile.name) + '"></label>' +
          '<button class="btn primary lg" data-next>Let\'s begin</button></div>';
      } else if (step === 1) {
        html += '<div class="card"><h2>What do you want to get better at?</h2><div class="grid2">' +
          GOALS.map(function (g) { return '<button class="choice-tile ' + (data.goal === g.id ? 'sel' : '') + '" data-goal="' + g.id + '">' + esc(g.name) + '</button>'; }).join('') +
          '</div><button class="btn primary" data-next ' + (data.goal ? '' : 'disabled') + '>Continue</button></div>';
      } else if (step === 2) {
        html += '<div class="card"><h2>Where are you starting from?</h2><p class="muted">Be honest — this only sets your starting stage. You can explore every level any time.</p><ol class="placement">' +
          PLACEMENT.map(function (q, i) {
            return '<li><p>' + esc(q) + '</p><div class="seg" role="radiogroup" aria-label="' + esc(q) + '">' +
              ['Rarely', 'Sometimes', 'Usually'].map(function (lab, v) { return '<button role="radio" aria-checked="' + (answers[i] === v) + '" class="' + (answers[i] === v ? 'sel' : '') + '" data-q="' + i + '" data-v="' + v + '">' + lab + '</button>'; }).join('') +
              '</div></li>';
          }).join('') + '</ol><button class="btn primary" data-next ' + (answers.filter(function (x) { return x !== undefined; }).length === PLACEMENT.length ? '' : 'disabled') + '>See my starting stage</button></div>';
      } else if (step === 3) {
        var lv = App.level(data.level);
        html += '<div class="card center"><p class="eyebrow">Your starting stage</p><h2 class="stage-name">' + esc(lv.stage) + '</h2><p><strong>' + esc(lv.name) + '</strong> — ' + esc(lv.description) + '</p>' +
          '<div class="seg">' + RC.levels.map(function (l) { return '<button class="' + (l.id === data.level ? 'sel' : '') + '" data-lv="' + l.id + '">' + esc(l.name) + '</button>'; }).join('') + '</div>' +
          '<h3>Transcripts</h3><div id="srinfo" class="muted">Checking what your browser supports…</div>' +
          '<div class="seg" id="srmode">' +
          '<button data-mode="local">On-device only</button><button data-mode="auto">Best available</button><button data-mode="off">Off (audio only)</button></div>' +
          '<button class="btn primary lg" data-next>Take the 60-second Voice Snapshot</button><button class="btn ghost" data-skip>Skip for now</button></div>';
      } else if (step === 4) {
        html += '<div class="card"><p class="eyebrow">Voice Snapshot · 1 of 2</p><h2>Read this aloud, at your natural pace</h2><div id="snap1"></div></div>';
      } else if (step === 5) {
        html += '<div class="card"><p class="eyebrow">Voice Snapshot · 2 of 2</p><h2>Now speak freely for 30–60 seconds</h2><div id="snap2"></div></div>';
      }
      html += '</div>';
      el.innerHTML = html;
      wire();
    }
    function finish() {
      var g = GOALS.find(function (x) { return x.id === data.goal; }) || GOALS[0];
      Store.update(function (s) {
        s.profile.onboarded = true; s.profile.goal = data.goal; s.profile.level = data.level;
        if (!s.path) s.path = { id: g.path, startedAt: Date.now() };
      });
      App.go('#/today');
    }
    function wire() {
      on(el, '[data-next]', 'click', function () {
        if (step === 0) Store.update(function (s) { s.profile.name = ($('#nm').value || '').trim(); });
        if (step === 2) {
          var score = answers.reduce(function (a, b) { return a + b; }, 0);
          data.level = score <= 3 ? 'L1' : score <= 6 ? 'L2' : score <= 9 ? 'L3' : 'L4';
        }
        step++; draw();
      });
      on(el, '[data-skip]', 'click', finish);
      on(el, '[data-goal]', 'click', function (e, b) { data.goal = b.getAttribute('data-goal'); draw(); });
      on(el, '[data-q]', 'click', function (e, b) { answers[+b.getAttribute('data-q')] = +b.getAttribute('data-v'); draw(); });
      on(el, '[data-lv]', 'click', function (e, b) { data.level = b.getAttribute('data-lv'); draw(); });
      if (step === 3) App.renderTranscriptChooser($('#srinfo'), $('#srmode'));
      if (step === 4) {
        App.mountStage($('#snap1'), {
          kind: 'read', targetText: RC.snapshot.passage, seconds: 60, ref: 'snapshot-read', title: '', showForge: false,
          doneLabel: 'Next: speak freely →', onComplete: function () { step = 5; draw(); }
        });
      }
      if (step === 5) {
        App.mountStage($('#snap2'), {
          kind: 'speak', prompt: RC.snapshot.question, seconds: 60, ref: 'snapshot-free', focus: ['opening', 'hedges', 'structure'],
          doneLabel: 'Finish — go to Today', onComplete: finish
        });
      }
    }
    draw();
  });

  App.renderTranscriptChooser = function (info, seg) {
    var p = Store.get().profile;
    function mark() { $$('[data-mode]', seg).forEach(function (b) { b.classList.toggle('sel', b.getAttribute('data-mode') === Store.get().profile.transcriptMode); }); }
    mark();
    on(seg, '[data-mode]', 'click', function (e, b) { Store.update(function (s) { s.profile.transcriptMode = b.getAttribute('data-mode'); }); mark(); });
    if (!Audio2.hasRecognition) {
      info.innerHTML = 'This browser has no speech recognition, so Rostrum will measure your <strong>voice</strong> (pace from audio, pauses, pitch, endings) and you can type what you said for language feedback. Chrome or Edge add live transcripts.';
      Store.update(function (s) { s.profile.transcriptMode = 'off'; }); mark();
      return;
    }
    function describe(sup) {
      if (sup === 'local') info.innerHTML = '✓ Your browser can transcribe <strong>on-device</strong> — fully offline and private.';
      else if (sup === 'local-downloadable') {
        info.innerHTML = 'Your browser can transcribe on-device after a one-time language download. <button class="btn sm" id="dl">Download now</button>';
        $('#dl', info).onclick = function () { info.textContent = 'Downloading…'; Audio2.installLocalRecognition(p.accent).then(function (ok) { remember(ok ? 'local' : sup); describe(ok ? 'local' : 'failed'); }); };
      } else if (sup === 'failed') info.innerHTML = 'Download failed — you can retry later in Settings.';
      else if (sup === 'cloud') info.innerHTML = 'Your browser\'s recogniser runs in the <strong>cloud</strong> (audio goes to the browser maker) and needs a connection. Choose "On-device only" or "Off" to keep audio on this device — you\'ll still get voice measurements and can type your words.';
      else info.innerHTML = 'Live transcripts use your browser\'s speech recogniser. Some browsers can run it <strong>on-device</strong> (private, offline); others send audio to the browser maker. <button class="btn sm" id="chk">Check this browser</button>';
      var chk = $('#chk', info);
      if (chk) chk.onclick = function () { info.textContent = 'Checking…'; Audio2.recognitionSupport(p.accent).then(function (r) { remember(r); describe(r); }); };
    }
    function remember(v) { App.localSR = v; Store.update(function (s) { s.profile.localSR = v; }); }
    describe(App.localSR);
  };

  // ---------- Progress helpers ----------
  App.unlockedLevel = function () {
    var xp = Store.get().xp, lv = RC.levels[0];
    RC.levels.forEach(function (l) { if (xp >= l.xpToUnlock) lv = l; });
    return lv;
  };
  App.nextLesson = function () {
    var s = Store.get();
    if (s.path) {
      var p = RC.paths.find(function (x) { return x.id === s.path.id; });
      if (p) for (var w = 0; w < p.weeks.length; w++) for (var i = 0; i < p.weeks[w].lessonIds.length; i++) {
        var id = p.weeks[w].lessonIds[i];
        if (!s.completed[id] && App.lesson(id)) return { lesson: App.lesson(id), week: p.weeks[w], path: p };
      }
    }
    var order = RC.levels.map(function (l) { return l.id; });
    var start = Math.max(0, order.indexOf(s.profile.level));
    for (var k = start; k < order.length; k++) {
      var l = RC.lessons.find(function (x) { return x.level === order[k] && !s.completed[x.id]; });
      if (l) return { lesson: l };
    }
    return null;
  };
  App.suggestDrill = function () {
    var fp = Store.get().fingerprint.slice(-8);
    if (!fp.length) return 'rd2';
    var avg = function (k) { var v = fp.map(function (f) { return f[k]; }).filter(function (x) { return typeof x === 'number'; }); return v.length ? v.reduce(function (a, b) { return a + b; }, 0) / v.length : null; };
    if (fp.filter(function (f) { return f.openingClean === false; }).length >= fp.length / 2) return 'rd2';
    if ((avg('hedgesPer100') || 0) >= 3) return 'rd4';
    if ((avg('fillersPerMin') || 0) >= 5) return 'rd10';
    if (fp.filter(function (f) { return f.finalEnding === 'rising'; }).length >= 2) return 'rd3';
    return App.seeded(['rd1', 'rd3', 'rd5', 'rd6', 'rd9'], Store.dayKey());
  };

  // ---------- Today ----------
  App.route('today', function (el) {
    var s = Store.get(), p = s.profile;
    var lv = App.unlockedLevel(), streak = Store.streak();
    var nx = App.nextLesson();
    var drill = RC.roomDrills.find(function (d) { return d.id === App.suggestDrill(); });
    var due = s.words.filter(function (w) { return SRS.isDue(w.card); }).length;
    var prompt = App.seeded(RC.prompts.filter(function (x) { return x.level <= (+p.level.slice(1)) + 1; }), Store.dayKey());
    var upcoming = s.realMoments.filter(function (m) { return !m.done; }).sort(function (a, b) { return a.date.localeCompare(b.date); })[0];
    var nerves = sessionStorage.getItem('nerves-before');
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    var html = '<header class="today-head"><div><p class="eyebrow">' + esc(lv.stage) + ' · ' + esc(lv.name) + '</p><h1>' + greet + (p.name ? ', ' + esc(p.name) : '') + '.</h1></div>' +
      '<div class="stats"><div><b>' + streak + '</b><span>day streak</span></div><div><b>' + s.xp + '</b><span>XP</span></div><div><b>' + s.restTokens + '</b><span>rest days</span></div></div></header>';
    if (!nerves) {
      html += '<div class="card nerves"><h3>Before you start: how are your nerves about speaking today?</h3><div class="scale" role="radiogroup" aria-label="Nerves 1 to 5">' +
        [1, 2, 3, 4, 5].map(function (n) { return '<button role="radio" data-nerve="' + n + '">' + n + '<small>' + ['calm', '', 'some', '', 'very'][n - 1] + '</small></button>'; }).join('') +
        '</div><p class="muted small">This goes in your private Courage Ledger. Confidence isn\'t something an app can read from your voice — but you can track it.</p></div>';
    }
    html += '<h2 class="section-h">Today\'s session <small>5–10 minutes</small></h2><ol class="plan">';
    var rd8 = RC.roomDrills.find(function (d) { return d.measure === 'warmup'; });
    if (rd8) html += planItem('#/gym/room/' + rd8.id, '1 min', 'Warm up', rd8.name, rd8.goal);
    if (nx) html += planItem('#/lesson/' + nx.lesson.id, nx.lesson.minutes + ' min', nx.path ? nx.path.name + ' · week ' + nx.week.week : 'Next lesson', nx.lesson.title, App.skill(nx.lesson.skill).name + ' · ' + App.level(nx.lesson.level).name);
    if (drill) html += planItem('#/gym/room/' + drill.id, '2 min', 'Own the Room drill', drill.name, drill.goal);
    if (due) html += planItem('#/words/review', '2 min', 'Word Bank', due + ' word' + (due > 1 ? 's' : '') + ' to say aloud', 'Recall by speaking, not tapping.');
    html += planItem('#/gym/impromptu/' + prompt.id, '1 min', 'Impromptu', '“' + prompt.text + '”', 'Speak for 60 seconds. One point, one example.');
    html += '</ol>';
    if (upcoming) html += '<a class="card link-card" href="#/journey/moments"><p class="eyebrow">Real Moment · ' + esc(upcoming.date) + '</p><h3>' + esc(upcoming.title) + '</h3><p class="muted">Your rehearsal plan is ready.</p></a>';
    if (nerves) html += '<div class="card"><h3>Finished for today?</h3><p class="muted">How are your nerves now? (you said ' + nerves + ' before)</p><div class="scale">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-after="' + n + '">' + n + '</button>'; }).join('') + '</div></div>';
    if (s.restTokens > 0 && !s.days[Store.dayKey(Date.now() - 86400000)] && streak === 0 && Object.keys(s.days).length) html += '<p class="muted small">Missed yesterday? <button class="btn ghost sm" data-rest>Use a rest day</button> — life happens.</p>';
    el.innerHTML = html;
    on(el, '[data-nerve]', 'click', function (e, b) { sessionStorage.setItem('nerves-before', b.getAttribute('data-nerve')); App.render(); });
    on(el, '[data-after]', 'click', function (e, b) {
      var after = +b.getAttribute('data-after');
      Store.update(function (st) { st.courage.push({ ts: Date.now(), before: +nerves, after: after, takes: st.takes.filter(function (t) { return t.ts > Date.now() - 3 * 3600000; }).length }); });
      sessionStorage.removeItem('nerves-before');
      App.toast(after < +nerves ? 'Nerves down from ' + nerves + ' to ' + after + '. That\'s courage, logged.' : 'Logged. Showing up nervous is exactly how confidence is built.');
      App.render();
    });
    on(el, '[data-rest]', 'click', function () { if (Store.takeRestDay()) { App.toast('Rest day used. Streak protected.'); App.render(); } });
  });
  function planItem(href, time, kicker, title, sub) {
    return '<li><a class="plan-item" href="' + href + '"><span class="pi-time">' + esc(time) + '</span><span class="pi-body"><span class="eyebrow">' + esc(kicker) + '</span><strong>' + esc(title) + '</strong><span class="muted">' + esc(sub) + '</span></span><span class="pi-go" aria-hidden="true">→</span></a></li>';
  }

  // ---------- Learn ----------
  App.route('learn', function (el, args) {
    var s = Store.get();
    var sel = args[0] || s.profile.level;
    var unlocked = App.unlockedLevel();
    var html = '<h1>Learn</h1><p class="muted">Structured lessons from Foundations to Masterful. Each one teaches a technique, shows a before/after, and makes you say it.</p>';
    html += '<div class="level-tabs" role="tablist">' + RC.levels.map(function (l) {
      var done = RC.lessons.filter(function (x) { return x.level === l.id && s.completed[x.id]; }).length;
      var total = RC.lessons.filter(function (x) { return x.level === l.id; }).length;
      return '<a role="tab" aria-selected="' + (l.id === sel) + '" class="lvtab ' + (l.id === sel ? 'sel' : '') + '" href="#/learn/' + l.id + '"><span class="stage-mini">' + esc(l.stage) + '</span><b>' + esc(l.name) + '</b><span class="prog"><i style="width:' + Math.round(done * 100 / Math.max(1, total)) + '%"></i></span><small>' + done + '/' + total + (s.xp < l.xpToUnlock ? ' · stage opens at ' + l.xpToUnlock + ' XP' : '') + '</small></a>';
    }).join('') + '</div>';
    var L = App.level(sel);
    html += '<p class="lv-desc"><strong>' + esc(L.tagline) + '</strong> ' + esc(L.description) + '</p>';
    if (s.xp < L.xpToUnlock) html += '<p class="note">ⓘ You\'re at ' + s.xp + ' XP. The ' + esc(L.stage) + ' stage officially opens at ' + L.xpToUnlock + ' XP, but you\'re welcome to explore.</p>';
    RC.skills.forEach(function (sk) {
      var ls = RC.lessons.filter(function (x) { return x.level === sel && x.skill === sk.id; });
      if (!ls.length) return;
      html += '<section class="skill-row"><h2><span class="glyph" aria-hidden="true">' + esc(sk.glyph) + '</span> ' + esc(sk.name) + '</h2><div class="lesson-cards">' +
        ls.map(function (l) { return '<a class="lesson-card ' + (s.completed[l.id] ? 'done' : '') + '" href="#/lesson/' + l.id + '"><span class="eyebrow">' + l.minutes + ' min' + (s.completed[l.id] ? ' · ✓ done' : '') + '</span><strong>' + esc(l.title) + '</strong><span class="muted">' + esc(l.useCase.context) + '</span></a>'; }).join('') + '</div></section>';
    });
    html += '<h2 class="section-h">4-week paths</h2><div class="paths">' + RC.paths.map(function (p) {
      var ids = [].concat.apply([], p.weeks.map(function (w) { return w.lessonIds; }));
      var done = ids.filter(function (id) { return s.completed[id]; }).length;
      var active = s.path && s.path.id === p.id;
      return '<div class="card path ' + (active ? 'active' : '') + '"><h3>' + esc(p.name) + '</h3><p class="muted">' + esc(p.description) + '</p><p class="small">' + done + '/' + ids.length + ' lessons</p>' +
        '<details><summary>See the 4 weeks</summary><ol>' + p.weeks.map(function (w) { return '<li><strong>' + esc(w.focus) + '</strong><ul>' + w.lessonIds.map(function (id) { var l = App.lesson(id); return l ? '<li><a href="#/lesson/' + id + '">' + (s.completed[id] ? '✓ ' : '') + esc(l.title) + '</a></li>' : ''; }).join('') + '</ul></li>'; }).join('') + '</ol></details>' +
        (active ? '<span class="badge">Your path</span>' : '<button class="btn sm" data-path="' + p.id + '">Follow this path</button>') + '</div>';
    }).join('') + '</div>';
    el.innerHTML = html;
    on(el, '[data-path]', 'click', function (e, b) { Store.update(function (st) { st.path = { id: b.getAttribute('data-path'), startedAt: Date.now() }; }); App.toast('Path set. Today will follow it.'); App.render(); });
  });

  // ---------- Lesson player ----------
  App.route('lesson', function (el, args) {
    var l = App.lesson(args[0]);
    if (!l) { el.innerHTML = '<p>Lesson not found. <a href="#/learn">Back to Learn</a></p>'; return; }
    var s = Store.get();
    var sk = App.skill(l.skill), lv = App.level(l.level);
    var html = '<nav class="crumbs"><a href="#/learn/' + l.level + '">← ' + esc(lv.name) + '</a></nav>' +
      '<header class="lesson-head"><p class="eyebrow"><span class="glyph">' + esc(sk.glyph) + '</span> ' + esc(sk.name) + ' · ' + esc(lv.name) + ' · ' + l.minutes + ' min</p><h1>' + esc(l.title) + '</h1></header>' +
      '<section class="card concept">' + l.concept.split('\n\n').map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      '<ul class="keypoints">' + l.keyPoints.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="card beforeafter"><h3>Before → After</h3><div class="ba"><div class="weak"><span class="eyebrow">Before</span><p>“' + esc(l.example.weak) + '”</p>' + App.ttsButton(l.example.weak) + '</div>' +
      '<div class="strong"><span class="eyebrow">After</span><p>“' + esc(l.example.strong) + '”</p>' + App.ttsButton(l.example.strong) + '</div></div><p class="why">' + esc(l.example.why) + '</p></section>' +
      '<section class="card usecase"><span class="eyebrow">Use it in real life · ' + esc(l.useCase.context) + '</span><p>' + esc(l.useCase.scenario) + '</p></section>' +
      '<h2 class="section-h">Practice</h2>' +
      l.exercises.map(function (x, i) { return '<section class="card exercise" id="ex' + i + '"><p class="eyebrow">Exercise ' + (i + 1) + ' of ' + l.exercises.length + ' · ' + esc(exLabel(x.type)) + (s.exercisesDone[l.id + ':' + i] ? ' · ✓' : '') + '</p><div class="ex-body"></div></section>'; }).join('') +
      '<section class="card checklist"><h3>Self-check</h3><ul>' + l.checklist.map(function (c, i) { return '<li><label><input type="checkbox" data-ck="' + i + '"> ' + esc(c) + '</label></li>'; }).join('') + '</ul>' +
      '<button class="btn primary" data-complete>' + (s.completed[l.id] ? 'Completed ✓ — mark again' : 'Complete lesson (+50 XP)') + '</button></section>';
    el.innerHTML = html;
    l.exercises.forEach(function (x, i) { App.renderExercise($('#ex' + i + ' .ex-body', el), x, l, i); });
    on(el, '[data-complete]', 'click', function () {
      var first = !Store.get().completed[l.id];
      Store.update(function (st) { st.completed[l.id] = Date.now(); });
      if (first) Store.addXp(50, 'lesson complete');
      var nx = App.nextLesson();
      el.querySelector('.checklist').insertAdjacentHTML('beforeend', '<div class="done-banner"><p>🎭 Lesson complete.</p>' + (nx ? '<a class="btn primary" href="#/lesson/' + nx.lesson.id + '">Next: ' + esc(nx.lesson.title) + ' →</a>' : '') + ' <a class="btn" href="#/today">Back to Today</a></div>');
    });
  });
  function exLabel(t) { return { choice: 'Quick check', rewrite: 'Rewrite & say it', build: 'Build it, then say it', speak: 'Speak', read: 'Read aloud' }[t] || t; }

  function markDone(l, i) {
    var k = l.id + ':' + i;
    if (!Store.get().exercisesDone[k]) { Store.update(function (s) { s.exercisesDone[k] = Date.now(); }); Store.addXp(10, 'exercise'); }
  }

  App.renderExercise = function (box, x, l, i) {
    if (x.type === 'choice') {
      box.innerHTML = '<p class="q">' + esc(x.question) + '</p><div class="options">' + x.options.map(function (o, k) { return '<button class="opt" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div><p class="explain" hidden></p>';
      on(box, '[data-k]', 'click', function (e, b) {
        var k = +b.getAttribute('data-k');
        $$('.opt', box).forEach(function (o, idx) { o.disabled = true; if (idx === x.answer) o.classList.add('right'); });
        if (k !== x.answer) b.classList.add('wrong');
        var ex = $('.explain', box); ex.hidden = false; ex.textContent = (k === x.answer ? '✓ Right. ' : 'Not quite. ') + x.explain;
        markDone(l, i);
      });
    } else if (x.type === 'rewrite') {
      box.innerHTML = '<p class="q">' + esc(x.instruction) + '</p><blockquote>“' + esc(x.original) + '”</blockquote>' +
        '<label class="field"><span>Your version</span><textarea rows="3"></textarea></label>' +
        (x.hints && x.hints.length ? '<details><summary>Hints</summary><ul>' + x.hints.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></details>' : '') +
        '<div class="row"><button class="btn" data-check>Check my rewrite</button><button class="btn ghost sm" data-model>Show a model answer</button></div><div class="rw-out"></div><div class="rw-stage"></div>';
      on(box, '[data-model]', 'click', function () { $('.rw-out', box).innerHTML = '<p class="model">Model: “' + esc(x.model) + '” ' + App.ttsButton(x.model) + '</p>'; });
      on(box, '[data-check]', 'click', function () {
        var mine = $('textarea', box).value.trim();
        if (!mine) return;
        var a0 = Analysis.analyzeText(x.original), a1 = Analysis.analyzeText(mine);
        var notes = [];
        if (a1.wordCount < a0.wordCount) notes.push('✓ ' + (a0.wordCount - a1.wordCount) + ' words shorter.');
        else if (x.goal === 'shorter') notes.push('○ Same length or longer — try cutting more.');
        if (a1.hedgeCount < a0.hedgeCount) notes.push('✓ Hedges removed (' + a0.hedgeCount + ' → ' + a1.hedgeCount + ').');
        else if (a1.hedgeCount && x.goal === 'no-hedges') notes.push('○ Still hedging: ' + Object.keys(a1.hedges).join(', '));
        if (x.goal === 'concrete') notes.push(a1.structure.example || /\d/.test(mine) ? '✓ Has a concrete detail (number, example or instance).' : '○ Add a number, a name, or a moment.');
        if (x.goal === 'active' && /\b(was|were|been|being|is|are)\s+\w+ed\b/i.test(mine)) notes.push('○ Looks passive ("' + mine.match(/\b(was|were|been|being|is|are)\s+\w+ed\b/i)[0] + '"). Who did it?');
        if (a1.grammar.length) notes.push('○ Check: ' + a1.grammar[0].name);
        $('.rw-out', box).innerHTML = '<ul class="checks">' + notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul><p class="model">One model answer: “' + esc(x.model) + '”</p><p class="muted small">There\'s more than one good rewrite. Now say yours aloud — out loud is where it counts.</p>';
        App.mountStage($('.rw-stage', box), { kind: 'read', targetText: mine, seconds: 30, ref: l.id + ':' + i, focus: ['hedges', 'ending'], showForge: false, doneLabel: 'Done', onComplete: function () { markDone(l, i); App.toast('Exercise done'); } });
        markDone(l, i);
      });
    } else if (x.type === 'build') {
      box.innerHTML = '<p class="q">' + esc(x.instruction) + '</p>' + x.fields.map(function (f, k) { return '<label class="field"><span>' + esc(f.label) + '</span><input data-f="' + k + '" placeholder="' + esc(f.placeholder) + '"></label>'; }).join('') +
        '<button class="btn" data-build>Make my cue card</button><div class="b-stage"></div>';
      on(box, '[data-build]', 'click', function () {
        var vals = $$('[data-f]', box).map(function (inp, k) { return { label: x.fields[k].label, v: inp.value.trim() }; });
        var cue = '<ol class="cuecard">' + vals.map(function (v) { return '<li><b>' + esc(v.label) + '</b> ' + esc(v.v || '…') + '</li>'; }).join('') + '</ol>';
        App.mountStage($('.b-stage', box), { kind: 'speak', prompt: x.speakPrompt, cue: cue, seconds: x.seconds || 60, ref: l.id + ':' + i, focus: ['structure'], onComplete: function () { markDone(l, i); App.toast('Exercise done'); } });
      });
    } else if (x.type === 'speak' || x.type === 'read') {
      box.innerHTML = (x.tip ? '<p class="tip">💡 ' + esc(x.tip) + '</p>' : '') + '<div class="sp-stage"></div>';
      App.mountStage($('.sp-stage', box), {
        kind: x.type, prompt: x.type === 'speak' ? x.prompt : 'Read this aloud. " / " marks a pause; CAPS mark emphasis.', targetText: x.type === 'read' ? x.text : null,
        seconds: x.seconds || (x.type === 'read' ? 45 : 60), ref: l.id + ':' + i, focus: x.focus || [],
        cue: x.type === 'read' && Audio2.hasTTS ? App.ttsButton(App.cleanScript(x.text), 'Hear a model', 0.95) + App.ttsButton(App.cleanScript(x.text), 'Slow', 0.7) : '',
        onComplete: function () { markDone(l, i); App.toast('Exercise done'); }
      });
    }
  };
})(window);
