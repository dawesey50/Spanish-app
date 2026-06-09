# Spanish App — Roadmap (Phases 24–27): Premium UI Overhaul

## Why this roadmap exists

Feedback after Phases 22–23:

- The app still looks **simple and basic** — lots of empty space, elements feel "pushed onto the screen for the sake of it" rather than designed.
- **Vocab screen:** the topic filter buttons (All Topics, Greetings, Food…) are squashed so small the text can't be read.
- The **"More" tab** should become a proper **Profile page** — name, achievements, a small overview, possibly a customisable character — with Settings demoted to a button on that page.
- The **Progress page** looks basic and boring despite having good data.
- **Achievements** still use emoji — they need real icons (see `ACHIEVEMENT_ICON_PROMPTS.md`).

## What "premium" means concretely (applies to every phase below)

1. **One design language.** A shared `src/theme.ts` exporting spacing scale, corner radii, shadow presets, and a type scale — every screen imports from it instead of hard-coding values.
2. **Nothing floats.** Every element lives inside a card or under a section header. No orphaned buttons or stray text.
3. **Density over emptiness.** Cards carry 2–3 layers of information (big value → label → sub-line/trend), not a single lonely number.
4. **Depth.** Soft layered shadows on white cards; coloured glow shadows on accent cards (indigo card → indigo shadow).
5. **Motion.** Press-scale feedback on every touchable; content fades/slides in on screen focus.

---

## Phase 24 — Global Polish Pass + Vocab Fixes

**Goal:** Establish the design system, fix the broken Vocab filters, and apply the new language to every existing screen so nothing feels "pushed on".

### Features

- **`src/theme.ts`** — design tokens: `spacing` (4/8/12/16/20/24/32), `radius` (sm 10 / md 14 / lg 18 / xl 24), `shadows` (card / floating / glow(color)), `type` (display 28 / title 20 / body 15 / caption 12 / micro 11 with weights), `colors` (the existing palette centralised).
- **Vocab topic chips fixed** — the horizontal `ScrollView` is collapsing its height (classic RN bug). Fix: `flexGrow: 0` on the ScrollView + explicit chip height (~40px), `fontSize: 14`, `paddingVertical: 10`, `paddingHorizontal: 16`. Active chip gets indigo fill + white text instead of near-black.
- **Vocab screen polish** — taller search bar with search icon, filter pills (All / ★ Favourites / ⚠ Weak) restyled as a segmented control, word rows get topic tag + difficulty dots so the list feels rich.
- **`src/components/PressableScale.tsx`** — small wrapper (Animated scale 1 → 0.97 on press-in) used by every card/button across the app.
- **Empty states** — every list that can be empty (Vocab favourites, weak words, Review, history) gets icon + headline + one-line hint + CTA button, vertically centred.
- **Apply tokens** to Home, Review (list + session), Lesson, Conversation screens — replace ad-hoc paddings/shadows with theme values; add section headers where content currently floats.

### Files

| Action | File |
|---|---|
| New | `src/theme.ts` |
| New | `src/components/PressableScale.tsx` |
| Edit | `src/screens/VocabScreen.tsx` — chip fix + polish |
| Edit | `src/screens/HomeScreen.tsx`, `ReviewScreen.tsx`, `LessonScreen.tsx`, `ConversationScreen.tsx` — token sweep |

### Notes
- No new packages. Pure styling + one tiny component.
- This phase intentionally ships **before** the Profile/Progress rebuilds so they're born using the tokens.

---

## Phase 25 — Profile Tab (replaces "More")

**Goal:** Turn the Settings tab slot into a Profile page that feels like the user's home: identity, character, achievements, and an overview — with Settings one tap away.

### Features

- **New `ProfileScreen`** in the tab bar where Settings was (tab label "Profile", person icon — already in place in `TabBar.tsx`).
  - **Indigo hero header** (matches Home): large circular avatar, name, level badge + XP bar, "learning since" date.
  - **Customisable character** — tap the avatar → modal with a grid of character emoji (🧑‍🎓 🦊 🐸 🦉 🐱 🌮 ☀️ ⚡ …) and a row of background colours from the palette. Stored in DB. Shown everywhere the initials-avatar currently appears (Home header too).
  - **Overview strip** — Total XP · Day streak · Lessons done · Words mastered.
  - **Achievements showcase** — horizontal scroll of unlocked badges (icons from Phase 27; emoji until then) + "x / 15 unlocked" + chevron → `AchievementsScreen`.
  - **Settings gear** top-right of the header → opens Settings.
- **Settings becomes a stack screen** — pushed with `slide_from_right`, with a back button. All existing settings content unchanged.

### Files

