/*
 * Spaced repetition — a compact, FSRS-inspired scheduler (stability + difficulty).
 * Simplified on purpose so it runs offline with no dependencies; it is NOT the full FSRS-5 model.
 * Ratings: 1 Again, 2 Hard, 3 Good, 4 Easy.
 */
(function (root) {
  'use strict';
  var DAY = 86400000;

  function newCard(now) {
    return { due: now || Date.now(), stability: 0, difficulty: 5, reps: 0, lapses: 0, last: null, state: 'new' };
  }

  function retrievability(card, now) {
    if (!card.last || !card.stability) return 0;
    var elapsedDays = (now - card.last) / DAY;
    return Math.pow(1 + elapsedDays / (9 * card.stability), -1);
  }

  function review(card, rating, now) {
    now = now || Date.now();
    var c = Object.assign({}, card);
    var initial = [0.4, 1.2, 3, 8];
    c.difficulty = Math.min(10, Math.max(1, c.difficulty + (3 - rating) * 0.8));
    if (c.reps === 0 || c.state === 'new') {
      c.stability = initial[rating - 1];
    } else if (rating === 1) {
      c.lapses += 1;
      c.stability = Math.max(0.3, c.stability * 0.3);
    } else {
      var r = retrievability(card, now);
      var growth = Math.exp(0.9) * (11 - c.difficulty) * Math.pow(c.stability, -0.2) * (Math.exp((1 - r) * 1.2) - 1);
      var bonus = rating === 2 ? 0.6 : rating === 4 ? 1.4 : 1;
      c.stability = c.stability * (1 + Math.max(0.15, growth * bonus * 0.35));
    }
    c.reps += 1;
    c.last = now;
    c.state = rating === 1 ? 'relearning' : 'review';
    var intervalDays = rating === 1 ? 10 / 1440 : Math.max(1, Math.round(c.stability));
    c.due = now + intervalDays * DAY;
    c.intervalDays = intervalDays;
    return c;
  }

  function isDue(card, now) { return card.due <= (now || Date.now()); }

  var api = { newCard: newCard, review: review, isDue: isDue, retrievability: retrievability };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SRS = api;
})(typeof window !== 'undefined' ? window : this);
