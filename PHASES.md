# Spanish App — Development Roadmap (Phases 8–13)

## Current State (Phases 1–7 complete)

| Area | Status |
|---|---|
| Units & lessons | 4 units · 13 lessons · 86 words |
| Question types | Multiple choice · Typing · Listening · Speaking |
| Screens | Home · Lesson · Results · Review · Progress · Settings · Conversation · Onboarding |
| Database | SQLite: `user_progress`, `completed_lessons`, `lesson_history`, `weak_words` |
| Key features | XP · Streak · Daily goal · Notifications · TTS audio · Speech recognition · AI conversation (Groq) · Weak-word review · Developer mode |

---

## Phase 8 — Stats & Analytics (Progress Screen Upgrade)

**Goal:** Turn the existing placeholder Progress screen into a genuinely informative dashboard using data that is already being collected.

### Features

- **Streak calendar** — last 30 days shown as a grid of filled/empty circles (green = practiced, grey = missed). Uses `lesson_history` dates.
- **XP-per-day bar chart** — last 7 days of XP earned, drawn with React Native `Animated` + `View` bars (no third-party chart library needed).
- **Summary stat cards** — total XP · current streak · longest streak ever · lessons completed / total lessons · words introduced.
- **Accuracy rate** — calculated from `lesson_history` scores (average score across all completed lessons).
- **Weak words count** — live count from `weak_words` table with a shortcut button to start a Review session.

### Files

| Action | File |
|---|---|
| Rewrite | `src/screens/ProgressScreen.tsx` |
| Extend | `src/database/db.ts` — add `getLongestStreak()`, `getXPHistory(days)` |
| Extend | `src/database/schema.ts` — add `ALTER TABLE` migration to store `longest_streak` in `user_progress` |

### Notes
- No new npm packages needed.
- `getLongestStreak()` scans `lesson_history` dates to compute the max consecutive-day run.
- `getXPHistory(7)` returns `{ date, xp }[]` from `lesson_history` grouped by date.

---

## Phase 9 — Achievements & Badges

**Goal:** Reward milestones with unlockable badges. Adds a meaningful loop beyond daily XP.

### Badge definitions (first pass)

| Badge | Trigger |
|---|---|
| First Steps | Complete lesson 1 |
| On a Roll | 3-day streak |
| Committed | 7-day streak |
| Dedicated | 30-day streak |
| Century | Reach 100 XP |
| High Scorer | Reach 500 XP |
| XP Machine | Reach 1 000 XP |
| Perfect Lesson | Score 100% on any lesson |
| Unit Champion | Complete all lessons in a unit |
| Conversationalist | Finish an AI Conversation session |
| Reviewer | Complete a Review session |
| Wordsmith | Clear 10 words from weak-words list |

### Features

- New **Achievements tab** (or section inside Progress screen) showing a grid of earned/locked badges.
- Locked badges are shown greyed out with a hint of their trigger.
- Toast-style popup when a badge is earned mid-session (non-blocking, disappears after 2 s).
- Badge earned date stored in SQLite.

### Files

| Action | File |
|---|---|
| New | `src/data/achievements.ts` — badge definitions array |
| New | `src/screens/AchievementsScreen.tsx` |
| New | `src/components/AchievementToast.tsx` |
| Extend | `src/database/db.ts` — `unlockAchievement()`, `getUnlockedAchievements()` |
| Extend | `src/database/schema.ts` — new table `achievements (badge_id TEXT PRIMARY KEY, unlocked_at TEXT)` |
| Extend | `src/navigation/AppNavigator.tsx` — add Achievements tab or stack screen |
| Extend | `src/screens/LessonScreen.tsx` · `ReviewScreen.tsx` · `ConversationScreen.tsx` — call achievement checker after session ends |

### Notes
- Achievement checking is a pure function `checkAchievements(progress, event)` returning newly unlocked badge IDs. Keep it separate from DB writes so it's testable.
- Toast component sits in the root `App.tsx` layout, receives events via a simple context or ref callback.

---

## Phase 10 — Sentence Builder (New Question Type)

**Goal:** Add a new question type where learners arrange scrambled word tiles into the correct Spanish sentence, improving grammar intuition beyond single-word recall.

### How it works

1. A sentence in English is shown as the prompt (e.g. *"I want a coffee, please"*).
2. The correct Spanish sentence is split into tokens (e.g. `["Quisiera", "un", "café,", "por", "favor"]`).
3. Those tokens plus 2–3 distractor tokens are shuffled and displayed as tappable tiles.
4. The learner taps tiles in order to build the sentence in a tray at the top.
5. Tapping a tile in the tray removes it (puts it back in the pool).
6. "Check" button appears once all correct tokens are placed.

### Data changes

- New `sentences.ts` data file — each entry has `id`, `english`, `spanish`, `tokens[]`, `distractors[]`, `lessonId`.
- New `QuestionType`: `'sentenceBuilder'` added to the union in `types/index.ts`.
- `Question` interface gains optional `tokens?: string[]` field.
- `buildQuestions()` includes sentence builder questions for lessons that opt in.

### Files

| Action | File |
|---|---|
| New | `src/data/sentences.ts` |
| New | `src/components/SentenceBuilder.tsx` |
| Extend | `src/types/index.ts` — add `'sentenceBuilder'` to `QuestionType` |
| Extend | `src/utils/questionGenerator.ts` — `buildSentenceQuestion()` |
| Extend | `src/screens/LessonScreen.tsx` — render `<SentenceBuilder>` branch |
| Extend | `src/data/units.ts` — add `'sentenceBuilder'` to Units 3–4 lesson `questionTypes` |

