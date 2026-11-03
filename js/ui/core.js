/* Rostrum UI core: helpers, router, toast, and the shared Stage (record → evidence → one big fix → retake → A/B). */
(function (root) {
  'use strict';
  var App = root.App = root.App || {};
  var RC = root.RC;

  // ---------- helpers ----------
  function esc(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c];
    });
  }
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function on(el, sel, ev, fn) {
    el.addEventListener(ev, function (e) {
      var t = e.target.closest(sel);
      if (t && el.contains(t)) fn(e, t);
    });
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function seeded(arr, seed) { var h = 0; for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0; return arr[h % arr.length]; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function fmtTime(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function reducedMotion() {
    return Store.get().profile.settings.reducedMotion || (root.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function lesson(id) { return RC.lessons.find(function (l) { return l.id === id; }); }
  function level(id) { return RC.levels.find(function (l) { return l.id === id; }); }
  function skill(id) { return RC.skills.find(function (s) { return s.id === id; }); }
  function speakAs(text, o) {
    var p = Store.get().profile;
    o = o || {};
    return Audio2.speak(text, { lang: p.accent, rate: (o.rate || 1) * (p.mentorRate || 1), pitch: o.pitch || 1 });
  }
  function ttsButton(text, label, rate) {
    if (!Audio2.hasTTS) return '';
    return '<button class="btn ghost sm" data-say="' + esc(text) + '" data-rate="' + (rate || 1) + '" aria-label="Listen: ' + esc(text) + '">▶ ' + esc(label || 'Listen') + '</button>';
  }
  // Global listener for any [data-say] button
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-say]');
    if (b) speakAs(b.getAttribute('data-say'), { rate: parseFloat(b.getAttribute('data-rate') || '1') });
  });

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 2200);
    setTimeout(function () { t.remove(); }, 2700);
  }

  // ---------- router ----------
  var routes = {};
  function route(name, fn) { routes[name] = fn; }
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  function render() {
    if (App.activeStage) { App.activeStage.destroy(); App.activeStage = null; }
    Audio2.stopSpeaking();
    var s = Store.get();
    var h = location.hash.replace(/^#\/?/, '') || (s.profile.onboarded ? 'today' : 'welcome');
    if (!s.profile.onboarded && h.indexOf('welcome') !== 0 && h.indexOf('settings') !== 0) h = 'welcome';
    var parts = h.split('/');
    var fn = routes[parts[0]] || routes.today;
    var main = $('#main');
    main.innerHTML = '';
    main.className = 'view view-' + parts[0];
    $$('.nav a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === parts[0]); a.setAttribute('aria-current', a.getAttribute('data-nav') === parts[0] ? 'page' : 'false'); });
    document.body.classList.toggle('no-nav', parts[0] === 'welcome');
    fn(main, parts.slice(1));
    main.focus({ preventScroll: true });
    root.scrollTo(0, 0);
  }
  root.addEventListener('hashchange', render);

  // ---------- word timing for tappable transcript ----------
  function timedWords(segments, transcript) {
    var out = [];
    if (segments && segments.length) {
      segments.forEach(function (s) {
        var ws = s.text.split(/\s+/).filter(Boolean);
        var span = Math.max(1, s.endMs - s.startMs);
        ws.forEach(function (w, i) { out.push({ w: w, t: Math.round(s.startMs + span * i / ws.length) }); });
      });
    } else if (transcript) {
      transcript.split(/\s+/).filter(Boolean).forEach(function (w) { out.push({ w: w, t: null }); });
    }
    return out;
  }
  function markWord(w, ev) {
    var t = Analysis.tokenize(w)[0] || '';
    var tx = ev.text;
    if (!tx) return '';
    if (Analysis.FILLERS.indexOf(t) >= 0) return 'mk-filler';
    if (tx.hedges && Object.keys(tx.hedges).some(function (h) { return h.split(' ').indexOf(t) >= 0 && h.split(' ').length === 1; })) return 'mk-hedge';
    if (tx.bankWordsUsed && tx.bankWordsUsed.some(function (b) { return b.toLowerCase() === t; })) return 'mk-bank';
    return '';
  }

  // ---------- Stage: the Second Take loop ----------
  /**
   * opts: { title, prompt, cue (html), seconds, kind: 'speak'|'read'|'question', targetText, focus:[], showForge,
   *         ref, onTake(result) -> optional extra html, onComplete(takes), drill: {measure, target}, interrupt:[lines],
   *         minTakes, compact }
   */
  function Stage(container, opts) {
    this.el = container;
    this.opts = opts || {};
    this.takes = [];
    this.render();
  }

  Stage.prototype.render = function () {
    var o = this.opts;
    var self = this;
    this.el.innerHTML =
      '<section class="stage card" aria-label="Recording stage">' +
      (o.title ? '<h3 class="stage-title">' + esc(o.title) + '</h3>' : '') +
      (o.prompt ? '<p class="stage-prompt">' + esc(o.prompt) + '</p>' : '') +
      (o.targetText ? '<div class="script" aria-label="Text to read aloud">' + formatScript(o.targetText) + '</div>' : '') +
      (o.cue ? '<div class="cue">' + o.cue + '</div>' : '') +
      '<div class="spot-wrap"><canvas class="spot" width="600" height="220" aria-hidden="true"></canvas>' +
      '<div class="spot-overlay"><button class="rec-btn" aria-label="Start recording"><span class="rec-dot"></span></button>' +
      '<div class="rec-meta"><span class="rec-status">Tap to speak</span><span class="rec-timer">' + (o.seconds ? fmtTime(o.seconds * 1000) : '') + '</span></div></div></div>' +
      '<div class="timebar" aria-hidden="true"><div></div></div>' +
      '<p class="live-transcript" aria-live="polite"></p>' +
      '<div class="stage-results"></div>' +
      '</section>';
    this.canvas = $('canvas', this.el);
    this.btn = $('.rec-btn', this.el);
    this.btn.addEventListener('click', function () { self.recording ? self.stop() : self.start(); });
    this.drawIdle();
  };

  App.cleanScript = function (t) { return (t || '').replace(/\([^)]*\)|\[[^\]]*\]/g, ' ').replace(/ \/ /g, ' ').replace(/\s+/g, ' ').trim(); };
  function formatScript(t) {
    return esc(t).replace(/(\([^)]*\)|\[[^\]]*\])/g, '<em class="direction">$1</em>').replace(/ \/ /g, ' <span class="tg" aria-label="pause">/</span> ')
      .replace(/\b([A-Z]{2,})\b/g, '<strong class="emph">$1</strong>');
  }
  App.formatScript = formatScript;

  Stage.prototype.drawIdle = function () {
    var c = this.canvas, g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    var grd = g.createRadialGradient(c.width / 2, c.height / 2, 10, c.width / 2, c.height / 2, 140);
    grd.addColorStop(0, 'rgba(255,214,150,0.22)');
    grd.addColorStop(1, 'rgba(255,214,150,0)');
    g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
  };

  Stage.prototype.drawLive = function (rms, pitch) {
    var c = this.canvas, g = c.getContext('2d');
    var W = c.width, H = c.height;
    this.trace = this.trace || [];
    this.trace.push(pitch > 60 && pitch < 500 ? pitch : null);
    if (this.trace.length > 150) this.trace.shift();
    var lvl = Math.min(1, rms * 9);
    this.smooth = (this.smooth || 0) * 0.7 + lvl * 0.3;
    g.clearRect(0, 0, W, H);
    if (reducedMotion()) {
      g.fillStyle = 'rgba(232,176,75,0.8)';
      g.fillRect(20, H - 24, (W - 40) * this.smooth, 10);
    } else {
      var r = 60 + this.smooth * 120;
      var grd = g.createRadialGradient(W / 2, H / 2, 5, W / 2, H / 2, r);
      grd.addColorStop(0, 'rgba(255,226,170,' + (0.35 + this.smooth * 0.5) + ')');
      grd.addColorStop(0.6, 'rgba(232,176,75,' + (0.12 + this.smooth * 0.2) + ')');
      grd.addColorStop(1, 'rgba(232,176,75,0)');
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
    }
    // pitch line
    g.strokeStyle = 'rgba(255,240,220,0.85)'; g.lineWidth = 2.5; g.beginPath();
    var started = false;
    for (var i = 0; i < this.trace.length; i++) {
      var p = this.trace[i];
      if (!p) { started = false; continue; }
      var x = W * i / 150;
      var y = H - 14 - (Math.log2(p / 70) / Math.log2(450 / 70)) * (H - 28);
      if (!started) { g.moveTo(x, y); started = true; } else g.lineTo(x, y);
    }
    g.stroke();
  };

  Stage.prototype.start = async function () {
    var self = this, o = this.opts, p = Store.get().profile;
    if (!Audio2.hasMic) { toast('This browser cannot record audio.'); return; }
    Audio2.stopSpeaking();
    $('.stage-results', this.el).innerHTML = '';
    $('.live-transcript', this.el).textContent = '';
    var mode = p.transcriptMode;
    this.rec = new Audio2.Recorder({
      lang: p.accent, transcriptMode: mode, localAvailable: App.localSR === 'local',
      onLevel: function (rms, pitch, t) {
        self.drawLive(rms, pitch);
        if (o.seconds) {
          var left = o.seconds * 1000 - t;
          $('.rec-timer', self.el).textContent = fmtTime(left);
          $('.timebar div', self.el).style.width = Math.min(100, t / (o.seconds * 10)) + '%';
          if (left <= 0) self.stop();
        } else $('.rec-timer', self.el).textContent = fmtTime(t);
        if (self.onTick) self.onTick(t);
      },
      onTranscript: function (fin, interim) {
        $('.live-transcript', self.el).innerHTML = esc(fin) + ' <span class="interim">' + esc(interim) + '</span>';
      }
    });
    try {
      await this.rec.start();
    } catch (e) {
      toast('Microphone unavailable: ' + (e.name === 'NotAllowedError' ? 'permission denied' : e.message));
      return;
    }
    this.recording = true;
    this.trace = [];
    this.el.querySelector('.stage').classList.add('live');
    this.btn.classList.add('on');
    this.btn.setAttribute('aria-label', 'Stop recording');
    $('.rec-status', this.el).textContent = 'Recording… tap to stop';
    if (o.onStart) o.onStart(this);
    if (o.interrupt && o.interrupt.length) this.scheduleInterrupt();
  };

  Stage.prototype.scheduleInterrupt = function () {
    var self = this, o = this.opts;
    var at = (o.seconds || 40) * 1000 * (0.3 + Math.random() * 0.25);
    this.interruptAt = null;
    this.onTick = function (t) {
      if (!self.interruptFired && t >= at) {
        self.interruptFired = true;
        self.interruptAt = t;
        var line = pick(o.interrupt);
        var cap = document.createElement('div');
        cap.className = 'interrupt-cap';
        cap.textContent = '⟡ ' + line;
        $('.spot-wrap', self.el).appendChild(cap);
        if (o.interruptSilent) {
          self.interruptEnd = t;
          self.el.querySelector('.stage').classList.add('blanked');
        } else {
          var pv = o.interruptVoice || { rate: 1.1, pitch: 0.9 };
          speakAs(line, pv).then(function () { self.interruptEnd = performance.now() - self.rec.t0; });
        }
      }
    };
  };

  Stage.prototype.stop = async function () {
    if (!this.recording) return;
    var self = this, o = this.opts, s = Store.get();
    this.recording = false;
    this.onTick = null;
    this.btn.classList.remove('on');
    this.btn.disabled = true;
    this.el.querySelector('.stage').classList.remove('live');
    $('.rec-status', this.el).textContent = 'Analysing…';
    var res = await this.rec.stop();
    this.btn.disabled = false;
    this.btn.setAttribute('aria-label', 'Record again');
    $('.rec-status', this.el).textContent = 'Tap to retake';
    $('.live-transcript', this.el).textContent = '';
    var cap = $('.interrupt-cap', this.el); if (cap) cap.remove();
    this.el.querySelector('.stage').classList.remove('blanked');
    var interrupt = this.interruptFired ? { atMs: this.interruptAt, endMs: this.interruptEnd } : null;
    this.interruptFired = false;
    this.drawIdle();
    this.analyse(res, interrupt);
  };

  Stage.prototype.analyse = function (res, interrupt) {
    var o = this.opts, s = Store.get();
    var target = o.targetText ? App.cleanScript(o.targetText) : null;
    var ev = Analysis.buildEvidence({
      frames: res.frames, durationMs: res.durationMs, transcript: res.transcript, segments: res.segments,
      transcriptSource: res.transcriptSource, grammar: RC.grammar, targetText: target,
      bankWords: s.words.map(function (w) { return w.word; }), context: { kind: o.kind, ref: o.ref }
    });
    var fb = Mentor.coach(ev, { focus: o.focus || [], style: s.profile.style, settings: s.profile.settings, targetSeconds: o.seconds, kind: o.kind });
    var take = { id: uid(), n: this.takes.length + 1, ev: ev, frames: res.frames, fb: fb, blob: res.blob, url: URL.createObjectURL(res.blob), recError: res.recError, interrupt: interrupt };
    if (o.drill) take.drill = evaluateDrill(o.drill, ev, interrupt);
    this.takes.push(take);
    if (fb.quality.ok) persistTake(take, o);
    this.showResults(take);
  };

  function persistTake(take, o) {
    var ev = take.ev, fb = take.fb;
    var t = ev.text, a = ev.audio || {};
    Store.update(function (s) {
      s.takes.unshift({
        id: take.id, ts: Date.now(), kind: o.kind || 'speak', ref: o.ref || null, title: o.title || o.prompt || 'Take',
        n: take.n, transcript: ev.transcript, durationMs: ev.durationMs, hasAudio: true, saved: false,
        fix: fb.bigFix ? fb.bigFix.title : null, strength: fb.strength ? fb.strength.text : null,
        metrics: {
          wpm: t && t.wpm, fillers: t && t.fillerCount, hedges: t && t.hedgeCount, openingClean: t ? !t.openingIssues.length : null,
          pitchRangeSt: a.pitchRangeSt, finalEnding: a.finalEnding, pauses: a.pauseCount, leadingSilenceMs: a.leadingSilenceMs
        }
      });
      if (s.takes.length > 300) s.takes.length = 300;
      if (Object.keys(fb.fingerprint || {}).length) s.fingerprint.push(Object.assign({ ts: Date.now(), kind: o.kind || 'speak' }, fb.fingerprint));
      if (s.fingerprint.length > 500) s.fingerprint.shift();
      (fb.bankWordsUsed || []).forEach(function (w) {
        var item = s.words.find(function (x) { return x.word === w; });
        if (item && !item.owned) { item.owned = Date.now(); setTimeout(function () { toast('★ "' + w + '" used in the wild — it\'s yours now!'); }, 600); }
        if (item) item.wildUses = (item.wildUses || 0) + 1;
      });
    });
    Store.putAudio(take.id, take.blob);
    Store.addXp(take.n > 1 ? 15 : 10, take.n > 1 ? 'Second Take' : 'take recorded');
  }

  function evaluateDrill(d, ev, interrupt) {
    var a = ev.audio || {}, t = ev.text, tg = d.target || {};
    var r = { pass: null, detail: '' };
    switch (d.measure) {
      case 'pause': {
        var need = tg.pauseMs || 2000;
        var best = Math.max(a.leadingSilenceMs || 0, a.longestPauseMs || 0);
        r.pass = best >= need; r.detail = 'Longest deliberate silence: ' + (best / 1000).toFixed(1) + 's (target ' + (need / 1000).toFixed(1) + 's).';
        break;
      }
      case 'opening':
        if (!t) { r.detail = 'Needs a transcript to check your opening words.'; break; }
        r.pass = !t.openingIssues.length; r.detail = r.pass ? 'Clean start: "' + t.openingWords.split(' ').slice(0, 6).join(' ') + '…"' : 'Opening contained: ' + t.openingIssues.join(', ');
        if (tg.pattern) {
          var moved = new RegExp(tg.pattern, 'i').test(ev.transcript);
          r.pass = r.pass && moved;
          r.detail += moved ? ' You moved forward with a next step.' : ' Add a next step: "I\'ll find out and get back to you by…"';
        }
        break;
      case 'ending':
        r.pass = a.finalEnding === 'falling'; r.detail = a.finalEnding ? 'Final ending sounded ' + a.finalEnding + ' (pitch-based signal).' : 'Couldn\'t measure pitch clearly — try a longer final sentence.';
        if (!a.finalEnding) r.pass = null;
        break;
      case 'hedges':
        if (!t) { r.detail = 'Needs a transcript to count hedges.'; break; }
        r.pass = t.hedgeCount <= (tg.maxHedges || 0); r.detail = t.hedgeCount + ' hedges detected' + (t.hedgeCount ? ': ' + Object.keys(t.hedges).join(', ') : '') + '.';
        break;
      case 'fillers':
        if (!t) { r.detail = 'Needs a transcript to count fillers.'; break; }
        r.pass = t.fillerCount <= (tg.maxFillers || 0); r.detail = t.fillerCount + ' fillers detected (recognisers can miss some "um"s).';
        break;
      case 'volume':
        r.pass = (a.volumeVariationDb || 0) >= (tg.minVariationDb || (tg.volumeSteps ? 4 : 4)); r.detail = 'Volume variation: ' + (a.volumeVariationDb || 0) + ' dB.';
        break;
      case 'recovery':
        if (!interrupt || !interrupt.endMs) { r.detail = 'The interruption didn\'t play this time — try again and speak a little longer.'; break; }
        var after = (a.segments || []).find(function (sg) { return sg.start >= interrupt.endMs - 100; });
        var gap = after ? after.start - interrupt.endMs : null;
        r.pass = gap !== null && gap <= (tg.maxResumeMs || 3000);
        r.detail = gap !== null ? 'You resumed ' + (Math.max(0, gap) / 1000).toFixed(1) + 's after the interruption ended.' : 'I didn\'t hear you resume after the interruption.';
        break;
      default:
        r.detail = '';
    }
    return r;
  }

  Stage.prototype.showResults = function (take) {
    var self = this, o = this.opts, fb = take.fb, ev = take.ev;
    var box = $('.stage-results', this.el);
    var html = '';
    html += '<audio class="take-audio" src="' + take.url + '" preload="metadata"></audio>';
    if (!fb.quality.ok) {
      html += '<div class="fb-card warn" role="alert"><h4>Let\'s retake that</h4><p>' + esc(fb.quality.message) + '</p></div>';
      box.innerHTML = html;
      return;
    }
    if (take.drill && take.drill.detail) {
      html += '<div class="fb-card drill ' + (take.drill.pass === true ? 'pass' : take.drill.pass === false ? 'miss' : '') + '"><h4>' +
        (take.drill.pass === true ? '✓ Drill target hit' : take.drill.pass === false ? '○ Not yet — go again' : 'Drill result') + '</h4><p>' + esc(take.drill.detail) + '</p></div>';
    }
    if (fb.strength) html += '<div class="fb-card strength"><span class="lead">' + esc(fb.strength.lead) + '</span><p>' + esc(fb.strength.text) + '</p>' + evidenceBtn(fb.strength.evidence) + '</div>';
    if (fb.bigFix) {
      var b = fb.bigFix;
      html += '<div class="fb-card bigfix"><span class="lead">' + esc(b.lead) + ' · <span class="skill-tag">' + esc(b.skill) + '</span>' +
        ' <span class="conf conf-' + b.confidence + '" title="How sure the measurement is">' + esc(b.confidence) + ' confidence</span></span>' +
        '<h4>' + esc(b.title) + '</h4>' +
        '<dl class="wwh"><dt>What happened</dt><dd>' + esc(b.whatHappened) + '</dd><dt>Why it matters</dt><dd>' + esc(b.whyItMatters) + '</dd><dt>How to fix it</dt><dd>' + esc(b.howToFix) + '</dd></dl>' +
        '<p class="retake-prompt">↻ ' + esc(b.retakePrompt) + '</p>' +
        '<div class="row">' + evidenceBtn(b.evidence) + '<button class="btn ghost sm" data-report="' + esc(b.key) + '">That\'s wrong</button></div></div>';
    } else {
      html += '<div class="fb-card"><h4>No big fix this time</h4><p>Nothing stood out in what I can measure. Try a harder prompt or a stricter mentor style.</p></div>';
    }
    if (fb.minorNotes && fb.minorNotes.length) {
      html += '<details class="minor"><summary>' + fb.minorNotes.length + ' minor note' + (fb.minorNotes.length > 1 ? 's' : '') + ' (optional)</summary><ul>' +
        fb.minorNotes.map(function (n) { return '<li><strong>' + esc(n.title) + '.</strong> ' + esc(n.text) + ' <span class="conf conf-' + n.confidence + '">' + n.confidence + '</span> ' + evidenceBtn(n.evidence) + '</li>'; }).join('') + '</ul></details>';
    }
    html += '<div class="chips">' + fb.metrics.map(function (m) { return '<span class="chip" title="' + esc(m.hint || '') + '"><b>' + esc(m.label) + '</b> ' + esc(m.value) + '</span>'; }).join('') + '</div>';
    // Transcript
    var words = timedWords(ev.segments, ev.transcript);
    if (words.length) {
      html += '<div class="transcript" aria-label="Transcript. Tap a word to hear that moment."><div class="tlabel">Transcript <small>(' + esc(sourceLabel(ev.transcriptSource)) + (ev.segments.length ? ' · tap a word to hear it, timing approx.' : '') + ')</small></div><p>' +
        words.map(function (w) { var cls = markWord(w.w, ev); return w.t !== null ? '<button class="w ' + cls + '" data-t="' + w.t + '">' + esc(w.w) + '</button>' : '<span class="w ' + cls + '">' + esc(w.w) + '</span>'; }).join(' ') +
        '</p><div class="legend"><span class="mk-filler">filler</span> <span class="mk-hedge">hedge</span> <span class="mk-bank">Word Bank</span></div></div>';
    } else {
      html += '<details class="typed"><summary>No transcript — type what you said for language feedback (optional)</summary><textarea rows="3" aria-label="What you said"></textarea><button class="btn sm" data-typed>Analyse my words</button></details>';
    }
    if (ev.text && ev.text.miscues && o.kind === 'read') {
      html += '<div class="miscues"><div class="tlabel">Script check <small>(recogniser-based signal — not a verdict on your accent)</small></div><p>' +
        ev.text.miscues.ops.map(function (op) {
          if (op.op === 'ok') return '<span class="ok">' + esc(op.word) + '</span>';
          if (op.op === 'sub') return '<span class="sub" title="heard: ' + esc(op.heard) + '">' + esc(op.word) + ' <small>→ ' + esc(op.heard) + '</small></span>';
          if (op.op === 'missing') return '<span class="miss" title="not heard">' + esc(op.word) + '</span>';
          return '';
        }).join(' ') + '</p></div>';
    }
    (fb.notes || []).forEach(function (n) { html += '<p class="note">ⓘ ' + esc(n) + '</p>'; });
    if (take.recError && take.recError !== 'no-speech' && take.recError !== 'aborted') html += '<p class="note">ⓘ Speech recognition reported "' + esc(take.recError) + '". ' + (take.recError === 'network' ? 'It needs a connection in this browser — switch to on-device in Settings if supported.' : '') + '</p>';
    if (fb.wordBankCandidates && fb.wordBankCandidates.length) {
      html += '<div class="wb-cands"><span class="tlabel">Word Bank ideas</span> ' + fb.wordBankCandidates.slice(0, 3).map(function (c) {
        return c.options.filter(function (x) { return x.indexOf('(') < 0; }).slice(0, 2).map(function (opt) { return '<button class="btn ghost sm" data-addword="' + esc(opt) + '" data-replaces="' + esc(c.weak) + '">+ ' + esc(opt) + ' <small>for "' + esc(c.weak) + '"</small></button>'; }).join('');
      }).join('') + '</div>';
    }
    // A/B
    var good = this.takes.filter(function (t) { return t.fb.quality.ok; });
    if (good.length >= 2) {
      var t1 = good[0], t2 = good[good.length - 1];
      var cmp = Mentor.compareTakes(t1.ev, t2.ev, Store.get().profile.settings);
      html += '<div class="ab card-inner"><h4>Hear the difference: Take ' + t1.n + ' vs Take ' + t2.n + '</h4>' +
        '<div class="row"><button class="btn sm" data-play="' + t1.id + '">▶ Take ' + t1.n + '</button><button class="btn sm" data-play="' + t2.id + '">▶ Take ' + t2.n + '</button></div>' +
        '<table class="cmp"><thead><tr><th>Measure</th><th>Take ' + t1.n + '</th><th>Take ' + t2.n + '</th><th><span class="sr-only">Change</span></th></tr></thead><tbody>' +
        cmp.rows.map(function (r) { return '<tr><td>' + esc(r.label) + '</td><td>' + esc(r.before) + '</td><td>' + esc(r.after) + '</td><td class="' + (r.better === true ? 'up' : r.better === false ? 'down' : '') + '">' + (r.better === true ? '▲ better' : r.better === false ? '▼ worse' : '—') + '</td></tr>'; }).join('') +
        '</tbody></table>' +
        '<p class="ab-sum">' + (cmp.wins > cmp.losses ? 'Measurably better on ' + cmp.wins + ' measure' + (cmp.wins > 1 ? 's' : '') + '. That\'s the point of a Second Take.' : cmp.wins === 0 && cmp.losses === 0 ? 'No measurable change yet — listen to both and trust your ears too.' : 'Mixed result — that\'s normal. Pick the one fix and go again.') + '</p></div>';
    }
    html += '<div class="row actions"><button class="btn primary" data-retake>↻ Second Take</button>' +
      (o.showForge !== false && ev.transcript && ev.transcript.split(' ').length > 5 ? '<button class="btn ghost" data-forge>Forge a sentence</button>' : '') +
      (o.onComplete ? '<button class="btn" data-done>' + esc(o.doneLabel || 'Done') + '</button>' : '') + '</div>';
    if (o.onTake) html += o.onTake(take, this) || '';
    box.innerHTML = html;
    var audio = $('.take-audio', box);
    function playAt(url, ms, endMs) {
      if (audio.src !== url) audio.src = url;
      var go = function () {
        audio.currentTime = Math.max(0, (ms || 0) / 1000);
        audio.play();
        if (endMs) { var stopAt = endMs / 1000; var h = function () { if (audio.currentTime >= stopAt) { audio.pause(); audio.removeEventListener('timeupdate', h); } }; audio.addEventListener('timeupdate', h); }
      };
      if (audio.readyState >= 1) go(); else audio.addEventListener('loadedmetadata', go, { once: true });
    }
    on(box, '[data-t]', 'click', function (e, b) { playAt(take.url, parseInt(b.getAttribute('data-t'), 10) - 300, null); });
    on(box, '[data-ev]', 'click', function (e, b) { playAt(take.url, parseInt(b.getAttribute('data-ev'), 10), parseInt(b.getAttribute('data-end'), 10)); });
    on(box, '[data-play]', 'click', function (e, b) { var tk = self.takes.find(function (x) { return x.id === b.getAttribute('data-play'); }); if (tk) playAt(tk.url, 0, null); });
    on(box, '[data-retake]', 'click', function () { self.el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }); self.start(); });
    on(box, '[data-done]', 'click', function () { o.onComplete(self.takes); });
    on(box, '[data-report]', 'click', function (e, b) {
      Store.update(function (s) { s.reports.push({ ts: Date.now(), key: b.getAttribute('data-report'), transcript: ev.transcript, fix: fb.bigFix }); });
      b.textContent = 'Thanks — noted'; b.disabled = true;
      toast('Logged locally. Reports help tune the rules (Settings → Reports).');
    });
    on(box, '[data-addword]', 'click', function (e, b) { App.addWord(b.getAttribute('data-addword'), b.getAttribute('data-replaces')); b.disabled = true; b.textContent = '✓ added'; });
    on(box, '[data-forge]', 'click', function () {
      var sents = Analysis.splitSentences(ev.transcript);
      var best = sents.length > 1 ? sents.reduce(function (a, b2) { return Analysis.analyzeText(b2).hedgeCount > Analysis.analyzeText(a).hedgeCount ? b2 : a; }) : ev.transcript.split(' ').slice(0, 30).join(' ');
      sessionStorage.setItem('forge-input', best);
      go('#/gym/forge');
    });
    on(box, '[data-typed]', 'click', function () {
      var txt = $('.typed textarea', box).value.trim();
      if (!txt) return;
      var ev2 = Analysis.buildEvidence({ frames: null, durationMs: ev.durationMs, transcript: txt, transcriptSource: 'typed', grammar: RC.grammar, targetText: o.targetText, bankWords: Store.get().words.map(function (w) { return w.word; }) });
      ev2.audio = ev.audio;
      take.ev = ev2;
      take.fb = Mentor.coach(ev2, { focus: o.focus || [], style: Store.get().profile.style, settings: Store.get().profile.settings, targetSeconds: o.seconds, kind: o.kind });
      self.showResults(take);
    });
    if (!reducedMotion()) box.firstElementChild && box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  function evidenceBtn(evd) {
    if (!evd || evd.startMs === undefined || evd.startMs === null) return '';
    return '<button class="btn ghost sm" data-ev="' + evd.startMs + '" data-end="' + (evd.endMs || evd.startMs + 2000) + '">▶ Hear this moment (' + fmtTime(evd.startMs) + ')</button>';
  }
  function sourceLabel(s) {
    return { 'on-device': 'on-device recognition', browser: 'browser speech service', typed: 'typed by you', none: 'none' }[s] || s;
  }

  Stage.prototype.destroy = function () {
    if (this.recording && this.rec) this.rec.cancel();
    this.takes.forEach(function (t) { try { URL.revokeObjectURL(t.url); } catch (e) { /* */ } });
  };

  function mountStage(container, opts) {
    var st = new Stage(container, opts);
    App.activeStage = st;
    return st;
  }

  // ---------- Word Bank helper ----------
  App.addWord = function (word, replaces) {
    var seed = (RC.wordSeed || []).find(function (w) { return w.word.toLowerCase() === word.toLowerCase(); });
    var exists = Store.get().words.some(function (w) { return w.word.toLowerCase() === word.toLowerCase(); });
    if (exists) { toast('"' + word + '" is already in your Word Bank'); return false; }
    Store.update(function (s) {
      s.words.push(Object.assign({ word: word, meaning: '', ipa: '', register: 'neutral', collocations: [], misuse: '', example: '' }, seed || {}, {
        added: Date.now(), source: replaces ? 'session (instead of "' + replaces + '")' : (seed ? 'library' : 'you'), card: SRS.newCard(), owned: null
      }));
    });
    toast('Added "' + word + '" to your Word Bank');
    return true;
  };

  Object.assign(App, {
    esc: esc, $: $, $$: $$, on: on, pick: pick, seeded: seeded, uid: uid, fmtTime: fmtTime, toast: toast,
    route: route, go: go, render: render, mountStage: mountStage, lesson: lesson, level: level, skill: skill,
    speakAs: speakAs, ttsButton: ttsButton, reducedMotion: reducedMotion, timedWords: timedWords
  });
})(window);
