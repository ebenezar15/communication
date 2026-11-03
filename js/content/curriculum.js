/* Rostrum curriculum. Pure data — edit freely. Keep it valid JSON-style object literals.
   Exercise types: choice | rewrite | build | speak | read  (see README for fields). */
var RC = window.RC = window.RC || {};

RC.levels = [
  { id: 'L1', name: 'Foundations', stage: 'Bedroom', tagline: 'Say one thing, clearly.',
    description: 'Build the basics in a safe space: one clear point, fewer fillers, simple sentences, a steady breath and real listening.', xpToUnlock: 0 },
  { id: 'L2', name: 'Developing', stage: 'Meeting Room', tagline: 'Structure it. Shape it.',
    description: 'Use frameworks like PREP and STAR, match your register to the room, stress the right words and open without apologising.', xpToUnlock: 300 },
  { id: 'L3', name: 'Skilled', stage: 'Auditorium', tagline: 'Persuade with precision.',
    description: 'Build arguments that move people, choose precise words, use pitch and pauses for meaning, tell stories with arcs and stay calm under hard questions.', xpToUnlock: 900 },
  { id: 'L4', name: 'Masterful', stage: 'Main Stage', tagline: 'Own the room.',
    description: 'Lead with the answer, use rhetoric honestly, think on your feet, fill a large room with your voice and steer difficult groups.', xpToUnlock: 1800 }
];

RC.skills = [
  { id: 'clarity', name: 'Clarity & Structure', short: 'Clarity', glyph: '¶',
    description: 'Know your point, say it first and give it a shape the listener can follow.' },
  { id: 'words', name: 'Word Choice & Vocabulary', short: 'Words', glyph: 'Aa',
    description: 'Pick plain, precise words that fit the person and the moment.' },
  { id: 'grammar', name: 'Grammar & Sentences', short: 'Grammar', glyph: '§',
    description: 'Build sentences that are correct, easy to say and easy to follow.' },
  { id: 'voice', name: 'Pronunciation, Pace & Intonation', short: 'Voice', glyph: '♪',
    description: 'Be understood the first time: clear sounds, word stress, pace, pauses and pitch.' },
  { id: 'stories', name: 'Examples, Analogies & Stories', short: 'Stories', glyph: '❦',
    description: 'Turn abstract ideas into pictures people remember.' },
  { id: 'presence', name: 'Confidence & Presence', short: 'Presence', glyph: '◉',
    description: 'Observable behaviours that make you look and sound settled: breath, posture, openings, endings and recovery.' },
  { id: 'listening', name: 'Listening & Conversation', short: 'Listening', glyph: '⇄',
    description: 'Hear what is meant, ask better questions and keep conversations moving.' }
];

