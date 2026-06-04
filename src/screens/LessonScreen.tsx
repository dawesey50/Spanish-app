import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import type { RootStackParamList, Question, Correction } from '../types';
import { LESSONS_BY_ID } from '../data/units';
import { WORDS_BY_ID } from '../data/words';
import { completeLesson, recordWrongAnswer } from '../database/db';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Lesson'>;

const XP_PER_CORRECT = 10;
const XP_PER_LESSON_BONUS = 20;

function buildQuestions(lessonId: string): Question[] {
  const lesson = LESSONS_BY_ID[lessonId];
  if (!lesson) return [];

  const questions: Question[] = [];

  lesson.wordIds.forEach((wordId) => {
    const word = WORDS_BY_ID[wordId];
    if (!word) return;

    const allWords = Object.values(WORDS_BY_ID);
    const distractors = allWords
      .filter((w) => w.id !== wordId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.english);

    const options = [...distractors, word.english].sort(() => Math.random() - 0.5);

    questions.push({
      id: `q_mc_${wordId}`,
      type: 'multipleChoice',
      wordId,
      prompt: `What does "${word.spanish}" mean?`,
      correctAnswer: word.english,
      options,
    });

    if (lesson.questionTypes.includes('typing')) {
      questions.push({
        id: `q_type_${wordId}`,
        type: 'typing',
        wordId,
        prompt: `Type the Spanish for: "${word.english}"`,
        correctAnswer: word.spanish,
      });
    }

    if (lesson.questionTypes.includes('listening')) {
      questions.push({
        id: `q_listen_${wordId}`,
        type: 'listening',
        wordId,
        prompt: 'Listen and type what you hear:',
        correctAnswer: word.spanish,
        audioText: word.spanish,
        options,
      });
    }
  });

  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿¡]/g, '');
}

