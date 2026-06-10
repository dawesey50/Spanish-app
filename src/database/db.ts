import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL, DEFAULT_PROGRESS_SQL } from './schema';
import type { UserProgress, LessonHistoryEntry } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('spanish_app.db');
  await db.execAsync(CREATE_TABLES_SQL);
  await db.execAsync(DEFAULT_PROGRESS_SQL);
  // Safe column migrations — catch means the column already exists
  const migrations = [
    'ALTER TABLE user_progress ADD COLUMN tts_rate REAL NOT NULL DEFAULT 0.8',
    'ALTER TABLE user_progress ADD COLUMN notifications_enabled INTEGER NOT NULL DEFAULT 0',
    'ALTER TABLE user_progress ADD COLUMN notification_hour INTEGER NOT NULL DEFAULT 20',
    'ALTER TABLE user_progress ADD COLUMN developer_mode INTEGER NOT NULL DEFAULT 0',
    'ALTER TABLE user_progress ADD COLUMN longest_streak INTEGER NOT NULL DEFAULT 0',
    'ALTER TABLE lesson_history ADD COLUMN xp_earned INTEGER NOT NULL DEFAULT 0',
    'ALTER TABLE user_progress ADD COLUMN words_mastered INTEGER NOT NULL DEFAULT 0',
    "ALTER TABLE user_progress ADD COLUMN last_challenge_date TEXT NOT NULL DEFAULT ''",
    // Phase 17: spaced repetition columns on weak_words
    'ALTER TABLE weak_words ADD COLUMN interval INTEGER NOT NULL DEFAULT 1',
    "ALTER TABLE weak_words ADD COLUMN next_review_date TEXT NOT NULL DEFAULT ''",
    'ALTER TABLE weak_words ADD COLUMN ease_factor REAL NOT NULL DEFAULT 2.5',
    // Phase 18: profile name
    "ALTER TABLE user_progress ADD COLUMN profile_name TEXT NOT NULL DEFAULT ''",
    // Phase 19: streak shield
    "ALTER TABLE user_progress ADD COLUMN streak_shield_last_used TEXT NOT NULL DEFAULT ''",
    // Phase 25: profile character
    "ALTER TABLE user_progress ADD COLUMN profile_emoji TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE user_progress ADD COLUMN profile_color TEXT NOT NULL DEFAULT '#4F46E5'",
    // Phase 29: streak milestone celebrations
    'ALTER TABLE user_progress ADD COLUMN last_streak_celebrated INTEGER NOT NULL DEFAULT 0',
    // Phase 30: sound effects toggle
    'ALTER TABLE user_progress ADD COLUMN sounds_enabled INTEGER NOT NULL DEFAULT 1',
    // Phase 31: theme mode (system / light / dark)
    "ALTER TABLE user_progress ADD COLUMN theme_mode TEXT NOT NULL DEFAULT 'system'",
  ];
  for (const sql of migrations) {
    try { await db.execAsync(sql); } catch { /* already exists */ }
  }
}

