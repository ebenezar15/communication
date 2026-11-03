/*
 * Rostrum analysis engine — deterministic measurement only.
 * Code measures; the mentor (mentor.js) interprets. Nothing here guesses at feelings.
 * Works in the browser (window.Analysis) and in Node (module.exports) for tests.
 */
(function (root) {
  'use strict';

  // ---------- Lexicons (editable) ----------
  var FILLERS = ['um', 'umm', 'uh', 'uhh', 'er', 'erm', 'ah', 'hmm', 'mm'];
  // Multi-word or context-dependent fillers. Counted only in filler-like positions.
  var SOFT_FILLERS = ['you know', 'i mean', 'basically', 'literally', 'like', 'actually', 'okay so', 'so yeah', 'right'];
  var HEDGES = ['i think', 'i guess', 'i feel like', 'i suppose', 'sort of', 'kind of', 'maybe', 'perhaps',
    'probably', 'just', 'a little bit', 'a bit', 'hopefully', 'somewhat', 'possibly', 'i\'m not sure', 'i am not sure',
    'i might be wrong', 'if that makes sense', 'does that make sense', 'or something', 'more or less', 'try to'];
  var APOLOGIES = ['sorry', 'i\'m sorry', 'apologies', 'excuse me', 'this might be a stupid', 'this is probably wrong',
    'i\'m not an expert', 'bear with me', 'i\'m nervous'];
  var WEAK_WORDS = {
    'very good': ['excellent', 'strong', 'outstanding'],
    'very bad': ['poor', 'serious', 'damaging'],
    'very big': ['substantial', 'major', 'large-scale'],
    'very small': ['minor', 'slight', 'marginal'],
    'very important': ['critical', 'essential', 'pivotal'],
    'really important': ['critical', 'essential', 'pivotal'],
    'very clear': ['unmistakable', 'explicit'],
    'very hard': ['demanding', 'difficult', 'gruelling'],
    'a lot of': ['many', 'much', 'plenty of', 'substantial'],
    'thing': ['factor', 'issue', 'step', 'idea (be specific)'],
    'things': ['factors', 'issues', 'steps', 'ideas (be specific)'],
    'stuff': ['material', 'work', 'details (be specific)'],
    'nice': ['pleasant', 'thoughtful', 'well-made (be specific)'],
    'good': ['effective', 'reliable', 'useful (be specific)'],
    'bad': ['harmful', 'flawed', 'costly (be specific)'],
    'got': ['received', 'earned', 'became'],
    'get': ['obtain', 'reach', 'receive']
  };
  var SIGNPOSTS = {
    point: ['my point is', 'the point is', 'the key is', 'in short', 'the answer is', 'i recommend', 'my recommendation',
      'what matters', 'the bottom line', 'here\'s the thing', 'i believe', 'i want to', 'we should', 'we need to', 'the main'],
    reason: ['because', 'since', 'the reason', 'that\'s why', 'which means', 'so that', 'due to'],
    example: ['for example', 'for instance', 'such as', 'take ', 'imagine', 'last week', 'last year', 'yesterday', 'once ',
      'when i', 'one time', 'picture', 'consider'],
    close: ['so,', 'that\'s why', 'in short', 'to sum up', 'in summary', 'which is why', 'so the', 'so my', 'finally', 'in the end'],
    sequence: ['first', 'second', 'third', 'next', 'then', 'finally', 'lastly', 'one ', 'two ', 'three ']
  };
  var STOP = ('a an the and or but if of to in on at for with by from up about into over after is are was were be been being ' +
    'i you he she it we they me him her us them my your his its our their this that these those there here what which who ' +
    'whom when where why how all any both each few more most other some such no nor not only own same so than too very can ' +
    'will just do does did doing have has had having would should could am im it\'s i\'m don\'t that\'s')
    .split(' ');
  var STOPSET = {};
  STOP.forEach(function (w) { STOPSET[w] = true; });

  // ---------- Text helpers ----------
  function normalise(text) {
    return (text || '').toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, '\'');
  }
  function tokenize(text) {
    var m = normalise(text).match(/[a-z0-9']+/g);
    return m || [];
  }
  function countPhrase(tokens, phrase) {
    var p = phrase.split(' ');
    var n = 0, hits = [];
    for (var i = 0; i + p.length <= tokens.length; i++) {
      var ok = true;
      for (var j = 0; j < p.length; j++) { if (tokens[i + j] !== p[j]) { ok = false; break; } }
      if (ok) { n++; hits.push(i); }
    }
    return { n: n, at: hits };
  }
  function splitSentences(text) {
    var t = (text || '').trim();
    if (!t) return [];
    var parts = t.split(/(?<=[.!?])\s+|\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
    return parts;
  }
  function hasPunctuation(text) { return /[.!?]/.test(text || ''); }

  /**
   * Analyse a transcript.
   * opts: { durationMs, speechMs, segments:[{text,startMs,endMs}], grammar:[patterns with detect], ownedWords:[...], targetWords:[...] }
   */
  function analyzeText(text, opts) {
    opts = opts || {};
    var tokens = tokenize(text);
    var wc = tokens.length;
    var minutes = opts.durationMs ? opts.durationMs / 60000 : null;
    var speechMinutes = opts.speechMs ? opts.speechMs / 60000 : null;
    var r = { wordCount: wc, tokens: tokens };

    r.wpm = minutes && wc ? Math.round(wc / minutes) : null;
    r.articulationWpm = speechMinutes && wc ? Math.round(wc / speechMinutes) : null;

    // Fillers
    var fillers = {};
    var fillerTotal = 0;
    FILLERS.forEach(function (f) {
      var c = countPhrase(tokens, f).n; if (c) { fillers[f] = c; fillerTotal += c; }
    });
    // Soft fillers: count "like" only when not preceded by a verb that takes it as a real verb ("i like", "would like", "looks like").
    SOFT_FILLERS.forEach(function (f) {
      var hit = countPhrase(tokens, f);
      var c = 0;
      hit.at.forEach(function (i) {
        var prev = tokens[i - 1];
        if (f === 'like' && /^(i|you|we|they|would|do|don't|did|didn't|looks|look|looked|feel|feels|felt|seems|sounds|just|really|much|more|anything|something|nothing|things|people|i'd|we'd|you'd)$/.test(prev || '')) return;
        if (f === 'right' && i !== 0 && tokens[i + 1] !== undefined) return; // only "right" at start/end
        if (f === 'actually' && i !== 0) return;
        c++;
      });
      if (c) { fillers[f] = (fillers[f] || 0) + c; fillerTotal += c; }
    });
    r.fillers = fillers;
    r.fillerCount = fillerTotal;
    r.fillersPerMin = minutes ? +(fillerTotal / minutes).toFixed(1) : null;

    // Hedges
    var hedges = {}, hedgeTotal = 0;
    HEDGES.forEach(function (h) {
      var c = countPhrase(tokens, h).n;
      if (h === 'just') {
        // "just" as "fair/recent" is legit; we cannot tell reliably, so we count it but mark low confidence.
      }
      if (c) { hedges[h] = c; hedgeTotal += c; }
    });
    r.hedges = hedges;
    r.hedgeCount = hedgeTotal;
    r.hedgesPer100 = wc ? +(hedgeTotal * 100 / wc).toFixed(1) : 0;

    // Opening (first 10 words)
    var opening = tokens.slice(0, 10);
    var openIssues = [];
    APOLOGIES.forEach(function (a) { if (countPhrase(opening, a).n) openIssues.push(a); });
    ['so', 'okay', 'well', 'basically', 'like', 'right'].forEach(function (f) {
      if (opening[0] === f) { if (openIssues.indexOf(f) < 0) openIssues.push(f); }
    });
    opening.slice(0, 4).forEach(function (w) {
      if (FILLERS.indexOf(w) >= 0 && openIssues.indexOf(w) < 0) openIssues.push(w);
    });
    r.openingWords = opening.join(' ');
    r.openingIssues = openIssues;

    // Apologies anywhere
    var apol = 0;
    APOLOGIES.forEach(function (a) { apol += countPhrase(tokens, a).n; });
    r.apologyCount = apol;

    // Repetition: immediate repeats ("the the") and overused content words
    var stutters = [];
    for (var i = 1; i < tokens.length; i++) {
      if (tokens[i] === tokens[i - 1] && !/^(very|really|no|bye|ha|that|had)$/.test(tokens[i])) stutters.push(tokens[i]);
    }
    r.restarts = stutters.length;
    var freq = {};
    tokens.forEach(function (t) { if (!STOPSET[t] && t.length > 2 && FILLERS.indexOf(t) < 0) freq[t] = (freq[t] || 0) + 1; });
    var overused = Object.keys(freq).filter(function (k) { return freq[k] >= Math.max(3, Math.ceil(wc / 40)); })
      .sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, 5)
      .map(function (k) { return { word: k, count: freq[k] }; });
    r.overused = overused;

    // Vocabulary diversity (only meaningful with enough speech)
    var content = tokens.filter(function (t) { return !STOPSET[t]; });
    var uniq = {};
    content.forEach(function (t) { uniq[t] = 1; });
    r.diversity = wc >= 50 ? +(Object.keys(uniq).length / Math.max(1, content.length)).toFixed(2) : null;

    // Sentences
    var sentences = splitSentences(text);
    r.punctuated = hasPunctuation(text);
    if (r.punctuated && sentences.length) {
      var lens = sentences.map(function (s) { return tokenize(s).length; }).filter(function (n) { return n > 0; });
      r.sentenceCount = lens.length;
      r.avgSentence = lens.length ? Math.round(lens.reduce(function (a, b) { return a + b; }, 0) / lens.length) : null;
      r.longestSentence = lens.length ? Math.max.apply(null, lens) : null;
      var longest = sentences.reduce(function (a, b) { return tokenize(b).length > tokenize(a).length ? b : a; }, '');
      r.longestSentenceText = longest;
    } else {
      r.sentenceCount = null; r.avgSentence = null; r.longestSentence = null;
    }

    // Weak words
    var weak = [];
    Object.keys(WEAK_WORDS).forEach(function (w) {
      var c = countPhrase(tokens, w).n;
      if (c) weak.push({ word: w, count: c, options: WEAK_WORDS[w] });
    });
    // avoid double counting "very good" + "good"
    weak = weak.filter(function (w) {
      return !weak.some(function (o) { return o !== w && o.word.indexOf(' ') > 0 && o.word.split(' ').indexOf(w.word) >= 0 && o.count >= w.count; });
    });
    r.weakWords = weak;

    // Structure signals
    var lower = ' ' + normalise(text) + ' ';
    var struct = {};
    Object.keys(SIGNPOSTS).forEach(function (k) {
      struct[k] = SIGNPOSTS[k].filter(function (p) { return lower.indexOf(' ' + p) >= 0; });
    });
    r.structure = {
      point: struct.point.length > 0,
      reason: struct.reason.length > 0,
      example: struct.example.length > 0 || /\b\d+\b/.test(lower),
      close: struct.close.length > 0,
      sequence: struct.sequence.length >= 2,
      signals: struct
    };
    var missing = [];
    if (!r.structure.point) missing.push('point');
    if (!r.structure.reason) missing.push('reason');
    if (!r.structure.example) missing.push('example');
    r.structure.missing = missing;
    r.structure.prep = missing.length === 0;

    // Grammar patterns (rule-based; signals not verdicts)
    var grammarHits = [];
    (opts.grammar || []).forEach(function (g) {
      if (!g.detect) return;
      try {
        var re = new RegExp(g.detect, 'ig');
        var m = normalise(text).match(re);
        if (m && m.length) grammarHits.push({ id: g.id, name: g.name, quote: m[0], right: g.right, rule: g.rule, count: m.length });
      } catch (e) { /* bad regex in content: skip */ }
    });
    r.grammar = grammarHits;
    r.grammarPer100 = wc ? +(grammarHits.reduce(function (a, g) { return a + g.count; }, 0) * 100 / wc).toFixed(1) : 0;

    // Word bank: owned words used in the wild
    var used = [];
    (opts.bankWords || []).forEach(function (w) {
      var t = tokenize(w);
      if (t.length && countPhrase(tokens, t.join(' ')).n) used.push(w);
      else if (t.length === 1) {
        // simple inflection match: pivotal -> pivotally, mitigate -> mitigated/mitigating
        var stem = t[0].replace(/(e|y)$/, '');
        if (stem.length >= 4 && tokens.some(function (x) { return x.indexOf(stem) === 0 && x.length - stem.length <= 4; })) used.push(w);
      }
    });
    r.bankWordsUsed = used;

    // Target words (for read-aloud / scripted practice): miscue detection
    if (opts.targetText) {
      r.miscues = compareScript(opts.targetText, text);
    }
    return r;
  }

  /** Align expected script against recognised words (LCS). Returns missing/substituted/extra. */
  function compareScript(expected, said) {
    var a = tokenize(expected), b = tokenize(said);
    var n = a.length, m = b.length;
    var dp = [];
    for (var i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var out = [], x = 0, y = 0;
    while (x < n && y < m) {
      if (a[x] === b[y]) { out.push({ op: 'ok', word: a[x] }); x++; y++; }
      else if (dp[x + 1][y] >= dp[x][y + 1]) { out.push({ op: 'missing', word: a[x] }); x++; }
      else { out.push({ op: 'extra', word: b[y] }); y++; }
    }
    while (x < n) { out.push({ op: 'missing', word: a[x++] }); }
    while (y < m) { out.push({ op: 'extra', word: b[y++] }); }
    // Merge adjacent missing+extra into substitution
    var merged = [];
    for (var k = 0; k < out.length; k++) {
      if (out[k].op === 'missing' && out[k + 1] && out[k + 1].op === 'extra') {
        merged.push({ op: 'sub', word: out[k].word, heard: out[k + 1].word }); k++;
      } else merged.push(out[k]);
    }
    var okCount = merged.filter(function (o) { return o.op === 'ok'; }).length;
    return {
      ops: merged,
      matchRate: n ? +(okCount / n).toFixed(2) : 0,
      missing: merged.filter(function (o) { return o.op === 'missing'; }).map(function (o) { return o.word; }),
      subs: merged.filter(function (o) { return o.op === 'sub'; })
    };
  }

  // ---------- Audio analysis ----------
  /**
   * frames: [{t (ms since start), rms (0..1), peak (0..1), pitch (Hz or 0)}], sampled ~every 30-60ms.
   */
  function analyzeAudio(frames, durationMs) {
    var r = { durationMs: durationMs || (frames.length ? frames[frames.length - 1].t : 0) };
    if (!frames || frames.length < 5) { r.quality = { ok: false, reason: 'too-short' }; return r; }
    var rmsSorted = frames.map(function (f) { return f.rms; }).sort(function (a, b) { return a - b; });
    var noise = percentile(rmsSorted, 0.15);
    var loud = percentile(rmsSorted, 0.9);
    // Cap at a fraction of the loud level so continuous speech (little silence) still counts as speech.
    var threshold = Math.max(0.012, Math.min(Math.max(noise * 2.2, noise + (loud - noise) * 0.18), loud * 0.35));
    var quiet = rmsSorted.filter(function (v) { return v < threshold; });
    noise = quiet.length >= 3 ? percentile(quiet, 0.5) : null;
    r.noiseFloor = noise === null ? null : +noise.toFixed(4);
    r.threshold = +threshold.toFixed(4);

    // Voice activity with hangover smoothing
    var voiced = frames.map(function (f) { return f.rms >= threshold; });
    var dt = frames.length > 1 ? (frames[frames.length - 1].t - frames[0].t) / (frames.length - 1) : 50;
    var hang = Math.round(150 / dt);
    var smooth = voiced.slice();
    for (var i = 0; i < voiced.length; i++) {
      if (!voiced[i]) continue;
      for (var k = 1; k <= hang && i + k < voiced.length; k++) smooth[i + k] = true;
    }
    // Segments
    var segs = [];
    var cur = null;
    for (i = 0; i < frames.length; i++) {
      if (smooth[i]) { if (!cur) cur = { start: frames[i].t, end: frames[i].t }; else cur.end = frames[i].t; }
      else if (cur) {
        // gap shorter than 250ms doesn't end the segment
        var gapEnd = i; while (gapEnd < frames.length && !smooth[gapEnd]) gapEnd++;
        if (gapEnd < frames.length && frames[gapEnd].t - cur.end < 250) { i = gapEnd - 1; continue; }
        segs.push(cur); cur = null;
      }
    }
    if (cur) segs.push(cur);
    segs = segs.filter(function (s) { return s.end - s.start >= 80; });
    r.segments = segs;
    var speechMs = segs.reduce(function (a, s) { return a + (s.end - s.start + dt); }, 0);
    r.speechMs = Math.round(speechMs);
    r.leadingSilenceMs = segs.length ? Math.round(segs[0].start) : Math.round(r.durationMs);
    r.trailingSilenceMs = segs.length ? Math.max(0, Math.round(r.durationMs - segs[segs.length - 1].end)) : 0;

    var pauses = [];
    for (i = 1; i < segs.length; i++) {
      var g = segs[i].start - segs[i - 1].end;
      if (g >= 300) pauses.push({ startMs: Math.round(segs[i - 1].end), endMs: Math.round(segs[i].start), ms: Math.round(g) });
    }
    r.pauses = pauses;
    r.pauseCount = pauses.length;
    r.longPauses = pauses.filter(function (p) { return p.ms >= 1200; }).length;
    r.longestPauseMs = pauses.reduce(function (a, p) { return Math.max(a, p.ms); }, 0);
    // longest continuous run without a pause >= 300ms
    r.longestRunMs = segs.reduce(function (a, s) { return Math.max(a, s.end - s.start); }, 0);

    // Volume
    var speechFrames = frames.filter(function (f, idx) { return smooth[idx]; });
    var speechRms = speechFrames.map(function (f) { return f.rms; }).sort(function (a, b) { return a - b; });
    r.medianSpeechRms = speechRms.length ? +percentile(speechRms, 0.5).toFixed(4) : 0;
    var db = speechFrames.map(function (f) { return 20 * Math.log10(Math.max(f.rms, 1e-5)); });
    r.volumeVariationDb = db.length > 5 ? +stdev(db).toFixed(1) : null;
    var clipped = frames.filter(function (f) { return f.peak >= 0.99; }).length;
    r.clippedRatio = +(clipped / frames.length).toFixed(3);
    r.snrDb = noise ? +(20 * Math.log10(Math.max(r.medianSpeechRms, 1e-5) / Math.max(noise, 1e-5))).toFixed(1) : null;

    // Pitch (semitones relative to speaker median)
    var pitches = speechFrames.map(function (f) { return f.pitch; }).filter(function (p) { return p > 60 && p < 500; });
    if (pitches.length >= 8) {
      var ps = pitches.slice().sort(function (a, b) { return a - b; });
      var med = percentile(ps, 0.5);
      r.pitchMedianHz = Math.round(med);
      r.pitchRangeSt = +(12 * Math.log2(percentile(ps, 0.9) / percentile(ps, 0.1))).toFixed(1);
      r.monotone = r.pitchRangeSt < 3.5;
      r.endings = segs.map(function (s) { return endingDirection(frames, s, med); }).filter(Boolean);
      var last = r.endings.length ? r.endings[r.endings.length - 1] : null;
      r.finalEnding = last ? last.dir : null;
      r.risingEndings = r.endings.filter(function (e) { return e.dir === 'rising'; }).length;
    } else {
      r.pitchMedianHz = null; r.pitchRangeSt = null; r.monotone = null; r.endings = []; r.finalEnding = null; r.risingEndings = 0;
    }

    // Quality gate — ask for a retake rather than scoring unreliable audio
    var q = { ok: true, reason: null };
    if (r.durationMs < 1500 || speechMs < 800) q = { ok: false, reason: 'too-short' };
    else if (r.medianSpeechRms < 0.008) q = { ok: false, reason: 'too-quiet' };
    else if (r.clippedRatio > 0.05) q = { ok: false, reason: 'clipping' };
    else if (r.snrDb !== null && r.snrDb < 6) q = { ok: false, reason: 'noisy' };
    r.quality = q;
    return r;
  }

  function endingDirection(frames, seg, med) {
    if (seg.end - seg.start < 500) return null;
    var win = frames.filter(function (f) { return f.t >= seg.end - 450 && f.t <= seg.end && f.pitch > 60 && f.pitch < 500; });
    var before = frames.filter(function (f) { return f.t >= seg.start && f.t < seg.end - 450 && f.pitch > 60 && f.pitch < 500; });
    if (win.length < 3 || before.length < 3) return null;
    var tail = win.slice(-Math.max(2, Math.floor(win.length / 2)));
    var endP = mean(tail.map(function (f) { return f.pitch; }));
    var bodyP = mean(before.map(function (f) { return f.pitch; }));
    var st = 12 * Math.log2(endP / bodyP);
    var dir = st > 2 ? 'rising' : st < -1 ? 'falling' : 'level';
    return { atMs: Math.round(seg.end), dir: dir, st: +st.toFixed(1) };
  }

  function percentile(sorted, p) {
    if (!sorted.length) return 0;
    var idx = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * p)));
    return sorted[idx];
  }
  function mean(a) { return a.reduce(function (x, y) { return x + y; }, 0) / (a.length || 1); }
  function stdev(a) { var m = mean(a); return Math.sqrt(mean(a.map(function (x) { return (x - m) * (x - m); }))); }

  /** Autocorrelation pitch detector. buf: Float32Array time-domain, returns Hz or 0. */
  function detectPitch(buf, sampleRate) {
    var n = buf.length;
    var rms = 0;
    for (var i = 0; i < n; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / n);
    if (rms < 0.01) return 0;
    var minLag = Math.floor(sampleRate / 500), maxLag = Math.min(Math.floor(sampleRate / 60), n - 1);
    // Normalised difference (YIN-style) for robustness
    var d = new Float32Array(maxLag + 1);
    for (var lag = minLag; lag <= maxLag; lag++) {
      var sum = 0;
      for (i = 0; i + lag < n; i++) { var diff = buf[i] - buf[i + lag]; sum += diff * diff; }
      d[lag] = sum;
    }
    var running = 0, best = -1;
    var cmnd = new Float32Array(maxLag + 1);
    for (lag = minLag; lag <= maxLag; lag++) {
      running += d[lag];
      cmnd[lag] = running ? d[lag] * (lag - minLag + 1) / running : 1;
    }
    for (lag = minLag + 1; lag < maxLag; lag++) {
      if (cmnd[lag] < 0.15 && cmnd[lag] <= cmnd[lag - 1] && cmnd[lag] <= cmnd[lag + 1]) { best = lag; break; }
    }
    if (best < 0) return 0;
    // Parabolic interpolation
    var x0 = cmnd[best - 1], x1 = cmnd[best], x2 = cmnd[best + 1];
    var denom = x0 + x2 - 2 * x1;
    var shift = denom ? (x0 - x2) / (2 * denom) : 0;
    return sampleRate / (best + shift);
  }

  /** Merge text + audio into one versioned Evidence Bundle. */
  function buildEvidence(input) {
    var audio = input.frames ? analyzeAudio(input.frames, input.durationMs) : null;
    var text = input.transcript ? analyzeText(input.transcript, {
      durationMs: input.durationMs,
      speechMs: audio ? audio.speechMs : null,
      grammar: input.grammar,
      bankWords: input.bankWords,
      targetText: input.targetText
    }) : null;
    return {
      version: 1,
      createdAt: Date.now(),
      transcriptSource: input.transcriptSource || (input.transcript ? 'unknown' : 'none'),
      transcript: input.transcript || '',
      segments: input.segments || [],
      durationMs: input.durationMs,
      audio: audio,
      text: text,
      context: input.context || {}
    };
  }

  var api = {
    FILLERS: FILLERS, HEDGES: HEDGES, APOLOGIES: APOLOGIES, WEAK_WORDS: WEAK_WORDS,
    tokenize: tokenize, splitSentences: splitSentences, analyzeText: analyzeText, analyzeAudio: analyzeAudio,
    compareScript: compareScript, detectPitch: detectPitch, buildEvidence: buildEvidence, countPhrase: countPhrase
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Analysis = api;
})(typeof window !== 'undefined' ? window : this);
