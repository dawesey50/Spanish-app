# Spanish App — Icon & Image Asset Specification

## Style Guide (apply to ALL assets)

- **Art style:** Clean, modern flat illustration. Slightly rounded, friendly — similar to Duolingo's visual language.
- **Background:** Transparent PNG for all icons. White or light-coloured background only for full illustrations.
- **Colour palette:**
  - Primary indigo: `#4F46E5`
  - Green (success): `#059669`
  - Amber (streak/warning): `#D97706`
  - Red (error/danger): `#DC2626`
  - Sky blue (accent): `#0EA5E9`
  - Light grey (disabled/locked): `#9CA3AF`
- **Corner radius:** Rounded on everything — no sharp corners.
- **Export format:** PNG, transparent background (unless stated otherwise).
- **Provide each icon at:** 64×64 px, 128×128 px, and 256×256 px (3 files per icon, named `icon-name@1x.png`, `icon-name@2x.png`, `icon-name@3x.png`).

---

## Group 1 — App Icon

| Filename | Description | Notes |
|---|---|---|
| `app-icon.png` | Main app icon. A bold, friendly letter **Ñ** (or a speech bubble containing "Ñ") in white, on a vibrant Spanish-flag-inspired gradient background (red top, yellow/amber centre, red bottom). Add subtle depth/shadow. | 1024×1024 px. Rounded square crop will be applied by the app store automatically. |
| `splash-screen.png` | Same Ñ/speech bubble logo, centred, on a solid indigo (`#4F46E5`) background. Minimal — just the mark. | 1242×2208 px (iPhone max). |

---

## Group 2 — Tab Bar Icons (4 icons, active + inactive versions)

These appear at the bottom of the app. Provide two versions each: **active** (filled, indigo `#4F46E5`) and **inactive** (outline/light, grey `#9CA3AF`).

| Filename | Replaces | Description |
|---|---|---|
| `tab-learn` | 📚 Learn tab | An open book with a small sparkle/star on the right page. Clean, simple. |
| `tab-review` | 🔄 Review tab | Two curved arrows forming a circle (refresh/repeat symbol). |
| `tab-progress` | 📊 Progress tab | A small bar chart with 3 bars of increasing height. |
| `tab-settings` | ⚙️ Settings tab | A gear/cog icon with rounded teeth. |

*(Provide as `tab-learn-active.png`, `tab-learn-inactive.png`, etc.)*

---

## Group 3 — Core UI Icons

Small icons used throughout the app. All transparent background, single colour unless stated.

| Filename | Replaces | Used In | Description |
|---|---|---|---|
| `icon-flame` | 🔥 | Streak display, progress stats | A flame shape. Provide in **amber** `#D97706` filled version. |
| `icon-star` | ⭐ | XP stats, results screen | A 5-point star. Provide in **amber/gold** filled version. |
| `icon-heart-full` | ❤️ | Hearts display (lives) | A filled heart shape. Provide in **red** `#DC2626`. |
| `icon-heart-empty` | 🖤 | Hearts display (lost life) | Same heart shape, outline only, light grey. |
| `icon-lock` | 🔒 | Locked lessons/units | A padlock (closed). Grey `#9CA3AF`. |
| `icon-unlock` | 🔓 | Developer mode enabled | A padlock (open). Red `#DC2626`. |
| `icon-speaker-on` | 🔊 | AudioButton (playing) | Speaker with 3 sound waves. Indigo `#4F46E5`. |
| `icon-speaker-off` | 🔈 | AudioButton (idle) | Speaker with 1 faint wave. Grey `#9CA3AF`. |
| `icon-mic` | 🎤 | Speaking questions, mic button | A microphone shape. Indigo `#4F46E5`. |
| `icon-mic-recording` | 🎤 (recording) | SpeakingQuestion recording state | Same microphone with a red dot/pulse ring. Red accent. |
| `icon-check` | ✓ | Correct answers, completions | A thick checkmark/tick. Green `#059669`. |
| `icon-cross` | ✗ | Wrong answers | A thick X. Red `#DC2626`. |
| `icon-warning` | ⚠️ | Weak words banner | A triangle with an exclamation mark. Amber `#D97706`. |
| `icon-back` | ← | Back buttons | A left-pointing chevron/arrow. Indigo `#4F46E5`. |
| `icon-close` | ✕ | Quit/close buttons | A thin X / close mark. Grey `#6B7280`. |
| `icon-chat` | 💬 | AI Conversation card on Home | A speech bubble with three dots inside. White (used on indigo background). Also provide indigo version. |
| `icon-book` | 📖 | Lessons done stat | An open book. Indigo `#4F46E5`. |
| `icon-target` | 🎯 | Accuracy stat | A circular target/bullseye with a dot in the centre. Sky blue `#0EA5E9`. |
| `icon-arrow-right` | → | Cards, continue buttons | A right-pointing arrow. Indigo or white depending on context — provide both. |
| `icon-stop` | ⏹ | Stop recording | A filled square. Red `#DC2626`. |

---

## Group 4 — Question Type Badges

Small badge icons used to label question types inside lessons and review sessions.

| Filename | Replaces | Description |
|---|---|---|
| `badge-multiple-choice` | 🔤 | A grid of 2×2 letter tiles, like a word selection grid. |
| `badge-typing` | ⌨️ | A simple keyboard outline with a few visible keys. |
| `badge-listening` | 🔊 | A single ear shape with a small sound wave. |
| `badge-speaking` | 🎤 | A microphone with a small waveform beside it. |
| `badge-review` | (orange pill) | The word "Review" would remain as text — no image needed. |

---

## Group 5 — AI Conversation Scenario Icons