function getDb(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export async function getUserProgress(): Promise<UserProgress> {
  const database = getDb();

  const row = await database.getFirstAsync<{
    streak: number;
    last_active_date: string;
    xp: number;
    daily_goal_xp: number;
    daily_xp_today: number;
    has_completed_onboarding: number;
    starting_unit_id: string;
    tts_rate: number;
    notifications_enabled: number;
    notification_hour: number;
    developer_mode: number;
    longest_streak: number;
    words_mastered: number;
    last_challenge_date: string;
    profile_name: string;
    streak_shield_last_used: string;
    profile_emoji: string;
    profile_color: string;
  }>('SELECT * FROM user_progress WHERE id = 1');

  const completedRows = await database.getAllAsync<{ lesson_id: string }>(
    'SELECT lesson_id FROM completed_lessons'
  );

  const historyRows = await database.getAllAsync<{
    lesson_id: string;
    score: number;
    date: string;
  }>('SELECT lesson_id, score, date FROM lesson_history ORDER BY id DESC LIMIT 50');

  const weakRows = await database.getAllAsync<{ word_id: string }>(
    'SELECT word_id FROM weak_words ORDER BY wrong_count DESC LIMIT 20'
  );

  const today = new Date().toISOString().split('T')[0];
  const lastActive = row?.last_active_date ?? '';
  let streak = row?.streak ?? 0;
  let dailyXPToday = row?.daily_xp_today ?? 0;
  const shieldLastUsed = row?.streak_shield_last_used ?? '';
  const shieldAvailable = !shieldLastUsed ||
    (Date.now() - new Date(shieldLastUsed + 'T00:00:00').getTime()) >= 7 * 86400000;
  let streakShieldAvailable = shieldAvailable;

  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive !== yesterday && lastActive !== '') {
      if (shieldAvailable) {
        try {
          await database.runAsync(
            "UPDATE user_progress SET streak_shield_last_used = ? WHERE id = 1",
            [today]
          );
        } catch {}
        streakShieldAvailable = false;
      } else {
        streak = 0;
      }
    }
    dailyXPToday = 0;
  }

  return {
    streak,
    lastActiveDate: lastActive,
    xp: row?.xp ?? 0,
    dailyGoalXP: row?.daily_goal_xp ?? 20,
    dailyXPToday,
    completedLessons: completedRows.map((r) => r.lesson_id),
    history: historyRows.map((r) => ({
      lessonId: r.lesson_id,
      score: r.score,
      date: r.date,
    })),
    weakWords: weakRows.map((r) => r.word_id),
    hasCompletedOnboarding: (row?.has_completed_onboarding ?? 0) === 1,
    startingUnitId: row?.starting_unit_id ?? 'unit_01',
    ttsRate: row?.tts_rate ?? 0.8,
    notificationsEnabled: (row?.notifications_enabled ?? 0) === 1,
    notificationHour: row?.notification_hour ?? 20,
    developerMode: (row?.developer_mode ?? 0) === 1,
    longestStreak: row?.longest_streak ?? 0,
    wordsMastered: row?.words_mastered ?? 0,
    lastChallengeDate: row?.last_challenge_date ?? '',
    profileName: row?.profile_name ?? '',
    streakShieldAvailable,
    profileEmoji: row?.profile_emoji ?? '',
    profileColor: row?.profile_color ?? '#4F46E5',
  };
}

export async function completeLesson(
  lessonId: string,
  score: number,
  xpEarned: number
): Promise<void> {
  const database = getDb();
  const today = new Date().toISOString().split('T')[0];

  const row = await database.getFirstAsync<{
    xp: number;
    streak: number;
    last_active_date: string;
    daily_xp_today: number;
    longest_streak: number;
    streak_shield_last_used: string;
  }>('SELECT xp, streak, last_active_date, daily_xp_today, longest_streak, streak_shield_last_used FROM user_progress WHERE id = 1');

  const lastActive = row?.last_active_date ?? '';
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = row?.streak ?? 0;
  const shieldUsedToday = (row?.streak_shield_last_used ?? '') === today;

  if (lastActive !== today) {
    if (lastActive === yesterday || shieldUsedToday) {
      newStreak = newStreak + 1;
    } else {
      newStreak = 1;
    }
  }

  const newLongestStreak = Math.max(row?.longest_streak ?? 0, newStreak);

  // 1.5× XP multiplier when streak ≥ 7
  const xpMultiplier = newStreak >= 7 ? 1.5 : 1.0;
  const effectiveXP = Math.round(xpEarned * xpMultiplier);
  const newDailyXP = lastActive === today ? (row?.daily_xp_today ?? 0) + effectiveXP : effectiveXP;

  await database.runAsync(
    `UPDATE user_progress SET xp = ?, streak = ?, last_active_date = ?, daily_xp_today = ?, longest_streak = ? WHERE id = 1`,
    [(row?.xp ?? 0) + effectiveXP, newStreak, today, newDailyXP, newLongestStreak]
  );

  await database.runAsync(
    'INSERT OR IGNORE INTO completed_lessons (lesson_id) VALUES (?)',
    [lessonId]
  );

  await database.runAsync(
    'INSERT INTO lesson_history (lesson_id, score, xp_earned, date) VALUES (?, ?, ?, ?)',
    [lessonId, score, effectiveXP, today]
  );
}

