/*
 * Rostrum local storage. Everything stays on this device.
 * - App state (progress, Word Bank, Fingerprint, Courage Ledger) → localStorage
 * - Audio recordings → IndexedDB (unsaved takes auto-expire after 30 days)
 */
(function (root) {
  'use strict';
  var KEY = 'rostrum:v1';
  var DAY = 86400000;

  function defaults() {
    return {
      version: 1,
      createdAt: Date.now(),
      profile: {
        name: '', goal: null, level: 'L1', onboarded: false, style: 'direct', accent: 'en-US',
        transcriptMode: 'auto', theme: 'auto', mentorRate: 1,
        settings: { stutterFriendly: false, scoreFillers: true, scorePace: true, reducedMotion: false }
      },
      xp: 0,
      completed: {},       // lessonId -> timestamp
      exercisesDone: {},   // lessonId:index -> timestamp
      path: null,          // { id, startedAt }
      takes: [],           // summaries; audio in IndexedDB
      fingerprint: [],     // [{ts, kind, ...updates}]
      words: [],           // Word Bank items with SRS card
      courage: [],         // [{ts, before, after, note, behaviours}]
      days: {},            // 'YYYY-MM-DD' -> {xp, rest}
      restTokens: 2,
      realMoments: [],
      reports: [],         // "That's wrong" reports (kept locally for your review)
      drills: {}           // drill id -> {count, best}
    };
  }

  var state;
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      state = raw ? Object.assign(defaults(), JSON.parse(raw)) : defaults();
      state.profile = Object.assign(defaults().profile, state.profile || {});
      state.profile.settings = Object.assign(defaults().profile.settings, state.profile.settings || {});
    } catch (e) { state = defaults(); }
    return state;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('Could not save', e); }
  }
  function get() { return state || load(); }
  function update(fn) { fn(get()); save(); return state; }
  function reset() { state = defaults(); save(); return clearAudio(); }

  function dayKey(ts) {
    var d = new Date(ts || Date.now());
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function addXp(n, reason) {
    update(function (s) {
      s.xp += n;
      var k = dayKey();
      s.days[k] = s.days[k] || { xp: 0 };
      s.days[k].xp += n;
    });
    if (root.App && root.App.toast) root.App.toast('+' + n + ' XP' + (reason ? ' · ' + reason : ''));
  }
  /** Streak counts practice days; rest days (tokens) bridge gaps so real life isn't punished. */
  function streak() {
    var s = get(), n = 0, d = new Date();
    if (!s.days[dayKey(d)]) d = new Date(d.getTime() - DAY); // today not done yet: count from yesterday
    for (var i = 0; i < 400; i++) {
      var k = dayKey(d);
      if (s.days[k] && (s.days[k].xp > 0 || s.days[k].rest)) n++;
      else break;
      d = new Date(d.getTime() - DAY);
    }
    return n;
  }
  function takeRestDay() {
    var s = get();
    var y = dayKey(Date.now() - DAY);
    if (s.restTokens <= 0 || s.days[y]) return false;
    update(function (st) { st.restTokens -= 1; st.days[y] = { xp: 0, rest: true }; });
    return true;
  }

  // ---------- IndexedDB audio ----------
  var dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (resolve, reject) {
      if (!root.indexedDB) return reject(new Error('no idb'));
      var req = indexedDB.open('rostrum-audio', 1);
      req.onupgradeneeded = function () { req.result.createObjectStore('takes'); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (resolve, reject) {
        var t = d.transaction('takes', mode);
        var r = fn(t.objectStore('takes'));
        t.oncomplete = function () { resolve(r && r.result); };
        t.onerror = function () { reject(t.error); };
      });
    }).catch(function () { return null; });
  }
  function putAudio(id, blob) { return tx('readwrite', function (s) { return s.put(blob, id); }); }
  function getAudio(id) {
    return db().then(function (d) {
      return new Promise(function (resolve) {
        var r = d.transaction('takes').objectStore('takes').get(id);
        r.onsuccess = function () { resolve(r.result || null); };
        r.onerror = function () { resolve(null); };
      });
    }).catch(function () { return null; });
  }
  function deleteAudio(id) { return tx('readwrite', function (s) { return s.delete(id); }); }
  function clearAudio() { return tx('readwrite', function (s) { return s.clear(); }); }

  /** Delete unsaved audio older than 30 days (metrics are kept). */
  function expireAudio() {
    var cutoff = Date.now() - 30 * DAY;
    var s = get();
    s.takes.forEach(function (t) {
      if (!t.saved && t.ts < cutoff && t.hasAudio) { deleteAudio(t.id); t.hasAudio = false; }
    });
    save();
  }

  function exportAll() {
    return JSON.stringify(get(), null, 2);
  }
  function importAll(json) {
    var data = JSON.parse(json);
    if (!data || data.version !== 1) throw new Error('Not a Rostrum export');
    state = Object.assign(defaults(), data); save();
  }

  root.Store = {
    load: load, save: save, get: get, update: update, reset: reset, addXp: addXp, streak: streak, takeRestDay: takeRestDay,
    dayKey: dayKey, putAudio: putAudio, getAudio: getAudio, deleteAudio: deleteAudio, expireAudio: expireAudio,
    exportAll: exportAll, importAll: importAll
  };
})(window);
