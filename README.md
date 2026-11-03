# Rostrum: offline communication coach

**Say it. See exactly what happened. Say it better, right now.**

Rostrum is an installable web app (PWA) that takes someone from beginner to advanced speaker. It uses structured lessons, spoken exercises, pressure simulations and real-life use cases. It works **fully offline**. There is no server, no account and no AI or cloud API. Your voice and progress stay on your device.

## Run it

You need any static file server. A server is required because service workers and the microphone need `http://localhost` or HTTPS.

```bash
npm start
```

Then open http://localhost:8080. In Chrome or Edge, click **Install** in the address bar to get an app that runs offline. After the first visit, everything is cached by `sw.js`.

To host it, copy the folder to any static host that serves HTTPS, such as GitHub Pages or Netlify.

## Run the tests

```bash
npm test
```

The tests use Node's built-in test runner and need no dependencies. They cover the analysis engine, the mentor rules, Phrase Forge, spaced repetition and content integrity.

## What's inside

| Area | What you do |
|---|---|
| **Today** | A personalised 5–10 minute session: warm-up, next lesson on your path, a targeted Own the Room drill, Word Bank reviews and an impromptu prompt. Rate your nerves before and after for the Courage Ledger. |
| **Learn** | 56 lessons across 4 levels (**Foundations → Developing → Skilled → Masterful**, staged as Bedroom → Meeting Room → Auditorium → Main Stage) and 7 skills: clarity and structure, word choice, grammar, voice, stories and analogies, presence, and listening. Each lesson has a concept, a before/after you can listen to, a real-life use case, 2–3 exercises (quiz, rewrite-then-say, build-then-say, speak, read aloud) and a self-check. There are also 4 four-week paths: Clear Speaker, Confident Professional, Interview Ready and Storyteller. |
| **Gym** | **Pronunciation Lab** (30 minimal pairs with ear training, word stress, shadowing, intonation with a pitch trace, tongue twisters), **Phrase Forge**, **Grammar Clinic** (40 patterns), **Metaphor Gym** (Example Ladder, Analogy Builder, Allegory Studio, Random Spark, Audience Switch), **Own the Room** (10 drills) and **Impromptu** (60 prompts). |
| **Arena** | 12 scenarios with 6 voiced personas, a Calm/Tough/Brutal pressure dial, curveballs (interruptions, time cuts, unanswerable questions, a simulated blank), in-character reactions and a debrief. |
| **Words** | A living Word Bank. You review words by **saying** them in a fresh sentence, scheduled with spaced repetition. A word becomes "owned" when it shows up naturally in your free speech. |
| **Journey** | Stages, a practice calendar, your Speech Fingerprint (which you can inspect and edit), trends, the Courage Ledger, "then vs now" playback, a weekly Highlight Reel, Real Moment Prep and recordings. |

### The core loop: Second Take

Every recording ends in the same loop:

1. **Evidence.** You see a transcript and can tap any word to hear that moment.
2. **One strength.** The mentor names one true thing you did well.
3. **One Big Fix.** It explains what happened, why it matters and how to fix it, with a confidence label and a button to hear the moment.
4. **Retake.** You record again straight away.
5. **A/B comparison.** You see what objectively changed between the two takes.

## How it works offline

- **Measurement happens in code; the mentor only interprets.** `js/engine/analysis.js` computes these in the browser:
  - from the audio: speech/pause segments, pace, pause count and placement, pitch (a YIN-style detector), pitch range, rising or falling endings, volume variation, clipping and SNR
  - from the transcript: fillers, hedges, apologetic openings, repetition, sentence length, vague words, PREP structure, rule-based grammar patterns, and a script-vs-speech comparison that catches substituted words such as *there → they*
- **The mentor is a transparent rule set** in `js/engine/mentor.js`, not an LLM. It follows the coaching rules: one strength, one big fix, then what → why → how → try it now. It labels its confidence, never invents facts, and refuses to score unreliable audio.
- **Transcripts** come from the browser's Web Speech API. You choose the mode:
  - **On-device only:** private and offline. Recent Chrome supports this.
  - **Best available:** may send audio to the browser maker.
  - **Off:** the app still gives voice metrics, and you can type what you said to get language feedback.
- **Model audio** uses the device's built-in text-to-speech voices. Many of these work offline.
- **Storage:** progress is kept in `localStorage` and recordings in IndexedDB. Unsaved audio is deleted after 30 days. You can export, import or delete everything in Settings.

## Honest limits

- Browser speech recognisers often drop "um" and "uh", so filler counts can be low. The app says so whenever this applies.
- Pronunciation feedback comes from what the recogniser heard. It is a **signal**, not a phoneme-level score, and it is worded that way ("this may have sounded like…").
- Grammar checks are pattern-based, so they can raise false alarms. "That's wrong" logs the report locally.
- Phrase Forge's "Vivid" version uses `[placeholders]`, because only you know the true concrete details.
- No confidence or emotion detection. The app tracks observable behaviours and your own nerves ratings.
- **Stutter-friendly mode** turns off fluency, filler, pace and repetition scoring. The app never treats dysfluency or an accent as an error.

## Editing content

All teaching content is plain data that non-developers can edit:

- `js/content/curriculum.js`: levels, skills, lessons and paths
- `js/content/practice.js`: pronunciation, grammar patterns, prompts, Metaphor Gym material, personas, scenarios, room drills, seed words and the snapshot

After you edit either file, run `npm test` to check content integrity, and bump `VERSION` in `sw.js` so installed apps pick up the change.

## Project layout

```
index.html, css/app.css, sw.js, manifest.webmanifest, icons/
js/engine/   analysis.js · mentor.js · forge.js · srs.js   (pure, unit-tested)
js/          store.js (local data) · audio.js (mic, recognition, TTS) · app.js (boot)
js/ui/       core.js (router + Stage/Second Take) · views-learn · views-gym · views-arena · views-me
js/content/  curriculum.js · practice.js
tests/       engine.test.js
docs/        decisions.md
```
