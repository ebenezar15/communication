/* Rostrum: Word Bank, Journey (Fingerprint, trends, Courage Ledger, recordings, Real Moment Prep), Settings. */
(function (root) {
  'use strict';
  var App = root.App, RC = root.RC;
  var esc = App.esc, $ = App.$, $$ = App.$$, on = App.on;
  var DAY = 86400000;

  // ---------- Word Bank ----------
  App.route('words', function (el, args) {
    if (args[0] === 'review') return review(el);
    var s = Store.get();
    var tab = args[0] || 'mine';
    var due = s.words.filter(function (w) { return SRS.isDue(w.card); });
    var html = '<h1>Word Bank</h1><p class="muted">Words come from what you tried to say. You review them by <strong>speaking</strong> them in fresh sentences — and when one shows up naturally in your free speech, it\'s yours.</p>' +
      '<div class="row"><a class="btn primary ' + (due.length ? '' : 'disabled') + '" href="#/words/review" ' + (due.length ? '' : 'aria-disabled="true"') + '>Review ' + due.length + ' due</a>' +
      '<span class="muted small">' + s.words.length + ' words · ' + s.words.filter(function (w) { return w.owned; }).length + ' owned</span></div>' +
      '<div class="tabs"><a class="' + (tab === 'mine' ? 'sel' : '') + '" href="#/words/mine">My words</a><a class="' + (tab === 'library' ? 'sel' : '') + '" href="#/words/library">Library</a></div>';
    if (tab === 'library') {
      html += '<label class="field"><span>Search</span><input id="wq" placeholder="e.g. mitigate, concise…"></label><div class="word-grid" id="lib"></div>';
    } else {
      html += '<details class="card"><summary>Add your own word</summary><div class="grid2"><label class="field"><span>Word or phrase</span><input id="nw"></label><label class="field"><span>Meaning (optional)</span><input id="nm"></label></div><button class="btn sm" id="nwadd">Add</button></details>';
      html += s.words.length ? '<div class="word-grid">' + s.words.map(wordCard).join('') + '</div>' : '<p class="empty">No words yet. Add some from the Library, or practise — Rostrum suggests upgrades for vague words you use.</p>';
    }
    el.innerHTML = html;
    if (tab === 'library') {
      var draw = function () {
        var q = ($('#wq', el).value || '').toLowerCase();
        var have = {}; Store.get().words.forEach(function (w) { have[w.word.toLowerCase()] = 1; });
        $('#lib', el).innerHTML = RC.wordSeed.filter(function (w) { return !q || w.word.indexOf(q) >= 0 || (w.meaning || '').toLowerCase().indexOf(q) >= 0; }).map(function (w) {
          return '<div class="card word"><div class="row between"><h3>' + esc(w.word) + '</h3><span class="badge">' + esc(w.register) + '</span></div><p class="ipa">' + esc(w.ipa) + '</p><p>' + esc(w.meaning) + '</p>' +
            (w.replaces && w.replaces.length ? '<p class="small muted">Instead of: ' + esc(w.replaces.join(', ')) + '</p>' : '') +
            '<div class="row">' + App.ttsButton(w.word) + (have[w.word.toLowerCase()] ? '<span class="badge">✓ in bank</span>' : '<button class="btn sm" data-add="' + esc(w.word) + '">+ Add</button>') + '</div></div>';
        }).join('');
      };
      $('#wq', el).oninput = draw; draw();
      on(el, '[data-add]', 'click', function (e, b) { App.addWord(b.getAttribute('data-add')); draw(); });
    } else {
      var add = $('#nwadd', el);
      if (add) add.onclick = function () { var w = $('#nw', el).value.trim(); if (!w) return; if (App.addWord(w)) { var m = $('#nm', el).value.trim(); if (m) Store.update(function (st) { st.words[st.words.length - 1].meaning = m; }); App.render(); } };
      on(el, '[data-del]', 'click', function (e, b) { App.confirmTap(b, 'Tap again to remove', function () { Store.update(function (st) { st.words = st.words.filter(function (w) { return w.word !== b.getAttribute('data-del'); }); }); App.render(); }); });
    }
  });
  function wordCard(w) {
    var days = Math.round((w.card.due - Date.now()) / DAY);
    return '<div class="card word ' + (w.owned ? 'owned' : '') + '"><div class="row between"><h3>' + esc(w.word) + (w.owned ? ' <span class="star" title="Used in the wild">★</span>' : '') + '</h3><span class="badge">' + esc(w.register || '') + '</span></div>' +
      (w.ipa ? '<p class="ipa">' + esc(w.ipa) + '</p>' : '') + (w.meaning ? '<p>' + esc(w.meaning) + '</p>' : '') +
      (w.collocations && w.collocations.length ? '<p class="small"><b>Goes with:</b> ' + esc(w.collocations.join(' · ')) + '</p>' : '') +
      (w.misuse ? '<p class="small warn-t">⚠ ' + esc(w.misuse) + '</p>' : '') +
      '<p class="small muted">' + (w.owned ? 'Owned · used ' + (w.wildUses || 1) + '× in free speech' : 'Source: ' + esc(w.source || '')) + ' · ' + (days <= 0 ? 'due now' : 'next review in ' + days + 'd') + '</p>' +
      '<div class="row">' + App.ttsButton(w.word) + '<button class="btn ghost sm" data-del="' + esc(w.word) + '">Remove</button></div></div>';
  }

  function review(el) {
    var queue = Store.get().words.filter(function (w) { return SRS.isDue(w.card); });
    var i = 0;
    function next() {
      var w = queue[i];
      if (!w) { el.innerHTML = '<h1>Review done</h1><p>Every due word said aloud. Now try to use one in real conversation today — Rostrum will notice when it shows up in your practice.</p><a class="btn primary" href="#/today">Back to Today</a>'; return; }
      el.innerHTML = '<nav class="crumbs"><a href="#/words">← Word Bank</a></nav><p class="eyebrow">Review ' + (i + 1) + ' of ' + queue.length + '</p>' +
        '<div class="card word-review"><h1>' + esc(w.word) + '</h1>' + (w.ipa ? '<p class="ipa">' + esc(w.ipa) + '</p>' : '') + App.ttsButton(w.word) +
        '<details><summary>Show meaning & examples</summary>' + (w.meaning ? '<p>' + esc(w.meaning) + '</p>' : '') + (w.example ? '<p><em>“' + esc(w.example) + '”</em></p>' : '') + (w.collocations && w.collocations.length ? '<p class="small">Goes with: ' + esc(w.collocations.join(' · ')) + '</p>' : '') + '</details>' +
        '<p>Say a <strong>fresh sentence</strong> using “' + esc(w.word) + '” — about your own life or work.</p><div id="wst"></div>' +
        '<div class="rate" hidden><p>How did that feel?</p><div class="row">' + [['1', 'Again'], ['2', 'Hard'], ['3', 'Good'], ['4', 'Easy']].map(function (r) { return '<button class="btn" data-r="' + r[0] + '">' + r[1] + '</button>'; }).join('') + '</div></div></div>';
      App.mountStage($('#wst', el), { kind: 'speak', seconds: 20, ref: 'word:' + w.word, showForge: false,
        onTake: function (take) {
          $('.rate', el).hidden = false;
          var used = take.ev.text && take.ev.text.tokens.join(' ').indexOf(Analysis.tokenize(w.word).join(' ').replace(/(e|y)$/, '')) >= 0;
          if (!take.ev.transcript) return '<p class="small muted">No transcript — rate yourself honestly.</p>';
          return '<div class="fb-card ' + (used ? 'pass' : 'miss') + '"><p>' + (used ? '✓ You used “' + esc(w.word) + '”.' : '○ I didn\'t hear “' + esc(w.word) + '” — the recogniser may have missed it, or try again.') + '</p></div>';
        } });
      on(el, '[data-r]', 'click', function (e, b) {
        var r = +b.getAttribute('data-r');
        Store.update(function (s) { var x = s.words.find(function (y) { return y.word === w.word; }); if (x) x.card = SRS.review(x.card, r); });
        Store.addXp(5, 'word reviewed');
        i++; next();
      });
    }
    next();
  }

  // ---------- Journey ----------
  App.route('journey', function (el, args) {
    if (args[0] === 'moments') return moments(el);
    var s = Store.get();
    var fp = s.fingerprint.slice(-30);
    var html = '<h1>Journey</h1>';
    // Stages
    html += '<section class="card"><h2>Your stages</h2><div class="stages">' + RC.levels.map(function (l) {
      var open = s.xp >= l.xpToUnlock;
      return '<div class="stage-step ' + (open ? 'open' : '') + '"><span class="stage-mini">' + esc(l.stage) + '</span><b>' + esc(l.name) + '</b><small>' + (open ? 'open' : l.xpToUnlock + ' XP') + '</small></div>';
    }).join('') + '</div><p class="small muted">' + s.xp + ' XP · ' + Object.keys(s.completed).length + ' lessons · ' + s.takes.length + ' takes · ' + s.takes.filter(function (t) { return t.n > 1; }).length + ' second takes</p>' + calendar(s) + '</section>';
    // Fingerprint
    html += '<section class="card"><div class="row between"><h2>Speech Fingerprint</h2>' + (fp.length ? '<button class="btn ghost sm" data-fpreset>Reset</button>' : '') + '</div>';
    if (fp.length < 2) html += '<p class="muted">Record a few takes and your patterns will appear here: crutch words, hedging rate, pace range, how your sentences end, and your strengths. You can inspect, correct and delete anything.</p>';
    else html += fingerprint(fp);
    html += '</section>';
    // Trends
    if (fp.length >= 3) html += '<section class="card"><h2>Trends <small class="muted">last ' + fp.length + ' takes</small></h2><div class="trends">' +
      trend(fp, 'hedgesPer100', 'Hedges / 100 words', 'lower') + trend(fp, 'fillersPerMin', 'Fillers / min', 'lower') + trend(fp, 'wpm', 'Pace (wpm)', null) + trend(fp, 'pitchRangeSt', 'Pitch range (st)', 'higher') +
      '</div><p class="small muted">Trends, not a single master score. Good pace depends on the room.</p></section>';
    // Courage Ledger
    html += '<section class="card"><h2>Courage Ledger</h2>';
    if (s.courage.length) {
      var avgB = avg(s.courage.map(function (c) { return c.before; })), avgA = avg(s.courage.map(function (c) { return c.after; }));
      html += '<p>Across ' + s.courage.length + ' sessions, nerves went from <b>' + avgB.toFixed(1) + '</b> before to <b>' + avgA.toFixed(1) + '</b> after, on average.</p><ul class="ledger">' +
        s.courage.slice(-8).reverse().map(function (c) { return '<li>' + new Date(c.ts).toLocaleDateString() + ': ' + c.before + ' → ' + c.after + (c.takes ? ' · ' + c.takes + ' takes' : '') + '</li>'; }).join('') + '</ul>';
    } else html += '<p class="muted">Rate your nerves at the start and end of a Today session to start your ledger.</p>';
    var behaviours = [
      ['Second takes recorded', s.takes.filter(function (t) { return t.n > 1; }).length],
      ['Arena scenes finished', Object.keys(s.drills).filter(function (k) { return k.indexOf('arena-') === 0; }).reduce(function (a, k) { return a + s.drills[k].count; }, 0)],
      ['Clean openings', s.takes.filter(function (t) { return t.metrics && t.metrics.openingClean; }).length],
      ['Landed (falling) endings', s.takes.filter(function (t) { return t.metrics && t.metrics.finalEnding === 'falling'; }).length]
    ];
    html += '<div class="chips">' + behaviours.map(function (b) { return '<span class="chip"><b>' + b[1] + '</b> ' + esc(b[0]) + '</span>'; }).join('') + '</div>';
    var then = s.takes.slice().reverse().find(function (t) { return t.hasAudio && t.metrics && t.metrics.openingClean === false; });
    var now = s.takes.find(function (t) { return t.hasAudio && t.metrics && t.metrics.openingClean === true && (!then || t.ts > then.ts); });
    if (then && now) html += '<div class="thenNow"><p><b>Then vs now.</b> ' + timeAgo(then.ts) + ' you opened with "' + esc((then.transcript || '').split(' ').slice(0, 4).join(' ')) + '…". Listen to a recent opening.</p><div class="row"><button class="btn sm" data-aud="' + then.id + '">▶ Then</button><button class="btn sm" data-aud="' + now.id + '">▶ Now</button></div></div>';
    html += '</section>';
    // Highlight reel
    var week = s.takes.filter(function (t) { return t.ts > Date.now() - 7 * DAY && t.hasAudio && t.strength; }).slice(0, 5);
    html += '<section class="card"><h2>This week\'s Highlight Reel</h2>' + (week.length ? '<ul class="reel">' + week.map(function (t) { return '<li><button class="btn ghost sm" data-aud="' + t.id + '">▶</button> <span><b>' + esc(t.title) + '</b><br><span class="small muted">' + esc(t.strength) + '</span></span></li>'; }).join('') + '</ul>' : '<p class="muted">Your best moments this week will collect here.</p>') + '</section>';
    // Real moments
    html += '<a class="card link-card" href="#/journey/moments"><h2>Real Moment Prep →</h2><p class="muted">An interview on Friday? A toast on Sunday? Get a rehearsal plan.</p></a>';
    // Recordings
    html += '<section class="card"><h2>Recordings</h2><p class="small muted">Unsaved audio is deleted after 30 days; metrics stay. ☆ Save keeps a take.</p>' + (s.takes.length ? '<ul class="takes">' + s.takes.slice(0, 40).map(function (t) {
      return '<li><div><b>' + esc(t.title).slice(0, 80) + '</b> <span class="small muted">' + new Date(t.ts).toLocaleString() + (t.n > 1 ? ' · take ' + t.n : '') + '</span>' + (t.fix ? '<br><span class="small">Fix: ' + esc(t.fix) + '</span>' : '') + '</div><div class="row">' +
        (t.hasAudio ? '<button class="btn ghost sm" data-aud="' + t.id + '" aria-label="Play">▶</button><button class="btn ghost sm" data-save="' + t.id + '" aria-label="' + (t.saved ? 'Unsave' : 'Save') + '">' + (t.saved ? '★' : '☆') + '</button>' : '<span class="small muted">audio expired</span>') +
        '<button class="btn ghost sm" data-deltake="' + t.id + '" aria-label="Delete">✕</button></div></li>';
    }).join('') + '</ul>' : '<p class="muted">No recordings yet.</p>') + '</section>';
    el.innerHTML = html + '<audio id="jaudio"></audio>';
    var player = $('#jaudio', el);
    on(el, '[data-aud]', 'click', function (e, b) {
      Store.getAudio(b.getAttribute('data-aud')).then(function (blob) {
        if (!blob) return App.toast('Audio not available.');
        if (player.src) URL.revokeObjectURL(player.src);
        player.src = URL.createObjectURL(blob); player.play();
      });
    });
    on(el, '[data-save]', 'click', function (e, b) { Store.update(function (st) { var t = st.takes.find(function (x) { return x.id === b.getAttribute('data-save'); }); if (t) t.saved = !t.saved; }); App.render(); });
    on(el, '[data-deltake]', 'click', function (e, b) { var id = b.getAttribute('data-deltake'); Store.deleteAudio(id); Store.update(function (st) { st.takes = st.takes.filter(function (x) { return x.id !== id; }); }); App.render(); });
    on(el, '[data-fpreset]', 'click', function (e, b) { App.confirmTap(b, 'Tap again to reset', function () { Store.update(function (st) { st.fingerprint = []; }); App.render(); }); });
    on(el, '[data-forget]', 'click', function (e, b) {
      var parts = b.getAttribute('data-forget').split(':'), k = parts[0], v = parts[1];
      Store.update(function (st) { st.fingerprint.forEach(function (f) { if (v && f[k] && typeof f[k] === 'object') { if (Array.isArray(f[k])) f[k] = f[k].filter(function (x) { return x !== v; }); else delete f[k][v]; } else delete f[k]; }); });
      App.toast('Removed from your Fingerprint.'); App.render();
    });
  });

  function avg(a) { a = a.filter(function (x) { return typeof x === 'number' && !isNaN(x); }); return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
  function timeAgo(ts) { var d = Math.round((Date.now() - ts) / DAY); return d <= 0 ? 'Earlier today' : d === 1 ? 'Yesterday' : d < 14 ? d + ' days ago' : Math.round(d / 7) + ' weeks ago'; }
  function sumDicts(fp, key) { var o = {}; fp.forEach(function (f) { var d = f[key] || {}; if (Array.isArray(d)) d.forEach(function (x) { o[x] = (o[x] || 0) + 1; }); else Object.keys(d).forEach(function (k) { o[k] = (o[k] || 0) + d[k]; }); }); return o; }
  function topN(o, n) { return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, n).filter(function (k) { return o[k] >= 2; }); }

  function fingerprint(fp) {
    var hed = sumDicts(fp, 'hedges'), fil = sumDicts(fp, 'fillers'), gr = sumDicts(fp, 'grammar'), ww = sumDicts(fp, 'weakWords');
    var wpms = fp.map(function (f) { return f.wpm; }).filter(Boolean);
    var endings = fp.filter(function (f) { return f.finalEnding; });
    var falling = endings.filter(function (f) { return f.finalEnding === 'falling'; }).length;
    var opens = fp.filter(function (f) { return f.openingClean !== undefined; });
    var clean = opens.filter(function (f) { return f.openingClean; }).length;
    var ex = fp.filter(function (f) { return f.example !== undefined && f.example !== null; });
    var rows = [];
    function row(label, val, forget, good) { rows.push('<li class="' + (good ? 'good' : '') + '"><span>' + esc(label) + '</span><b>' + val + '</b>' + (forget ? '<button class="btn ghost xs" data-forget="' + esc(forget) + '" title="That\'s not right — forget it">forget</button>' : '') + '</li>'); }
    topN(hed, 3).forEach(function (h) { row('Crutch hedge', '"' + esc(h) + '" ×' + hed[h], 'hedges:' + h); });
    topN(fil, 3).forEach(function (h) { row('Filler', '"' + esc(h) + '" ×' + fil[h], 'fillers:' + h); });
    topN(gr, 3).forEach(function (g) { var p = RC.grammar.find(function (x) { return x.id === g; }); row('Recurring grammar', '<a href="#/gym/grammar/' + g + '">' + esc(p ? p.name : g) + '</a> ×' + gr[g], 'grammar:' + g); });
    topN(ww, 3).forEach(function (w) { row('Go-to vague word', '"' + esc(w) + '" ×' + ww[w], 'weakWords:' + w); });
    if (wpms.length >= 2) row('Pace range', Math.min.apply(null, wpms) + '–' + Math.max.apply(null, wpms) + ' wpm', 'wpm');
    var hps = fp.map(function (f) { return f.hedgesPer100; }).filter(function (x) { return typeof x === 'number'; });
    if (hps.length >= 2) { var hp = avg(hps); row('Hedging rate', hp.toFixed(1) + ' / 100 words', null, hp < 2); }
    if (opens.length >= 2) row('Clean openings', Math.round(clean * 100 / opens.length) + '%', null, clean / opens.length >= 0.7);
    if (endings.length >= 2) row('Endings that land (fall)', Math.round(falling * 100 / endings.length) + '%', 'finalEnding', falling / endings.length >= 0.6);
    if (ex.length >= 2) row('Answers with a concrete example', Math.round(ex.filter(function (f) { return f.example; }).length * 100 / ex.length) + '%', null);
    var pr = avg(fp.map(function (f) { return f.pitchRangeSt; }));
    if (pr) row('Typical pitch range', pr.toFixed(1) + ' semitones', 'pitchRangeSt', pr >= 6);
    return '<ul class="fp">' + rows.join('') + '</ul><p class="small muted">Built only from your takes on this device. Green rows are strengths. "forget" removes a pattern you think is wrong.</p>';
  }

  function trend(fp, key, label, betterWhen) {
    var vals = fp.map(function (f) { return f[key]; }).filter(function (v) { return typeof v === 'number'; });
    if (vals.length < 3) return '';
    var w = 160, h = 44, mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), rg = mx - mn || 1;
    var pts = vals.map(function (v, i) { return (i * w / (vals.length - 1)).toFixed(1) + ',' + (h - 4 - (v - mn) / rg * (h - 8)).toFixed(1); }).join(' ');
    var first = avg(vals.slice(0, Math.ceil(vals.length / 2))), last = avg(vals.slice(Math.floor(vals.length / 2)));
    var dir = betterWhen === 'lower' ? (last < first ? 'up' : last > first ? 'down' : '') : betterWhen === 'higher' ? (last > first ? 'up' : last < first ? 'down' : '') : '';
    return '<div class="trend"><span class="small">' + esc(label) + '</span><svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + ' trend: from ' + first.toFixed(1) + ' to ' + last.toFixed(1) + '"><polyline points="' + pts + '" fill="none" stroke="currentColor" stroke-width="2"/></svg><b class="' + dir + '">' + vals[vals.length - 1] + '</b></div>';
  }

  function calendar(s) {
    var cells = '';
    for (var i = 27; i >= 0; i--) {
      var k = Store.dayKey(Date.now() - i * DAY), d = s.days[k];
      cells += '<span class="cal ' + (d ? (d.rest ? 'rest' : 'on') : '') + '" title="' + k + (d ? (d.rest ? ' · rest day' : ' · ' + d.xp + ' XP') : '') + '"></span>';
    }
    return '<div class="calendar" aria-label="Practice days, last 4 weeks">' + cells + '</div>';
  }

  // ---------- Real Moment Prep ----------
  var STRUCTURES = {
    interview: 'STAR — Situation, Task, Action, Result. Spend most of your time on Action.',
    toast: 'Hook → one short story → what it shows about them → raise a glass with a wish.',
    pitch: 'Problem → cost of the problem → your solution → proof → the ask.',
    boardroom: 'Bottom line first → three supporting points → decision you need.',
    feedback: 'SBI — Situation, Behaviour, Impact → then ask and listen.',
    townhall: 'Acknowledge the question → answer in one line → reason → next step.',
    other: 'PREP — Point, Reason, Example, Point.'
  };
  function moments(el) {
    var s = Store.get();
    var today = Store.dayKey();
    var html = '<nav class="crumbs"><a href="#/journey">← Journey</a></nav><h1>Real Moment Prep</h1><p class="muted">Tell me what\'s coming up. You\'ll get a short rehearsal plan; afterwards, tell me how it went.</p>' +
      '<form class="card" id="rmf"><div class="grid2"><label class="field"><span>What is it?</span><input name="title" required placeholder="Interview at Acme on Friday"></label>' +
      '<label class="field"><span>When?</span><input name="date" type="date" required min="' + today + '"></label>' +
      '<label class="field"><span>Type</span><select name="type">' + Object.keys(STRUCTURES).map(function (k) { return '<option value="' + k + '">' + k + '</option>'; }).join('') + '</select></label></div><button class="btn primary">Make my plan</button></form>';
    s.realMoments.slice().reverse().forEach(function (m, idx) {
      var realIdx = s.realMoments.length - 1 - idx;
      var sc = RC.scenarios.find(function (x) { return x.scene === m.type; }) || RC.scenarios[0];
      var past = m.date < today;
      html += '<section class="card moment ' + (m.done ? 'done' : '') + '"><p class="eyebrow">' + esc(m.date) + ' · ' + esc(m.type) + '</p><h2>' + esc(m.title) + '</h2>';
      if (m.done) html += '<p>It went: <b>' + m.outcome + '/5</b>. ' + esc(m.note || '') + '</p>' + (m.outcome <= 2 ? '<p class="small">Next time, start prep earlier and add a full Arena run. One hard day doesn\'t define your progress.</p>' : '<p class="small">Logged in your Courage Ledger. That was real courage.</p>');
      else {
        html += '<ol class="plan-steps"><li><b>Structure:</b> ' + esc(STRUCTURES[m.type] || STRUCTURES.other) + '</li>' +
          '<li><b>Likely questions:</b><ul>' + sc.questions.slice(0, 4).map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul></li>' +
          '<li><b>Drills:</b> <a href="#/gym/room/rd2">First 10 Seconds</a> · <a href="#/gym/room/rd1">Power Pause</a> · <a href="#/gym/room/rd3">Land the Ending</a> · <a href="#/gym/room/rd6">"I don\'t know" with authority</a></li>' +
          (s.words.length ? '<li><b>Words to use:</b> ' + s.words.slice(-3).map(function (w) { return esc(w.word); }).join(', ') + '</li>' : '') +
          '<li><b>Final full run:</b> <a href="#/arena/' + sc.id + '">' + esc(sc.name) + '</a> at Tough pressure, the day before.</li></ol>';
        if (past) html += '<label class="field"><span>One line on how it went (optional)</span><input id="mnote-' + realIdx + '"></label><div class="row"><span>How did it go?</span>' + [1, 2, 3, 4, 5].map(function (n) { return '<button class="btn sm" data-out="' + realIdx + ':' + n + '">' + n + '</button>'; }).join('') + '</div>';
        else html += '<p class="small muted">After ' + esc(m.date) + ', come back and tell me how it went.</p>';
      }
      html += '</section>';
    });
    el.innerHTML = html;
    $('#rmf', el).onsubmit = function (e) {
      e.preventDefault();
      var f = new FormData(e.target);
      Store.update(function (st) { st.realMoments.push({ title: f.get('title'), date: f.get('date'), type: f.get('type'), created: Date.now() }); });
      App.render();
    };
    on(el, '[data-out]', 'click', function (e, b) {
      var p = b.getAttribute('data-out').split(':');
      var noteEl = $('#mnote-' + p[0], el);
      var note = noteEl ? noteEl.value.trim() : '';
      Store.update(function (st) { var m = st.realMoments[+p[0]]; m.done = true; m.outcome = +p[1]; m.note = note; st.courage.push({ ts: Date.now(), before: null, after: null, realMoment: m.title, outcome: m.outcome }); });
      Store.addXp(40, 'Real Moment done');
      App.render();
    });
  }

  // ---------- Settings ----------
  App.route('settings', function (el) {
    var s = Store.get(), p = s.profile, st = p.settings;
    function radio(name, val, opts) { return '<div class="seg" role="radiogroup">' + opts.map(function (o) { return '<button role="radio" aria-checked="' + (val === o[0]) + '" class="' + (val === o[0] ? 'sel' : '') + '" data-set="' + name + '" data-val="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>'; }
    function toggle(name, val, label, help) { return '<label class="toggle"><input type="checkbox" data-tog="' + name + '" ' + (val ? 'checked' : '') + '><span>' + esc(label) + (help ? '<small>' + esc(help) + '</small>' : '') + '</span></label>'; }
    el.innerHTML = '<h1>Settings</h1>' +
      '<section class="card"><h2>Mentor</h2><label class="field"><span>Your name</span><input id="sname" value="' + esc(p.name) + '"></label>' +
      '<h3>Mentor style</h3>' + radio('style', p.style, [['gentle', 'Gentle Guide'], ['direct', 'Direct Coach'], ['tough', 'Tough Director']]) +
      '<h3>English model</h3><p class="small muted">Used for model audio and recognition. Never treated as "correct" over your accent.</p>' + radio('accent', p.accent, [['en-US', 'American'], ['en-GB', 'British'], ['en-IN', 'Indian'], ['en-AU', 'Australian']]) +
      '<h3>Mentor speech speed</h3><input type="range" min="0.6" max="1.4" step="0.1" value="' + p.mentorRate + '" id="srate" aria-label="Mentor speech speed"> <span id="srv">' + p.mentorRate + '×</span> ' + App.ttsButton('This is how fast I will speak.', 'Test') + '</section>' +
      '<section class="card"><h2>Transcripts & privacy</h2><div id="srinfo2" class="muted small"></div><div class="seg" id="srmode2"><button data-mode="local">On-device only</button><button data-mode="auto">Best available</button><button data-mode="off">Off (audio only)</button></div></section>' +
      '<section class="card"><h2>Fair scoring</h2>' + toggle('stutterFriendly', st.stutterFriendly, 'Stutter-friendly mode', 'Turns off fluency, filler, pace and repetition scoring. Dysfluency is never a failure.') +
      toggle('scoreFillers', st.scoreFillers, 'Score fillers') + toggle('scorePace', st.scorePace, 'Score pace and pauses') + '</section>' +
      '<section class="card"><h2>Colour scheme</h2><div class="schemes" role="radiogroup" aria-label="Colour scheme">' + App.SCHEMES.map(function (sc) {
        return '<button class="scheme ' + (p.scheme === sc.id ? 'sel' : '') + '" role="radio" aria-checked="' + (p.scheme === sc.id) + '" data-set="scheme" data-val="' + sc.id + '"><span class="swatch" aria-hidden="true">' + sc.swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span><b>' + esc(sc.name) + '</b><small class="muted">' + esc(sc.desc) + '</small></button>';
      }).join('') + '</div><h3>Light or dark</h3>' + radio('theme', p.theme, [['auto', 'Match my device'], ['dark', 'Dark'], ['light', 'Light']]) + toggle('reducedMotion', st.reducedMotion, 'Reduce motion') + '</section>' +
      '<section class="card"><h2>Your data</h2><p class="small muted">Everything lives on this device. Export is a JSON file of your progress (recordings stay in the browser).</p><div class="row"><button class="btn" id="exp">Export progress</button><label class="btn">Import<input type="file" accept="application/json" id="imp" hidden></label><button class="btn danger" id="wipe">Delete everything</button></div>' +
      '<p class="small">' + s.reports.length + ' "That\'s wrong" report(s) stored locally.' + (s.reports.length ? ' <button class="btn ghost xs" id="exrep">Export reports</button>' : '') + '</p></section>' +
      '<section class="card"><h2>About Rostrum</h2><p class="small">Offline-first communication coach. No accounts, no servers, no AI service: measurements are computed in your browser and feedback comes from transparent rules. Scores are signals, not verdicts — tap "That\'s wrong" whenever one misses. Not a substitute for therapy; if speaking anxiety is overwhelming, talking to a professional can help.</p></section>';
    App.renderTranscriptChooser($('#srinfo2', el), $('#srmode2', el));
    on(el, '[data-set]', 'click', function (e, b) { var k = b.getAttribute('data-set'), v = b.getAttribute('data-val'); Store.update(function (x) { x.profile[k] = v; }); if (k === 'theme' || k === 'scheme') App.applyTheme(); App.render(); });
    on(el, '[data-tog]', 'change', function (e, b) { var k = b.getAttribute('data-tog'); Store.update(function (x) { x.profile.settings[k] = b.checked; }); });
    $('#sname', el).onchange = function () { var v = this.value.trim(); Store.update(function (x) { x.profile.name = v; }); };
    $('#srate', el).oninput = function () { var v = parseFloat(this.value); $('#srv', el).textContent = v + '×'; Store.update(function (x) { x.profile.mentorRate = v; }); };
    function download(name, text) {
      if (window.claude && window.claude.use) {
        window.claude.use('downloads').then(function (d) {
          if (d) return d.save({ filename: name, data: text }).catch(function () { App.toast('Download cancelled.'); });
          plain(name, text);
        });
        return;
      }
      plain(name, text);
    }
    function plain(name, text) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000); }
    $('#exp', el).onclick = function () { download('rostrum-export-' + Store.dayKey() + '.json', Store.exportAll()); };
    var er = $('#exrep', el); if (er) er.onclick = function () { download('rostrum-reports.json', JSON.stringify(Store.get().reports, null, 2)); };
    $('#imp', el).onchange = function () { var f = this.files[0]; if (!f) return; f.text().then(function (t) { try { Store.importAll(t); App.toast('Imported.'); App.render(); } catch (err) { App.toast('Import failed: ' + err.message); } }); };
    $('#wipe', el).onclick = function () { App.confirmTap(this, 'Tap again: erase everything', function () { Store.reset().then(function () { App.session.remove('nerves-before'); location.hash = '#/welcome'; App.render(); App.toast('Everything erased.'); }); }); };
  });
})(window);
