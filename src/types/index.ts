export type QuestionType = 'multipleChoice' | 'typing' | 'listening' | 'speaking' | 'sentenceBuilder';

export interface Word {
  id: string;
  spanish: string;
  english: string;
  example: string;
  topic: string;
  difficulty: 1 | 2 | 3;
  gender?: 'm' | 'f' | null;
}

export interface GrammarNote {
  tip: string;
  examples: { spanish: string; english: string }[];
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  questionTypes: QuestionType[];
  wordIds: string[];
  grammarNote?: GrammarNote;
  lessonType?: 'standard' | 'review';
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
  icon: string;
}

export interface LessonHistoryEntry {
  lessonId: string;
  score: number;
  date: string;
}

export interface UserProgress {
  streak: number;
  lastActiveDate: string;
  xp: number;
  dailyGoalXP: number;
  dailyXPToday: number;
  completedLessons: string[];
  history: LessonHistoryEntry[];
  weakWords: string[];
  hasCompletedOnboarding: boolean;
  startingUnitId: string;
  ttsRate: number;
  notificationsEnabled: boolean;
  notificationHour: number;
  developerMode: boolean;
  longestStreak: number;
  wordsMastered: number;
  lastChallengeDate: string;
  profileName: string;
  streakShieldAvailable: boolean;
  shieldUsedDate: string;
  profileEmoji: string;
  profileColor: string;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Lesson: { lessonId: string };
  Conversation: { scenario?: string };
  Results: {
    lessonId: string;
    score: number;
    xpEarned: number;
    corrections: Correction[];
    wordResults?: { wordId: string; correct: boolean }[];
  };
  Achievements: undefined;
  DailyChallenge: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Review: undefined;
  Vocab: undefined;
  Progress: undefined;
  Profile: undefined;
};

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  wordId?: string;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  audioText?: string;
  tokens?: string[];
}

export interface Sentence {
  id: string;
  lessonId: string;
  english: string;
  spanish: string;
  tokens: string[];
  distractors: string[];
}
