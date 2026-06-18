import { UNITS } from './units';
import type { LessonHistoryEntry } from '../types';

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  hint: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Streak ───────────────────────────────────────────────────────────────
  { id: 'on_a_roll',        emoji: '🎲', title: 'On a Roll',        description: 'Reached a 3-day streak',    hint: 'Build a 3-day streak' },
  { id: 'committed',        emoji: '📅', title: 'Committed',         description: 'Reached a 7-day streak',    hint: 'Build a 7-day streak' },
  { id: 'streak_14',        emoji: '🔥', title: 'Fortnight Fire',    description: 'Reached a 14-day streak',   hint: 'Build a 14-day streak' },
  { id: 'dedicated',        emoji: '🏆', title: 'Dedicated',         description: 'Reached a 30-day streak',   hint: 'Build a 30-day streak' },
  { id: 'streak_60',        emoji: '🔥', title: 'Unstoppable',       description: 'Reached a 60-day streak',   hint: 'Build a 60-day streak' },
  { id: 'streak_100',       emoji: '💫', title: 'Legend',            description: 'Reached a 100-day streak',  hint: 'Build a 100-day streak' },

  // ── XP ───────────────────────────────────────────────────────────────────
  { id: 'century',    emoji: '💯', title: 'Century',      description: 'Earned 100 XP',     hint: 'Earn 100 total XP' },
  { id: 'high_scorer',emoji: '⭐', title: 'High Scorer',  description: 'Earned 500 XP',     hint: 'Earn 500 total XP' },
  { id: 'xp_machine', emoji: '🚀', title: 'XP Machine',   description: 'Earned 1,000 XP',   hint: 'Earn 1,000 total XP' },
  { id: 'xp_2000',    emoji: '💥', title: 'XP Explosion', description: 'Earned 2,000 XP',   hint: 'Earn 2,000 total XP' },
  { id: 'xp_5000',    emoji: '⚡', title: 'XP Legend',    description: 'Earned 5,000 XP',   hint: 'Earn 5,000 total XP' },
  { id: 'xp_10000',   emoji: '👑', title: 'Grand Master', description: 'Earned 10,000 XP',  hint: 'Earn 10,000 total XP' },

  // ── Lessons ───────────────────────────────────────────────────────────────
  { id: 'first_steps',  emoji: '👣', title: 'First Steps',    description: 'Completed your first lesson', hint: 'Complete your first lesson' },
  { id: 'lessons_5',    emoji: '📚', title: 'Quick Learner',   description: 'Completed 5 lessons',         hint: 'Complete 5 lessons' },
  { id: 'lessons_10',   emoji: '🎒', title: 'Eager Student',   description: 'Completed 10 lessons',        hint: 'Complete 10 lessons' },
  { id: 'lessons_25',   emoji: '🏃', title: 'Halfway Hero',    description: 'Completed 25 lessons',        hint: 'Complete 25 lessons' },
  { id: 'lessons_all',  emoji: '🌟', title: 'Completionist',   description: 'Completed every lesson',      hint: 'Complete all available lessons' },

  // ── Units ─────────────────────────────────────────────────────────────────
  { id: 'unit_champion', emoji: '🏅', title: 'Unit Champion',     description: 'Completed all lessons in a unit', hint: 'Finish every lesson in a unit' },
  { id: 'two_units',     emoji: '🗺️', title: 'Unit Explorer',     description: 'Completed 2 full units',          hint: 'Finish all lessons in 2 units' },
  { id: 'four_units',    emoji: '📖', title: 'Advanced Learner',  description: 'Completed 4 full units',          hint: 'Finish all lessons in 4 units' },
  { id: 'all_units',     emoji: '🎓', title: 'Spanish Graduate',  description: 'Completed all units',             hint: 'Finish all lessons in every unit' },

  // ── Scores ────────────────────────────────────────────────────────────────
  { id: 'perfect_lesson', emoji: '💎', title: 'Perfect Lesson', description: 'Scored 100% on any lesson',    hint: 'Get a perfect score on any lesson' },
  { id: 'perfect_5',      emoji: '🌠', title: 'Perfectionist',  description: 'Scored 100% on 5 lessons',     hint: 'Get a perfect score on 5 different lessons' },

  // ── Review & words ────────────────────────────────────────────────────────
  { id: 'reviewer',    emoji: '🔄', title: 'Reviewer',        description: 'Completed a Review session',            hint: 'Finish a Review session' },
  { id: 'wordsmith',   emoji: '✨', title: 'Wordsmith',        description: 'Mastered 10 words via spaced repetition', hint: 'Master 10 words through the review system' },
  { id: 'mastered_25', emoji: '🎓', title: 'Word Master',      description: 'Mastered 25 words via spaced repetition', hint: 'Master 25 words through the review system' },
  { id: 'mastered_50', emoji: '🧠', title: 'Vocab Master',     description: 'Mastered 50 words via spaced repetition', hint: 'Master 50 words through the review system' },
  { id: 'mastered_100',emoji: '🪄', title: 'Word Wizard',      description: 'Mastered 100 words',                    hint: 'Master 100 words through the review system' },

  // ── Conversation ──────────────────────────────────────────────────────────
  { id: 'conversationalist', emoji: '💬', title: 'Conversationalist', description: 'Completed an AI conversation', hint: 'Finish an AI Conversation session' },

  // ── Fun / time-based ──────────────────────────────────────────────────────
  { id: 'night_owl',        emoji: '🦉', title: 'Night Owl',       description: 'Studied after 10pm',              hint: 'Complete a lesson after 10pm' },
  { id: 'early_bird',       emoji: '🌅', title: 'Early Bird',       description: 'Studied before 7am',              hint: 'Complete a lesson before 7am' },
  { id: 'weekend_warrior',  emoji: '⚽', title: 'Weekend Warrior',  description: 'Studied on the weekend',          hint: 'Complete a lesson on Saturday or Sunday' },
];