| Action | File |
|---|---|
| New | `src/screens/ProfileScreen.tsx` |
| New | `src/components/AvatarPickerModal.tsx` |
| Edit | `src/navigation/AppNavigator.tsx` — tab swap + `Settings` stack screen |
| Edit | `src/components/TabBar.tsx` — rename tab entry `Settings` → `Profile` |
| Edit | `src/types/index.ts` — `MainTabParamList`: `Settings` → `Profile`; `RootStackParamList`: add `Settings` |
| Edit | `src/database/db.ts` — migrations + getters/setters |
| Edit | `src/screens/HomeScreen.tsx` — avatar shows chosen character/colour |

### DB migration (existing `ALTER TABLE` pattern)

```sql
ALTER TABLE user_progress ADD COLUMN profile_emoji TEXT NOT NULL DEFAULT '';
ALTER TABLE user_progress ADD COLUMN profile_color TEXT NOT NULL DEFAULT '#4F46E5';
```

### Notes
- Empty `profile_emoji` → fall back to initials (current behaviour), so existing users see no change until they customise.
- Achievements preview can then be removed from the Progress screen (it moves home to Profile).

---

## Phase 26 — Progress Dashboard Redesign

**Goal:** Same data, completely different feel. The Progress screen becomes the most visually impressive screen in the app.

### Features

- **Indigo hero header** — big **circular level ring** (XP progress around the user's level number), level name, total XP. Mirrors Home/Profile so the app feels like one product.
- **Stat grid (2 × 3)** — XP, streak, longest streak, lessons, accuracy, words mastered. Each card: icon chip in a tinted circle, large value, label, sub-line (e.g. "top 'best day' 80 XP"). Subtle coloured glow per card.
- **XP This Week chart v2** — rounded-top bars that animate growing in on focus, today's bar in amber with a pill label, dashed goal line at the daily XP goal.
- **30-Day Activity v2** — proper month grid with weekday column labels, green fills with intensity by XP earned that day, flame marker on today, current-streak callout underneath.
- **Unit mastery section** — one row per unit: unit image, title, animated progress bar, "n / m lessons".
- **Lesson history v2** — grouped under date headers ("Today", "Yesterday", "3 June"), score shown as a small coloured ring instead of bare text.

### Files

| Action | File |
|---|---|
| Rewrite | `src/screens/ProgressScreen.tsx` |
| New | `src/components/ProgressRing.tsx` (used by hero + history scores) |

### Notes
- **Recommended:** `npx expo install react-native-svg` — works in Expo Go, unlocks real circular rings and smooth charts. Fallback if we'd rather not add it: build the ring from two rotated semicircle masks (pure Views) — uglier code, same look.
- All data already exists (`getXPHistory`, `lesson_history`, `getLongestStreak`) — zero DB changes.

---

## Phase 27 — Achievement Icons + Achievements Screen Upgrade

**Goal:** Replace emoji with real badge artwork and make the achievements screen feel like a trophy cabinet.

### Prerequisite

Generate the 15 icons using **`ACHIEVEMENT_ICON_PROMPTS.md`** and save them to `assets/achievements/<id>.png` (transparent PNG, ~512×512). Filenames must match achievement ids exactly (`first_steps.png`, `on_a_roll.png`, …).

### Features

- **`ACHIEVEMENT_ICONS`** static require-map in `src/data/achievements.ts` keyed by id (RN `require()` needs literal paths). Emoji field stays as fallback.
- **AchievementsScreen → trophy cabinet** — 2-column grid of badge cards. Unlocked: full-colour icon, title, unlock date. Locked: icon at 25 % opacity with a lock glyph overlay and the hint text. Progress header: "x / 15 unlocked" with a bar.
- **Unlock moment** — when a badge unlocks, the card pops in with a spring + the particle burst already built for ResultsScreen.
- **Icon everywhere** — achievement toast and the Profile showcase row use the PNGs.

### Files

| Action | File |
|---|---|
| New | `assets/achievements/*.png` (15 files, user-generated) |
| Edit | `src/data/achievements.ts` — icon map |
| Rewrite | `src/screens/AchievementsScreen.tsx` |
| Edit | `src/components/AchievementToast.tsx` (or equivalent) + `ProfileScreen.tsx` |

### Notes
- Locked state is done in code (opacity + overlay) — **no separate locked assets needed**.
- If an icon file is missing the emoji renders instead, so this phase can ship incrementally.

---

## Summary

| Phase | Theme | New screens | New packages | DB changes |
|---|---|---|---|---|
| 24 | Design system + Vocab fixes | — | — | — |
| 25 | Profile tab + avatar + Settings move | Profile | — | 2 columns |
| 26 | Progress dashboard redesign | — | `react-native-svg` (recommended) | — |
| 27 | Achievement icons + trophy cabinet | — | — | — |

**Build order: 24 → 25 → 26 → 27.**
Tokens first so everything after is born consistent; icons last since artwork can be generated in parallel while 24–26 are built.
