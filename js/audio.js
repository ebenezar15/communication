/*
 * Rostrum audio layer: microphone capture, live measurement frames, optional speech recognition, TTS.
 * Everything runs in the browser. Recordings never leave the device; see the speech-recognition note below.
 */
(function (root) {
  'use strict';

  var SR = root.SpeechRecognition || root.webkitSpeechRecognition;

  function pickMime() {
    if (!root.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
    var types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    for (var i = 0; i < types.length; i++) if (MediaRecorder.isTypeSupported(types[i])) return types[i];
    return '';
  }

  /** Check what kind of speech recognition is possible. Returns 'local' | 'cloud' | 'none'. */
  async function recognitionSupport(lang) {
    if (!SR) return 'none';
    try {
      if (typeof SR.available === 'function') {
        var st = await SR.available({ langs: [lang], processLocally: true });
        if (st === 'available') return 'local';
        if (st === 'downloadable' || st === 'downloading') return 'local-downloadable';
      }
    } catch (e) { /* older API */ }
    return 'cloud';
  }

  async function installLocalRecognition(lang) {
    if (!SR || typeof SR.install !== 'function') return false;
    try { return !!(await SR.install({ langs: [lang], processLocally: true })); } catch (e) { return false; }
  }

  /**
   * Recorder session.
   * opts: { lang, transcriptMode: 'local' | 'auto' | 'off', onLevel(rms, pitch), onTranscript(finalText, interimText) }
   */
  function Recorder(opts) {
    this.opts = opts || {};
    this.frames = [];
    this.segments = [];
    this.finalText = '';
    this.interim = '';
    this.source = 'none';
  }

  Recorder.prototype.start = async function () {
    var self = this;
    self.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false, channelCount: 1 }
    });
    var Ctx = root.AudioContext || root.webkitAudioContext;
    self.ctx = new Ctx();
    if (self.ctx.state === 'suspended') await self.ctx.resume();
    var src = self.ctx.createMediaStreamSource(self.stream);
    self.analyser = self.ctx.createAnalyser();
    self.analyser.fftSize = 2048;
    src.connect(self.analyser);
    var buf = new Float32Array(self.analyser.fftSize);
    var half = new Float32Array(buf.length / 2);
    var rate = self.ctx.sampleRate;

    self.chunks = [];
    var mime = pickMime();
    try { self.mr = new MediaRecorder(self.stream, mime ? { mimeType: mime } : undefined); } catch (e) { self.mr = new MediaRecorder(self.stream); }
    self.mime = self.mr.mimeType || mime || 'audio/webm';
    self.mr.ondataavailable = function (e) { if (e.data && e.data.size) self.chunks.push(e.data); };
    self.mr.start(250);
    self.t0 = performance.now();

    self.timer = setInterval(function () {
      self.analyser.getFloatTimeDomainData(buf);
      var sum = 0, peak = 0;
      for (var i = 0; i < buf.length; i++) { var v = buf[i]; sum += v * v; var av = v < 0 ? -v : v; if (av > peak) peak = av; }
      var rms = Math.sqrt(sum / buf.length);
      for (i = 0; i < half.length; i++) half[i] = (buf[2 * i] + buf[2 * i + 1]) / 2; // decimate for speed
      var pitch = rms > 0.012 ? root.Analysis.detectPitch(half, rate / 2) : 0;
      var t = performance.now() - self.t0;
      self.frames.push({ t: Math.round(t), rms: rms, peak: peak, pitch: pitch });
      if (self.opts.onLevel) self.opts.onLevel(rms, pitch, t);
    }, 40);

    if (SR && self.opts.transcriptMode && self.opts.transcriptMode !== 'off') self._startRecognition();
  };

  Recorder.prototype._startRecognition = function () {
    var self = this;
    var rec = new SR();
    rec.lang = self.opts.lang || 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    if (self.opts.transcriptMode === 'local') {
      if ('processLocally' in rec) { rec.processLocally = true; self.source = 'on-device'; }
      else { self.source = 'none'; return; } // user asked for on-device only and this browser can't
    } else {
      self.source = ('processLocally' in rec && self.opts.localAvailable) ? 'on-device' : 'browser';
      if (self.source === 'on-device') rec.processLocally = true;
    }
    var startTimes = {};
    rec.onresult = function (ev) {
      var interim = '';
      var now = performance.now() - self.t0;
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        var key = self.segOffset + i;
        if (startTimes[key] === undefined) startTimes[key] = Math.max(0, now - 1200);
        var r = ev.results[i];
        if (r.isFinal) {
          var txt = r[0].transcript.trim();
          if (txt) {
            self.segments.push({ text: txt, startMs: Math.round(startTimes[key]), endMs: Math.round(now) });
            self.finalText += (self.finalText ? ' ' : '') + txt;
          }
        } else interim += r[0].transcript;
      }
      self.interim = interim;
      if (self.opts.onTranscript) self.opts.onTranscript(self.finalText, interim);
    };
    rec.onerror = function (e) {
      self.recError = e.error;
      if (e.error === 'network' || e.error === 'service-not-allowed' || e.error === 'language-not-supported') self.recDead = true;
    };
    rec.onend = function () {
      // Chrome stops continuous recognition after silence; restart while recording.
      if (self.recording && !self.recDead) {
        self.segOffset += 1000;
        try { rec.start(); } catch (e) { /* ignore */ }
      }
    };
    self.segOffset = 0;
    self.recording = true;
    self.rec = rec;
    try { rec.start(); } catch (e) { self.recError = 'start-failed'; }
  };

  Recorder.prototype.stop = function () {
    var self = this;
    self.recording = false;
    clearInterval(self.timer);
    var durationMs = Math.round(performance.now() - self.t0);
    return new Promise(function (resolve) {
      var finish = function () {
        try { self.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* */ }
        try { self.ctx.close(); } catch (e) { /* */ }
        var blob = new Blob(self.chunks, { type: self.mime });
        // Give the recogniser a moment to deliver its final result
        setTimeout(function () {
          try { if (self.rec) self.rec.stop(); } catch (e) { /* */ }
          setTimeout(function () {
            var text = self.finalText;
            if (self.interim) text += (text ? ' ' : '') + self.interim.trim();
            resolve({
              blob: blob, frames: self.frames, durationMs: durationMs,
              transcript: text.trim(), segments: self.segments,
              transcriptSource: text.trim() ? self.source : 'none',
              recError: self.recError || null
            });
          }, 500);
        }, 250);
      };
      if (self.mr && self.mr.state !== 'inactive') { self.mr.onstop = finish; self.mr.stop(); } else finish();
    });
  };

  Recorder.prototype.cancel = function () {
    this.recording = false;
    clearInterval(this.timer);
    try { if (this.mr && this.mr.state !== 'inactive') this.mr.stop(); } catch (e) { /* */ }
    try { this.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* */ }
    try { this.ctx.close(); } catch (e) { /* */ }
    try { if (this.rec) this.rec.abort(); } catch (e) { /* */ }
  };

  // ---------- Text to speech (uses the device's built-in voices; many work offline) ----------
  var voicesCache = [];
  function loadVoices() { if (root.speechSynthesis) voicesCache = speechSynthesis.getVoices(); return voicesCache; }
  if (root.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

  function pickVoice(lang) {
    var vs = voicesCache.length ? voicesCache : loadVoices();
    var exact = vs.filter(function (v) { return v.lang && v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase(); });
    var en = vs.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
    var pool = exact.length ? exact : en;
    return pool.find(function (v) { return v.localService; }) || pool[0] || null;
  }

  function speak(text, o) {
    o = o || {};
    return new Promise(function (resolve) {
      if (!root.speechSynthesis) return resolve(false);
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var v = pickVoice(o.lang || 'en-US');
      if (v) u.voice = v;
      u.lang = (v && v.lang) || o.lang || 'en-US';
      u.rate = o.rate || 1;
      u.pitch = o.pitch || 1;
      u.onend = function () { resolve(true); };
      u.onerror = function () { resolve(false); };
      speechSynthesis.speak(u);
      if (o.onstart) o.onstart();
    });
  }
  function stopSpeaking() { if (root.speechSynthesis) speechSynthesis.cancel(); }

  root.Audio2 = {
    Recorder: Recorder, speak: speak, stopSpeaking: stopSpeaking, recognitionSupport: recognitionSupport,
    installLocalRecognition: installLocalRecognition, hasRecognition: !!SR, hasTTS: !!root.speechSynthesis,
    hasMic: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && root.MediaRecorder)
  };
})(window);