export async function recordWrongAnswer(wordId: string): Promise<void> {
  const database = getDb();
  const today = new Date().toISOString().split('T')[0];
  await database.runAsync(
    `INSERT INTO weak_words (word_id, wrong_count, last_wrong_date, interval, next_review_date, ease_factor)
     VALUES (?, 1, ?, 1, ?, 2.5)
     ON CONFLICT(word_id) DO UPDATE SET
       wrong_count = wrong_count + 1,
       last_wrong_date = ?,
       interval = 1,
       next_review_date = ?,
       ease_factor = MAX(1.3, ease_factor - 0.2)`,
    [wordId, today, today, today, today]
  );
}

export async function updateDailyGoal(goalXP: number): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET daily_goal_xp = ? WHERE id = 1',
    [goalXP]
  );
}

export async function updateTTSRate(rate: number): Promise<void> {
  await getDb().runAsync('UPDATE user_progress SET tts_rate = ? WHERE id = 1', [rate]);
}

export async function updateNotificationSettings(
  enabled: boolean,
  hour: number
): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET notifications_enabled = ?, notification_hour = ? WHERE id = 1',
    [enabled ? 1 : 0, hour]
  );
}

export async function getWeakWordsWithCounts(): Promise<{ wordId: string; wrongCount: number }[]> {
  const rows = await getDb().getAllAsync<{ word_id: string; wrong_count: number }>(
    'SELECT word_id, wrong_count FROM weak_words ORDER BY wrong_count DESC LIMIT 20'
  );
  return rows.map((r) => ({ wordId: r.word_id, wrongCount: r.wrong_count }));
}

// Direct removal — used by VocabScreen "Mark as practised"
export async function markWordReviewed(wordId: string): Promise<void> {
  const database = getDb();
  const result = await database.runAsync(
    'DELETE FROM weak_words WHERE word_id = ?',
    [wordId]
  );
  if (result.changes > 0) {
    await database.runAsync(
      'UPDATE user_progress SET words_mastered = words_mastered + 1 WHERE id = 1'
    );
  }
}

const MASTERY_INTERVAL = 21; // days — word is mastered when interval reaches this

// SRS scheduling — used by ReviewScreen after each answer
export async function scheduleWordReview(
  wordId: string,
  correct: boolean
): Promise<{ mastered: boolean; newInterval: number }> {
  const database = getDb();
  const today = new Date().toISOString().split('T')[0];

  if (!correct) {
    await database.runAsync(
      `UPDATE weak_words SET
         wrong_count = wrong_count + 1,
         last_wrong_date = ?,
         interval = 1,
         next_review_date = ?,
         ease_factor = MAX(1.3, ease_factor - 0.2)
       WHERE word_id = ?`,
      [today, today, wordId]
    );
    return { mastered: false, newInterval: 1 };
  }

  const row = await database.getFirstAsync<{ interval: number; ease_factor: number }>(
    'SELECT interval, ease_factor FROM weak_words WHERE word_id = ?',
    [wordId]
  );
  if (!row) return { mastered: false, newInterval: 1 };

  const newEase = Math.min(3.0, (row.ease_factor ?? 2.5) + 0.1);
  const newInterval = Math.max(1, Math.round((row.interval ?? 1) * newEase));

  if (newInterval >= MASTERY_INTERVAL) {
    await database.runAsync('DELETE FROM weak_words WHERE word_id = ?', [wordId]);
    await database.runAsync(
      'UPDATE user_progress SET words_mastered = words_mastered + 1 WHERE id = 1'
    );
    return { mastered: true, newInterval: 0 };
  }

  const nextDate = new Date(Date.now() + newInterval * 86400000).toISOString().split('T')[0];
  await database.runAsync(
    'UPDATE weak_words SET interval = ?, next_review_date = ?, ease_factor = ? WHERE word_id = ?',
    [newInterval, nextDate, newEase, wordId]
  );
  return { mastered: false, newInterval };
}

