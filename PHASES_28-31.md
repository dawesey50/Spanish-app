# Spanish App — Roadmap (Phases 28–31): The Premium Layer

## Where we are

Phases 24–27 gave us a design system (`theme.ts`), press feedback, a custom tab bar, hero headers, a trophy cabinet, and a redesigned Progress dashboard. The structure is right — but it still reads as "nicely styled" rather than "premium product". This roadmap closes that gap.

## The honest diagnosis

What premium apps (Duolingo, Babbel, Headspace) have that we don't:

| Gap | Today | Premium |
|---|---|---|
| **Colour depth** | Flat `#4F46E5` headers/buttons | Gradients everywhere — headers, buttons, rings |
| **Typeface** | Default system font | A rounded, friendly display font (Nunito/Baloo) for headers + numbers |
| **Loading** | `"Cargando..."` text / bare spinner | Skeleton shimmer placeholders |
| **Numbers** | Static `1,240 XP` | Count-up animation when they appear |
| **Celebration** | Level-ups happen silently | Full-screen level-up moment with particles |
| **Content entry** | Screens snap into existence | Content fades/slides in on focus |
| **Sound** | Silent | Subtle correct/wrong/complete sounds |
| **In-lesson energy** | Correct → next question | Combo streaks, escalating feedback |

**Build order: 28 → 29 → 30 → 31.** Phase 28 is the single biggest visual jump (gradients + font change how *every* screen looks at once). 29 adds the moments. 30 deepens the lesson loop. 31 (dark mode) is last because it doubles the colour surface area — do it once everything else is settled.

---

## Phase 28 — Gradients, Typeface & Living Numbers

**Goal:** The two changes that transform every screen simultaneously — colour depth and typography — plus numbers that feel alive.

### New packages

```bash
npx expo install expo-linear-gradient
npx expo install @expo-google-fonts/nunito expo-font
```

Both work in Expo Go. Nunito ExtraBold is the closest free match to the rounded "friendly but solid" look Duolingo's Feather font has.

### Features

1. **`GradientHeader` treatment** — every indigo hero (Home, Profile, Progress) becomes a `LinearGradient` from `#6366F1` (top-left) → `#4F46E5` → `#4338CA` (bottom-right). Same for the unit header strips in UnitMap.
2. **Gradient primary buttons** — `PrimaryButton` component wrapping `LinearGradient` + `PressableScale`: indigo gradient + glow shadow. Replaces every flat indigo CTA (Check, Continue, Start Review, Save character…). Green success variant for Continue-after-correct.
3. **Nunito type ramp** — load `Nunito_800ExtraBold` and `Nunito_700Bold` in `App.tsx` (with `SplashScreen.preventAutoHideAsync` until loaded). `theme.ts` typography gets `fontFamily`. **Rule:** Nunito for display text (screen titles, hero names, stat values, button labels), system font stays for body/paragraph text — that contrast is what looks expensive.
4. **`CountUp` component** — animated number that counts from 0 (or previous value) to target over ~700ms with ease-out. Used for: hero XP values, stat card values on Progress/Profile, XP earned on Results.
5. **Animated streak flame** — the fire icon on Home/Progress gets a gentle perpetual scale pulse (1 → 1.08 → 1, ~1.2s loop) so the streak feels alive.
6. **Level medal gradient** — the Progress hero medal ring uses a gradient stroke (level colour → lighter tint).

### Files

| Action | File |
|---|---|
| New | `src/components/PrimaryButton.tsx` |
| New | `src/components/CountUp.tsx` |
| New | `src/components/PulseImage.tsx` (streak flame) |
| Edit | `App.tsx` — font loading + splash hold |
| Edit | `src/theme.ts` — `fonts` export + typography fontFamily |
| Edit | `HomeScreen`, `ProfileScreen`, `ProgressScreen`, `UnitMap` — gradient heroes |
| Edit | `LessonScreen`, `ReviewScreen`, `ResultsScreen`, `ConversationScreen`, `AvatarPickerModal` — PrimaryButton swap |

---

## Phase 29 — Moments: Celebrations, Transitions & Skeletons

**Goal:** Reward the user's wins loudly and remove every "dead" moment (loading, screen change).

### Features