// Only PNG-backed achievements get an icon here; the rest fall back to emoji rendering
export const ACHIEVEMENT_ICONS: Record<string, ReturnType<typeof require>> = {
  first_steps:       require('../../assets/achievements/first_steps.png'),
  on_a_roll:         require('../../assets/achievements/on_a_roll.png'),
  committed:         require('../../assets/achievements/committed.png'),
  streak_14:         require('../../assets/achievements/streak_14.png'),
  dedicated:         require('../../assets/achievements/dedicated.png'),
  century:           require('../../assets/achievements/century.png'),
  high_scorer:       require('../../assets/achievements/high_scorer.png'),
  xp_machine:        require('../../assets/achievements/xp_machine.png'),
  xp_2000:           require('../../assets/achievements/xp_2000.png'),
  perfect_lesson:    require('../../assets/achievements/perfect_lesson.png'),
  unit_champion:     require('../../assets/achievements/unit_champion.png'),
  conversationalist: require('../../assets/achievements/conversationalist.png'),
  reviewer:          require('../../assets/achievements/reviewer.png'),
  wordsmith:         require('../../assets/achievements/wordsmith.png'),
  mastered_25:       require('../../assets/achievements/mastered_25.png'),
};

export const ACHIEVEMENTS_BY_ID: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

export type AchievementEvent =
  | { type: 'lesson'; score: number; streak: number; totalXP: number; completedLessons: string[]; history?: LessonHistoryEntry[] }
  | { type: 'review'; totalWordsMastered: number }
  | { type: 'conversation' };

export function checkAchievements(
  event: AchievementEvent,
  alreadyUnlocked: string[]
): string[] {
  const unlocked = new Set(alreadyUnlocked);
  const newOnes: string[] = [];

  const tryUnlock = (id: string) => {
    if (!unlocked.has(id) && !newOnes.includes(id)) newOnes.push(id);
  };

  if (event.type === 'lesson') {
    const { score, streak, totalXP, completedLessons, history } = event;

    // First lesson
    if (completedLessons.length >= 1) tryUnlock('first_steps');

    // Lesson milestones
    if (completedLessons.length >= 5)  tryUnlock('lessons_5');
    if (completedLessons.length >= 10) tryUnlock('lessons_10');
    if (completedLessons.length >= 25) tryUnlock('lessons_25');
    const totalLessons = UNITS.reduce((s, u) => s + u.lessonIds.length, 0);
    if (completedLessons.length >= totalLessons) tryUnlock('lessons_all');

    // Streak milestones
    if (streak >= 3)   tryUnlock('on_a_roll');
    if (streak >= 7)   tryUnlock('committed');
    if (streak >= 14)  tryUnlock('streak_14');
    if (streak >= 30)  tryUnlock('dedicated');
    if (streak >= 60)  tryUnlock('streak_60');
    if (streak >= 100) tryUnlock('streak_100');

    // XP milestones
    if (totalXP >= 100)   tryUnlock('century');
    if (totalXP >= 500)   tryUnlock('high_scorer');
    if (totalXP >= 1000)  tryUnlock('xp_machine');
    if (totalXP >= 2000)  tryUnlock('xp_2000');
    if (totalXP >= 5000)  tryUnlock('xp_5000');
    if (totalXP >= 10000) tryUnlock('xp_10000');

    // Perfect score
    if (score === 100) tryUnlock('perfect_lesson');
    if (history) {
      const perfectCount = history.filter((h) => h.score === 100).length;
      if (perfectCount >= 5) tryUnlock('perfect_5');
    }

    // Unit completion
    const unitsCompleted = UNITS.filter(
      (u) => u.lessonIds.length > 0 && u.lessonIds.every((id) => completedLessons.includes(id))
    ).length;
    if (unitsCompleted >= 1) tryUnlock('unit_champion');
    if (unitsCompleted >= 2) tryUnlock('two_units');
    if (unitsCompleted >= 4) tryUnlock('four_units');
    if (unitsCompleted >= UNITS.length) tryUnlock('all_units');

    // Time-based
    const now = new Date();
    const hour = now.getHours();
    const day  = now.getDay();
    if (hour >= 22)           tryUnlock('night_owl');
    if (hour < 7)             tryUnlock('early_bird');
    if (day === 0 || day === 6) tryUnlock('weekend_warrior');
  }

  if (event.type === 'review') {
    tryUnlock('reviewer');
    if (event.totalWordsMastered >= 10)  tryUnlock('wordsmith');
    if (event.totalWordsMastered >= 25)  tryUnlock('mastered_25');
    if (event.totalWordsMastered >= 50)  tryUnlock('mastered_50');
    if (event.totalWordsMastered >= 100) tryUnlock('mastered_100');
  }

  if (event.type === 'conversation') {
    tryUnlock('conversationalist');
  }

  return newOnes;
}
