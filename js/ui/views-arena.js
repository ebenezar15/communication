/* Rostrum Arena: pressure simulations with voiced personas, curveballs, reactions and a debrief. */
(function (root) {
  'use strict';
  var App = root.App, RC = root.RC;
  var esc = App.esc, $ = App.$, $$ = App.$$, on = App.on;

  var PRESSURE = {
    calm: { name: 'Calm', questions: 3, seconds: 90, curveballs: 0, desc: 'Friendly pace. No surprises.' },
    tough: { name: 'Tough', questions: 4, seconds: 60, curveballs: 1, desc: 'Tighter time, one curveball.' },
    brutal: { name: 'Brutal', questions: 5, seconds: 45, curveballs: 2, desc: 'Short answers, two curveballs, tough crowd.' }
  };
  var SCENE_ICON = { interview: '🪑', boardroom: '▤', toast: '🥂', classroom: '✎', pitch: '◆', feedback: '⇄', townhall: '▦', negotiation: '⚖', support: '☎', networking: '☕', kickoff: '▶' };

  function persona(id) { return RC.personas.find(function (p) { return p.id === id; }) || RC.personas[0]; }

  App.route('arena', function (el, args) {
    var s = Store.get();
    if (!args[0]) {
      el.innerHTML = '<h1>Arena</h1><p class="muted">Pressure simulations. Personas speak with your device\'s voice; curveballs come when you least expect them. You choose how hard it gets.</p>' +
        '<p class="note">🎧 Use headphones if you can — persona voices can leak into your recording.</p><div class="tiles">' +
        RC.scenarios.map(function (sc) {
          return '<a class="tile scene-tile" href="#/arena/' + sc.id + '"><span class="glyph big" aria-hidden="true">' + (SCENE_ICON[sc.scene] || '◎') + '</span><strong>' + esc(sc.name) + '</strong><span class="muted">' + esc(sc.setup) + '</span><span class="badge">Level ' + sc.level + '</span></a>';
        }).join('') + '</div>';
      return;
    }
    var sc = RC.scenarios.find(function (x) { return x.id === args[0]; });
    if (!sc) return App.go('#/arena');
    var pressure = 'calm';
    function setup() {
      el.innerHTML = '<nav class="crumbs"><a href="#/arena">← Arena</a></nav><h1>' + esc(sc.name) + '</h1>' +
        '<div class="card"><p><strong>Setup:</strong> ' + esc(sc.setup) + '</p><p><strong>Your goal:</strong> ' + esc(sc.goal) + '</p>' +
        '<h3>In the room</h3><div class="personas">' + sc.personas.map(function (pid) { var p = persona(pid); return '<div class="persona"><span class="avatar" aria-hidden="true">' + esc(p.name.charAt(0)) + '</span><div><strong>' + esc(p.name) + '</strong><p class="small muted">' + esc(p.description) + '</p></div></div>'; }).join('') + '</div>' +
        '<h3>Pressure dial</h3><div class="dial" role="radiogroup" aria-label="Pressure">' + Object.keys(PRESSURE).map(function (k) { return '<button role="radio" aria-checked="' + (k === pressure) + '" class="' + (k === pressure ? 'sel' : '') + ' p-' + k + '" data-p="' + k + '"><b>' + PRESSURE[k].name + '</b><small>' + PRESSURE[k].desc + '</small></button>'; }).join('') + '</div>' +
        '<details><summary>Tips before you walk in</summary><ul>' + sc.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></details>' +
        '<button class="btn primary lg" data-start>Raise the curtain</button></div>';
      on(el, '[data-p]', 'click', function (e, b) { pressure = b.getAttribute('data-p'); setup(); });
      on(el, '[data-start]', 'click', run);
    }

    function run() {
      var P = PRESSURE[pressure];
      var qs = [sc.openingLine].concat(sc.questions.slice(0, P.questions - 1));
      // assign curveballs to random question slots (never the first)
      var cbs = sc.curveballs.slice().sort(function () { return Math.random() - 0.5; }).slice(0, P.curveballs);
      var plan = qs.map(function (q, i) { return { q: q, asker: sc.personas[i % sc.personas.length], cb: null }; });
      cbs.forEach(function (cb, k) { var slot = 1 + ((k * 2 + Math.floor(Math.random() * 2)) % Math.max(1, plan.length - 1)); if (plan[slot]) plan[slot].cb = cb; });
      var answers = [];
      var i = 0;
      el.innerHTML = '<div class="theatre ' + (App.reducedMotion() ? '' : 'animate') + '"><div class="curtain left"></div><div class="curtain right"></div>' +
        '<div class="arena-stage"><div class="row between"><p class="eyebrow">' + esc(sc.name) + ' · ' + P.name + '</p><button class="btn ghost sm" data-leave>Leave stage</button></div>' +
        '<div class="panel">' + sc.personas.map(function (pid) { var p = persona(pid); return '<div class="seat" data-seat="' + pid + '"><span class="avatar">' + esc(p.name.charAt(0)) + '</span><span class="small">' + esc(p.name.split(',')[0]) + '</span></div>'; }).join('') + '</div>' +
        '<div class="caption" aria-live="polite"></div><div class="reaction" aria-live="polite"></div><div id="ast"></div></div></div>';
      requestAnimationFrame(function () { $('.theatre', el).classList.add('open'); });
      on(el, '[data-leave]', 'click', function () { Audio2.stopSpeaking(); App.go('#/arena'); });
      setTimeout(ask, App.reducedMotion() ? 100 : 1200);

      function say(pid, line) {
        var p = persona(pid);
        $$('.seat', el).forEach(function (s2) { s2.classList.toggle('speaking', s2.getAttribute('data-seat') === pid); });
        return App.speakAs(line, p.voice).then(function () { $$('.seat', el).forEach(function (s2) { s2.classList.remove('speaking'); }); });
      }
      function ask() {
        var item = plan[i];
        var q = item.q, seconds = P.seconds, opts = {};
        $('.reaction', el).textContent = '';
        if (item.cb) {
          if (item.cb.type === 'unknown') q = item.cb.line;
          if (item.cb.type === 'time') { seconds = 30; q = q + ' ' + item.cb.line; }
          if (item.cb.type === 'interrupt') { opts.interrupt = [item.cb.line]; opts.interruptVoice = persona(item.asker).voice; }
          if (item.cb.type === 'blank') { opts.interrupt = [item.cb.line]; opts.interruptSilent = true; }
        }
        if (pressure !== 'calm' && !opts.interrupt && sc.personas.indexOf('interrupter') >= 0 && Math.random() < 0.3) {
          opts.interrupt = persona('interrupter').interruptions; opts.interruptVoice = persona('interrupter').voice;
        }
        var asker = persona(item.asker);
        $('.caption', el).innerHTML = '<span class="who">' + esc(asker.name) + ':</span> “' + esc(q) + '”' + (item.cb && item.cb.type === 'unknown' ? ' <span class="badge">curveball</span>' : '');
        $('#ast', el).innerHTML = '';
        say(item.asker, q).then(function () {
          App.mountStage($('#ast', el), Object.assign({
            kind: 'speak', seconds: seconds, ref: sc.id + ':q' + i, title: 'Your answer · question ' + (i + 1) + ' of ' + plan.length, focus: ['structure', 'opening'],
            doneLabel: i < plan.length - 1 ? 'Next question →' : 'Curtain call →', showForge: false,
            onTake: function (take) { react(take, item); return ''; },
            onComplete: function (takes) {
              var good = takes.filter(function (t) { return t.fb.quality.ok; });
              answers.push({ q: q, asker: asker.name, take: good[good.length - 1] || takes[takes.length - 1], cb: item.cb });
              i++;
              if (i < plan.length) ask(); else debrief();
            }
          }, opts));
        });
      }
      function react(take, item) {
        if (!take.fb.quality.ok) return;
        var t = take.ev.text, a = take.ev.audio || {};
        var strong = (a.speechMs || 0) >= 8000 && (!t || (t.hedgesPer100 < 3 && !t.openingIssues.length));
        if (item.cb && item.cb.type === 'flat') { $('.reaction', el).innerHTML = '<em>' + esc(item.cb.line) + '</em>'; return; }
        var pid = sc.personas[Math.floor(Math.random() * sc.personas.length)], p = persona(pid);
        var line = App.pick(strong ? p.reactions.strong : p.reactions.weak);
        $('.reaction', el).innerHTML = '<span class="who">' + esc(p.name) + ':</span> “' + esc(line) + '”';
        say(pid, line);
      }
      function debrief() {
        Store.update(function (s2) { s2.drills['arena-' + sc.id] = s2.drills['arena-' + sc.id] || { count: 0 }; s2.drills['arena-' + sc.id].count++; });
        Store.addXp(pressure === 'brutal' ? 60 : pressure === 'tough' ? 45 : 30, 'Arena scene completed');
        var fixes = {};
        answers.forEach(function (a) { var f = a.take && a.take.fb.bigFix; if (f) fixes[f.title] = (fixes[f.title] || 0) + 1; });
        var top = Object.keys(fixes).sort(function (x, y) { return fixes[y] - fixes[x]; })[0];
        $('.theatre', el).classList.remove('open');
        el.innerHTML = '<nav class="crumbs"><a href="#/arena">← Arena</a></nav><p class="eyebrow">Curtain call · ' + esc(sc.name) + ' · ' + P.name + '</p><h1>Debrief</h1>' +
          '<div class="card"><p>You stayed on stage for all ' + answers.length + ' questions' + (answers.some(function (a) { return a.cb; }) ? ', including ' + answers.filter(function (a) { return a.cb; }).length + ' curveball(s)' : '') + '. That counts.</p>' +
          (top ? '<p><strong>Pattern across answers:</strong> ' + esc(top) + (fixes[top] > 1 ? ' (came up ' + fixes[top] + ' times)' : '') + '. Make this your next drill.</p>' : '') + '</div>' +
          answers.map(function (a, k) {
            var fb = a.take && a.take.fb;
            return '<div class="card debrief-item"><p class="eyebrow">Q' + (k + 1) + ' · ' + esc(a.asker) + (a.cb ? ' · curveball: ' + esc(a.cb.type) : '') + '</p><p class="q">“' + esc(a.q) + '”</p>' +
              (a.take && a.take.url ? '<audio controls src="' + a.take.url + '" preload="none"></audio>' : '') +
              (fb && fb.quality.ok ? '<p>✓ ' + esc(fb.strength.text) + '</p>' + (fb.bigFix ? '<p>→ <strong>' + esc(fb.bigFix.title) + '.</strong> ' + esc(fb.bigFix.howToFix) + '</p>' : '') : '<p class="muted">No reliable audio for this answer.</p>') +
              (a.take && a.take.drill && a.take.interrupt ? '' : '') + '</div>';
          }).join('') +
          '<div class="row"><a class="btn primary" href="#/arena/' + sc.id + '">Run it again</a><a class="btn" href="#/gym/room">Own the Room drills</a><a class="btn ghost" href="#/today">Today</a></div>';
      }
    }
    setup();
  });
})(window);