function isCorrect(answer: string, correct: string): boolean {
  const a = normalize(answer);
  const c = normalize(correct);
  if (a === c) return true;
  // allow 1 typo for strings longer than 4 chars
  if (c.length > 4 && levenshtein(a, c) === 1) return true;
  return false;
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

export default function LessonScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { lessonId } = route.params;

  const [questions] = useState(() => buildQuestions(lessonId));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const current = questions[index];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: index / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [index]);

  useEffect(() => {
    if (current?.type === 'listening' && current.audioText) {
      Speech.speak(current.audioText, { language: 'es', rate: 0.8 });
    }
  }, [index]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const checkAnswer = (answer: string) => {
    if (revealed) return;
    const correct = isCorrect(answer, current.correctAnswer);
    setSelected(answer);
    setRevealed(true);

    if (correct) {
      setCorrectCount((n) => n + 1);
    } else {
      shake();
      recordWrongAnswer(current.wordId);
      setCorrections((prev) => [
        ...prev,
        {
          original: answer,
          corrected: current.correctAnswer,
          explanation: `"${answer}" is incorrect. The correct answer is "${current.correctAnswer}".`,
        },
      ]);
    }
  };

  const next = async () => {
    setSelected(null);
    setTypedAnswer('');
    setRevealed(false);

    if (index + 1 >= questions.length) {
      const score = Math.round((correctCount / questions.length) * 100);
      const xpEarned = correctCount * XP_PER_CORRECT + XP_PER_LESSON_BONUS;
      await completeLesson(lessonId, score, xpEarned);
      navigation.replace('Results', { lessonId, score, xpEarned, corrections });
    } else {
      setIndex((i) => i + 1);
    }
  };

  const confirmQuit = () => {
    Alert.alert('Quit Lesson?', 'Your progress will not be saved.', [
      { text: 'Keep Going', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  if (!current) return null;

  const answerGiven = current.type === 'typing' || current.type === 'listening'
    ? typedAnswer.trim().length > 0
    : selected !== null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Progress bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={confirmQuit} style={styles.quitBtn}>
            <Text style={styles.quitText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.counter}>
            {index + 1}/{questions.length}
          </Text>
        </View>

        <Animated.View style={[styles.content, { transform: [{ translateX: shakeAnim }] }]}>
          {/* Question type badge */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {current.type === 'multipleChoice'
                ? '🔤 Multiple Choice'
                : current.type === 'typing'
                ? '⌨️ Type the Answer'
                : '🔊 Listening'}
            </Text>
          </View>

          <Text style={styles.prompt}>{current.prompt}</Text>

          {current.type === 'listening' && (
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() =>
                Speech.speak(current.audioText!, { language: 'es', rate: 0.8 })
              }
            >
              <Text style={styles.playBtnText}>🔊 Play Again</Text>
            </TouchableOpacity>
          )}

          {/* Multiple choice options */}
          {(current.type === 'multipleChoice' || current.type === 'listening') &&
            current.type !== 'typing' &&
            current.options && (
              <View style={styles.options}>
                {current.options.map((opt) => {
                  const isSelected = selected === opt;
                  const isRight = opt === current.correctAnswer;
                  let bg = '#FFFFFF';
                  if (revealed && isSelected && isRight) bg = '#D1FAE5';
                  if (revealed && isSelected && !isRight) bg = '#FEE2E2';
                  if (revealed && !isSelected && isRight) bg = '#D1FAE5';

                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.option, { backgroundColor: bg }]}
                      onPress={() => checkAnswer(opt)}
                      disabled={revealed}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionText}>{opt}</Text>
                      {revealed && isRight && <Text>✓</Text>}
                      {revealed && isSelected && !isRight && <Text>✗</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

          {/* Typing input */}
          {current.type === 'typing' && (
            <View style={styles.typingArea}>
              <TextInput
                style={[
                  styles.input,
                  revealed &&
                    (isCorrect(typedAnswer, current.correctAnswer)
                      ? styles.inputCorrect
                      : styles.inputWrong),
                ]}
                value={typedAnswer}
                onChangeText={setTypedAnswer}
                placeholder="Type your answer..."
                autoCorrect={false}
                autoCapitalize="none"
                editable={!revealed}
                onSubmitEditing={() => {
                  if (!revealed && typedAnswer.trim()) checkAnswer(typedAnswer.trim());
                }}
              />
              {revealed && !isCorrect(typedAnswer, current.correctAnswer) && (
                <Text style={styles.correction}>✓ {current.correctAnswer}</Text>
              )}
            </View>
          )}
        </Animated.View>

        {/* Footer button */}
        <View style={styles.footer}>
          {!revealed && (current.type === 'typing' || current.type === 'listening') && (
            <TouchableOpacity
              style={[styles.checkBtn, !typedAnswer.trim() && styles.checkBtnDisabled]}
              onPress={() => checkAnswer(typedAnswer.trim())}
              disabled={!typedAnswer.trim()}
            >
              <Text style={styles.checkBtnText}>Check</Text>
            </TouchableOpacity>
          )}
          {revealed && (
            <TouchableOpacity style={styles.nextBtn} onPress={next}>
              <Text style={styles.nextBtnText}>
                {index + 1 >= questions.length ? 'Finish' : 'Continue →'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  quitBtn: { padding: 4 },
  quitText: { fontSize: 18, color: '#6B7280' },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  counter: { fontSize: 13, color: '#6B7280', fontWeight: '600', width: 36, textAlign: 'right' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  typeText: { fontSize: 13, color: '#4F46E5', fontWeight: '600' },
  prompt: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 28,
    lineHeight: 30,
  },
  playBtn: {
    alignSelf: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 24,
  },
  playBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  options: { gap: 10 },
  option: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: { fontSize: 16, color: '#111827', fontWeight: '500', flex: 1 },
  typingArea: { gap: 8 },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputCorrect: { borderColor: '#059669', backgroundColor: '#D1FAE5' },
  inputWrong: { borderColor: '#DC2626', backgroundColor: '#FEE2E2' },
  correction: { fontSize: 16, color: '#059669', fontWeight: '600', paddingLeft: 4 },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
  checkBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  checkBtnDisabled: { backgroundColor: '#C7D2FE' },
  checkBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  nextBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  nextBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
