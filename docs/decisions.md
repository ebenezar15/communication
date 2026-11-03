# Decisions

The product brief (`communication-coach-app-prompt.md`) describes a cloud product with Claude, speech-to-text and pronunciation APIs. The user asked for an app that **works offline, without Claude**. These are the decisions that follow from that.

| Topic | Decision | Why |
|---|---|---|
| Platform | A vanilla-JS PWA with no build step and no dependencies | Runs from any static host, installs on phone and desktop, and caches fully for offline use. Nothing needs a backend. |
| Mentor | A deterministic rule engine (`mentor.js`) instead of an LLM | Works offline, costs nothing and gives the same output every time. Every item comes from measured evidence, which matches "separate measurement from judgement". |
| Transcription | Web Speech API, with the user choosing on-device, best available or off | The only offline-capable speech-to-text available in browsers without shipping a large model. The on-device probe runs only when the user asks, because it crashed one headless Chromium build. |
| Pronunciation | Ear training, recogniser-based miscue detection, and stress/intonation drills with a pitch trace | Offline phoneme scoring isn't reliable enough to show precise numbers. Findings are labelled as low-confidence signals. |
| Text-to-speech | `speechSynthesis`, preferring local voices | Offline model audio, at normal and slow speed. |
| Spaced repetition | A compact FSRS-inspired scheduler (`srs.js`) | No dependency. It is documented as simplified, not full FSRS. |
| Storage | `localStorage` for state and IndexedDB for audio, with a 30-day expiry for unsaved takes | Privacy by default, and export/delete everything is one tap. |
| Accent | en-US, en-GB, en-IN and en-AU models for audio and recognition. Accent is never scored. | "Clear and confident", not "native". |
| Content | Data files edited as JS object literals, not `.json` | `fetch()` of JSON fails on some offline/file setups. The files are pure data, so non-developers can still edit them. |
| Later, optional | A cloud mentor adapter (Claude), a vendor pronunciation API and live Arena voice | The engine output already uses a structured feedback shape, so an LLM adapter could replace or augment `Mentor.coach` behind the same interface. |