### Notes
- Sentence builder replaces the speaking question for Expo Go (better compatibility).
- Start with 2–3 sentences per existing unit, expanding in Phase 11.

---

## Phase 11 — Expanded Lesson Content (Units 5–8)

**Goal:** Double the vocabulary and lessons so learners have meaningful progression beyond the current 4 units.

### New units

| Unit | Theme | Lessons | Words |
|---|---|---|---|
| Unit 5 — Shopping & Money | Shops, clothes, prices, payments | 3 lessons | ~20 words |
| Unit 6 — Weather & Nature | Weather conditions, seasons, environment | 3 lessons | ~20 words |
| Unit 7 — Health & Body | Body parts, illness, pharmacy, doctor | 3 lessons | ~20 words |
| Unit 8 — Hobbies & Free Time | Sports, music, reading, weekend activities | 4 lessons | ~25 words |

**Total new words: ~85 → vocabulary grows from 86 to ~170 words.**

### Lesson question types
All new lessons include: `multipleChoice`, `typing`, `listening`, `speaking`, `sentenceBuilder`.

### Files

| Action | File |
|---|---|
| Extend | `src/data/words.ts` — add w087–w170 |
| Extend | `src/data/units.ts` — add units 5–8 and lessons 14–26 |
| Extend | `src/data/sentences.ts` — add sentences for each new lesson |

### Notes
- Words follow the existing `{ id, spanish, english, example, topic, difficulty }` shape — no schema changes.
- New `topic` values: `'shopping'`, `'weather'`, `'health'`, `'hobbies'`.
- UnitMap component already handles any number of units — no UI changes needed.

---

## Phase 12 — Vocabulary Browser

**Goal:** Give learners a searchable dictionary of every word they have been introduced to, so they can study and review outside of structured lessons.

### Features

- New **Vocab** tab in the main tab bar (replaces or sits alongside Progress).
- **Search bar** — filters by Spanish or English in real time.
- **Filter chips** — All · By unit · By topic · Needs review (in weak_words).
- **Word cards** — show Spanish, English, example sentence, difficulty dots, and an AudioButton.
- **Favourite words** — tap a star to mark a word; favourites persist in SQLite.
- **Word detail modal** — tap a card to expand: full example sentence, unit it came from, pronunciation guide, link to the lesson.

### Files

| Action | File |
|---|---|
| New | `src/screens/VocabScreen.tsx` |
| New | `src/components/WordCard.tsx` |
| Extend | `src/database/db.ts` — `toggleFavourite()`, `getFavourites()` |
| Extend | `src/database/schema.ts` — new table `favourite_words (word_id TEXT PRIMARY KEY)` |
| Extend | `src/navigation/AppNavigator.tsx` — add Vocab tab |

### Notes
- Words shown are **all words in `words.ts`**, not just completed-lesson words — acts as a reference dictionary.
- Favourites table is append-only (toggle insert/delete). No migration risk.

---

## Phase 13 — Daily Challenges

**Goal:** Give learners a fresh short challenge every day to boost retention and habit formation beyond the main lesson path.

### How it works

1. A **Daily Challenge** card appears on the Home screen each day (disappears once completed).
2. Each challenge is a 5-question quiz drawn from words across *all completed lessons*, seeded by today's date so every user gets the same questions (no backend needed).
3. On completion: bonus XP reward (25 XP), a confetti animation, and the card marks itself as done for the day.
4. Missed days show "You missed yesterday's challenge — streak still safe."

### Features

- Daily challenge card on Home screen with a countdown to reset (midnight).
- Questions generated by a `buildDailyChallenge(date, completedLessons)` function using a deterministic shuffle seeded on the date string.
- Completion stored in `user_progress` as `last_challenge_date TEXT`.
- Results shown inline (not a separate Results screen) — a small summary modal.

### Files

| Action | File |
|---|---|
| New | `src/components/DailyChallengeCard.tsx` |
| New | `src/screens/DailyChallengeScreen.tsx` |
| Extend | `src/utils/questionGenerator.ts` — `buildDailyChallenge(dateStr, wordIds)` |
| Extend | `src/database/db.ts` — `completeDailyChallenge()`, check `last_challenge_date` |
| Extend | `src/database/schema.ts` — `ALTER TABLE` migration: add `last_challenge_date TEXT NOT NULL DEFAULT ''` |
| Extend | `src/screens/HomeScreen.tsx` — render `<DailyChallengeCard>` |
| Extend | `src/navigation/AppNavigator.tsx` — add `DailyChallenge` stack screen |

### Notes
- Deterministic seeding: `date.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)` gives a stable integer seed. Fisher-Yates shuffle with that seed picks the same 5 words for every device on the same day.
- Challenge only appears if the user has completed at least 1 lesson (needs words to draw from).
- No backend, no network call — fully offline.

---

## Summary

| Phase | Feature | New screens | New DB tables |
|---|---|---|---|
| 8 | Stats & Analytics | Rewrite Progress | No new tables |
| 9 | Achievements | Achievements | `achievements` |
| 10 | Sentence Builder | None (new component) | None |
| 11 | Expanded Content | None (data only) | None |
| 12 | Vocabulary Browser | Vocab | `favourite_words` |
| 13 | Daily Challenges | DailyChallenge | Column on `user_progress` |

**Recommended build order:** 8 → 9 → 11 → 10 → 12 → 13

Rationale: expanding content (11) before sentence builder (10) means Phase 10's sentence data can span all 8 units from the start rather than needing a backfill pass.
