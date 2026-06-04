import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL, DEFAULT_PROGRESS_SQL } from './schema';
import type { UserProgress, LessonHistoryEntry } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('spanish_app.db');
  await db.execAsync(CREATE_TABLES_SQL);
  await db.execAsync(DEFAULT_PROGRESS_SQL);
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

  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive !== yesterday && lastActive !== '') {
      streak = 0;
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
  }>('SELECT xp, streak, last_active_date, daily_xp_today FROM user_progress WHERE id = 1');

  const lastActive = row?.last_active_date ?? '';
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = row?.streak ?? 0;
  let newDailyXP = lastActive === today ? (row?.daily_xp_today ?? 0) + xpEarned : xpEarned;

  if (lastActive !== today) {
    newStreak = lastActive === yesterday ? newStreak + 1 : 1;
  }

  await database.runAsync(
    `UPDATE user_progress SET xp = ?, streak = ?, last_active_date = ?, daily_xp_today = ? WHERE id = 1`,
    [(row?.xp ?? 0) + xpEarned, newStreak, today, newDailyXP]
  );

  await database.runAsync(
    'INSERT OR IGNORE INTO completed_lessons (lesson_id) VALUES (?)',
    [lessonId]
  );

  await database.runAsync(
    'INSERT INTO lesson_history (lesson_id, score, date) VALUES (?, ?, ?)',
    [lessonId, score, today]
  );
}

export async function recordWrongAnswer(wordId: string): Promise<void> {
  const database = getDb();
  const today = new Date().toISOString().split('T')[0];
  await database.runAsync(
    `INSERT INTO weak_words (word_id, wrong_count, last_wrong_date)
     VALUES (?, 1, ?)
     ON CONFLICT(word_id) DO UPDATE SET wrong_count = wrong_count + 1, last_wrong_date = ?`,
    [wordId, today, today]
  );
}

export async function updateDailyGoal(goalXP: number): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET daily_goal_xp = ? WHERE id = 1',
    [goalXP]
  );
}

export async function setOnboardingComplete(startingUnitId: string): Promise<void> {
  await getDb().runAsync(
    'UPDATE user_progress SET has_completed_onboarding = 1, starting_unit_id = ? WHERE id = 1',
    [startingUnitId]
  );
}

export async function clearAllProgress(): Promise<void> {
  const database = getDb();
  await database.runAsync(
    `UPDATE user_progress SET streak = 0, last_active_date = '', xp = 0,
     daily_xp_today = 0, has_completed_onboarding = 0, starting_unit_id = 'unit_01' WHERE id = 1`
  );
  await database.runAsync('DELETE FROM completed_lessons');
  await database.runAsync('DELETE FROM lesson_history');
  await database.runAsync('DELETE FROM weak_words');
}
