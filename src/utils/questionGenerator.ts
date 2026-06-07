import type { Question } from '../types';
import { LESSONS_BY_ID } from '../data/units';
import { WORDS_BY_ID, WORDS } from '../data/words';
import { SENTENCES_BY_LESSON } from '../data/sentences';

function isVoiceAvailable(): boolean {
  try {
    require('@react-native-voice/voice');
    return true;
  } catch {
    return false;
  }
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿¡]/g, '');
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export function isCorrect(answer: string, correct: string): boolean {
  const a = normalize(answer);
  const c = normalize(correct);
  if (a === c) return true;
  if (c.length > 4 && levenshtein(a, c) <= 1) return true;
  // Allow "el/la/los/las" article variants to be omitted
  const stripArticle = (s: string) =>
    s.replace(/^(el |la |los |las |un |una )/, '');
  if (stripArticle(a) === stripArticle(c)) return true;
  return false;
}

function getDistractors(
  wordId: string,
  lang: 'spanish' | 'english',
  topic: string,
  count = 3
): string[] {
  const pool = WORDS.filter((w) => w.id !== wordId);
  const sameTopic = pool.filter((w) => w.topic === topic).map((w) => w[lang]);
  const other = pool.filter((w) => w.topic !== topic).map((w) => w[lang]);
  const combined = [...new Set([...sameTopic, ...other])];
  return combined.sort(() => Math.random() - 0.5).slice(0, count);
}

export function buildQuestions(lessonId: string): Question[] {
  const lesson = LESSONS_BY_ID[lessonId];
  if (!lesson) return [];

  const words = lesson.wordIds.map((id) => WORDS_BY_ID[id]).filter(Boolean);
  const pool: Question[] = [];

  words.forEach((word) => {
    const esDistractors = getDistractors(word.id, 'spanish', word.topic);
    const enDistractors = getDistractors(word.id, 'english', word.topic);

    // ES→EN multiple choice
    pool.push({
      id: `mc_es_en_${word.id}`,
      type: 'multipleChoice',
      wordId: word.id,
      prompt: `What does "${word.spanish}" mean?`,
      correctAnswer: word.english,
      options: [...new Set([...enDistractors, word.english])]
        .slice(0, 4)
        .sort(() => Math.random() - 0.5),
    });

    // EN→ES multiple choice
    pool.push({
      id: `mc_en_es_${word.id}`,
      type: 'multipleChoice',
      wordId: word.id,
      prompt: `How do you say "${word.english}" in Spanish?`,
      correctAnswer: word.spanish,
      options: [...new Set([...esDistractors, word.spanish])]
        .slice(0, 4)
        .sort(() => Math.random() - 0.5),
    });

    // Typing: EN→ES
    if (lesson.questionTypes.includes('typing')) {
      pool.push({
        id: `type_${word.id}`,
        type: 'typing',
        wordId: word.id,
        prompt: `Type the Spanish for: "${word.english}"`,
        correctAnswer: word.spanish,
      });
    }

    // Listening: hear Spanish, select/type it
    if (lesson.questionTypes.includes('listening')) {
      pool.push({
        id: `listen_${word.id}`,
        type: 'listening',
        wordId: word.id,
        prompt: 'Listen and select what you hear:',
        correctAnswer: word.spanish,
        audioText: word.spanish,
        options: [...new Set([...esDistractors, word.spanish])]
          .slice(0, 4)
          .sort(() => Math.random() - 0.5),
      });
    }

    // Speaking: say the Spanish word aloud (dev builds only)
    if (lesson.questionTypes.includes('speaking') && isVoiceAvailable()) {
      pool.push({
        id: `speak_${word.id}`,
        type: 'speaking',
        wordId: word.id,
        prompt: '',
        correctAnswer: word.spanish,
      });
    }
  });

  // Ensure every word appears at least once, then fill to target length with randoms
  const mustInclude = words.map((w) => {
    const forWord = pool.filter((q) => q.wordId === w.id);
    return forWord[Math.floor(Math.random() * forWord.length)];
  });

  const rest = pool
    .filter((q) => !mustInclude.find((m) => m.id === q.id))
    .sort(() => Math.random() - 0.5);

  const wordQuestions = [...mustInclude, ...rest].slice(0, Math.max(words.length, 10));

  // Add sentence builder questions (1 per sentence, shuffled position)
  const sentenceQuestions = buildSentenceQuestions(lessonId);
  if (sentenceQuestions.length === 0) return wordQuestions;

  const result = [...wordQuestions];
  sentenceQuestions.forEach((sq) => {
    const pos = Math.floor(Math.random() * (result.length + 1));
    result.splice(pos, 0, sq);
  });
  return result;
}

function buildSentenceQuestions(lessonId: string): Question[] {
  const sentences = SENTENCES_BY_LESSON[lessonId];
  if (!sentences?.length) return [];
  return sentences.map((s) => {
    const shuffled = [...s.tokens, ...s.distractors].sort(() => Math.random() - 0.5);
    return {
      id: `sb_${s.id}`,
      type: 'sentenceBuilder' as const,
      prompt: s.english,
      correctAnswer: s.spanish,
      tokens: shuffled,
    };
  });
}

export function buildReviewQuestions(wordIds: string[]): Question[] {
  const words = wordIds.map((id) => WORDS_BY_ID[id]).filter(Boolean);
  return words
    .map((word) => {
      const esDistractors = getDistractors(word.id, 'spanish', word.topic);
      const enDistractors = getDistractors(word.id, 'english', word.topic);
      const candidates: Question[] = [
        {
          id: `rev_mc_${word.id}`,
          type: 'multipleChoice',
          wordId: word.id,
          prompt: `What does "${word.spanish}" mean?`,
          correctAnswer: word.english,
          options: [...new Set([...enDistractors, word.english])]
            .slice(0, 4)
            .sort(() => Math.random() - 0.5),
        },
        {
          id: `rev_type_${word.id}`,
          type: 'typing',
          wordId: word.id,
          prompt: `Type the Spanish for: "${word.english}"`,
          correctAnswer: word.spanish,
        },
        {
          id: `rev_listen_${word.id}`,
          type: 'listening',
          wordId: word.id,
          prompt: 'Listen and select what you hear:',
          correctAnswer: word.spanish,
          audioText: word.spanish,
          options: [...new Set([...esDistractors, word.spanish])]
            .slice(0, 4)
            .sort(() => Math.random() - 0.5),
        },
      ];
      return candidates[Math.floor(Math.random() * candidates.length)];
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 15);
}