// Words due for review today (next_review_date <= today or never set)
export async function getDueReviewWords(): Promise<{
  wordId: string;
  wrongCount: number;
  interval: number;
  nextReviewDate: string;
}[]> {
  const today = new Date().toISOString().split('T')[0];
  const rows = await getDb().getAllAsync<{
    word_id: string;
    wrong_count: number;
    interval: number;
    next_review_date: string;
  }>(
    `SELECT word_id, wrong_count, interval, next_review_date
     FROM weak_words
     WHERE next_review_date <= ? OR next_review_date = ''
     ORDER BY next_review_date ASC, wrong_count DESC`,
    [today]
  );
  return rows.map((r) => ({
    wordId: r.word_id,
    wrongCount: r.wrong_count ?? 0,
    interval: r.interval ?? 1,
    nextReviewDate: r.next_review_date ?? '',
  }));
}

// Earliest future review date (for "all caught up" state)
export async function getNextScheduledReview(): Promise<string | null> {
  const today = new Date().toISOString().split('T')[0];
  const row = await getDb().getFirstAsync<{ next_review_date: string }>(
    `SELECT next_review_date FROM weak_words
     WHERE next_review_date > ?
     ORDER BY next_review_date ASC LIMIT 1`,
    [today]
  );
  return row?.next_review_date ?? null;
}

export async function awardXP(amount: number): Promise<void> {
  const database = getDb();
  const today = new Date().toISOString().split('T')[0];
  const row = await database.getFirstAsync<{
    xp: number;
    streak: number;
    last_active_date: string;
    daily_xp_today: number;
  }>('SELECT xp, streak, last_active_date, daily_xp_today FROM user_progress WHERE id = 1');
  const lastActive = row?.last_active_date ?? '';
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = row?.streak ?? 0;
  const newDailyXP = lastActive === today ? (row?.daily_xp_today ?? 0) + amount : amount;
  if (lastActive !== today) {
    newStreak = lastActive === yesterday ? newStreak + 1 : 1;
  }
  await database.runAsync(
    'UPDATE user_progress SET xp = ?, streak = ?, last_active_date = ?, daily_xp_today = ? WHERE id = 1',
    [(row?.xp ?? 0) + amount, newStreak, today, newDailyXP]
  );
}

export async function updateDeveloperMode(enabled: boolean): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET developer_mode = ? WHERE id = 1',
    [enabled ? 1 : 0]
  );
}

export async function updateProfileName(name: string): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET profile_name = ? WHERE id = 1',
    [name]
  );
}

export async function setProfileCharacter(emoji: string, color: string): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET profile_emoji = ?, profile_color = ? WHERE id = 1',
    [emoji, color]
  );
}

export async function getThemeMode(): Promise<'system' | 'light' | 'dark'> {
  const row = await getDb().getFirstAsync<{ theme_mode: string }>(
    'SELECT theme_mode FROM user_progress WHERE id = 1'
  );
  const mode = row?.theme_mode ?? 'system';
  return mode === 'light' || mode === 'dark' ? mode : 'system';
}

export async function updateThemeMode(mode: 'system' | 'light' | 'dark'): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET theme_mode = ? WHERE id = 1',
    [mode]
  );
}

export async function getSoundsEnabled(): Promise<boolean> {
  const row = await getDb().getFirstAsync<{ sounds_enabled: number }>(
    'SELECT sounds_enabled FROM user_progress WHERE id = 1'
  );
  return (row?.sounds_enabled ?? 1) === 1;
}

export async function updateSoundsEnabled(enabled: boolean): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET sounds_enabled = ? WHERE id = 1',
    [enabled ? 1 : 0]
  );
}

export async function getLastStreakCelebrated(): Promise<number> {
  const row = await getDb().getFirstAsync<{ last_streak_celebrated: number }>(
    'SELECT last_streak_celebrated FROM user_progress WHERE id = 1'
  );
  return row?.last_streak_celebrated ?? 0;
}