1. **Level-up takeover** — when a lesson/review pushes XP past a level threshold, after Results show a full-screen modal: gradient background in the new level's colour, medal zooms in with a spring, "¡Nivel 3!" + level name in Nunito, particle burst (reuse ResultsScreen's particles), Continue button. Detection: compare `getUserLevel(xpBefore)` vs `getUserLevel(xpAfter)` in Results.
2. **Streak milestone takeover** — same pattern at 3/7/14/30 days: full-screen flame, "7-day streak!", encouraging line. Fires once per milestone (store `last_streak_celebrated` in DB).
3. **`FadeSlideIn` wrapper** — content blocks fade in + translate up 12px, staggered ~60ms apart, on screen focus. Applied to the card stacks on Home, Progress, Profile, Review list.
4. **Skeleton shimmer** — `Skeleton` component (grey rounded block with a sweeping highlight via animated translateX). Skeleton layouts for Home (header + 3 cards), Progress (hero + grid), Profile, Vocab list. Replaces every `"Cargando..."` and full-screen `ActivityIndicator`.
5. **Tab icon pop** — active tab icon springs (scale 1 → 1.25 → 1) when selected.
6. **Results polish** — XP number uses `CountUp`, score ring animates filling, buttons get the gradient treatment.

### Files

| Action | File |
|---|---|
| New | `src/components/LevelUpModal.tsx` |
| New | `src/components/StreakMilestoneModal.tsx` |
| New | `src/components/FadeSlideIn.tsx` |
| New | `src/components/Skeleton.tsx` |
| Edit | `src/screens/ResultsScreen.tsx` — level-up detection + CountUp |
| Edit | `src/database/db.ts` — `last_streak_celebrated` column |
| Edit | `TabBar.tsx`, `HomeScreen`, `ProgressScreen`, `ProfileScreen`, `VocabScreen` |

---

## Phase 30 — Lesson Experience: Combos, Sound & Flow

**Goal:** The lesson loop is the product. Make every answer feel consequential.

### Features

1. **Combo streak** — 3+ correct answers in a row shows an animated pill ("¡Racha! ×3") that springs in next to the progress bar and grows with the combo. Wrong answer breaks it (pill shakes out). Combo ≥5 tints the progress bar amber.
2. **Sound effects** — short, soft sounds via `expo-av`: correct (pop), wrong (gentle thud), lesson complete (chime), level-up (fanfare). Global mute toggle in Settings (`sounds_enabled` column, default on). Files in `assets/sounds/` (I'll source/generate four free-licence clips, or you drop in your own).
3. **Question transitions** — current question slides out left + fades while the next slides in from right (~250ms). Replaces the hard swap.
4. **Progress bar v2** — animated width with a spring, subtle moving shine stripe, and a tick mark at each question boundary.
5. **Escalating haptics** — combo 3 = light, 5 = medium, 8+ = heavy + success notification. Wrong answer always light error buzz.
6. **Check button states** — disabled (grey, 60% opacity) until an answer is selected; selected → gradient slides in; correct → morphs green with the tick.

### Files

| Action | File |
|---|---|
| New | `src/components/ComboPill.tsx` |
| New | `src/utils/sounds.ts` (load/play/mute manager) |
| New | `assets/sounds/correct.mp3`, `wrong.mp3`, `complete.mp3`, `levelup.mp3` |
| Edit | `src/screens/LessonScreen.tsx`, `DailyChallengeScreen.tsx`, `ReviewScreen.tsx` |
| Edit | `src/screens/SettingsScreen.tsx` + `db.ts` — sound toggle |

---

## Phase 31 — Dark Mode

**Goal:** The classic "is this app premium?" test. Full dark theme, user-switchable.

### Features

1. **Theme context** — `ThemeProvider` exposing `colors` (light/dark palettes) + `mode`. `theme.ts` gains `darkColors`: bg `#0F172A`, card `#1E293B`, borders `#334155`, text `#F1F5F9`, indigo stays as accent (slightly brightened `#6366F1`).
2. **Setting** — Appearance row in Settings: System / Light / Dark (segmented control). Persisted (`theme_mode` column). "System" follows `useColorScheme()`.
3. **Migration sweep** — screens/components read colours from context instead of the static import. Mechanical but touches everything; doing it last means we do it exactly once.
4. **Status bar + tab bar** adapt automatically.

### Files

| Action | File |
|---|---|
| New | `src/ThemeContext.tsx` |
| Edit | `src/theme.ts` — dark palette |
| Edit | every screen/component (import swap) |
| Edit | `SettingsScreen.tsx`, `db.ts` — appearance setting |

---

## Summary

| Phase | Theme | New packages | DB changes | Visual impact |
|---|---|---|---|---|
| 28 | Gradients + Nunito + living numbers | `expo-linear-gradient`, `@expo-google-fonts/nunito` | — | ★★★★★ every screen at once |
| 29 | Celebrations, transitions, skeletons | — | 1 column | ★★★★ the "moments" |
| 30 | Lesson combos, sound, flow | — | 1 column | ★★★★ where users spend time |
| 31 | Dark mode | — | 1 column | ★★★ the premium checkbox |
