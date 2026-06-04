export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    streak INTEGER NOT NULL DEFAULT 0,
    last_active_date TEXT NOT NULL DEFAULT '',
    xp INTEGER NOT NULL DEFAULT 0,
    daily_goal_xp INTEGER NOT NULL DEFAULT 20,
    daily_xp_today INTEGER NOT NULL DEFAULT 0,
    has_completed_onboarding INTEGER NOT NULL DEFAULT 0,
    starting_unit_id TEXT NOT NULL DEFAULT 'unit_01'
  );

  CREATE TABLE IF NOT EXISTS completed_lessons (
    lesson_id TEXT PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS lesson_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS weak_words (
    word_id TEXT PRIMARY KEY,
    wrong_count INTEGER NOT NULL DEFAULT 1,
    last_wrong_date TEXT NOT NULL DEFAULT ''
  );
`;

export const DEFAULT_PROGRESS_SQL = `
  INSERT OR IGNORE INTO user_progress (id, streak, last_active_date, xp, daily_goal_xp, daily_xp_today)
  VALUES (1, 0, '', 0, 20, 0);
`;
