/*
 * Rostrum offline mentor — a transparent, rule-based coach.
 * It interprets measured evidence; it never invents numbers, facts or feelings.
 * Coaching rules: one true strength, ONE big fix, what → why → how → try it now.
 */
(function (root) {
  'use strict';

  var STYLE = {
    gentle: { fixLead: 'One thing to try next', strengthLead: 'What worked', retakeLead: 'Try it again, and this time' },
    direct: { fixLead: 'Biggest fix', strengthLead: 'Strength', retakeLead: 'Retake now:' },
    tough: { fixLead: 'What is costing you', strengthLead: 'Keep this', retakeLead: 'Again. This time' }
  };

  var QUALITY_MSG = {
    'too-short': 'That take was too short to measure fairly. Speak for at least a few seconds and try again.',
    'too-quiet': 'I could barely hear you, so I won\'t score this. Move closer to the mic or speak up a little, then retake.',
    'clipping': 'The audio was distorting (too loud for the mic). Move back a little and retake — I won\'t score distorted audio.',
    'noisy': 'There was a lot of background noise, so the measurements would be unreliable. Try a quieter spot and retake.'
  };

  function norm(s) { return (s || '').toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }

  /** Find a quote in timed segments, returning approximate times. */
  function locate(quote, segments) {
    if (!quote || !segments || !segments.length) return null;
    var q = norm(quote);
    for (var i = 0; i < segments.length; i++) {
      var s = segments[i];
      var t = norm(s.text);
      var at = t.indexOf(q);
      if (at >= 0) {
        var span = s.endMs - s.startMs;
        var startMs = s.startMs + Math.round(span * (at / Math.max(1, t.length)));
        var endMs = Math.min(s.endMs, startMs + Math.max(600, Math.round(span * (q.length / Math.max(1, t.length)))));
        return { startMs: Math.max(0, startMs - 250), endMs: endMs + 250 };
      }
    }
    return null;
  }

  function firstSentenceWith(text, phrase) {
    var sentences = (text || '').split(/(?<=[.!?])\s+/);
    var p = phrase.toLowerCase();
    for (var i = 0; i < sentences.length; i++) if (sentences[i].toLowerCase().indexOf(p) >= 0) return sentences[i].trim();
    // unpunctuated: take a window around the phrase
    var words = (text || '').split(/\s+/);
    var lw = words.map(function (w) { return w.toLowerCase().replace(/[^a-z']/g, ''); });
    var first = p.split(' ')[0];
    var idx = lw.indexOf(first);
    if (idx < 0) return phrase;
    return words.slice(Math.max(0, idx - 4), idx + 8).join(' ');
  }

  function topKey(obj) {
    var best = null;
    Object.keys(obj || {}).forEach(function (k) { if (!best || obj[k] > obj[best]) best = k; });
    return best;
  }

  /**
   * ev: Evidence bundle from Analysis.buildEvidence
   * ctx: { focus:[], style, settings:{stutterFriendly, scoreFillers, scorePace}, targetSeconds, kind, prompt }
   */
  function coach(ev, ctx) {
    ctx = ctx || {};
    var st = STYLE[ctx.style] || STYLE.direct;
    var settings = ctx.settings || {};
    var stutter = !!settings.stutterFriendly;
    var scoreFillers = !stutter && settings.scoreFillers !== false;
    var scorePace = !stutter && settings.scorePace !== false;
    var focus = ctx.focus || [];
    var a = ev.audio || {};
    var t = ev.text;
    var segs = ev.segments || [];
    var out = { version: 1, style: ctx.style || 'direct', notes: [] };

    if (a.quality && !a.quality.ok) {
      out.quality = { ok: false, reason: a.quality.reason, message: QUALITY_MSG[a.quality.reason] || 'Audio was unreliable. Please retake.' };
      return out;
    }
    out.quality = { ok: true };

    var cands = [];
    // When reading a script, the words aren't the speaker's choices: only coach delivery and clarity.
    var READ_OK = { fillers: 1, pace: 1, pronunciation: 1, ending: 1, pauses: 1, intonation: 1 };
    function add(c) {
      if (ctx.kind === 'read' && !READ_OK[c.key]) return;
      if (focus.indexOf(c.key) >= 0) c.impact *= 1.5;
      if (c.quote) c.evidence = Object.assign({ quote: c.quote }, locate(c.quote, segs) || {});
      cands.push(c);
    }
    var durS = (ev.durationMs || 0) / 1000;
    var speechS = (a.speechMs || ev.durationMs || 0) / 1000;

    // --- Language & delivery rules (need a transcript) ---
    if (t && t.wordCount >= 4) {
      if (t.openingIssues.length && ctx.kind !== 'read') {
        var oq = t.openingWords.split(' ').slice(0, 6).join(' ');
        add({
          key: 'opening', skill: 'presence', impact: 70, confidence: 'high',
          title: 'Open strong — no warm-up words',
          what: 'You opened with "' + t.openingIssues.join('", "') + '".',
          why: 'Listeners decide in the first seconds whether to lean in. An apology or filler spends that moment on nothing.',
          how: 'Breathe in, pause one beat, then say your first real sentence. Start with the point, a number, or a picture.',
          quote: oq,
          retake: 'start with your main point as the very first words'
        });
      }
      if (t.hedgesPer100 >= 3 && t.hedgeCount >= 2) {
        var h = topKey(t.hedges);
        add({
          key: 'hedges', skill: 'presence', impact: Math.min(85, 45 + t.hedgesPer100 * 5), confidence: h === 'just' ? 'medium' : 'high',
          title: 'Fewer hedges, more conviction',
          what: 'You used ' + t.hedgeCount + ' softeners (most often "' + h + '"), about ' + t.hedgesPer100 + ' per 100 words.',
          why: 'Each hedge tells the listener you are not sure — even when you are. Keep them only where honesty needs them.',
          how: 'Delete "' + h + '" and say the sentence plainly. If you really are unsure, say it once, clearly: "I\'m not certain, but my best estimate is…"',
          quote: firstSentenceWith(ev.transcript, h),
          retake: 'remove every "' + h + '" that isn\'t needed for honesty'
        });
      }
      if (scoreFillers && t.fillersPerMin !== null && t.fillersPerMin >= 5 && t.fillerCount >= 3) {
        var f = topKey(t.fillers);
        add({
          key: 'fillers', skill: 'presence', impact: Math.min(80, 35 + t.fillersPerMin * 4), confidence: 'medium',
          title: 'Swap fillers for silence',
          what: 'About ' + t.fillersPerMin + ' fillers per minute — mostly "' + f + '".',
          why: 'Fillers make thinking audible. A silent pause sounds deliberate; "' + f + '" sounds unsure.',
          how: 'When you feel "' + f + '" coming, close your lips and pause instead. The pause feels long to you; it sounds natural to them.',
          quote: f,
          retake: 'replace each "' + f + '" with a silent pause'
        });
      }
      if (scorePace && t.wpm && durS >= 12) {
        if (t.wpm > 185) add({
          key: 'pace', skill: 'voice', impact: 55 + Math.min(20, (t.wpm - 185) / 3), confidence: 'medium',
          title: 'Slow the pace so ideas land',
          what: 'About ' + t.wpm + ' words per minute. A comfortable range for explaining is roughly 130–170, depending on the room.',
          why: 'At speed, listeners hear words but miss meaning — and you sound rushed even when you are prepared.',
          how: 'Speak in short thought groups and pause at every full stop. Stretch the important words slightly.',
          retake: 'pause at the end of every sentence'
        });
        else if (t.wpm < 95 && (a.longPauses || 0) < 3) add({
          key: 'pace', skill: 'voice', impact: 40, confidence: 'low',
          title: 'Pick up the momentum',
          what: 'About ' + t.wpm + ' words per minute — on the slow side for most situations.',
          why: 'A very slow pace can lose attention. Energy carries listeners through.',
          how: 'Keep pauses for key moments; move through connecting words with a little more drive.',
          retake: 'keep the energy up between your key points'
        });
      }
      if (t.punctuated && t.longestSentence >= 35) add({
        key: 'sentenceLength', skill: 'grammar', impact: 40, confidence: 'high',
        title: 'Cut the long sentence in half',
        what: 'Your longest sentence ran ' + t.longestSentence + ' words.',
        why: 'Long spoken sentences make listeners hold too much in memory before they get the point.',
        how: 'Put the main point first, end the sentence, then add the detail as a second sentence.',
        quote: (t.longestSentenceText || '').split(' ').slice(0, 10).join(' '),
        retake: 'keep every sentence to one breath'
      });
      t.grammar.forEach(function (g) {
        add({
          key: 'grammar', skill: 'grammar', impact: 50, confidence: 'medium',
          title: 'Grammar: ' + g.name,
          what: 'You said "' + g.quote + '".',
          why: g.rule + ' (Rule-based check — tap "That\'s wrong" if it misheard you.)',
          how: 'Say it as: "' + g.right + '"',
          quote: g.quote,
          retake: 'use the corrected form: "' + g.right + '"'
        });
      });
      if (t.weakWords.length >= 2 || (t.weakWords[0] && t.weakWords[0].count >= 3)) {
        var w = t.weakWords.slice().sort(function (x, y) { return y.count - x.count; })[0];
        add({
          key: 'weakWords', skill: 'words', impact: 35, confidence: 'high',
          title: 'Choose sharper words',
          what: 'You leaned on general words like "' + t.weakWords.map(function (x) { return x.word; }).slice(0, 3).join('", "') + '".',
          why: 'Vague words make the listener do the work. Precise words make you sound like you know exactly what you mean.',
          how: 'Instead of "' + w.word + '", try ' + w.options.map(function (o) { return '"' + o + '"'; }).join(' or ') + ' — or name the specific thing.',
          quote: w.word,
          retake: 'replace "' + w.word + '" with a precise word'
        });
      }
      var wantsStructure = focus.indexOf('structure') >= 0 || (speechS >= 25 && ctx.kind !== 'read');
      if (wantsStructure && t.structure) {
        if (t.structure.missing.indexOf('example') >= 0) add({
          key: 'structure', skill: 'example', impact: 50, confidence: 'medium',
          title: 'Add one concrete example',
          what: 'I didn\'t hear a specific example — no "for example", no person, place, time or number.',
          why: 'Examples are what people remember. Abstract claims slide off; a real moment sticks.',
          how: 'After your point, add: "For example, last month…" — a person, a place, or a number.',
          retake: 'include one real example with a person, place or number'
        });
        else if (t.structure.missing.indexOf('point') >= 0 && focus.indexOf('structure') >= 0) add({
          key: 'structure', skill: 'structure', impact: 45, confidence: 'low',
          title: 'State your point up front',
          what: 'I couldn\'t find a clear headline statement of your point.',
          why: 'If listeners don\'t know where you\'re going, they can\'t follow the journey.',
          how: 'Use PREP: Point, Reason ("because…"), Example ("for example…"), Point again.',
          retake: 'begin with "My point is…" and end by repeating it'
        });
      }
      if (t.overused.length && t.overused[0].count >= 4 && !stutter) add({
        key: 'repetition', skill: 'words', impact: 30, confidence: 'high',
        title: 'Vary a repeated word',
        what: '"' + t.overused[0].word + '" came up ' + t.overused[0].count + ' times.',
        why: 'Heavy repetition can make a message sound thin. (Deliberate repetition for emphasis is fine!)',
        how: 'Find one synonym or replace it with "this", "it", or a more specific noun.',
        quote: t.overused[0].word,
        retake: 'use "' + t.overused[0].word + '" at most twice'
      });
      if (t.apologyCount >= 2 && !t.openingIssues.length) add({
        key: 'apology', skill: 'presence', impact: 45, confidence: 'high',
        title: 'Drop the apologies',
        what: 'You apologised ' + t.apologyCount + ' times.',
        why: 'Unneeded apologies shrink your message and train the audience to doubt it.',
        how: 'Replace "sorry" with "thank you" ("Thanks for waiting") or simply continue.',
        retake: 'say it without a single "sorry"'
      });
      if (t.miscues && t.miscues.matchRate < 0.9) {
        var sub = t.miscues.subs[0];
        add({
          key: 'pronunciation', skill: 'pronunciation', impact: 60, confidence: 'low',
          title: sub ? 'Check how "' + sub.word + '" came across' : 'Some words weren\'t picked up',
          what: sub ? 'The recogniser heard "' + sub.heard + '" where the script says "' + sub.word + '". This may have sounded like "' + sub.heard + '" — or the recogniser may simply have slipped.'
            : 'The recogniser missed: ' + t.miscues.missing.slice(0, 4).join(', ') + '.',
          why: 'If a machine mishears a word, some listeners may too — but this is a signal, not a verdict.',
          how: 'Use Listen to hear the model, then say the word slowly, then at normal speed. Exaggerate the final consonant.',
          quote: sub ? sub.heard : t.miscues.missing[0],
          retake: 'say "' + (sub ? sub.word : t.miscues.missing[0]) + '" slowly and clearly'
        });
      }
    }

    // --- Audio-only rules ---
    if (a.endings && a.finalEnding === 'rising' && ctx.kind !== 'question') add({
      key: 'ending', skill: 'presence', impact: 50, confidence: 'low',
      title: 'Land the ending',
      what: 'Your final sentence seemed to rise in pitch at the end (a possible "question" ending).',
      why: 'A falling finish signals certainty; a rising one can make a statement sound like a request for approval.',
      how: 'On your final word, let your voice drop and then stop. Hold the silence for a beat.',
      evidence: { startMs: Math.max(0, (a.endings[a.endings.length - 1].atMs) - 1200), endMs: a.endings[a.endings.length - 1].atMs + 300, quote: '(final words)' },
      retake: 'let your final word fall and stop cleanly'
    });
    if (scorePace && speechS >= 25 && a.pauseCount !== undefined && a.pauseCount < Math.floor(speechS / 12)) add({
      key: 'pauses', skill: 'voice', impact: 45, confidence: 'medium',
      title: 'Let it breathe — use pauses',
      what: 'Only ' + a.pauseCount + ' noticeable pauses in ' + Math.round(speechS) + ' seconds of speech.',
      why: 'Pauses are punctuation for the ear. They give listeners time to absorb and make you sound in control.',
      how: 'Pause for a full second after each key idea. Count "one-and" silently.',
      retake: 'pause for one second after each key idea'
    });
    if (a.monotone && speechS >= 10) add({
      key: 'intonation', skill: 'voice', impact: 30, confidence: 'low',
      title: 'Add vocal colour',
      what: 'Your pitch stayed in a narrow range (~' + a.pitchRangeSt + ' semitones).',
      why: 'Pitch movement tells listeners which words matter. A flat line makes everything sound equally (un)important.',
      how: 'Pick the one most important word per sentence and lift it — higher and slightly longer.',
      retake: 'lift one key word in each sentence'
    });
    if (ctx.targetSeconds && speechS < ctx.targetSeconds * 0.35 && speechS < 20) add({
      key: 'duration', skill: 'structure', impact: 40, confidence: 'high',
      title: 'Develop the answer further',
      what: 'You spoke for about ' + Math.round(speechS) + ' seconds of a ' + ctx.targetSeconds + '-second slot.',
      why: 'A short answer can sound unprepared. Room to develop = room to persuade.',
      how: 'Add a reason ("because…") and an example ("for example…") to your point.',
      retake: 'add a reason and an example'
    });

    cands.sort(function (x, y) { return y.impact - x.impact; });
    // Never show a low-confidence item as the big fix if a better-evidenced one exists with similar impact
    var big = cands[0] || null;
    if (big && big.confidence === 'low') {
      var alt = cands.find(function (c) { return c.confidence !== 'low' && c.impact >= big.impact * 0.8; });
      if (alt) big = alt;
    }
    if (big) {
      out.bigFix = {
        lead: st.fixLead, key: big.key, skill: big.skill, title: big.title, whatHappened: big.what, whyItMatters: big.why,
        howToFix: big.how, evidence: big.evidence || null, confidence: big.confidence,
        retakePrompt: st.retakeLead + ' ' + big.retake + '.'
      };
    }
    out.minorNotes = cands.filter(function (c) { return c !== big; }).slice(0, 2).map(function (c) {
      return { key: c.key, title: c.title, text: c.what + ' ' + c.how, confidence: c.confidence, evidence: c.evidence || null };
    });
    out.strength = pickStrength(ev, ctx, scoreFillers, scorePace, st);
    out.wordBankCandidates = t && ctx.kind !== 'read' ? t.weakWords.map(function (w) { return { weak: w.word, options: w.options }; }) : [];
    out.bankWordsUsed = t ? t.bankWordsUsed : [];
    out.fingerprint = fingerprintUpdates(ev, scoreFillers, scorePace);
    out.metrics = metricChips(ev, scoreFillers, scorePace);
    if (!t) out.notes.push('No transcript for this take, so language feedback (words, grammar, structure) is off. Turn on speech recognition or type what you said.');
    else if (ev.transcriptSource === 'browser' && scoreFillers) out.notes.push('Browser speech recognisers often drop "um" and "uh", so filler counts may be low.');
    if (stutter) out.notes.push('Stutter-friendly mode is on: fluency, filler, pace and repetition scoring are switched off.');
    return out;
  }

  function pickStrength(ev, ctx, scoreFillers, scorePace, st) {
    var a = ev.audio || {}, t = ev.text;
    var s = [];
    if (t && t.wordCount >= 15) {
      if (!t.openingIssues.length && ctx.kind !== 'read') s.push({ w: 60, text: 'Clean opening — you went straight in with "' + t.openingWords.split(' ').slice(0, 5).join(' ') + '…".', quote: t.openingWords.split(' ').slice(0, 5).join(' ') });
      if (t.structure && t.structure.prep) s.push({ w: 70, text: 'Complete structure: a point, a reason and an example. That\'s exactly how persuasive answers are built.' });
      else if (t.structure && t.structure.example) s.push({ w: 55, text: 'You used a concrete example — that\'s what listeners will remember.' });
      if (scoreFillers && t.fillerCount === 0 && t.wordCount >= 30) s.push({ w: 50, text: 'No fillers detected in ' + t.wordCount + ' words.' });
      if (t.hedgeCount === 0 && t.wordCount >= 25) s.push({ w: 52, text: 'No hedging — you said things plainly and with conviction.' });
      if (scorePace && t.wpm >= 120 && t.wpm <= 170) s.push({ w: 40, text: 'Comfortable pace (~' + t.wpm + ' wpm) — easy to follow.' });
      if (t.bankWordsUsed && t.bankWordsUsed.length) s.push({ w: 80, text: 'You used "' + t.bankWordsUsed[0] + '" from your Word Bank naturally — that word is becoming yours.' });
      if (t.miscues && t.miscues.matchRate >= 0.95) s.push({ w: 65, text: 'Very clear reading — the recogniser caught ' + Math.round(t.miscues.matchRate * 100) + '% of the script.' });
    }
    if (a.finalEnding === 'falling') s.push({ w: 45, text: 'You landed your ending — your voice fell on the final word, which sounds certain.' });
    if (a.pitchRangeSt && a.pitchRangeSt >= 7) s.push({ w: 35, text: 'Expressive voice — good pitch movement keeps people listening.' });
    if (a.longPauses >= 1 && a.longPauses <= 4) s.push({ w: 38, text: 'You used deliberate pauses — that reads as composure.' });
    if (a.leadingSilenceMs >= 800 && a.leadingSilenceMs <= 3500 && ctx.kind !== 'read') s.push({ w: 30, text: 'You took a breath before starting instead of rushing in.' });
    s.sort(function (x, y) { return y.w - x.w; });
    var pick = s[0] || { text: 'You finished the take. Showing up and speaking is the rep that counts most — now let\'s sharpen it.' };
    return { lead: st.strengthLead, text: pick.text, evidence: pick.quote ? Object.assign({ quote: pick.quote }, locate(pick.quote, ev.segments) || {}) : null };
  }

  function fingerprintUpdates(ev, scoreFillers, scorePace) {
    var a = ev.audio || {}, t = ev.text, u = {};
    if (t && t.wordCount >= 10) {
      if (scorePace && t.wpm) u.wpm = t.wpm;
      if (scoreFillers && t.fillersPerMin !== null) u.fillersPerMin = t.fillersPerMin;
      u.hedgesPer100 = t.hedgesPer100;
      u.hedges = t.hedges; u.fillers = scoreFillers ? t.fillers : {};
      u.grammar = t.grammar.map(function (g) { return g.id; });
      u.weakWords = t.weakWords.map(function (w) { return w.word; });
      u.openingClean = !t.openingIssues.length;
      if (t.avgSentence) u.avgSentence = t.avgSentence;
      u.example = t.structure ? t.structure.example : null;
    }
    if (a.pitchRangeSt) u.pitchRangeSt = a.pitchRangeSt;
    if (a.finalEnding) u.finalEnding = a.finalEnding;
    if (a.pauseCount !== undefined && a.speechMs) u.pausesPerMin = +(a.pauseCount / (a.speechMs / 60000)).toFixed(1);
    return u;
  }

  function metricChips(ev, scoreFillers, scorePace) {
    var a = ev.audio || {}, t = ev.text, m = [];
    m.push({ key: 'duration', label: 'Duration', value: Math.round((ev.durationMs || 0) / 1000) + 's' });
    if (a.speechMs) m.push({ key: 'speech', label: 'Speaking time', value: Math.round(a.speechMs / 1000) + 's' });
    if (t && scorePace && t.wpm) m.push({ key: 'pace', label: 'Pace', value: t.wpm + ' wpm', hint: '130–170 is a common explaining range' });
    if (t && scoreFillers && t.fillersPerMin !== null) m.push({ key: 'fillers', label: 'Fillers', value: t.fillerCount + ' (' + t.fillersPerMin + '/min)' });
    if (t) m.push({ key: 'hedges', label: 'Hedges', value: t.hedgeCount + ' (' + t.hedgesPer100 + '/100w)' });
    if (a.pauseCount !== undefined) m.push({ key: 'pauses', label: 'Pauses', value: a.pauseCount + (a.longestPauseMs ? ' (longest ' + (a.longestPauseMs / 1000).toFixed(1) + 's)' : '') });
    if (a.pitchRangeSt) m.push({ key: 'pitch', label: 'Pitch range', value: a.pitchRangeSt + ' st', hint: 'semitones; wider = more expressive' });
    if (a.finalEnding) m.push({ key: 'ending', label: 'Final ending', value: a.finalEnding });
    if (t && t.avgSentence) m.push({ key: 'sentence', label: 'Avg sentence', value: t.avgSentence + ' words' });
    if (t && t.miscues) m.push({ key: 'script', label: 'Script match', value: Math.round(t.miscues.matchRate * 100) + '%', hint: 'recogniser-based signal' });
    return m;
  }

  /** Objective A/B comparison between two evidence bundles. */
  function compareTakes(e1, e2, settings) {
    settings = settings || {};
    var stutter = settings.stutterFriendly;
    var rows = [];
    function row(label, v1, v2, betterWhen, unit) {
      if (v1 === null || v1 === undefined || v2 === null || v2 === undefined) return;
      var better = null;
      if (betterWhen === 'lower') better = v2 < v1 ? true : v2 > v1 ? false : null;
      else if (betterWhen === 'higher') better = v2 > v1 ? true : v2 < v1 ? false : null;
      else if (typeof betterWhen === 'function') better = betterWhen(v1, v2);
      rows.push({ label: label, before: v1 + (unit || ''), after: v2 + (unit || ''), better: better });
    }
    var t1 = e1.text, t2 = e2.text, a1 = e1.audio || {}, a2 = e2.audio || {};
    if (t1 && t2) {
      if (!stutter) row('Fillers', t1.fillerCount, t2.fillerCount, 'lower');
      row('Hedges', t1.hedgeCount, t2.hedgeCount, 'lower');
      row('Opening issues', t1.openingIssues.length, t2.openingIssues.length, 'lower');
      if (!stutter) row('Pace', t1.wpm, t2.wpm, function (x, y) { var d = function (v) { return Math.abs(v - 150); }; return d(y) < d(x) - 5 ? true : d(y) > d(x) + 5 ? false : null; }, ' wpm');
      row('Grammar flags', t1.grammar.length, t2.grammar.length, 'lower');
      row('Vague words', t1.weakWords.length, t2.weakWords.length, 'lower');
      row('Example used', t1.structure.example ? 'yes' : 'no', t2.structure.example ? 'yes' : 'no', function (x, y) { return x === y ? null : y === 'yes'; });
      if (t1.miscues && t2.miscues) row('Script match', Math.round(t1.miscues.matchRate * 100), Math.round(t2.miscues.matchRate * 100), 'higher', '%');
    }
    row('Pauses', a1.pauseCount, a2.pauseCount, null);
    row('Pitch range', a1.pitchRangeSt, a2.pitchRangeSt, 'higher', ' st');
    row('Final ending', a1.finalEnding, a2.finalEnding, function (x, y) { return x === y ? null : y === 'falling' ? true : x === 'falling' ? false : null; });
    var wins = rows.filter(function (r) { return r.better === true; }).length;
    var losses = rows.filter(function (r) { return r.better === false; }).length;
    return { rows: rows, wins: wins, losses: losses };
  }

  var api = { coach: coach, compareTakes: compareTakes, locate: locate, QUALITY_MSG: QUALITY_MSG };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Mentor = api;
})(typeof window !== 'undefined' ? window : this);
