import { UNITS } from './units';

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  hint: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    emoji: '👣',
    title: 'First Steps',
    description: 'Completed your first lesson',
    hint: 'Complete your first lesson',
  },
  {
    id: 'on_a_roll',
    emoji: '🎲',
    title: 'On a Roll',
    description: 'Reached a 3-day streak',
    hint: 'Build a 3-day streak',
  },
  {
    id: 'committed',
    emoji: '📅',
    title: 'Committed',
    description: 'Reached a 7-day streak',
    hint: 'Build a 7-day streak',
  },
  {
    id: 'dedicated',
    emoji: '🏆',
    title: 'Dedicated',
    description: 'Reached a 30-day streak',
    hint: 'Build a 30-day streak',
  },
  {
    id: 'century',
    emoji: '💯',
    title: 'Century',
    description: 'Earned 100 XP',
    hint: 'Earn 100 total XP',
  },
  {
    id: 'high_scorer',
    emoji: '⭐',
    title: 'High Scorer',
    description: 'Earned 500 XP',
    hint: 'Earn 500 total XP',
  },
  {
    id: 'xp_machine',
    emoji: '🚀',
    title: 'XP Machine',
    description: 'Earned 1,000 XP',
    hint: 'Earn 1,000 total XP',
  },
  {
    id: 'perfect_lesson',
    emoji: '💎',
    title: 'Perfect Lesson',
    description: 'Scored 100% on any lesson',
    hint: 'Get a perfect score on any lesson',
  },
  {
    id: 'unit_champion',
    emoji: '🏅',
    title: 'Unit Champion',
    description: 'Completed all lessons in a unit',
    hint: 'Finish every lesson in a unit',
  },
  {
    id: 'conversationalist',
    emoji: '💬',
    title: 'Conversationalist',
    description: 'Completed an AI conversation',
    hint: 'Finish an AI Conversation session',
  },
  {
    id: 'reviewer',
    emoji: '🔄',
    title: 'Reviewer',
    description: 'Completed a Review session',
    hint: 'Finish a Review session',
  },
  {
    id: 'wordsmith',
    emoji: '✨',
    title: 'Wordsmith',
    description: 'Cleared 10 words from your weak list',
    hint: 'Clear 10 words from your weak words list',
  },
  {
    id: 'streak_14',
    emoji: '🔥',
    title: 'Fortnight Fire',
    description: 'Reached a 14-day streak',
    hint: 'Build a 14-day streak',
  },
  {
    id: 'mastered_25',
    emoji: '🎓',
    title: 'Word Master',
    description: 'Mastered 25 words via spaced repetition',
    hint: 'Master 25 words through the review system',
  },
  {
    id: 'xp_2000',
    emoji: '💥',
    title: 'XP Explosion',
    description: 'Earned 2,000 XP',
    hint: 'Earn 2,000 total XP',
  },
];

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
  | { type: 'lesson'; score: number; streak: number; totalXP: number; completedLessons: string[] }
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
    const { score, streak, totalXP, completedLessons } = event;
    if (completedLessons.length >= 1) tryUnlock('first_steps');
    if (streak >= 3) tryUnlock('on_a_roll');
    if (streak >= 7) tryUnlock('committed');
    if (streak >= 14) tryUnlock('streak_14');
    if (streak >= 30) tryUnlock('dedicated');
    if (totalXP >= 100) tryUnlock('century');
    if (totalXP >= 500) tryUnlock('high_scorer');
    if (totalXP >= 1000) tryUnlock('xp_machine');
    if (totalXP >= 2000) tryUnlock('xp_2000');
    if (score === 100) tryUnlock('perfect_lesson');
    UNITS.forEach((unit) => {
      if (unit.lessonIds.every((id) => completedLessons.includes(id))) {
        tryUnlock('unit_champion');
      }
    });
  }

  if (event.type === 'review') {
    tryUnlock('reviewer');
    if (event.totalWordsMastered >= 10) tryUnlock('wordsmith');
    if (event.totalWordsMastered >= 25) tryUnlock('mastered_25');
  }

  if (event.type === 'conversation') {
    tryUnlock('conversationalist');
  }

  return newOnes;
}