export async function setLastStreakCelebrated(milestone: number): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET last_streak_celebrated = ? WHERE id = 1',
    [milestone]
  );
}

export async function resetUnit(lessonIds: string[], wordIds: string[]): Promise<void> {
  const database = getDb();
  if (lessonIds.length > 0) {
    const ph = lessonIds.map(() => '?').join(',');
    await database.runAsync(`DELETE FROM completed_lessons WHERE lesson_id IN (${ph})`, lessonIds);
  }
  if (wordIds.length > 0) {
    const ph = wordIds.map(() => '?').join(',');
    await database.runAsync(`DELETE FROM weak_words WHERE word_id IN (${ph})`, wordIds);
  }
}

export async function unlockAchievement(badgeId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await getDb().runAsync(
    'INSERT OR IGNORE INTO achievements (badge_id, unlocked_at) VALUES (?, ?)',
    [badgeId, today]
  );
}

export async function getUnlockedAchievements(): Promise<{ badgeId: string; unlockedAt: string }[]> {
  const rows = await getDb().getAllAsync<{ badge_id: string; unlocked_at: string }>(
    'SELECT badge_id, unlocked_at FROM achievements'
  );
  return rows.map((r) => ({ badgeId: r.badge_id, unlockedAt: r.unlocked_at }));
}

export async function getWordsMastered(): Promise<number> {
  const row = await getDb().getFirstAsync<{ words_mastered: number }>(
    'SELECT words_mastered FROM user_progress WHERE id = 1'
  );
  return row?.words_mastered ?? 0;
}

export async function getXPHistory(days: number): Promise<{ date: string; xp: number }[]> {
  const database = getDb();
  const cutoff = new Date(Date.now() - (days - 1) * 86400000).toISOString().split('T')[0];
  const rows = await database.getAllAsync<{ date: string; xp: number }>(
    'SELECT date, SUM(xp_earned) as xp FROM lesson_history WHERE date >= ? GROUP BY date',
    [cutoff]
  );
  const map = Object.fromEntries(rows.map((r) => [r.date, r.xp]));
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86400000);
    const date = d.toISOString().split('T')[0];
    return { date, xp: map[date] ?? 0 };
  });
}

export async function setOnboardingComplete(startingUnitId: string): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET has_completed_onboarding = 1, starting_unit_id = ? WHERE id = 1',
    [startingUnitId]
  );
}

export async function getFavourites(): Promise<string[]> {
  const rows = await getDb().getAllAsync<{ word_id: string }>(
    'SELECT word_id FROM favourite_words'
  );
  return rows.map((r) => r.word_id);
}

export async function toggleFavourite(wordId: string): Promise<boolean> {
  const database = getDb();
  const existing = await database.getFirstAsync(
    'SELECT 1 FROM favourite_words WHERE word_id = ?',
    [wordId]
  );
  if (existing) {
    await database.runAsync('DELETE FROM favourite_words WHERE word_id = ?', [wordId]);
    return false;
  } else {
    await database.runAsync('INSERT INTO favourite_words (word_id) VALUES (?)', [wordId]);
    return true;
  }
}

export async function completeDailyChallenge(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await getDb().runAsync(
    'UPDATE user_progress SET last_challenge_date = ? WHERE id = 1',
    [today]
  );
  await awardXP(25);
}

export async function clearAllProgress(): Promise<void> {
  const database = getDb();
  await database.runAsync(
    `UPDATE user_progress SET streak = 0, last_active_date = '', xp = 0,
     daily_xp_today = 0, has_completed_onboarding = 0, starting_unit_id = 'unit_01',
     longest_streak = 0, words_mastered = 0, last_challenge_date = '',
     streak_shield_last_used = '' WHERE id = 1`
  );
  await database.runAsync('DELETE FROM completed_lessons');
  await database.runAsync('DELETE FROM lesson_history');
  await database.runAsync('DELETE FROM weak_words');
  await database.runAsync('DELETE FROM achievements');
  await database.runAsync('DELETE FROM favourite_words');
}