Used in the scenario picker cards in ConversationScreen. Provide in a colourful, rounded-square illustration style (like app icons, not flat line icons).

| Filename | Replaces | Scenario | Description |
|---|---|---|---|
| `scenario-food` | 🍽️ | Ordering Food | A bowl of food or plate with cutlery. Warm red/orange tones. |
| `scenario-directions` | 🗺️ | Directions | A map pin / location marker on a simple street grid. Blue/teal tones. |
| `scenario-meeting` | 🤝 | Meeting Someone | Two hands shaking or two smiling character silhouettes facing each other. Purple/indigo tones. |
| `scenario-shopping` | 🛍️ | Shopping | A shopping bag with a small gift/tag on it. Pink/coral tones. |
| `scenario-freeform` | 💬 | Free Conversation | Two overlapping speech bubbles with dots. Indigo tones. |

---

## Group 6 — Unit Map Icons

Used on the unit cards in the lesson map. Colourful, rounded-square illustration style matching scenario icons.

| Filename | Replaces | Unit | Description |
|---|---|---|---|
| `unit-greetings` | 👋 | Greetings & Introductions | A waving hand with a friendly aura/sparkle. Warm yellow/amber. |
| `unit-food` | 🍽️ | Food & Everyday Verbs | A steaming bowl of food. Warm red/orange. |
| `unit-travel` | ✈️ | Travel & Directions | An aeroplane viewed from below against a sky. Blue. |
| `unit-family` | 👨‍👩‍👧‍👦 | Family & Descriptions | Simplified silhouettes of a family of 3-4. Green/teal. |

---

## Group 7 — Achievement Badge Illustrations

12 badges for the Achievements screen. Style: circular badge shape, coloured border, icon/symbol centred inside. Each badge is a single image (no text — text is added by the app).

| Filename | Badge | Visual concept | Colour scheme |
|---|---|---|---|
| `achievement-first-steps` | First Steps | A single footprint or boot stepping forward | Indigo |
| `achievement-on-a-roll` | On a Roll | Three green dice showing the same number | Green |
| `achievement-committed` | Committed | A calendar with a checkmark on today's date | Blue |
| `achievement-dedicated` | Dedicated | A trophy with a 30 on it | Gold |
| `achievement-century` | Century | A big bold "100" with a sparkle effect | Amber |
| `achievement-high-scorer` | High Scorer | A 5-star rating with 5 filled gold stars | Gold |
| `achievement-xp-machine` | XP Machine | A rocket launching with XP sparks trailing | Purple |
| `achievement-perfect-lesson` | Perfect Lesson | A diamond/gem with light refracting from it | Cyan/teal |
| `achievement-unit-champion` | Unit Champion | A medal on a ribbon (gold with a star) | Gold/red ribbon |
| `achievement-conversationalist` | Conversationalist | Two speech bubbles overlapping | Indigo |
| `achievement-reviewer` | Reviewer | Two circular arrows (refresh) around a star | Green |
| `achievement-wordsmith` | Wordsmith | A sparkle/magic wand over a letter | Purple/gold |

*(Provide at 128×128 px and 256×256 px. Circular badge shape with transparent background outside the circle.)*

---

## Group 8 — Screen Illustrations

Larger decorative images used in empty states, results, and onboarding.

| Filename | Used In | Description | Size |
|---|---|---|---|
| `illustration-no-hearts` | LessonScreen (lost all lives) | A cracked/broken heart with a sad expression. Not too dark — slightly cartoonish. | 200×200 px |
| `illustration-nothing-to-review` | ReviewScreen empty state | A happy star or smiling sun — "you're all caught up" feeling. Cheerful, green/gold tones. | 200×200 px |
| `illustration-lesson-excellent` | ResultsScreen (90%+ score) | A trophy or gold star burst — celebratory. | 200×200 px |
| `illustration-lesson-good` | ResultsScreen (70-89%) | A thumbs up with a sparkle. | 200×200 px |
| `illustration-lesson-keep-going` | ResultsScreen (50-69%) | A flexed arm / muscle showing effort. Warm colours. | 200×200 px |
| `illustration-lesson-try-again` | ResultsScreen (<50%) | A stack of books with a pencil — studious, not discouraging. | 200×200 px |
| `illustration-onboarding-hero` | OnboardingScreen | A friendly illustrated character holding a Spanish flag or speaking Spanish. Full-colour, 3/4 body height. | 280×280 px |
| `illustration-achievements-empty` | AchievementsScreen (0 badges) | A locked treasure chest with a question mark above it. | 160×160 px |

---

## Summary — File Count

| Group | Files |
|---|---|
| App icon + splash | 2 |
| Tab bar icons (4 × 2 states × 3 sizes) | 24 |
| Core UI icons (20 × 3 sizes) | 60 |
| Question type badges (4 × 3 sizes) | 12 |
| Scenario icons (5 × 3 sizes) | 15 |
| Unit map icons (4 × 3 sizes) | 12 |
| Achievement badges (12 × 2 sizes) | 24 |
| Screen illustrations (8) | 8 |
| **Total** | **~157 files** |

---

## Notes for ChatGPT / Image Generator

1. Generate all icons on **transparent backgrounds** unless stated otherwise.
2. Keep a consistent visual weight — icons should look like they belong in the same set.
3. The app is called a **Spanish learning app** — the overall feel should be warm, encouraging, and educational (not gamey or dark).
4. Avoid text inside icons (the app adds its own labels). Exceptions: `illustration-onboarding-hero` may include a speech bubble with "¡Hola!".
5. The app's primary colour is **indigo `#4F46E5`** — most icons should feel at home alongside this colour.
6. For the tab bar icons specifically: keep them **very simple** (2-3 elements maximum) so they read clearly at 24px.