RC.lessons = [
/* ======================= L1 FOUNDATIONS ======================= */
{ id: 'L1-clarity-1', level: 'L1', skill: 'clarity', title: 'One Point, Out Loud', minutes: 6,
  concept: "Most unclear speaking is not a language problem. It is a thinking problem: the speaker has not decided what their one point is, so they search for it out loud.\n\nBefore you speak, finish this sentence in your head: \"The one thing I want them to know is...\". If you cannot finish it in under ten words, you are not ready yet. Take two seconds and decide.\n\nThen say that sentence first. Details, reasons and stories come after. Listeners relax when they know where you are going.",
  keyPoints: ['Decide your one point before you open your mouth.', 'If it takes more than ten words, trim it.', 'Say the point first, then the details.', 'A two-second pause to think is better than thirty seconds of searching.'],
  example: { weak: "So, um, there were a few things with the report, like the numbers and the timing and some other stuff, and I think we maybe need to look at it.", strong: "The report needs one more week. The sales numbers are still incomplete.", why: "The listener hears the decision first and the reason second." },
  useCase: { context: 'Team meeting', scenario: 'Your manager asks, "Where are we on the report?" You have five seconds before everyone looks at you.' },
  exercises: [
    { type: 'choice', question: 'Which opening states one clear point?', options: ['There are lots of things going on with the project, so where do I start...', 'The project is on track for Friday.', 'Well, it depends on how you look at it, really.'], answer: 1, explain: 'It gives the listener the main message in one short sentence.' },
    { type: 'rewrite', instruction: 'Rewrite this so the one point comes first, in under 12 words.', original: "Yesterday I was talking to the supplier and they mentioned some issues and, long story short, the delivery is going to be late.", goal: 'shorter', hints: ['What is the news?', 'Put the news in the first five words.'], model: 'The delivery will be late. The supplier told me yesterday.' },
    { type: 'speak', prompt: 'Answer in one clear point, then one reason: "What is the best thing about where you live?"', seconds: 30, focus: ['opening', 'fillers', 'duration'], tip: 'Decide your answer silently first. Then say it in the first sentence.' }
  ],
  checklist: ['Did my first sentence contain my main point?', 'Could someone repeat my point in one sentence?', 'Did I stop once I had made it?'] },

{ id: 'L1-clarity-2', level: 'L1', skill: 'clarity', title: 'Beginning, Middle, End', minutes: 7,
  concept: "Every short answer can use a three-part shape: say what you will talk about, talk about it, then say it again in one line.\n\nThis sounds repetitive on paper, but out loud it is a gift to the listener. People cannot scroll back when they hear you, so a short summary at the end helps the point stick.\n\nUse simple signposts: \"First...\", \"The second thing...\", \"So, in short...\". They are the road signs of spoken language.",
  keyPoints: ['Open with the topic in one line.', 'Use signposts like "first" and "second".', 'Close by repeating the point in fresh words.', 'Signposts help listeners who cannot rewind.'],
  example: { weak: "Our team is good, and we did the launch, and also people like the app, and it was fast.", strong: "Two things went well this month. First, we launched on time. Second, early users love the app. So, a strong month.", why: "The listener knows how many points to expect and when the answer is finished." },
  useCase: { context: 'Family dinner', scenario: 'Someone asks how your first week at a new job went, and you want to give a clear answer instead of a ramble.' },
  exercises: [
    { type: 'build', instruction: 'Plan a 3-part answer to: "How was your weekend?"', fields: [{ label: 'Opening line', placeholder: 'My weekend was relaxing and busy.' }, { label: 'Point one', placeholder: 'First, ...' }, { label: 'Point two', placeholder: 'Second, ...' }, { label: 'Closing line', placeholder: 'So, in short, ...' }], speakPrompt: 'Now say it as one answer, using your signposts.', seconds: 45 },
    { type: 'speak', prompt: 'Describe your morning routine in three steps, with "first", "then" and "finally".', seconds: 40, focus: ['structure', 'fillers', 'ending'], tip: 'End with a short summary line, then stop.' }
  ],
  checklist: ['Did I say how many points were coming?', 'Did I use at least two signposts?', 'Did I finish with a summary line instead of trailing off?'] },

{ id: 'L1-words-1', level: 'L1', skill: 'words', title: 'Plain Words Win', minutes: 6,
  concept: "Many people reach for long words to sound smart. Listeners usually hear the opposite: it sounds like hiding.\n\nWhen you have a choice, use the short, everyday word. \"Use\" instead of \"utilise\". \"Help\" instead of \"facilitate\". \"Start\" instead of \"commence\". Plain words are faster to say, easier to pronounce and easier to understand.\n\nSave rare words for when they are the most exact word, not the most impressive one.",
  keyPoints: ['Choose the everyday word first.', 'Long words often sound like hiding.', 'Plain words are easier to pronounce under pressure.', 'Use a rare word only when it is the most exact.'],
  example: { weak: "We need to utilise our resources to facilitate the commencement of the initiative.", strong: "Let's use what we have to start the project.", why: "Same meaning, half the syllables, nothing to decode." },
  useCase: { context: 'Client call', scenario: 'You are explaining next steps to a customer who is busy and slightly frustrated.' },
  exercises: [
    { type: 'choice', question: 'What is the plainest replacement for "endeavour to ascertain"?', options: ['strive to determine', 'try to find out', 'attempt to establish'], answer: 1, explain: '"Try to find out" says the same thing in everyday words.' },
    { type: 'rewrite', instruction: 'Replace the heavy words with plain ones.', original: "Prior to the meeting, please endeavour to review the documentation in order to optimise our discussion.", goal: 'shorter', hints: ['prior to → before', 'endeavour → try', 'in order to → to'], model: 'Before the meeting, please read the documents so we can talk well.' },
    { type: 'speak', prompt: 'Explain what your job or studies involve to a twelve-year-old.', seconds: 45, focus: ['sentenceLength', 'fillers'], tip: 'If a word would confuse a child, swap it.' }
  ],
  checklist: ['Did I avoid words I would not use with a friend?', 'Could a twelve-year-old follow me?', 'Did I sound like myself?'] },

{ id: 'L1-words-2', level: 'L1', skill: 'words', title: 'Swap Your Crutch Words', minutes: 6,
  concept: "Everyone has crutch words: \"basically\", \"literally\", \"actually\", \"like\", \"you know\". One or two are harmless. Ten in a minute make the listener stop hearing your ideas.\n\nThe first step is noticing. Record yourself and count. The second step is replacing the crutch with silence. A short pause sounds thoughtful; a crutch word sounds unsure.\n\nDo not try to remove every one at once. Pick your most common crutch and target only that one this week.",
  keyPoints: ['Notice your top crutch word first.', 'Replace it with a short pause.', 'Target one crutch at a time.', 'Silence sounds more confident than filler.'],
  example: { weak: "So basically the app is, like, basically a way to, you know, actually track your spending.", strong: "The app tracks your spending.", why: "Removing four crutches reveals a clear, strong sentence." },
  useCase: { context: 'Job interview', scenario: 'You are describing a project you worked on, and you want the interviewer to remember the project, not your "basically".' },
  exercises: [
    { type: 'rewrite', instruction: 'Remove every crutch word without changing the meaning.', original: "Honestly, I literally think it's, like, actually the best option, you know?", goal: 'shorter', hints: ['Delete: honestly, literally, like, actually, you know'], model: "I think it's the best option." },
    { type: 'speak', prompt: 'Talk about a film, book or show you enjoyed and why. Pause instead of using crutch words.', seconds: 60, focus: ['fillers', 'repetition', 'pauses'], tip: 'When you feel "like" or "um" coming, close your mouth and breathe.' }
  ],
  checklist: ['Did I notice my crutch word while speaking?', 'Did I replace at least one with a pause?', 'Did my sentences feel shorter and cleaner?'] },

{ id: 'L1-grammar-1', level: 'L1', skill: 'grammar', title: 'Short Sentences Are Strong', minutes: 6,
  concept: "Long spoken sentences are where grammar breaks. You start with one subject, add three clauses, and by the end you have forgotten how you began.\n\nThe fix is simple: one idea, one sentence. When you feel an \"and\" coming, try a full stop instead. Short sentences give you time to breathe, and they give the listener time to understand.\n\nYou can vary length later. First, get comfortable ending sentences on purpose.",
  keyPoints: ['One idea per sentence.', 'Replace a chain of "and... and..." with full stops.', 'Short sentences reduce grammar slips.', 'Ending a sentence gives you a free breath.'],
  example: { weak: "I went to the bank and they said the card was blocked and so I called the helpline and they said it would take a week and I was annoyed.", strong: "I went to the bank. My card was blocked. The helpline said it would take a week. I was annoyed.", why: "Four clean sentences instead of one tangled chain." },
  useCase: { context: 'Customer service', scenario: 'You are explaining a problem to a support agent who needs to note down each fact.' },
  exercises: [
    { type: 'rewrite', instruction: 'Break this into three or four short sentences.', original: "The train was late and we missed the start and the doors were closed so we waited outside and then they let us in at the break.", goal: 'shorter', hints: ['Each "and" can become a full stop.'], model: 'The train was late. We missed the start. We waited outside until the break. Then they let us in.' },
    { type: 'speak', prompt: 'Tell the story of how you got here today in short sentences. Aim for under 12 words each.', seconds: 45, focus: ['sentenceLength', 'fillers'], tip: 'Let your voice drop at each full stop.' }
  ],
  checklist: ['Did most sentences have one idea?', 'Did I avoid long "and... and..." chains?', 'Did I breathe between sentences?'] },

{ id: 'L1-grammar-2', level: 'L1', skill: 'grammar', title: 'Subject and Verb Agree', minutes: 7,
  concept: "The most noticed grammar slips in spoken English are agreement errors: \"he don't\", \"she go\", \"the team are... it is\". They rarely block meaning, but they can distract listeners in formal settings.\n\nThe rule for the present simple: he, she, it, or one person/thing takes an \"-s\" on the verb: he goes, she knows, it works. With \"do\": he does, he doesn't. After \"does\" or \"doesn't\", the main verb has no \"-s\": he doesn't know.\n\nPractise with your own common sentences until the right form feels automatic.",
  keyPoints: ['He / she / it + verb-s: she works.', 'He doesn\'t, not he don\'t.', 'After does / doesn\'t, no -s: he doesn\'t know.', 'Drill your own common sentences, not random ones.'],
  example: { weak: "He don't knows the answer, and she go to the office on Monday.", strong: "He doesn't know the answer, and she goes to the office on Monday.", why: "Correct agreement removes a distraction for the listener." },
  useCase: { context: 'Job interview', scenario: 'You are describing your current manager and team, using he / she / they a lot.' },
  exercises: [
    { type: 'choice', question: 'Which sentence is correct?', options: ["She don't like meetings.", "She doesn't likes meetings.", "She doesn't like meetings."], answer: 2, explain: "Use doesn't with she, and the verb after it has no -s." },
    { type: 'rewrite', instruction: 'Fix the agreement errors.', original: "My brother work in a bank and he don't enjoy it, but he say the pay is good.", goal: 'active', hints: ['brother = he → works', "he don't → he doesn't", 'he say → he says'], model: "My brother works in a bank and he doesn't enjoy it, but he says the pay is good." },
    { type: 'speak', prompt: 'Describe a friend or family member: what they do every day and what they like and don\'t like.', seconds: 45, focus: ['pace', 'fillers'], tip: 'Slow down slightly on verbs after he / she.' }
  ],
  checklist: ['Did I add -s after he / she / it?', "Did I say doesn't instead of don't for he / she?", 'Did I slow down enough to choose the right form?'] },

{ id: 'L1-voice-1', level: 'L1', skill: 'voice', title: 'Slow Down to Be Heard', minutes: 6,
  concept: "Nervous speakers speed up. Fast speech blurs consonants, drops word endings and leaves no room for the listener to catch up.\n\nA comfortable conversational pace for most listeners is roughly 130 to 160 words per minute, but there is no single correct pace. The real test: can someone unfamiliar with the topic follow you the first time?\n\nTwo tricks: finish the last sound of each word (the \"t\" in \"want\", the \"d\" in \"need\"), and pause at every full stop. Both slow you down naturally without sounding robotic.",
  keyPoints: ['Nerves make you faster — plan for it.', 'Finish the final sounds of words.', 'Pause at every full stop.', 'Pace is about the listener, not a number.'],
  example: { weak: "Wannagoovertheplanquicklysowecanfinishearly.", strong: "I want to go over the plan / quickly / so we can finish early.", why: "Clear word endings and small pauses make each word land." },
  useCase: { context: 'Phone call', scenario: 'You are giving your address and a reference number on a call where the other person cannot see your lips.' },
  exercises: [
    { type: 'read', text: "Good morning. / My name is on the list, / and my booking number is four, seven, two, nine. / I would like to change the date / to next Tuesday.", focus: ['pace', 'pauses'], tip: 'Pause at each slash. Finish the last sound of every word.' },
    { type: 'speak', prompt: 'Give clear directions from your home to the nearest shop.', seconds: 45, focus: ['pace', 'pauses', 'fillers'], tip: 'Imagine the listener is writing every step down.' }
  ],
  checklist: ['Did I pause at full stops?', 'Did I finish the ends of words?', 'Would a stranger follow me on the first listen?'] },

{ id: 'L1-voice-2', level: 'L1', skill: 'voice', title: 'Clear Vowels, Clear Words', minutes: 8,
  concept: "Many misunderstandings come from a few vowel pairs: \"ship\" and \"sheep\", \"full\" and \"fool\", \"bad\" and \"bed\". These pairs are called minimal pairs because one sound changes the whole word.\n\nThe goal is not a particular accent. The goal is that the listener knows which word you meant. A long vowel like in \"sheep\" is held a little longer, with lips slightly spread. A short vowel like in \"ship\" is quick and relaxed.\n\nPractise pairs slowly, then in sentences, then at normal speed.",
  keyPoints: ['Minimal pairs differ by one sound.', 'Long vowels are held slightly longer.', 'The goal is intelligibility, not a native accent.', 'Practise slow, then in sentences, then at normal speed.'],
  example: { weak: "Please leave the sheet on my desk. (said so it sounds like a rude word)", strong: "Please leave the SHEEET on my desk. (long, clear vowel)", why: "Holding the long vowel removes the risk of being misheard." },
  useCase: { context: 'Workplace', scenario: 'You are asking a colleague for "the full report", and they keep hearing "the fool report".' },
  exercises: [
    { type: 'read', text: "Ship / sheep. Live / leave. Full / fool. Bad / bed. / The sheep is on the ship. / I live here, but I leave at six.", focus: ['pace', 'pauses'], tip: 'Exaggerate the difference at first. Then make it natural.' },
    { type: 'choice', question: 'Which pair is a minimal pair?', options: ['cat / dog', 'bit / beat', 'run / running'], answer: 1, explain: '"Bit" and "beat" differ only in the vowel sound.' },
    { type: 'speak', prompt: 'Make up two sentences that use "ship" and "sheep", or "live" and "leave", and say them clearly.', seconds: 30, focus: ['pace'], tip: 'Record and listen back: could someone tell the words apart?' }
  ],
  checklist: ['Could I hear a difference between the long and short vowels?', 'Did I slow down on the key words?', 'Did it still sound like my own voice?'] },

{ id: 'L1-stories-1', level: 'L1', skill: 'stories', title: 'Give One Example', minutes: 6,
  concept: "Abstract claims slide out of people's heads. \"I'm a hard worker\" means almost nothing. \"Last winter I came in at six every day for two weeks to finish a migration\" sticks.\n\nThe simplest upgrade to almost any answer is: \"For example...\" followed by one real moment with a who, a where or a number.\n\nOne good example beats three vague ones. Choose the one you can picture.",
  keyPoints: ['Follow a claim with "For example...".', 'A good example has a person, place or number.', 'One vivid example beats three vague ones.', 'Pick an example you can picture yourself.'],
  example: { weak: "I'm really good with customers.", strong: "I'm good with customers. For example, last month a client was about to cancel, and after one call he renewed for a year.", why: "The example turns a claim into evidence." },
  useCase: { context: 'Job interview', scenario: 'The interviewer asks, "What are your strengths?" and you want to be believed, not just heard.' },
  exercises: [
    { type: 'build', instruction: 'Turn a claim into evidence.', fields: [{ label: 'Your claim', placeholder: 'I am organised.' }, { label: 'When / where', placeholder: 'At my cousin\'s wedding last year...' }, { label: 'What you did (with a number if possible)', placeholder: 'I planned seating for 120 guests...' }], speakPrompt: 'Say the claim, then "For example...", then the moment.', seconds: 40 },
    { type: 'speak', prompt: 'Complete: "One thing I\'m proud of is... For example..."', seconds: 40, focus: ['structure', 'fillers'], tip: 'Include a name, a place, or a number.' }
  ],
  checklist: ['Did I use "for example"?', 'Did my example include a person, place or number?', 'Could the listener picture it?'] },

{ id: 'L1-stories-2', level: 'L1', skill: 'stories', title: 'Tiny Stories: Then, Then, So', minutes: 7,
  concept: "A story does not need to be long. The smallest useful story has three beats: what was happening, what changed, and what it meant.\n\nTry this pattern: \"I was... Then... So now I...\". For example: \"I was always late for meetings. Then I started setting my watch five minutes ahead. So now I'm usually first in.\"\n\nTiny stories make small talk easier and make your points memorable.",
  keyPoints: ['A story can be three sentences.', 'Pattern: I was... Then... So now...', 'The change is the heart of the story.', 'End with what it means.'],
  example: { weak: "I learned to cook during lockdown, it was fine.", strong: "I couldn't cook at all. Then a neighbour taught me one curry a week. So now I host dinner every Sunday.", why: "The change makes the listener curious and the ending gives it meaning." },
  useCase: { context: 'Networking event', scenario: 'Someone asks, "How did you get into your line of work?" and you want an answer that is short and memorable.' },
  exercises: [
    { type: 'build', instruction: 'Build a three-beat tiny story about learning something.', fields: [{ label: 'I was...', placeholder: 'I was scared of driving.' }, { label: 'Then...', placeholder: 'Then my sister took me to an empty car park every Sunday.' }, { label: 'So now...', placeholder: 'So now I drive to work every day.' }], speakPrompt: 'Tell it as one tiny story.', seconds: 30 },
    { type: 'speak', prompt: 'Tell a three-beat story about a small habit that changed your life.', seconds: 40, focus: ['structure', 'ending', 'duration'], tip: 'Land the "So now..." line and stop.' }
  ],
  checklist: ['Did my story have a clear change?', 'Did it fit in about three sentences?', 'Did I end with what it meant?'] },

{ id: 'L1-presence-1', level: 'L1', skill: 'presence', title: 'Breath Before Words', minutes: 6,
  concept: "Confidence is not something you feel first and show second. Often it works the other way: you settle your body and your voice follows.\n\nBefore speaking, take one slow breath in through the nose, low into the belly, and let it out slowly. Then plant both feet and drop your shoulders. This takes about five seconds and nobody notices.\n\nSpeak on the out-breath. A voice supported by breath sounds steadier and carries further.",
  keyPoints: ['One slow belly breath before you start.', 'Feet planted, shoulders down.', 'Speak on the out-breath.', 'The body settles first; the voice follows.'],
  example: { weak: "(rushed, shallow breath) Hi-everyone-so-I'm-going-to-talk-about...", strong: "(breath, feet planted, pause) Good morning. I'm going to talk about our results.", why: "Five seconds of settling makes the first words calm and audible." },
  useCase: { context: 'Presentation', scenario: 'You are called to the front of a class or meeting and feel your heart racing.' },
  exercises: [
    { type: 'read', text: "(Breathe in for four.) / Good morning, everyone. / (Breathe.) / Thank you for being here. / Today I'll share one idea / that I hope you'll use this week.", focus: ['pace', 'pauses', 'opening'], tip: 'Take the breath before each line. Let your voice ride the out-breath.' },
    { type: 'speak', prompt: 'Breathe, plant your feet, then introduce yourself in three sentences as if starting a talk.', seconds: 30, focus: ['opening', 'pace', 'fillers'], tip: 'No "so" or "um" at the start. Breath, then words.' }
  ],
  checklist: ['Did I take a full breath before starting?', 'Were my shoulders relaxed?', 'Did my first words come out steady?'] },

{ id: 'L1-presence-2', level: 'L1', skill: 'presence', title: 'Finish Your Sentences', minutes: 6,
  concept: "A common habit of nervous speakers is trailing off: the voice fades, the sentence ends with \"...so, yeah\" or \"...or whatever\". It signals that you do not believe your own words.\n\nPractise landing the end: finish the sentence, let your pitch fall slightly on the last word, then stop and hold the silence for a moment.\n\nThe silence after a sentence is not awkward. It shows you meant it.",
  keyPoints: ['Avoid tails like "so, yeah" and "or whatever".', 'Let your pitch fall on the last word.', 'Stop and hold a moment of silence.', 'Silence after a point signals conviction.'],
  example: { weak: "I think we could maybe try the new supplier... so, yeah, or whatever.", strong: "I recommend we try the new supplier.", why: "A clean ending makes the recommendation sound real." },
  useCase: { context: 'Team meeting', scenario: 'You make a suggestion and want people to take it seriously instead of moving on.' },
  exercises: [
    { type: 'rewrite', instruction: 'Remove the trailing tail and make it a firm statement.', original: "I'd like to lead the next project, if that's okay, or not, whatever works, so yeah.", goal: 'no-hedges', hints: ['Cut everything after the request.'], model: "I'd like to lead the next project." },
    { type: 'speak', prompt: 'Say three opinions about food, one sentence each. Land each one and pause for two seconds.', seconds: 30, focus: ['ending', 'pauses', 'hedges'], tip: 'Pitch down on the final word, then silence.' }
  ],
  checklist: ['Did I avoid "so, yeah" or "or whatever"?', 'Did my voice drop at the end of sentences?', 'Did I hold the silence after each one?'] },

{ id: 'L1-listening-1', level: 'L1', skill: 'listening', title: 'Listen to Understand', minutes: 6,
  concept: "Most people listen while preparing their reply. They miss half of what is said, and the other person can feel it.\n\nActive listening has three simple behaviours: give your attention (face the person, stop typing), show you are following (short sounds like \"mm\", \"right\"), and check your understanding by repeating the key idea back in your own words.\n\nThe repeat-back is the most powerful. It proves you heard and catches misunderstandings early.",
  keyPoints: ['Stop preparing your reply while they talk.', 'Show you are following with small signals.', 'Repeat back the key idea in your own words.', 'Repeating back catches misunderstandings early.'],
  example: { weak: "Yeah, yeah. Anyway, what I think is...", strong: "So the main problem is the deadline, not the budget — is that right?", why: "Repeating back shows respect and checks accuracy." },
  useCase: { context: 'Friend or partner', scenario: 'A friend tells you about a stressful week and you want them to feel heard before offering advice.' },
  exercises: [
    { type: 'choice', question: 'Which response best shows active listening?', options: ['That reminds me of when I...', 'So you felt ignored because nobody replied to your email?', 'You should just quit.'], answer: 1, explain: 'It repeats back the key feeling and fact, and checks them.' },
    { type: 'speak', prompt: 'Imagine a colleague said: "I can\'t finish the slides because I\'m still waiting for the data from finance." Respond by repeating back what you heard, then ask one question.', seconds: 30, focus: ['fillers', 'duration'], tip: 'Start with "So..." and end with a question.' }
  ],
  checklist: ['Did I repeat the key idea in my own words?', 'Did I check whether I understood correctly?', 'Did I hold back my own opinion?'] },

{ id: 'L1-listening-2', level: 'L1', skill: 'listening', title: 'Open Questions', minutes: 6,
  concept: "Closed questions get one-word answers: \"Did you like it?\" \"Yes.\" Open questions invite a story: \"What did you like about it?\"\n\nOpen questions usually start with what, how, or tell me about. \"Why\" is open too, but can sound like an accusation, so soften it: \"What made you choose...\" instead of \"Why did you...\".\n\nOne good open question can carry a whole conversation.",
  keyPoints: ['Closed questions get yes / no answers.', 'Open questions start with what, how, tell me about.', 'Soften "why" to "what made you...".', 'One good open question can carry a conversation.'],
  example: { weak: "Was the trip good?", strong: "What was the best part of the trip?", why: "The open version invites a story instead of a yes." },
  useCase: { context: 'Small talk', scenario: 'You meet a colleague in the kitchen and the conversation dies after "Good weekend?" "Yeah."' },
  exercises: [
    { type: 'rewrite', instruction: 'Turn this closed question into an open one.', original: 'Did you enjoy the conference?', goal: 'casual', hints: ['Start with "What" or "How".'], model: 'What was the most useful talk at the conference?' },
    { type: 'speak', prompt: 'Ask three open questions you could use to get to know a new teammate.', seconds: 30, focus: ['fillers', 'ending'], tip: 'Start each with what, how or tell me about.' }
  ],
  checklist: ['Did my questions start with what, how or tell me about?', 'Would they invite more than a one-word answer?', 'Did I avoid sounding like an interrogation?'] },

/* ======================= L2 DEVELOPING ======================= */
{ id: 'L2-clarity-1', level: 'L2', skill: 'clarity', title: 'PREP: Point, Reason, Example, Point', minutes: 8,
  concept: "PREP is a four-step structure for any opinion or answer: Point (say your view), Reason (why), Example (a real instance), Point (repeat the view).\n\nIt works because it matches how listeners decide whether to believe you: what do you think, why should I care, show me, remind me.\n\nPREP fits into 30 to 60 seconds. It is ideal for meetings, interviews and any time someone says \"What do you think?\"",
  keyPoints: ['Point: state your view in one sentence.', 'Reason: give one main reason.', 'Example: show a real instance.', 'Point: repeat the view in fresh words.'],
  example: { weak: "Remote work is, I mean, it has pros and cons, people like it, some don't...", strong: "I think hybrid work is best for our team. We focus better at home. For example, our release last month was built mostly on home days. So, two office days a week makes sense.", why: "The listener gets a view, a reason, proof and a conclusion in under 30 seconds." },
  useCase: { context: 'Team meeting', scenario: 'Your lead asks, "Should we switch to the new tool?" and you have 30 seconds.' },
  exercises: [
    { type: 'build', instruction: 'Plan a PREP answer to: "Should schools teach public speaking?"', fields: [{ label: 'Point', placeholder: 'Yes, every school should teach it.' }, { label: 'Reason', placeholder: 'Because...' }, { label: 'Example', placeholder: 'For example...' }, { label: 'Point (again)', placeholder: 'So...' }], speakPrompt: 'Deliver your PREP answer in one go.', seconds: 45 },
    { type: 'speak', prompt: 'Use PREP: "What is the most useful app on your phone?"', seconds: 45, focus: ['structure', 'opening', 'ending'], tip: 'Your first and last sentences should both state your point.' }
  ],
  checklist: ['Did I state my point in the first sentence?', 'Did I give one clear reason?', 'Did I include a real example?', 'Did I repeat my point at the end?'] },

{ id: 'L2-clarity-2', level: 'L2', skill: 'clarity', title: 'STAR Stories for Interviews', minutes: 10,
  concept: "Behavioural interview questions (\"Tell me about a time when...\") need a story, not an opinion. STAR gives that story a shape: Situation, Task, Action, Result.\n\nKeep Situation and Task short — about 20% of your time. Spend most time on Action: what YOU did, with \"I\" not \"we\". Finish with a Result that has a number or a clear outcome, and if possible, what you learned.\n\nPrepare five STAR stories before any interview: a success, a failure, a conflict, a leadership moment and a time you learned fast.",
  keyPoints: ['Situation and Task: brief context.', 'Action: the longest part, using "I".', 'Result: a number or clear outcome.', 'Prepare five stories that can flex to many questions.'],
  example: { weak: "We had a hard project once and we worked hard and it went okay.", strong: "Our biggest client threatened to leave (S). I had two weeks to rebuild trust (T). I called them daily and fixed their top three issues personally (A). They renewed for two years (R).", why: "Each STAR step is visible and the result is concrete." },
  useCase: { context: 'Job interview', scenario: 'The interviewer says, "Tell me about a time you handled a difficult situation at work."' },
  exercises: [
    { type: 'build', instruction: 'Build a STAR story about solving a problem.', fields: [{ label: 'Situation', placeholder: 'In my last role...' }, { label: 'Task', placeholder: 'I needed to...' }, { label: 'Action (what I did)', placeholder: 'I...' }, { label: 'Result', placeholder: 'As a result...' }], speakPrompt: 'Tell your STAR story in under 90 seconds.', seconds: 90 },
    { type: 'choice', question: 'Which STAR section should take the most time?', options: ['Situation', 'Task', 'Action', 'Result'], answer: 2, explain: 'Interviewers want to know what you did, so Action carries the most weight.' },
    { type: 'speak', prompt: '"Tell me about a time you learned something quickly." Answer with STAR.', seconds: 90, focus: ['structure', 'fillers', 'duration'], tip: 'Use "I" in the Action part, not "we".' }
  ],
  checklist: ['Was my Situation under 20 seconds?', 'Did I say "I" in the Action?', 'Did my Result include a number or clear outcome?'] },

{ id: 'L2-words-1', level: 'L2', skill: 'words', title: 'Match the Room: Register', minutes: 8,
  concept: "Register is how formal or casual your language is. The same idea sounds different to a friend, a manager or a judge. Problems happen when register does not match the room: too casual feels disrespectful, too formal feels cold.\n\nThink of three settings: casual (\"Can't make it, sorry!\"), professional (\"I can't attend, but I'll catch up on the notes.\"), formal (\"I regret that I am unable to attend.\").\n\nMost workplaces want professional: clear, polite and warm, with contractions allowed.",
  keyPoints: ['Register = level of formality.', 'Casual, professional, formal — choose deliberately.', 'Professional is the safe default at work.', 'Mismatch, not formality itself, causes problems.'],
  example: { weak: "(To a CEO) Hey, so the numbers are kinda a mess, lol.", strong: "The numbers need another review before we share them.", why: "Professional register keeps the message honest and appropriate." },
  useCase: { context: 'Email / voice note', scenario: 'You need to tell a senior client that a delivery will be late.' },
  exercises: [
    { type: 'rewrite', instruction: 'Rewrite this casual message in a professional register.', original: "Hey, gonna be late, traffic's crazy, start without me lol.", goal: 'formal', hints: ['Keep it short and polite.', 'Drop slang like "gonna" and "lol".'], model: "I'm running about ten minutes late because of traffic. Please start without me." },
    { type: 'rewrite', instruction: 'Now rewrite this formal sentence casually, as if to a friend.', original: "I would be delighted to accept your kind invitation to dinner.", goal: 'casual', hints: ['How would you text it?'], model: "I'd love to come to dinner — thanks!" },
    { type: 'speak', prompt: 'Say the same news — "the event is cancelled" — three ways: to a friend, to your team, and in a formal announcement.', seconds: 60, focus: ['fillers', 'pauses'], tip: 'Pause between versions and shift your tone, not only your words.' }
  ],
  checklist: ['Did the three versions sound clearly different?', 'Was my professional version polite but warm?', 'Did I avoid slang in the formal one?'] },

{ id: 'L2-words-2', level: 'L2', skill: 'words', title: 'Words That Belong Together', minutes: 8,
  concept: "Collocations are words that naturally go together: \"make a decision\", \"take a break\", \"heavy rain\", \"strong coffee\". Using the wrong partner (\"do a decision\", \"strong rain\") is understandable but sounds slightly off.\n\nLearn vocabulary in chunks, not single words. When you meet a useful word, note the verbs and adjectives that travel with it.\n\nWork English is full of collocations: \"meet a deadline\", \"raise a concern\", \"reach an agreement\", \"run a meeting\".",
  keyPoints: ['Collocations are natural word partners.', 'Learn words in chunks: verb + noun, adjective + noun.', 'Wrong partners are understood but sound off.', 'Collect work collocations you actually need.'],
  example: { weak: "We need to do a decision and make a meeting to reach the deadline.", strong: "We need to make a decision and run a meeting to meet the deadline.", why: "Correct collocations sound fluent and confident." },
  useCase: { context: 'Workplace', scenario: 'You are updating your manager on a project and want to sound fluent and precise.' },
  exercises: [
    { type: 'choice', question: 'Which collocation is natural?', options: ['do a mistake', 'make a mistake', 'take a mistake'], answer: 1, explain: 'In English we "make" a mistake.' },
    { type: 'choice', question: 'Which verb goes with "a concern"?', options: ['raise', 'lift', 'grow'], answer: 0, explain: 'We "raise a concern" in meetings.' },
    { type: 'speak', prompt: 'Describe your week using at least four of: make a decision, meet a deadline, raise a concern, take a break, run a meeting, reach an agreement.', seconds: 60, focus: ['fillers', 'pace'], tip: 'Say each collocation as one chunk, without a pause in the middle.' }
  ],
  checklist: ['Did I use at least four collocations?', 'Did they come out as smooth chunks?', 'Did my week sound real, not like a list?'] },

{ id: 'L2-grammar-1', level: 'L2', skill: 'grammar', title: 'Keep Your Tenses Steady', minutes: 8,
  concept: "When people tell stories, they often jump between past and present without meaning to: \"Yesterday I go to the shop and I saw...\". The listener then has to work out when things happened.\n\nChoose a time frame and stay in it. For past stories, use the simple past: went, saw, said. Switch tense only when the time really changes: \"I learned to code in 2020, and now I work as a developer.\"\n\nThe present perfect (\"I have worked\") connects the past to now. Use it for experience and for things that are still true.",
  keyPoints: ['Pick one time frame for a story.', 'Simple past for finished events: went, saw.', 'Switch tense only when the time really changes.', 'Present perfect links past to now: I have worked here for two years.'],
  example: { weak: "Last week I meet the client and she says the price was too high, so I tell her we can fix it.", strong: "Last week I met the client. She said the price was too high, so I told her we could fix it.", why: "A steady past tense makes the timeline obvious." },
  useCase: { context: 'Job interview', scenario: 'You are telling a STAR story about something that happened last year.' },
  exercises: [
    { type: 'rewrite', instruction: 'Fix the tense jumps so the whole story is in the past.', original: "Yesterday I walk into the office and my boss tells me the project was cancelled, so I go home early.", goal: 'active', hints: ['walk → walked', 'tells → told', 'go → went'], model: 'Yesterday I walked into the office and my boss told me the project was cancelled, so I went home early.' },
    { type: 'choice', question: 'Which is correct for experience up to now?', options: ['I work here since 2021.', 'I have worked here since 2021.', 'I am working here since 2021.'], answer: 1, explain: 'Present perfect with "since" connects the past to now.' },
    { type: 'speak', prompt: 'Tell the story of your last holiday or day off, staying in the past tense.', seconds: 60, focus: ['pace', 'fillers'], tip: 'Slow down on verbs. If you slip, correct calmly and keep going.' }
  ],
  checklist: ['Did I stay in the past tense?', 'Did I correct slips calmly?', 'Was the timeline easy to follow?'] },

{ id: 'L2-grammar-2', level: 'L2', skill: 'grammar', title: 'Articles: A, An, The', minutes: 8,
  concept: "Articles are small but frequent, and many languages do not have them. A simple working rule covers most cases.\n\nUse \"a\" or \"an\" when you mention one countable thing for the first time, or when it is one of many: \"I have an idea.\" Use \"the\" when both people know which one: \"The idea I mentioned yesterday.\" Use no article for general plurals and uncountables: \"Ideas matter. Information is useful.\"\n\n\"An\" goes before a vowel sound, not a vowel letter: an hour, a university.",
  keyPoints: ['a / an = one of many, or first mention.', 'the = we both know which one.', 'No article for general plurals and uncountables.', '"an" before vowel sounds: an hour, a user.'],
  example: { weak: "I sent the email to client and he said that information are useful.", strong: "I sent an email to the client and he said the information is useful.", why: "Correct articles and agreement make the sentence sound fluent." },
  useCase: { context: 'Work update', scenario: 'You are describing a meeting with a customer to your team.' },
  exercises: [
    { type: 'choice', question: 'Choose the correct sentence.', options: ['I waited for a hour.', 'I waited for an hour.', 'I waited for the hour.'], answer: 1, explain: '"Hour" starts with a vowel sound, so we use "an".' },
    { type: 'rewrite', instruction: 'Add or fix the articles.', original: "Manager asked me to write report about new product for meeting.", goal: 'active', hints: ['Which things do we both know about?'], model: 'The manager asked me to write a report about the new product for the meeting.' },
    { type: 'read', text: "I had an idea during the meeting. / The idea was simple: / a shorter form for new users. / The users we tested it with / finished in half the time.", focus: ['pace', 'pauses'], tip: 'Say "a" and "the" lightly — they are unstressed — but do not drop them.' }
  ],
  checklist: ['Did I use "a / an" for first mentions?', 'Did I use "the" for things we both know?', 'Did the small words stay light but present?'] },

{ id: 'L2-voice-1', level: 'L2', skill: 'voice', title: 'Word Stress Changes Meaning', minutes: 8,
  concept: "English words have one strong syllable. Stress the wrong one and listeners may hear a different word, or not recognise it at all. Stress matters more for being understood than perfect vowel sounds.\n\nSome word pairs change meaning with stress: REcord (a noun) vs reCORD (a verb), PREsent vs preSENT, OBject vs obJECT. As a rough guide, two-syllable nouns often stress the first syllable and verbs the second.\n\nThe stressed syllable is longer, louder and higher. The others are short and light.",
  keyPoints: ['Each word has one strong syllable.', 'Wrong stress can hide the word completely.', 'Noun REcord, verb reCORD.', 'Stressed = longer, louder, higher.'],
  example: { weak: "We need to deVElop a new comPAny poLIcy. (unusual stress)", strong: "We need to deVElop a new COMpany POlicy.", why: "Expected stress lets the listener recognise words instantly." },
  useCase: { context: 'Presentation', scenario: 'You are presenting a project and keep using the words "analysis", "development" and "photograph".' },
  exercises: [
    { type: 'read', text: "Please REcord the meeting. / No — I mean, please reCORD it. / I'll PREsent the PREsent at the party. / We need a deTAILED aNAlysis / of the PHOtograph and the phoTOgrapher.", focus: ['pace', 'pauses'], tip: 'Make stressed syllables longer and higher. Listen back for the difference.' },
    { type: 'choice', question: 'Which stress pattern is correct for the verb "to present"?', options: ['PREsent', 'preSENT'], answer: 1, explain: 'As a verb, the stress usually moves to the second syllable.' },
    { type: 'speak', prompt: 'Use "record", "present" and "object" each as a noun and a verb in your own sentences.', seconds: 45, focus: ['pace'], tip: 'Exaggerate the stress first, then make it natural.' }
  ],
  checklist: ['Could I hear the stressed syllable move?', 'Were stressed syllables longer, not just louder?', 'Did unstressed syllables stay light?'] },

{ id: 'L2-voice-2', level: 'L2', skill: 'voice', title: 'Thought Groups and Pauses', minutes: 8,
  concept: "Speech is not a stream of words. It comes in thought groups: short phrases of three to seven words, each carrying one idea, separated by small pauses.\n\nPausing between thought groups helps understanding. Pausing in the middle of a group (\"I went to / the\") breaks it. Plan your pauses where a comma might go, or before an important word.\n\nIn each thought group, one word usually carries the main stress — the new or important information.",
  keyPoints: ['Speak in groups of 3–7 words.', 'Pause between groups, not inside them.', 'Pause before important words.', 'Each group has one focus word.'],
  example: { weak: "Our sales grew by twenty / percent this quarter because the / new website launched in March.", strong: "Our sales grew / by TWENTY percent / this quarter / because the new WEBsite / launched in March.", why: "Pauses follow meaning, so each idea arrives in one piece." },
  useCase: { context: 'Presentation', scenario: 'You are reading results from a slide and want the numbers to land.' },
  exercises: [
    { type: 'read', text: "When we started / this project, / we had THREE people / and NO budget. / Today / we have a team of twenty / and our first PAYING customers.", focus: ['pauses', 'pace'], tip: 'Pause at each slash. Lean on the capitalised word.' },
    { type: 'build', instruction: 'Mark thought groups in your own sentence.', fields: [{ label: 'Write a 20–30 word sentence about your work', placeholder: 'When I joined the team last year we were missing deadlines every month...' }, { label: 'Rewrite it with / between thought groups', placeholder: 'When I joined the team / last year / ...' }], speakPrompt: 'Read your marked sentence aloud with the pauses.', seconds: 30 },
    { type: 'speak', prompt: 'Explain how to make your favourite drink, pausing between thought groups.', seconds: 45, focus: ['pauses', 'pace'], tip: 'Short phrases. Pause where a comma would go.' }
  ],
  checklist: ['Did I pause between ideas, not inside them?', 'Did one word in each group stand out?', 'Did the pace feel calm, not choppy?'] },

{ id: 'L2-stories-1', level: 'L2', skill: 'stories', title: 'Build an Analogy', minutes: 9,
  concept: "An analogy explains something unfamiliar using something familiar: \"A firewall is like a security guard checking IDs at the door.\"\n\nTo build one, list the key parts of your idea, then find an everyday domain — cooking, sport, traffic, gardening — with matching parts. Map them one-to-one. Then test it: where does the analogy break? Every analogy breaks somewhere. Knowing where makes you more credible.\n\nShort analogies work best spoken. One sentence, maybe two.",
  keyPoints: ['Explain the unfamiliar with the familiar.', 'Map parts: X is to Y as A is to B.', 'Pick a domain your audience knows.', 'Know where your analogy breaks.'],
  example: { weak: "Technical debt is when the code has issues that build up over time and make it harder to change.", strong: "Technical debt is like a messy kitchen. Skip the washing-up for a week and every new meal takes twice as long.", why: "Everyone has felt a messy kitchen, so the cost becomes obvious." },
  useCase: { context: 'Explaining to non-experts', scenario: 'You need to explain why your team needs time to "refactor" to a manager without a technical background.' },
  exercises: [
    { type: 'build', instruction: 'Map an analogy for "compound interest".', fields: [{ label: 'Everyday domain', placeholder: 'A snowball rolling downhill' }, { label: 'What maps to the money?', placeholder: 'The snow...' }, { label: 'What maps to time?', placeholder: 'The length of the hill...' }, { label: 'Where does it break?', placeholder: 'Real money can also shrink...' }], speakPrompt: 'Explain compound interest using your analogy, and say where it breaks.', seconds: 45 },
    { type: 'speak', prompt: 'Explain what your job or studies are like using an analogy from cooking, sport or travel.', seconds: 45, focus: ['structure', 'fillers'], tip: 'Start with "It\'s like..." and keep it to two sentences, then explain the match.' }
  ],
  checklist: ['Was my everyday domain truly familiar?', 'Did the parts map clearly?', 'Did I mention where it breaks?'] },

{ id: 'L2-stories-2', level: 'L2', skill: 'stories', title: 'The Example Ladder', minutes: 8,
  concept: "Ideas live at different heights. At the top: abstract statements (\"Good service matters\"). In the middle: categories (\"Quick replies to complaints\"). At the bottom: real instances with a person, place or number (\"Priya answered a complaint at 11 pm and saved a ₹5 lakh order\").\n\nStrong communicators move up and down this ladder on purpose. They state the abstract point, then climb down to a vivid instance, then climb back up to the lesson.\n\nIf your audience looks lost, climb down. If they look bored by detail, climb up.",
  keyPoints: ['Top rung: abstract claim.', 'Middle rung: category.', 'Bottom rung: a real moment with a person, place or number.', 'Go down for clarity, up for meaning.'],
  example: { weak: "Communication is important in teams.", strong: "Communication is important in teams. Small check-ins help most. Last month, a two-minute stand-up caught a bug that would have delayed our launch by a week.", why: "The ladder moves from claim to category to evidence." },
  useCase: { context: 'Performance review', scenario: 'You want to show your impact this year without sounding vague or boastful.' },
  exercises: [
    { type: 'build', instruction: 'Climb down the ladder from "Learning a language opens doors."', fields: [{ label: 'Top: abstract claim', placeholder: 'Learning a language opens doors.' }, { label: 'Middle: category', placeholder: 'It helps you make friends abroad.' }, { label: 'Bottom: real instance', placeholder: 'In Lisbon, I asked for directions in Portuguese and...' }], speakPrompt: 'Speak the three rungs, top to bottom, then climb back to the lesson.', seconds: 45 },
    { type: 'speak', prompt: 'Make a claim about what makes a good teacher, then climb down to one real teacher you had.', seconds: 60, focus: ['structure', 'fillers', 'ending'], tip: 'Include a name, a subject or a moment.' }
  ],
  checklist: ['Did I touch all three rungs?', 'Did my bottom rung have a person, place or number?', 'Did I climb back up to the lesson at the end?'] },

{ id: 'L2-presence-1', level: 'L2', skill: 'presence', title: 'Open Without Apologising', minutes: 7,
  concept: "Many talks start by undermining themselves: \"Sorry, I'm not very good at this...\", \"So, um, I'll be quick...\", \"I don't know if this is useful, but...\". The audience believes you, and lowers their expectations.\n\nYour first ten seconds should do one of three things: state your main point, ask a real question, or share a short, specific moment. Then pause.\n\nYou can be humble without apologising. Humility is \"Here is what I learned\". Apology is \"Sorry for being here\".",
  keyPoints: ['Never open with sorry, um or "I\'ll be quick".', 'Open with a point, a question or a moment.', 'Pause after your first line.', 'Humble is fine; self-cancelling is not.'],
  example: { weak: "Sorry, um, I'm not really a presenter, so bear with me, I'll try to be quick...", strong: "Last month we lost three customers in one week. Today I'll show you why — and how we stop it.", why: "The strong opening earns attention instead of asking for patience." },
  useCase: { context: 'Presentation', scenario: 'You are first to present in a quarterly review and the room is still settling.' },
  exercises: [
    { type: 'rewrite', instruction: 'Rewrite this opening without apology or filler.', original: "Sorry, so, um, I know everyone's busy, so I'll just quickly go through some slides about the budget, if that's okay.", goal: 'no-hedges', hints: ['Start with the most interesting fact about the budget.'], model: "We have 15% less budget next year. Here's how we keep every project alive." },
    { type: 'speak', prompt: 'Give the first 15 seconds of a talk on any topic you know. No apology, no "so" or "um".', seconds: 20, focus: ['opening', 'apology', 'fillers'], tip: 'Breathe first. Make your first word count.' }
  ],
  checklist: ['Did my first word avoid "so", "um" or "sorry"?', 'Did I open with a point, a question or a moment?', 'Did I pause after the first line?'] },

{ id: 'L2-presence-2', level: 'L2', skill: 'presence', title: 'Hunt Your Hedges', minutes: 8,
  concept: "Hedges are words that soften a statement: just, sort of, kind of, maybe, I think, a little bit, probably. Some hedges are honest: if you are truly unsure, say so. But habitual hedges make sure statements sound unsure.\n\nAsk of each hedge: \"Is this true uncertainty, or a habit?\" If it is a habit, cut it. If it is true, keep one hedge, clearly placed: \"I'm not certain about the date; I'll confirm by Friday.\"\n\nThe goal is accuracy, not arrogance.",
  keyPoints: ['Hedges: just, sort of, maybe, I think, probably.', 'Keep hedges that express real uncertainty.', 'Cut hedges that are only habit.', 'One clear hedge beats five vague ones.'],
  example: { weak: "I just think maybe we could sort of try a slightly different approach, perhaps?", strong: "I suggest a different approach: test it with five users first.", why: "The hedges added doubt without adding information." },
  useCase: { context: 'Team meeting', scenario: 'You want to propose an idea to a group of senior colleagues.' },
  exercises: [
    { type: 'rewrite', instruction: 'Remove the habitual hedges. Keep only honest uncertainty.', original: "I just wanted to kind of say that I think maybe the deadline is probably a bit unrealistic, sort of.", goal: 'no-hedges', hints: ['What do you actually believe?', 'If you are sure, say it plainly.'], model: 'I think the deadline is unrealistic. We need two more weeks.' },
    { type: 'speak', prompt: 'Give your honest opinion on whether people should work four days a week. Use at most one hedge.', seconds: 45, focus: ['hedges', 'ending', 'fillers'], tip: 'Decide your view first. Then say it as a statement.' }
  ],
  checklist: ['Did I use one hedge or fewer?', 'Was any hedge I kept honest?', 'Did my ending sound decided?'] },

{ id: 'L2-listening-1', level: 'L2', skill: 'listening', title: 'Paraphrase Like a Pro', minutes: 8,
  concept: "Paraphrasing is restating someone's message in your own words. It does three jobs: it shows you listened, it checks your understanding, and it slows down heated conversations.\n\nGood paraphrases capture both content and feeling: \"So the deadline moved without warning, and that's frustrating because you'd planned your week around it.\"\n\nUse starters like \"So what I'm hearing is...\", \"It sounds like...\", \"Let me check I've got this...\". Then stop and let them confirm or correct.",
  keyPoints: ['Paraphrase content and feeling.', 'Use starters: "It sounds like..."', 'Stop after paraphrasing; let them correct you.', 'Paraphrasing cools heated conversations.'],
  example: { weak: "Okay. Anyway, the reason it happened was...", strong: "It sounds like you felt left out because the decision was made before you saw it. Is that right?", why: "The person feels understood before you explain your side." },
  useCase: { context: 'Workplace conflict', scenario: 'A colleague is upset that their idea was not included in the final plan.' },
  exercises: [
    { type: 'choice', question: 'Which paraphrase captures content and feeling?', options: ['Okay, noted.', 'So you\'re saying the plan is bad.', 'It sounds like the late change put you under pressure, and you wish you\'d been asked first.'], answer: 2, explain: 'It reflects both what happened and how they feel, without judging.' },
    { type: 'speak', prompt: 'A customer says: "I\'ve called three times and nobody has fixed my internet. I work from home and I\'m losing money." Paraphrase, then ask one question.', seconds: 40, focus: ['fillers', 'pace'], tip: 'Reflect the facts and the feeling. Then pause.' }
  ],
  checklist: ['Did I capture the facts?', 'Did I name the feeling without exaggerating it?', 'Did I invite them to correct me?'] },

{ id: 'L2-listening-2', level: 'L2', skill: 'listening', title: 'Follow-Up Questions', minutes: 7,
  concept: "The fastest way to become a great conversationalist is to ask the second question. The first question opens a topic; the follow-up shows you were listening.\n\nPick one specific word from their answer and ask about it. If they say \"Work was crazy because of the launch\", don't switch topics — ask \"What was the hardest part of the launch?\"\n\nThree types of follow-up: go deeper (\"What happened next?\"), ask for feeling (\"How did that feel?\"), or ask for meaning (\"What did you take from it?\").",
  keyPoints: ['Ask about a specific word they used.', 'Go deeper, ask for feeling, or ask for meaning.', 'Resist switching to your own story.', 'Two follow-ups beat ten new topics.'],
  example: { weak: "\"I just got back from Kenya.\" — \"Cool. I went to Spain last year...\"", strong: "\"I just got back from Kenya.\" — \"What surprised you most there?\"", why: "The follow-up keeps the spotlight on them." },
  useCase: { context: 'Networking event', scenario: 'You are talking to someone you just met and want the conversation to feel genuine.' },
  exercises: [
    { type: 'build', instruction: 'Plan follow-ups to: "I\'ve just started learning the guitar."', fields: [{ label: 'Go deeper', placeholder: 'What made you start now?' }, { label: 'Ask for feeling', placeholder: 'How does it feel...' }, { label: 'Ask for meaning', placeholder: 'What do you hope...' }], speakPrompt: 'Ask all three follow-ups naturally, as if in a conversation.', seconds: 30 },
    { type: 'speak', prompt: 'Your friend says: "I\'m thinking of moving to another city." Ask three follow-up questions, each building on the last.', seconds: 40, focus: ['fillers', 'ending'], tip: 'Use their words in your questions.' }
  ],
  checklist: ['Did each question use their words?', 'Did I avoid switching to my own story?', 'Did my questions get deeper?'] },

/* ======================= L3 SKILLED ======================= */
{ id: 'L3-clarity-1', level: 'L3', skill: 'clarity', title: 'Problem, Cost, Solution, Ask', minutes: 10,
  concept: "Persuasion is not about clever words. It is about walking the listener from where they are to where you want them to be, one step at a time.\n\nA reliable spoken structure: Problem (what is wrong, in their terms), Cost (what it costs them if nothing changes), Solution (your proposal, in one line), Ask (the specific decision or action you need, with a time).\n\nThe most skipped step is the Ask. Many good pitches end with \"So, yeah, that's my idea.\" Always end with a clear request.",
  keyPoints: ['Problem in the listener\'s terms.', 'Cost makes the problem urgent.', 'Solution in one line.', 'Ask: specific action, specific time.'],
  example: { weak: "So I've been thinking we could use a new scheduling tool, it might help, let me know what you think.", strong: "Our team loses about five hours a week rescheduling meetings. That's a full day a month. A shared scheduling tool fixes it for ₹500 per person. Can I run a one-month trial starting Monday?", why: "Each step builds the case and the Ask makes it easy to say yes." },
  useCase: { context: 'Pitch to manager', scenario: 'You want approval for training, a tool or a new hire, and you get five minutes in a one-to-one.' },
  exercises: [
    { type: 'build', instruction: 'Build a persuasive pitch for something you want changed at work, school or home.', fields: [{ label: 'Problem', placeholder: 'Every week we...' }, { label: 'Cost', placeholder: 'That costs us...' }, { label: 'Solution', placeholder: 'If we...' }, { label: 'Ask (action + time)', placeholder: 'Can we try it from...' }], speakPrompt: 'Deliver your pitch in under 60 seconds.', seconds: 60 },
    { type: 'speak', prompt: 'Persuade a friend to join you for a weekly activity. Use Problem, Cost, Solution, Ask.', seconds: 60, focus: ['structure', 'ending', 'hedges'], tip: 'End with a direct question that has a time in it.' }
  ],
  checklist: ['Did I describe the problem in their terms?', 'Did I make the cost concrete?', 'Did I end with a specific Ask?'] },

{ id: 'L3-clarity-2', level: 'L3', skill: 'clarity', title: 'Signposting a Longer Talk', minutes: 9,
  concept: "In a five or ten minute talk, listeners get lost easily. Written text has headings; speech needs verbal headings, called signposts.\n\nUse a roadmap at the start (\"I'll cover three things: the problem, the options and my recommendation\"), transitions between sections (\"That's the problem. Now, the options.\"), and a summary at the end that mirrors the roadmap.\n\nTransitions are where speakers usually mumble. Make them crisp and slightly slower; they are the most important sentences for orientation.",
  keyPoints: ['Roadmap at the start: what\'s coming.', 'Clear transitions between sections.', 'Summary mirrors the roadmap.', 'Slow down slightly on transitions.'],
  example: { weak: "...and that's that. Um, also, another thing is, there's some options...", strong: "That's the problem. Now — the three options we have.", why: "A crisp transition closes one section and opens the next." },
  useCase: { context: 'Presentation', scenario: 'You are giving a 10-minute project update to a group of stakeholders who drift onto their phones.' },
  exercises: [
    { type: 'build', instruction: 'Write the signposts for a 3-section talk on any topic.', fields: [{ label: 'Roadmap sentence', placeholder: "I'll cover three things: ..." }, { label: 'Transition 1 → 2', placeholder: "That's ... Now, ..." }, { label: 'Transition 2 → 3', placeholder: 'So that\'s ... Finally, ...' }, { label: 'Summary', placeholder: 'To recap: ...' }], speakPrompt: 'Say only your signposts, in order, as if the content were between them.', seconds: 45 },
    { type: 'speak', prompt: 'Give a 90-second talk on "three things I wish I knew at 18", with a roadmap, transitions and a summary.', seconds: 90, focus: ['structure', 'pauses', 'ending'], tip: 'Pause briefly before each transition.' }
  ],
  checklist: ['Did I give a roadmap?', 'Were my transitions clear and slower?', 'Did my summary match the roadmap?'] },

{ id: 'L3-words-1', level: 'L3', skill: 'words', title: 'Precision Over Intensity', minutes: 9,
  concept: "When we want impact, we reach for intensifiers: very, really, extremely, super, totally. They feel strong but carry little information.\n\nPrecise words do more work. \"Very big\" becomes \"enormous\" or, better, \"three times last year's size\". \"Really bad\" becomes \"unusable\", \"late\" or \"unsafe\" depending on what you mean.\n\nAsk: what exactly do I mean? Replace the intensifier with a precise word or a number. Precision sounds more confident than volume.",
  keyPoints: ['Intensifiers add volume, not meaning.', 'Replace "very + adjective" with one precise word.', 'Better still, use a number or a fact.', 'Precision sounds more confident than emphasis.'],
  example: { weak: "The new system is really, really slow and it's super frustrating for everyone.", strong: "The new system takes forty seconds to load a page, so the team avoids using it.", why: "A specific fact persuades more than stacked intensifiers." },
  useCase: { context: 'Feedback to vendor', scenario: 'You need a supplier to take a problem seriously, and "it\'s very bad" has not worked.' },
  exercises: [
    { type: 'choice', question: 'Most precise replacement for "very tired"?', options: ['really tired', 'exhausted', 'super tired'], answer: 1, explain: '"Exhausted" is one precise word with a stronger meaning.' },
    { type: 'rewrite', instruction: 'Replace the intensifiers with precise words or facts.', original: "The event was really amazing and super successful and there were very many people.", goal: 'concrete', hints: ['How many people?', 'What made it a success?'], model: 'The event sold out: 400 people came, and 60 signed up for the next one.' },
    { type: 'speak', prompt: 'Describe the best meal you\'ve ever had without using very, really, super or amazing.', seconds: 45, focus: ['repetition', 'fillers'], tip: 'Use smell, taste, place and a detail only you would know.' }
  ],
  checklist: ['Did I avoid very, really and super?', 'Did I use at least one precise word or number?', 'Did my description feel specific to me?'] },

{ id: 'L3-words-2', level: 'L3', skill: 'words', title: 'Verbs That Carry the Weight', minutes: 9,
  concept: "Weak speech hides action inside nouns: \"We made a decision\", \"We carried out an investigation\", \"There was a reduction in costs\". Strong speech uses the verb directly: \"We decided\", \"We investigated\", \"We cut costs\".\n\nThis also fixes passive voice that hides who did what. \"Mistakes were made\" becomes \"I made a mistake\" or \"The team missed a step\".\n\nActive, direct verbs make you sound accountable and confident. Use passive only when the doer truly doesn't matter.",
  keyPoints: ['Turn hidden nouns back into verbs.', '"Made a decision" → "decided".', 'Active voice shows who did what.', 'Use passive only when the doer doesn\'t matter.'],
  example: { weak: "An improvement in response times was achieved through the implementation of a new process.", strong: "We cut response times by redesigning the process.", why: "Active verbs make the sentence shorter and show ownership." },
  useCase: { context: 'Status update', scenario: 'You are reporting what your team achieved this quarter to leadership.' },
  exercises: [
    { type: 'rewrite', instruction: 'Make it active and use strong verbs.', original: "A decision was made to conduct a review of the budget, and a reduction of spending was carried out.", goal: 'active', hints: ['Who decided?', 'decision → decided, review → reviewed, reduction → cut'], model: 'We decided to review the budget, and we cut spending.' },
    { type: 'rewrite', instruction: 'Own the mistake with an active sentence.', original: "Unfortunately, the email was sent to the wrong client.", goal: 'active', hints: ['Who sent it?'], model: 'I sent the email to the wrong client. I have already contacted both clients.' },
    { type: 'speak', prompt: 'Describe three things you achieved this year using strong active verbs: built, led, fixed, cut, launched, taught.', seconds: 60, focus: ['hedges', 'sentenceLength'], tip: 'Start sentences with "I" or "We" plus a verb.' }
  ],
  checklist: ['Did I use active verbs?', 'Did I avoid "was done" structures?', 'Did I sound accountable?'] },

{ id: 'L3-grammar-1', level: 'L3', skill: 'grammar', title: 'Front-Load Your Sentences', minutes: 9,
  concept: "In speech, the start of a sentence gets the most attention. Many speakers bury the main point at the end, after a long run-up of conditions and background.\n\nFront-load: put the subject and main verb early. \"Because of the delays we had in March and the supplier change, the launch will be in June\" becomes \"The launch moves to June, because of March delays and the supplier change.\"\n\nThis also helps you: once the main clause is said, the rest can't confuse you.",
  keyPoints: ['Put the main clause first.', 'Background and conditions come after.', 'Listeners remember sentence starts best.', 'Front-loading reduces mid-sentence tangles.'],
  example: { weak: "Given the fact that we had some unforeseen issues with the vendor, and taking into account the holiday period, it seems we will have to delay.", strong: "We have to delay by two weeks. The vendor issues and the holidays set us back.", why: "The decision arrives first; the reasons support it." },
  useCase: { context: 'Executive update', scenario: 'A director asks a quick question in the corridor and wants the answer, not the history.' },
  exercises: [
    { type: 'rewrite', instruction: 'Front-load the main point.', original: "If we consider the feedback from customers, the competitor pricing and our own costs, the best option is to raise prices by 5%.", goal: 'shorter', hints: ['What is the main point? Start with it.'], model: 'We should raise prices by 5%. Customer feedback, competitor pricing and our costs all support it.' },
    { type: 'speak', prompt: 'Answer, front-loading your answer: "Which city would you recommend to a first-time visitor to your country, and why?"', seconds: 45, focus: ['opening', 'sentenceLength', 'structure'], tip: 'Your first five words should contain the city name.' }
  ],
  checklist: ['Was my main point in the first sentence?', 'Did reasons come after?', 'Did my sentences stay untangled?'] },

{ id: 'L3-grammar-2', level: 'L3', skill: 'grammar', title: 'Sentence Variety and Rhythm', minutes: 9,
  concept: "Once your sentences are correct, make them interesting. Speech made of identical sentences sounds flat, even with great content.\n\nMix lengths: a long sentence that sets up context, followed by a short one that lands the point. \"We tested it with two hundred users, across six cities, over three months. It worked.\"\n\nVary openings too. Not every sentence needs to start with \"I\" or \"So\". Try a time (\"Last March...\"), a place (\"In the warehouse...\") or a question (\"What changed?\").",
  keyPoints: ['Mix long and short sentences.', 'A short sentence after a long one lands the point.', 'Vary how sentences begin.', 'Rhythm keeps listeners awake.'],
  example: { weak: "I worked on the project. I talked to the users. I fixed the problems. I launched it.", strong: "For three months, I talked to users, sketched fixes and rebuilt the flow, piece by piece. Then we launched. Complaints dropped by half.", why: "Varied length and openings create momentum." },
  useCase: { context: 'Presentation', scenario: 'You have strong results but your delivery sounds like a list.' },
  exercises: [
    { type: 'rewrite', instruction: 'Combine and vary these sentences. End with a short punchy line.', original: "We had a problem. The app was slow. Users left. We rewrote the code. Now it is fast.", goal: 'concrete', hints: ['Combine the first three into one longer sentence.', 'End with a very short sentence.'], model: 'Our app was so slow that users were leaving within seconds. So we rewrote the core. Now it flies.' },
    { type: 'speak', prompt: 'Describe a turning point in your life using at least one long sentence and one very short sentence.', seconds: 60, focus: ['sentenceLength', 'pauses'], tip: 'Pause just before the short sentence.' }
  ],
  checklist: ['Did I mix long and short sentences?', 'Did I vary how sentences began?', 'Did a short sentence land a key moment?'] },

{ id: 'L3-voice-1', level: 'L3', skill: 'voice', title: 'Intonation Carries Meaning', minutes: 10,
  concept: "The same words can mean different things depending on pitch. \"I didn't say she stole the money\" has seven meanings depending on which word you stress.\n\nFalling intonation at the end signals certainty and completion. Rising intonation signals a question, a list that continues, or uncertainty. Many speakers end statements with a rise, which can make firm ideas sound like questions.\n\nUse focus stress to point at the word that matters, and let statements fall at the end.",
  keyPoints: ['Pitch changes meaning, not just mood.', 'Stress the word that carries new information.', 'Statements fall; open questions and lists rise.', 'A rise on a statement can sound unsure.'],
  example: { weak: "We'll launch on Monday? (rising, sounds like a question)", strong: "We'll launch on MONday. (falling, sounds decided)", why: "A falling ending turns a hope into a commitment." },
  useCase: { context: 'Decision meeting', scenario: 'You announce a decision, and you want it heard as decided, not up for debate.' },
  exercises: [
    { type: 'read', text: "I didn't say SHE took the files. / I didn't say she TOOK the files. / I didn't say she took the FILES. / I DIDN'T say she took the files.", focus: ['pauses', 'ending'], tip: 'Make the capitalised word higher and longer. Notice how the meaning shifts.' },
    { type: 'read', text: "The budget is approved. / The team is ready. / We start on Monday.", focus: ['ending', 'pace'], tip: 'Let each final word fall in pitch. No question marks in your voice.' },
    { type: 'speak', prompt: 'Make three firm announcements about a plan of yours. Land each with a falling end.', seconds: 30, focus: ['ending', 'hedges'], tip: 'Listen back: does any statement sound like a question?' }
  ],
  checklist: ['Could I hear meaning shift with stress?', 'Did statements end with a fall?', 'Did any statement sound like a question?'] },

{ id: 'L3-voice-2', level: 'L3', skill: 'voice', title: 'The Power Pause', minutes: 8,
  concept: "A deliberate pause before a key line is one of the most powerful tools in speaking. It builds anticipation, signals importance and gives you a moment to breathe.\n\nWhere to pause: before a key number, before your main point, after a question you ask the audience, and after an important line so it can sink in. Hold for two to three seconds — it will feel longer to you than to them.\n\nThe pause only works if you stay still and keep looking at the audience. A pause with eyes on the floor looks like you've lost your place.",
  keyPoints: ['Pause before key lines and numbers.', 'Pause after a line to let it sink in.', 'Hold 2–3 seconds — it feels longer to you.', 'Stay still and keep your gaze up during the pause.'],
  example: { weak: "And-our-growth-this-year-was-forty-percent-which-is-great-and-also...", strong: "And our growth this year... (pause) ...was forty percent. (pause)", why: "The pause makes the number the moment of the talk." },
  useCase: { context: 'Presentation', scenario: 'You are revealing the main result of a year\'s work to the whole company.' },
  exercises: [
    { type: 'read', text: "We asked one question. / (pause) / What would happen / if we stopped guessing? / (pause) / The answer / (pause) / changed everything.", focus: ['pauses', 'ending'], tip: 'Hold each (pause) for two full seconds. Stay still.' },
    { type: 'speak', prompt: 'Share one surprising fact you know. Pause for two seconds before the surprising part, and two seconds after.', seconds: 30, focus: ['pauses', 'ending'], tip: 'Count "one-thousand, two-thousand" silently.' }
  ],
  checklist: ['Did I hold at least one 2-second pause?', 'Did I stay still during it?', 'Did the key line feel more important?'] },

{ id: 'L3-stories-1', level: 'L3', skill: 'stories', title: 'The Story Arc', minutes: 10,
  concept: "Memorable stories share an arc: a character with a goal, a struggle, a turning point, and a change. Without struggle, a story is just a report.\n\nKeep the setup short. Spend your time in the struggle — that is where the listener leans in. Make the turning point a specific moment: a sentence someone said, a thing that broke, a choice made.\n\nFinally, let the change speak. Show what is different now. The best stories leave the moral mostly unstated, trusting the listener to infer it.",
  keyPoints: ['Character + goal + struggle + turning point + change.', 'Short setup, longer struggle.', 'The turning point is one specific moment.', 'Show the change; let listeners infer the moral.'],
  example: { weak: "I learned that persistence is important when I was training for a race.", strong: "At kilometre eighteen, my legs stopped. A stranger jogged beside me and said, 'Just to the next lamppost.' I ran lamppost to lamppost for three kilometres. I still use that trick for every hard project.", why: "A specific turning point makes the lesson felt, not told." },
  useCase: { context: 'Leadership talk', scenario: 'You are speaking to a new team and want to share why you value resilience without lecturing.' },
  exercises: [
    { type: 'build', instruction: 'Plan a 60-second story arc from your life.', fields: [{ label: 'Character & goal', placeholder: 'I wanted to...' }, { label: 'Struggle', placeholder: 'But...' }, { label: 'Turning point (one moment)', placeholder: 'Then one day...' }, { label: 'Change (show, don\'t tell)', placeholder: 'Now I...' }], speakPrompt: 'Tell your story without stating the moral directly.', seconds: 60 },
    { type: 'speak', prompt: 'Tell a 45-second story about a time something went wrong and turned out well. Do not say "the lesson is".', seconds: 45, focus: ['structure', 'pauses', 'ending'], tip: 'Pause just before the turning point.' }
  ],
  checklist: ['Was there a real struggle?', 'Was the turning point one specific moment?', 'Could a listener infer the lesson without me saying it?'] },

{ id: 'L3-stories-2', level: 'L3', skill: 'stories', title: 'Allegory: The Unstated Moral', minutes: 10,
  concept: "An allegory is a short invented story that carries a lesson about something else. The listener does the work of connecting the story to the real situation — and ideas people work out for themselves stick better.\n\nBuild one in four steps: name the lesson in private (do not say it aloud), invent a character in a simple world (a gardener, a ferry pilot, a baker), give them a struggle that mirrors the real one, and end at the moment of change.\n\nTest it: tell it to someone and ask what they think it means. If they guess your lesson, it works.",
  keyPoints: ['An allegory carries a lesson about something else.', 'Keep the lesson private while building.', 'Use a simple world and a single character.', 'Test by asking listeners what it means.'],
  example: { weak: "We should invest in maintenance even when things are working.", strong: "A ferry pilot oiled her engine every Sunday, even in calm months. Other pilots laughed. Then came the storm season. Hers was the only ferry still running.", why: "Listeners reach the lesson themselves and remember it." },
  useCase: { context: 'Team talk', scenario: 'You need to persuade a team to spend time on preventive work when nothing seems urgent.' },
  exercises: [
    { type: 'build', instruction: 'Write a 45-second allegory.', fields: [{ label: 'Private lesson (don\'t say this)', placeholder: 'Asking for help early saves time.' }, { label: 'Character & simple world', placeholder: 'A young baker in a busy village...' }, { label: 'Struggle that mirrors the lesson', placeholder: 'She tried to bake every order alone...' }, { label: 'Moment of change', placeholder: 'One morning...' }], speakPrompt: 'Tell the allegory. Do not state the lesson.', seconds: 45 },
    { type: 'speak', prompt: 'Tell a short allegory about patience, using a gardener or a fisher as the character.', seconds: 45, focus: ['structure', 'pauses', 'ending'], tip: 'End on the change. Let silence do the rest.' }
  ],
  checklist: ['Did I avoid stating the lesson?', 'Did the struggle mirror the real situation?', 'Would a listener guess the moral?'] },

{ id: 'L3-presence-1', level: 'L3', skill: 'presence', title: 'Handling Hard Questions', minutes: 10,
  concept: "Hostile or tough questions are tests of composure more than knowledge. The audience watches how you respond as much as what you say.\n\nUse a four-step response: Pause (one breath — never rush), Acknowledge (\"That's a fair concern\"), Answer briefly (one or two sentences), Bridge back to your main message. If the question contains a loaded word, don't repeat it; reframe it neutrally.\n\nIf you don't know, say so with authority: \"I don't have that number. I'll send it to you by tomorrow.\"",
  keyPoints: ['Pause before answering.', 'Acknowledge the concern without agreeing to the attack.', 'Answer in one or two sentences.', 'Bridge back to your key message.'],
  example: { weak: "Well, um, no, that's not, I mean, it's not really a waste, well, kind of, but...", strong: "(pause) That's a fair concern about cost. The project is 10% over budget, and here's why it still saves money by next year.", why: "The calm structure shows control and moves to your message." },
  useCase: { context: 'Town hall', scenario: 'An employee asks, "Why should we trust leadership after the last round of layoffs?"' },
  exercises: [
    { type: 'choice', question: 'Asked "Isn\'t this project a total waste of money?", what is the best first move?', options: ['Say "No, it\'s not a waste!"', 'Pause, then acknowledge the concern about cost.', 'Change the topic quickly.'], answer: 1, explain: 'Pausing and acknowledging shows composure and avoids repeating the loaded word.' },
    { type: 'speak', prompt: 'Respond to: "Honestly, why should anyone listen to you on this topic?" Use pause, acknowledge, answer, bridge.', seconds: 45, focus: ['opening', 'hedges', 'ending'], tip: 'Breathe first. Don\'t repeat the hostile words.' },
    { type: 'speak', prompt: 'Respond to a question you can\'t answer: "What will our sales be next year?" Admit the gap with authority and move forward.', seconds: 30, focus: ['hedges', 'ending'], tip: 'Say what you know, what you don\'t, and what you\'ll do.' }
  ],
  checklist: ['Did I pause before answering?', 'Did I avoid repeating loaded words?', 'Did I bridge back to my message?'] },

{ id: 'L3-presence-2', level: 'L3', skill: 'presence', title: 'Difficult Feedback with SBI', minutes: 10,
  concept: "Giving difficult feedback is where many people either soften until the message disappears, or get harsh. The SBI model keeps you clear and fair: Situation (when and where), Behaviour (what you observed, not your judgement), Impact (the effect it had).\n\nThen stop and ask for their view: \"What's your take?\" This turns feedback into a conversation.\n\nAvoid labels (\"You're careless\") and absolutes (\"You always...\"). Describe observable behaviour a camera could record.",
  keyPoints: ['Situation: when and where.', 'Behaviour: what a camera would see.', 'Impact: the effect on work or people.', 'Then ask for their view.'],
  example: { weak: "You're always so unprofessional in meetings.", strong: "In Tuesday's client call, you checked your phone while the client was speaking. The client asked me afterwards if we were interested. What's your take?", why: "Observable behaviour and clear impact are hard to argue with and easy to fix." },
  useCase: { context: 'Manager one-to-one', scenario: 'A team member has missed three deadlines and you need to raise it without damaging trust.' },
  exercises: [
    { type: 'rewrite', instruction: 'Rewrite this as SBI feedback.', original: "You never prepare for meetings and it's really annoying.", goal: 'concrete', hints: ['Pick one specific meeting.', 'What exactly did you observe?', 'What was the impact?'], model: "In Monday's planning meeting, you didn't have the numbers ready. We had to reschedule, which pushed the launch decision back a week. What happened?" },
    { type: 'speak', prompt: 'Give SBI feedback to a housemate or colleague who often leaves shared spaces messy. End with a question.', seconds: 45, focus: ['hedges', 'ending', 'structure'], tip: 'Calm, steady pace. No labels, no "always".' }
  ],
  checklist: ['Did I name a specific situation?', 'Did I describe behaviour, not character?', 'Did I state the impact and ask for their view?'] },

{ id: 'L3-listening-1', level: 'L3', skill: 'listening', title: 'Listen for Interests', minutes: 10,
  concept: "In negotiations, people state positions (\"I need a 20% discount\") but are driven by interests (\"My boss will reject anything over budget\"). Positions clash; interests often fit together.\n\nListen for the why behind the what. Ask: \"What makes that important to you?\", \"What would a good outcome look like for you?\", \"What are you worried about?\". Then label what you hear: \"It sounds like predictability matters more than price.\"\n\nOnce interests are on the table, you can propose options that meet both sides.",
  keyPoints: ['Positions are what people ask for.', 'Interests are why they ask.', 'Ask "What makes that important?"', 'Label the interest you hear, then propose options.'],
  example: { weak: "\"I need it by Friday.\" — \"That's impossible.\"", strong: "\"I need it by Friday.\" — \"What happens on Friday?\" — \"The board meets.\" — \"So if you had the key slides by Thursday and the rest next week, would that work?\"", why: "Discovering the interest opened an option both could accept." },
  useCase: { context: 'Negotiation', scenario: 'A client demands a lower price and you cannot simply agree.' },
  exercises: [
    { type: 'choice', question: 'Which question best uncovers an interest?', options: ['Is that your final offer?', 'What makes that deadline important for you?', 'Can you go higher?'], answer: 1, explain: 'It asks for the reason behind the position.' },
    { type: 'speak', prompt: 'A landlord says: "I\'m raising the rent by 15% next month." Ask two interest questions and label what you might hear.', seconds: 45, focus: ['fillers', 'ending'], tip: 'Curious tone, not accusing. Use "what" questions.' }
  ],
  checklist: ['Did I ask about the why, not just the what?', 'Did I label an interest?', 'Did I stay curious instead of defensive?'] },

{ id: 'L3-listening-2', level: 'L3', skill: 'listening', title: 'Disagree Without Damage', minutes: 9,
  concept: "Disagreeing well is a listening skill. Before you share your view, show that you understood theirs — well enough that they would agree with your summary.\n\nThen use \"and\" rather than \"but\" where you can: \"You want speed, and I'm worried about quality.\" \"But\" erases what came before; \"and\" keeps both views on the table.\n\nFinally, separate the idea from the person. Disagree with the plan, not with the person who proposed it.",
  keyPoints: ['Summarise their view before giving yours.', 'Prefer "and" to "but".', 'Disagree with the idea, not the person.', 'Look for the part you agree with first.'],
  example: { weak: "No, that's wrong. That won't work.", strong: "So you're proposing we launch in all cities at once to beat competitors. I agree speed matters, and I'm worried we can't support that many customers. Could we start with three cities?", why: "Their view is respected, the concern is clear and an option is offered." },
  useCase: { context: 'Team meeting', scenario: 'A senior colleague proposes a plan you think is risky.' },
  exercises: [
    { type: 'rewrite', instruction: 'Rewrite to disagree respectfully: summarise, use "and", offer an option.', original: "That's a bad idea, we tried that already and it failed.", goal: 'formal', hints: ['Start by summarising their idea.', 'Mention the past attempt as information, not attack.'], model: "So the idea is to bring back the weekly newsletter. I like the goal of staying in touch, and when we tried it in 2022, open rates were low. Could we test a monthly version first?" },
    { type: 'speak', prompt: 'Someone says: "Social media does more harm than good." Respectfully disagree (or agree with a nuance), summarising their view first.', seconds: 60, focus: ['structure', 'hedges', 'fillers'], tip: 'Start with "So you\'re saying..."' }
  ],
  checklist: ['Did I summarise their view fairly?', 'Did I use "and" instead of "but"?', 'Did I offer a constructive option?'] },

/* ======================= L4 MASTERFUL ======================= */
{ id: 'L4-clarity-1', level: 'L4', skill: 'clarity', title: 'Answer First: The Pyramid', minutes: 11,
  concept: "Senior audiences want the answer first. The pyramid principle structures your message top-down: the governing thought (your answer or recommendation) at the top, three or so supporting arguments below it, and evidence beneath each.\n\nSpoken, it sounds like: \"We should enter the Pune market in Q2. Three reasons: demand, cost, and timing. First, demand...\" If they interrupt after the first sentence, they already have what they need.\n\nTest your pyramid: does each support answer \"Why?\" about the top? Do the supports overlap? Is anything missing?",
  keyPoints: ['Lead with the governing thought.', 'Group support into about three reasons.', 'Each reason answers "Why?" about the top.', 'If interrupted, they should already have the answer.'],
  example: { weak: "So we looked at a lot of data, and there were some trends, and after analysing the competitors and costs, we think possibly we could look at Pune.", strong: "We should open in Pune in Q2. Three reasons: demand is up 30%, rent is 20% lower than Mumbai, and our main competitor is leaving. Let me take each briefly.", why: "The decision and its logic are visible in the first 15 seconds." },
  useCase: { context: 'Board meeting', scenario: 'You have four minutes with leadership and they may cut you off after one.' },
  exercises: [
    { type: 'build', instruction: 'Build a spoken pyramid for a recommendation of your choice.', fields: [{ label: 'Governing thought (answer)', placeholder: 'We should...' }, { label: 'Reason 1 + evidence', placeholder: 'First, ... because ...' }, { label: 'Reason 2 + evidence', placeholder: 'Second, ...' }, { label: 'Reason 3 + evidence', placeholder: 'Third, ...' }], speakPrompt: 'Deliver it in under 60 seconds, answer first.', seconds: 60 },
    { type: 'speak', prompt: 'In 45 seconds, recommend whether a young professional should rent or buy a home in your city. Answer first.', seconds: 45, focus: ['opening', 'structure', 'ending'], tip: 'Your first sentence is the recommendation. Nothing before it.' }
  ],
  checklist: ['Was the answer my first sentence?', 'Did I give about three distinct reasons?', 'Would an interruption after sentence one still leave them informed?'] },

{ id: 'L4-clarity-2', level: 'L4', skill: 'clarity', title: 'Impromptu: Think in 3 Seconds', minutes: 10,
  concept: "Impromptu speaking — being asked to \"say a few words\" with no warning — tests whether you can structure in real time. The secret is to have structures ready before you need them.\n\nKeep three in your pocket: PREP for opinions; Past-Present-Future for updates and toasts (\"Where we were, where we are, where we're going\"); and What-So What-Now What for any event or data (what happened, why it matters, what we do next).\n\nBuy thinking time honestly: repeat the question, or take a breath and say \"Let me give you the short version.\" Then pick a structure and commit.",
  keyPoints: ['Keep three structures ready.', 'PREP for opinions.', 'Past-Present-Future for updates and toasts.', 'What-So What-Now What for events and data.'],
  example: { weak: "Oh, um, wow, okay, I wasn't expecting... so, um, the team is great, and, yeah, thanks.", strong: "A year ago we were four people with one idea. Today we're twelve, with real customers. Next year, I want us to be the name people recommend. Thank you, all of you.", why: "Past-Present-Future turned a surprise into a polished moment." },
  useCase: { context: 'Celebration', scenario: 'At a team dinner, your manager says, "Why don\'t you say a few words?"' },
  exercises: [
    { type: 'choice', question: 'Your boss asks, "What happened with yesterday\'s outage?" Which structure fits best?', options: ['PREP', 'Past-Present-Future', 'What-So What-Now What'], answer: 2, explain: 'It explains the event, why it matters and the next steps.' },
    { type: 'speak', prompt: 'Impromptu: give a 45-second toast for a friend\'s new job. Choose a structure in 3 seconds and go.', seconds: 45, focus: ['opening', 'structure', 'fillers', 'ending'], tip: 'Breath, structure, first line. Don\'t plan the whole thing.' },
    { type: 'speak', prompt: 'Impromptu: "What should every city do to improve life for residents?"', seconds: 60, focus: ['structure', 'fillers', 'hedges'], tip: 'PREP works well for opinion questions.' }
  ],
  checklist: ['Did I pick a structure within a few seconds?', 'Did my first line sound deliberate?', 'Did I end cleanly instead of trailing off?'] },

{ id: 'L4-words-1', level: 'L4', skill: 'words', title: 'Rhetoric Used Honestly', minutes: 11,
  concept: "Rhetorical devices make ideas memorable. Three are especially useful in speech. The tricolon groups ideas in threes (\"Faster, simpler, cheaper\"). Antithesis puts opposites side by side (\"We don't need more data; we need better questions\"). The callback returns to an earlier image or phrase at the end to create closure.\n\nUse them to clarify, not to manipulate. A device that makes a weak argument sound strong is a trick; a device that makes a true argument easier to remember is a gift.\n\nOne or two devices per talk is plenty. Overuse sounds like a performance.",
  keyPoints: ['Tricolon: three parallel items.', 'Antithesis: two opposites side by side.', 'Callback: return to an opening image at the end.', 'Use devices to clarify truth, not to disguise weakness.'],
  example: { weak: "Our product is better than others in a lot of ways, like price and also speed, and it's easy too.", strong: "Our product is faster, simpler and cheaper. It doesn't ask you to change how you work; it changes how much work you do.", why: "The tricolon and antithesis make true claims easy to remember." },
  useCase: { context: 'Keynote or pitch', scenario: 'You want your closing line to be repeated after the meeting.' },
  exercises: [
    { type: 'build', instruction: 'Craft devices for a message you care about.', fields: [{ label: 'Tricolon (three parallel words or phrases)', placeholder: 'Learn it, practise it, own it.' }, { label: 'Antithesis (not X; Y)', placeholder: 'Confidence isn\'t the absence of fear; it\'s ...' }, { label: 'Opening image for a callback', placeholder: 'A blank page...' }], speakPrompt: 'Give a 60-second mini-talk using all three, with the callback at the end.', seconds: 60 },
    { type: 'choice', question: 'Which line is an antithesis?', options: ['Plan, build, ship.', 'Ask not what is easy, but what is right.', 'We had a great year.'], answer: 1, explain: 'It contrasts two opposites (easy / right) in parallel form.' },
    { type: 'speak', prompt: 'Close a talk about your team\'s year with a tricolon, then stop.', seconds: 30, focus: ['ending', 'pauses'], tip: 'Pause before the three items, and fall in pitch on the last one.' }
  ],
  checklist: ['Did my devices clarify a true point?', 'Did I use no more than two or three devices?', 'Did my tricolon have a falling final item?'] },

{ id: 'L4-words-2', level: 'L4', skill: 'words', title: 'Concrete Language, Abstract Audience', minutes: 10,
  concept: "At senior levels, language drifts into abstraction: \"alignment\", \"synergies\", \"value creation\", \"strategic enablement\". These words feel professional but leave listeners with no picture.\n\nThe master move is translating abstractions into concrete images without losing seniority. \"Drive operational efficiency\" becomes \"Close the books in three days instead of ten.\" \"Improve customer experience\" becomes \"No customer waits more than two minutes on hold.\"\n\nA useful test: could someone draw it or measure it? If not, make it more concrete.",
  keyPoints: ['Jargon creates no picture.', 'Translate goals into something visible or measurable.', 'Concrete does not mean simple-minded.', 'Test: could someone draw it or measure it?'],
  example: { weak: "We will leverage cross-functional synergies to drive value creation across the customer journey.", strong: "Sales and support will share one inbox, so no customer has to explain their problem twice.", why: "The listener can picture exactly what will change." },
  useCase: { context: 'Strategy presentation', scenario: 'You are presenting a strategy to frontline staff who distrust corporate language.' },
  exercises: [
    { type: 'rewrite', instruction: 'Translate this jargon into a concrete, measurable statement.', original: "Our goal is to optimise stakeholder engagement and enhance organisational agility.", goal: 'concrete', hints: ['Who are the stakeholders?', 'What would agility look like on a Tuesday?'], model: 'Our goal: every team gets an answer from leadership within 48 hours, and we can change a plan in one meeting, not three.' },
    { type: 'speak', prompt: 'Describe your organisation\'s or school\'s goal for this year in concrete, measurable terms. No jargon.', seconds: 45, focus: ['repetition', 'sentenceLength'], tip: 'Use numbers, times, places and people.' }
  ],
  checklist: ['Did I avoid jargon?', 'Could a listener measure or picture my goal?', 'Did I still sound senior and serious?'] },

{ id: 'L4-grammar-1', level: 'L4', skill: 'grammar', title: 'Parallel Structure and Cadence', minutes: 10,
  concept: "Parallel structure means expressing related ideas in the same grammatical form: \"We listen, we learn, we lead\" rather than \"We listen, learning is important, and leading too.\" Parallel sentences are easier to follow and naturally rhythmic.\n\nAt the master level, use parallelism to build cadence — a rising rhythm that carries the audience toward your key line. Repeat a sentence opening (\"We will... We will... We will...\") and change the last one slightly for emphasis.\n\nCheck your lists: do all items start with the same part of speech?",
  keyPoints: ['Same idea type, same grammar form.', 'Parallel lists are easier to remember.', 'Repeated openings build cadence.', 'Break the pattern on purpose for the final line.'],
  example: { weak: "Our plan is to hire more people, the office will be bigger, and also customer service improvements.", strong: "Our plan is to hire more people, open a bigger office and answer every customer within an hour.", why: "Three verb phrases in parallel make the plan crisp." },
  useCase: { context: 'Leadership speech', scenario: 'You are closing an all-hands meeting and want a strong, rhythmic finish.' },
  exercises: [
    { type: 'rewrite', instruction: 'Make the list parallel.', original: "In this role you will manage the budget, client relationships, and you need to be reporting to the director.", goal: 'shorter', hints: ['Start each item with a verb.'], model: 'In this role you will manage the budget, build client relationships and report to the director.' },
    { type: 'read', text: "We came here to build something useful. / We stayed because the work mattered. / We will grow because our customers trust us. / And we will keep that trust — / one honest conversation at a time.", focus: ['pauses', 'ending', 'pace'], tip: 'Let the repeated "We" build. Slow down for the last line.' },
    { type: 'speak', prompt: 'Give a 30-second closing for any project using a repeated sentence opening three times, then a different final line.', seconds: 30, focus: ['ending', 'pauses'], tip: 'Pause before the final line.' }
  ],
  checklist: ['Were my list items grammatically parallel?', 'Did the repeated opening build rhythm?', 'Did my final line break the pattern for emphasis?'] },

{ id: 'L4-grammar-2', level: 'L4', skill: 'grammar', title: 'Precise Qualifiers and Conditionals', minutes: 10,
  concept: "At high levels, credibility depends on saying exactly how sure you are. Overclaiming damages trust; underclaiming wastes authority.\n\nUse calibrated qualifiers deliberately: \"will\" (certain), \"is likely to\" (probable), \"could\" (possible), \"is unlikely to\" (improbable). Attach evidence: \"Sales are likely to rise, based on three months of pre-orders.\"\n\nUse conditionals to show clear thinking about risk: \"If the supplier delays, we will switch to plan B by the 15th.\" This sounds confident precisely because it admits uncertainty.",
  keyPoints: ['Match your words to your real certainty.', 'will > likely > could > unlikely.', 'Attach evidence to your qualifier.', 'Conditionals show you have planned for risk.'],
  example: { weak: "The project will definitely be totally fine, there's no way it fails.", strong: "The project is likely to finish on time; we're 80% done. If testing finds major bugs, we'll move the launch by one week, not more.", why: "Calibrated language with a contingency plan builds more trust than false certainty." },
  useCase: { context: 'Investor or client update', scenario: 'You are asked, "Will you hit the target?" and the honest answer is "probably".' },
  exercises: [
    { type: 'choice', question: 'You have strong but incomplete evidence. Which wording fits?', options: ['This will definitely work.', 'This is likely to work, based on the pilot.', 'This maybe sort of might work.'], answer: 1, explain: 'It states probability and gives the evidence.' },
    { type: 'rewrite', instruction: 'Rewrite with a calibrated qualifier, evidence and a conditional plan.', original: "We'll totally hit our targets, no problem.", goal: 'formal', hints: ['How sure are you, really?', 'What would make you miss? What would you do?'], model: "We're likely to hit our targets: we're at 85% with a month to go. If the last big order slips, we'll still be within 5%." },
    { type: 'speak', prompt: 'Forecast the weather, traffic or a sports result for tomorrow using calibrated language and one conditional.', seconds: 40, focus: ['hedges', 'ending'], tip: 'One qualifier, clearly placed. Then commit.' }
  ],
  checklist: ['Did my certainty words match my evidence?', 'Did I include a conditional?', 'Did I avoid both overclaiming and vague hedging?'] },

{ id: 'L4-voice-1', level: 'L4', skill: 'voice', title: 'Fill a Large Room', minutes: 11,
  concept: "In a large room, your voice must carry without shouting. Projection comes from breath support and resonance, not from the throat. Breathe low, keep the throat relaxed and imagine speaking to the back row.\n\nUse vocal variety: change pace, pitch and volume to signal structure and emotion. Slow down and drop lower for serious points. Speed up slightly and lift for energy. Get quieter — not louder — for an intimate moment; the room will lean in.\n\nArticulation matters more in big spaces. Consonants carry meaning; give them a little more energy than in conversation.",
  keyPoints: ['Project from breath, not the throat.', 'Speak to the back row.', 'Vary pace, pitch and volume deliberately.', 'Give consonants extra energy in big spaces.'],
  example: { weak: "(flat, same speed, same volume) Thank you all for coming today we have a lot to cover so let's start.", strong: "(warm, lifted) Thank you all for coming. (slower, lower) Today matters. (pause) Here's why.", why: "Variation signals importance and holds attention." },
  useCase: { context: 'Conference', scenario: 'You are speaking in a hall of 300 people and the microphone fails.' },
  exercises: [
    { type: 'read', text: "GOOD evening, everyone. / (louder, to the back row) Can you hear me at the back? / (slower, lower) Tonight / is about one simple idea. / (quieter) And it starts / with a single conversation.", focus: ['pace', 'pauses', 'ending'], tip: 'Breathe low before each line. Change volume and pace as marked.' },
    { type: 'speak', prompt: 'Open an event for 200 people. Use at least one change of pace, one change of pitch and one quiet moment.', seconds: 45, focus: ['pace', 'pauses', 'opening'], tip: 'Stand up. Imagine the back wall. Breathe low.' }
  ],
  checklist: ['Did I project without straining my throat?', 'Did I vary pace, pitch and volume?', 'Were my consonants crisp?'] },

{ id: 'L4-voice-2', level: 'L4', skill: 'voice', title: 'Pitch Range and Emphasis Under Pressure', minutes: 10,
  concept: "Under pressure, pitch range shrinks. Voices go flat or rise to the top of their range. A master speaker keeps a full, comfortable range even when stakes are high.\n\nWarm up your range before high-stakes moments: glide from low to high on a hum, then speak a line using your full range. Use your natural low range for authority — but do not force your voice lower than is comfortable.\n\nPractise emphasis by contrast: say your key line once neutrally, then once with deliberate pitch movement and a pause. Choose the version that sounds like you at your best.",
  keyPoints: ['Pressure narrows pitch range.', 'Warm up with glides and hums.', 'Use your natural low range for weighty points; never strain.', 'Emphasis = pitch movement + pause.'],
  example: { weak: "(flat, monotone) This is the most important decision we will make this year.", strong: "This is the most IMPORTANT decision (pause) we will make (lower, slower) this year.", why: "Pitch movement and pause signal importance without shouting." },
  useCase: { context: 'High-stakes pitch', scenario: 'You are delivering the final line of a funding pitch and your voice tends to go flat when nervous.' },
  exercises: [
    { type: 'read', text: "Hmm (glide low to high). / Hmm (glide high to low). / We've done the hard part. / (wider range) We've done the HARD part. / Now / (lower, slower) let's finish it.", focus: ['pauses', 'ending'], tip: 'Notice how much more alive the second version sounds.' },
    { type: 'speak', prompt: 'Deliver the closing line of a pitch for something you believe in. Say it twice: first flat, then with full range and a pause.', seconds: 30, focus: ['pauses', 'ending'], tip: 'Record both and compare them.' }
  ],
  checklist: ['Did I warm up my range first?', 'Could I hear a clear difference between the two versions?', 'Did my voice stay comfortable, not strained?'] },

{ id: 'L4-stories-1', level: 'L4', skill: 'stories', title: 'The Keynote Story', minutes: 12,
  concept: "A keynote story is not a decoration; it is the spine of the talk. The best talks open with a story, pause it at the moment of tension, deliver the ideas, then return to finish the story at the end. This is the open loop: an unfinished story keeps attention.\n\nUse sensory detail sparingly but precisely: one sound, one image, one line of dialogue. Dialogue is especially powerful — it puts the listener in the room.\n\nEnd by connecting the story's resolution to your audience's next action. The story becomes their story.",
  keyPoints: ['Open with a story; pause it at the tension.', 'Close the loop at the end of the talk.', 'Use one image, one sound, one line of dialogue.', 'Connect the resolution to the audience\'s action.'],
  example: { weak: "Today I want to talk about why feedback matters in organisations.", strong: "\"Can I tell you something you won't like?\" My first manager said that on my third day. I'll tell you what she said later. First, why most of us never hear it.", why: "The open loop creates suspense the whole talk can ride on." },
  useCase: { context: 'Conference keynote', scenario: 'You have 15 minutes to persuade an audience to change a habit, and they have heard many talks today.' },
  exercises: [
    { type: 'build', instruction: 'Design an open-loop keynote opening and closing.', fields: [{ label: 'Opening story up to the tension', placeholder: 'It was 2 a.m. when the phone rang...' }, { label: 'The line where you pause the story', placeholder: 'I\'ll tell you what she said later.' }, { label: 'Your core idea (one sentence)', placeholder: 'Today: why...' }, { label: 'Story resolution + audience action', placeholder: 'What she said was... So this week, ...' }], speakPrompt: 'Deliver the opening, one sentence of core idea, then the close.', seconds: 90 },
    { type: 'speak', prompt: 'Open a talk with a 30-second story that stops at the moment of tension. Include one line of dialogue.', seconds: 40, focus: ['opening', 'pauses', 'structure'], tip: 'Your first words should place us in a moment, not introduce yourself.' }
  ],
  checklist: ['Did my story stop at a moment of tension?', 'Did I include one vivid detail and a line of dialogue?', 'Did the resolution connect to an audience action?'] },

{ id: 'L4-stories-2', level: 'L4', skill: 'stories', title: 'Audience Switch', minutes: 10,
  concept: "Mastery is explaining the same idea to very different audiences without losing truth. A child needs a picture. A CEO needs the decision and its cost. A sceptic needs evidence and acknowledgement of the downside.\n\nBefore you speak, ask three questions: What do they already know? What do they care about? What will make them doubt me? Then choose your example, analogy and vocabulary to match.\n\nKeep the core message identical. Only the path to it changes.",
  keyPoints: ['Same core message, different path.', 'Child: a picture. CEO: decision and cost. Sceptic: evidence and downside.', 'Ask: what do they know, care about, doubt?', 'Choose examples for the audience, not for yourself.'],
  example: { weak: "(to a CEO) So the algorithm uses gradient-boosted trees with feature engineering on the transaction data...", strong: "(to a CEO) This model catches 30% more fraud and saves about ₹2 crore a year. It needs two engineers for three months.", why: "The CEO hears what they decide on: value and cost." },
  useCase: { context: 'Cross-functional work', scenario: 'You must explain a delay to a client, your team and your own boss on the same afternoon.' },
  exercises: [
    { type: 'build', instruction: 'Explain "why sleep matters" to three audiences.', fields: [{ label: 'To a 7-year-old', placeholder: 'Your brain is like a phone that needs charging...' }, { label: 'To a busy CEO', placeholder: 'Tired teams make costly mistakes...' }, { label: 'To a sceptic who says "I\'m fine on 5 hours"', placeholder: 'You may feel fine, and studies show...' }], speakPrompt: 'Say all three versions, pausing between them.', seconds: 90 },
    { type: 'speak', prompt: 'Explain what you do for work or study to a child, then to a CEO, then to a sceptic. 20 seconds each.', seconds: 75, focus: ['structure', 'pauses'], tip: 'Change vocabulary, pace and example — keep the core idea the same.' }
  ],
  checklist: ['Was the core message the same each time?', 'Did vocabulary and examples change for each audience?', 'Did I address the sceptic\'s doubt directly?'] },

{ id: 'L4-presence-1', level: 'L4', skill: 'presence', title: 'Own the Room Under Pressure', minutes: 11,
  concept: "Owning the room is not dominance. It is being so settled that others feel safe following you. Under pressure, it shows in a few observable behaviours: you speak at a steady pace, you hold pauses, you finish sentences, and you recover from mistakes without drama.\n\nRecovery is the master skill. Interrupted? \"Let me finish this point, then I'd love your view.\" Mind goes blank? Say \"Let me come back to the key point\" and restate your last line. A joke falls flat? Smile, move on, never explain it.\n\nRehearse recoveries in advance. Composure is practised, not born.",
  keyPoints: ['Steady pace, held pauses, finished sentences.', 'Reclaim the floor politely: "Let me finish this point."', 'Blank? Restate your last line and continue.', 'Rehearse recoveries in advance.'],
  example: { weak: "(interrupted) Oh, sorry, yeah, go ahead, sorry...", strong: "(calm, steady) I'll take that in a moment — let me finish this point first. (continues)", why: "A polite, firm reclaim keeps authority without hostility." },
  useCase: { context: 'Senior meeting', scenario: 'A senior executive interrupts you twice in your first minute of presenting.' },
  exercises: [
    { type: 'speak', prompt: 'Practise an interruption recovery: start explaining any plan; after a few seconds, imagine an interruption, then reclaim the floor and finish.', seconds: 45, focus: ['apology', 'hedges', 'ending'], tip: 'No "sorry". Calm and warm: "Let me finish this, then I\'d love your view."' },
    { type: 'speak', prompt: 'Blank recovery: start talking about your favourite place. Midway, stop for 3 seconds, then say "Let me come back to the key point" and finish.', seconds: 45, focus: ['pauses', 'ending'], tip: 'The pause is not a failure. Breathe and restate.' }
  ],
  checklist: ['Did I avoid apologising for being interrupted?', 'Did I recover from the blank calmly?', 'Did I finish my point?'] },

{ id: 'L4-presence-2', level: 'L4', skill: 'presence', title: 'Speaking for Change', minutes: 11,
  concept: "The highest stakes speaking asks people to change: a new direction, a hard truth, a sacrifice. People resist change when they feel unseen, unsafe or unsure what to do.\n\nA change talk addresses all three. Acknowledge what is being lost (\"I know this means giving up something we've built\"). Make the future concrete (\"In six months, a typical Monday looks like this...\"). Give a first step that is small and specific (\"This week, each team picks one process to test\").\n\nDeliver it with calm conviction: slower pace, falling endings, eye contact, and no hedging on the decision itself — while staying open on how to implement it.",
  keyPoints: ['Acknowledge what people are losing.', 'Paint a concrete picture of the future.', 'Give one small, specific first step.', 'Firm on the decision, open on the how.'],
  example: { weak: "So, um, there might be some changes coming, and I think we'll maybe restructure a bit, hopefully it's fine.", strong: "We are merging the two teams in March. I know that means losing a way of working many of you built. Here's what a week will look like after the change, and here's the one thing I need from each of you this week.", why: "It is honest about loss, clear about the future and specific about the next step." },
  useCase: { context: 'Leadership announcement', scenario: 'You must tell your team that a popular project is being cancelled.' },
  exercises: [
    { type: 'build', instruction: 'Plan a 90-second change talk.', fields: [{ label: 'The decision (one sentence)', placeholder: 'From next month, we will...' }, { label: 'What is being lost (acknowledge)', placeholder: 'I know this means...' }, { label: 'The concrete future', placeholder: 'In six months...' }, { label: 'The first small step', placeholder: 'This week, I\'m asking you to...' }], speakPrompt: 'Deliver your change talk with calm conviction.', seconds: 90 },
    { type: 'speak', prompt: 'Announce a hard change to a group (real or imagined). Acknowledge the loss, describe the future and give one first step.', seconds: 90, focus: ['hedges', 'ending', 'pace', 'structure'], tip: 'Slow down. No hedges on the decision itself.' }
  ],
  checklist: ['Did I acknowledge the loss honestly?', 'Was the future concrete?', 'Was my first step small and specific?', 'Did I avoid hedging on the decision?'] },

{ id: 'L4-listening-1', level: 'L4', skill: 'listening', title: 'Facilitate the Room', minutes: 11,
  concept: "Facilitating means helping a group think together. The facilitator speaks less but shapes more: setting a clear purpose, drawing in quiet voices, managing dominant ones and summarising progress.\n\nUseful moves: \"Let's hear from someone who hasn't spoken yet.\" \"Let me pause you there — I want to capture that and hear from others.\" \"Here's what I think we've agreed so far... Did I miss anything?\"\n\nClose every discussion with decisions, owners and dates. A meeting without those was just a conversation.",
  keyPoints: ['Open with a clear purpose and outcome.', 'Invite quiet voices by name or by role.', 'Pause dominant voices respectfully.', 'Close with decisions, owners and dates.'],
  example: { weak: "So... does anyone have anything? No? Okay, um, I guess we're done then.", strong: "We have ten minutes left. Here's what we've agreed: Asha owns the budget draft by Friday; Leo books the venue by Tuesday. Anything I've missed?", why: "A clear summary turns discussion into action." },
  useCase: { context: 'Workshop', scenario: 'You are running a planning meeting where two people dominate and three never speak.' },
  exercises: [
    { type: 'choice', question: 'One person keeps talking over others. Best facilitation move?', options: ['Ignore it and hope it stops.', '"Let me pause you there — great point — I\'d like to hear from Meera on this."', '"Please stop interrupting everyone."'], answer: 1, explain: 'It acknowledges the person, pauses them respectfully and redirects.' },
    { type: 'speak', prompt: 'Open a 30-minute team meeting: state the purpose, the desired outcome, and how you will make sure everyone is heard.', seconds: 45, focus: ['opening', 'structure', 'fillers'], tip: 'Purpose in your first sentence.' },
    { type: 'speak', prompt: 'Close the same meeting: summarise two decisions with owners and dates, and ask what you missed.', seconds: 40, focus: ['structure', 'ending'], tip: 'Names, actions, dates.' }
  ],
  checklist: ['Did I state a purpose and an outcome?', 'Did I plan how to include quiet voices?', 'Did my close include owners and dates?'] },

{ id: 'L4-listening-2', level: 'L4', skill: 'listening', title: 'De-escalating Conflict', minutes: 12,
  concept: "When emotions run high, people cannot hear arguments. De-escalation comes first; problem-solving second.\n\nThe sequence: lower your own pace and volume (people unconsciously match you); label the emotion without judging it (\"It sounds like you feel let down\"); find a point of agreement (\"We both want this to work\"); then move to a shared next step.\n\nAvoid \"Calm down\", \"You're overreacting\" or \"With respect...\". They escalate. And if the situation becomes unsafe, it is not a communication failure to step away and seek help.",
  keyPoints: ['Lower your own pace and volume first.', 'Label the emotion without judging it.', 'Find one point of agreement.', 'Never say "calm down"; step away if unsafe.'],
  example: { weak: "Calm down, you're overreacting. Let me explain why you're wrong.", strong: "(slower, quieter) It sounds like you're really frustrated, and that makes sense — you were promised this last week. We both want it fixed. Here's what I can do today.", why: "Labelling and agreement lower the temperature before solving." },
  useCase: { context: 'Customer escalation', scenario: 'An angry customer is shouting at the front desk about a cancelled booking.' },
  exercises: [
    { type: 'choice', question: 'Which phrase is most likely to de-escalate?', options: ['Calm down, please.', 'You\'re overreacting.', 'It sounds like this has been really frustrating.'], answer: 2, explain: 'Labelling the emotion without judgement helps people feel heard.' },
    { type: 'speak', prompt: 'Respond to: "This is the third time your team has messed up my order! I\'m done with you people!" De-escalate, find agreement and offer a next step.', seconds: 60, focus: ['pace', 'hedges', 'structure'], tip: 'Slower and quieter than normal. Label, agree, act.' }
  ],
  checklist: ['Did I slow my pace and soften my volume?', 'Did I label the emotion without judging?', 'Did I find a point of agreement before solving?'] }
];

RC.paths = [
  { id: 'clear-speaker', name: 'Clear Speaker', goal: 'Be understood the first time, every time.',
    description: 'Focus on clear points, plain words, steady pace, word stress and clean sentences. Ideal if you often hear "Sorry, can you repeat that?"',
    weeks: [
      { week: 1, focus: 'One point, plain words, slower pace', lessonIds: ['L1-clarity-1', 'L1-words-1', 'L1-voice-1', 'L1-grammar-1'] },
      { week: 2, focus: 'Clear sounds and crutch-free speech', lessonIds: ['L1-voice-2', 'L1-words-2', 'L1-grammar-2', 'L1-clarity-2'] },
      { week: 3, focus: 'Stress, thought groups and steady tenses', lessonIds: ['L2-voice-1', 'L2-voice-2', 'L2-grammar-1', 'L2-grammar-2', 'L2-clarity-1'] },
      { week: 4, focus: 'Front-loading and intonation for meaning', lessonIds: ['L3-grammar-1', 'L3-voice-1', 'L3-words-1', 'L3-clarity-2'] }
    ] },
  { id: 'confident-professional', name: 'Confident Professional', goal: 'Sound decided, calm and credible at work.',
    description: 'Openings without apology, fewer hedges, firm endings, persuasion, tough questions and difficult feedback.',
    weeks: [
      { week: 1, focus: 'Breath, endings and plain language', lessonIds: ['L1-presence-1', 'L1-presence-2', 'L1-clarity-1', 'L1-words-1'] },
      { week: 2, focus: 'Openings, hedges and register', lessonIds: ['L2-presence-1', 'L2-presence-2', 'L2-words-1', 'L2-clarity-1', 'L2-listening-1'] },
      { week: 3, focus: 'Persuasion and active language', lessonIds: ['L3-clarity-1', 'L3-words-2', 'L3-voice-2', 'L3-listening-2'] },
      { week: 4, focus: 'Pressure: hard questions, feedback, answer-first', lessonIds: ['L3-presence-1', 'L3-presence-2', 'L4-clarity-1', 'L4-presence-1'] }
    ] },
  { id: 'interview-ready', name: 'Interview Ready', goal: 'Walk into any interview with stories ready and a steady voice.',
    description: 'STAR stories, concrete examples, strong verbs, steady tenses, calm handling of hard questions and impromptu answers.',
    weeks: [
      { week: 1, focus: 'Clear points and real examples', lessonIds: ['L1-clarity-1', 'L1-stories-1', 'L1-words-2', 'L1-presence-1'] },
      { week: 2, focus: 'PREP, STAR and steady tenses', lessonIds: ['L2-clarity-1', 'L2-clarity-2', 'L2-grammar-1', 'L2-presence-1'] },
      { week: 3, focus: 'Evidence, ownership and precision', lessonIds: ['L2-stories-2', 'L3-words-2', 'L3-words-1', 'L3-grammar-1'] },
      { week: 4, focus: 'Tough questions and thinking on your feet', lessonIds: ['L3-presence-1', 'L4-clarity-2', 'L4-grammar-2', 'L4-presence-1'] }
    ] },
  { id: 'storyteller', name: 'Storyteller', goal: 'Turn ideas into examples, analogies and stories people remember.',
    description: 'From a single example to tiny stories, analogies, the example ladder, story arcs, allegories, rhetoric and keynote stories.',
    weeks: [
      { week: 1, focus: 'Examples and tiny stories', lessonIds: ['L1-stories-1', 'L1-stories-2', 'L1-clarity-2', 'L1-presence-2'] },
      { week: 2, focus: 'Analogies and the example ladder', lessonIds: ['L2-stories-1', 'L2-stories-2', 'L2-voice-2', 'L2-listening-2'] },
      { week: 3, focus: 'Story arcs, allegory and the power pause', lessonIds: ['L3-stories-1', 'L3-stories-2', 'L3-voice-2', 'L3-grammar-2'] },
      { week: 4, focus: 'Keynote stories, rhetoric and audience switch', lessonIds: ['L4-stories-1', 'L4-stories-2', 'L4-words-1', 'L4-grammar-1'] }
    ] }
];
