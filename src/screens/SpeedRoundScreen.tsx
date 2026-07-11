import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { WORDS_BY_ID } from '../data/words';
import { playSound } from '../utils/sounds';
import { awardXP, recordWrongAnswer, scheduleWordReview } from '../database/db';
import { fonts, gradients, radius, shadows, type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
import type { RootStackParamList } from '../types';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'SpeedRound'>;

const NUM_QUESTIONS      = 10;
const QUESTION_DURATION  = 5000; // ms per question
const FEEDBACK_DURATION  = 650;  // ms to show correct/wrong before advancing
const XP_SPEED_ROUND     = 40;

type Question = {
  wordId: string;
  spanish: string;
  correctAnswer: string;
  options: string[];
};

type Phase = 'playing' | 'feedback' | 'finished';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(wordIds: string[]): Question[] {
  const available = wordIds.filter((id) => WORDS_BY_ID[id]);
  const pool = shuffle(available);
  const sampled = pool.slice(0, NUM_QUESTIONS);

  return sampled.map((id) => {
    const word = WORDS_BY_ID[id]!;
    const others = available.filter((oid) => oid !== id);
    const distractors = shuffle(others)
      .slice(0, 3)
      .map((oid) => WORDS_BY_ID[oid]!.english);
    return {
      wordId: id,
      spanish: word.spanish,
      correctAnswer: word.english,
      options: shuffle([word.english, ...distractors]),
    };
  });
}

export default function SpeedRoundScreen() {
  const { c } = useTheme();
  const styles     = useThemedStyles(createStyles);
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { wordIds, sectionLabel } = route.params;

  const [questions]    = useState(() => buildQuestions(wordIds));
  const [currentIdx,   setCurrentIdx]   = useState(0);
  const [phase,        setPhase]        = useState<Phase>('playing');
  const [selected,     setSelected]     = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wasCorrect,   setWasCorrect]   = useState(false);

  const barAnim         = useRef(new Animated.Value(1)).current;
  const scaleAnim       = useRef(new Animated.Value(0)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const timerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barAnimRef      = useRef<Animated.CompositeAnimation | null>(null);
  const xpAwarded       = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    barAnimRef.current?.stop();
  };

  const advance = useCallback(() => {
    setCurrentIdx((idx) => {
      const next = idx + 1;
      if (next >= questions.length) {
        return idx; // will be handled by useEffect on phase
      }
      return next;
    });
    setSelected(null);
    setPhase('playing');
  }, [questions.length]);

  const startQuestion = useCallback((wordId: string) => {
    barAnim.setValue(1);
    barAnimRef.current = Animated.timing(barAnim, {
      toValue: 0,
      duration: QUESTION_DURATION,
      useNativeDriver: false,
    });
    barAnimRef.current.start(({ finished }) => {
      if (finished) {
        // Timed out — treat as wrong
        setWasCorrect(false);
        setPhase('feedback');
        playSound('wrong');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        recordWrongAnswer(wordId).catch(() => {});
      }
    });
  }, [barAnim]);

  useEffect(() => {
    if (phase === 'playing') {
      startQuestion(questions[currentIdx].wordId);
    } else if (phase === 'feedback') {
      clearTimer();
      timerRef.current = setTimeout(() => {
        if (currentIdx + 1 >= questions.length) {
          setPhase('finished');
        } else {
          advance();
        }
      }, FEEDBACK_DURATION);
    } else if (phase === 'finished') {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (!xpAwarded.current) {
        xpAwarded.current = true;
        const earned = Math.round((correctCount / questions.length) * XP_SPEED_ROUND);
        awardXP(earned).catch(() => {});
      }
    }
    return () => {
      if (phase === 'playing') clearTimer();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIdx]);

  const handleOption = (option: string) => {
    if (phase !== 'playing') return;
    clearTimer();
    const correct = option === questions[currentIdx].correctAnswer;
    setSelected(option);
    setWasCorrect(correct);
    setPhase('feedback');

    if (correct) {
      setCorrectCount((n) => n + 1);
      playSound('correct');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scheduleWordReview(questions[currentIdx].wordId, true).catch(() => {});
    } else {
      playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      recordWrongAnswer(questions[currentIdx].wordId).catch(() => {});
    }
  };

  // ── Finished ───────────────────────────────────────────────────────────────────
  if (phase === 'finished') {
    const accuracy    = Math.round((correctCount / questions.length) * 100);
    const xpEarned    = Math.round((correctCount / questions.length) * XP_SPEED_ROUND);
    const starRating  = accuracy >= 80 ? '⭐⭐⭐' : accuracy >= 50 ? '⭐⭐' : '⭐';

    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={['#6366F1', '#4F46E5', '#4338CA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.finishedBg}
        >
          <Animated.View style={[styles.finishedCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.finishedEmoji}>{starRating}</Text>
            <Text style={styles.finishedTitle}>Speed Round Done!</Text>
            <Text style={styles.finishedSub}>{sectionLabel} · Rapid Fire</Text>
            <View style={styles.finishedStats}>
              <View style={styles.finishedStat}>
                <Text style={styles.finishedStatValue}>{correctCount}/{questions.length}</Text>
                <Text style={styles.finishedStatLabel}>Correct</Text>
              </View>
              <View style={styles.finishedStatDiv} />
              <View style={styles.finishedStat}>
                <Text style={styles.finishedStatValue}>{accuracy}%</Text>
                <Text style={styles.finishedStatLabel}>Accuracy</Text>
              </View>
              <View style={styles.finishedStatDiv} />
              <View style={styles.finishedStat}>
                <Text style={[styles.finishedStatValue, { color: '#6366F1' }]}>+{xpEarned}</Text>
                <Text style={styles.finishedStatLabel}>XP</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={gradients.hero}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.doneBtnGrad}
              >
                <Text style={styles.doneBtnText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // ── Playing / Feedback ──────────────────────────────────────────────────────────
  const question = questions[currentIdx];

  const barColor = barAnim.interpolate({
    inputRange:  [0, 0.25, 0.6, 1],
    outputRange: ['#EF4444', '#F59E0B', '#10B981', '#6366F1'],
  });

  const barWidth = barAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => { clearTimer(); navigation.goBack(); }} style={styles.backBtn}>
          <Text style={styles.backBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Speed Round</Text>
          <Text style={styles.headerSub}>{sectionLabel}</Text>
        </View>
        <View style={styles.qCounter}>
          <Text style={styles.qNum}>{currentIdx + 1}</Text>
          <Text style={styles.qTotal}>/{questions.length}</Text>
        </View>
      </LinearGradient>

      {/* Timer bar */}
      <View style={styles.timerTrack}>
        <Animated.View style={[styles.timerFill, { width: barWidth, backgroundColor: barColor }]} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Progress dots */}
        <View style={styles.progressRow}>
          {questions.map((_, i) => {
            const isCurrentOrFuture = i >= currentIdx;
            const isDone = i < currentIdx;
            return (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  isDone && styles.progressDotDone,
                  i === currentIdx && styles.progressDotCurrent,
                ]}
              />
            );
          })}
        </View>

        {/* Spanish word card */}
        <View style={styles.wordCard}>
          <Text style={styles.wordLabel}>Translate to English</Text>
          <Text style={styles.wordSpanish}>{question.spanish}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsGrid}>
          {question.options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrect  = option === question.correctAnswer;

            let bg     = c.card;
            let border = c.border;
            let color  = c.text;

            if (phase === 'feedback') {
              if (isCorrect) {
                bg = c.greenSoft; border = c.green; color = c.green;
              } else if (isSelected) {
                bg = c.redSoft; border = c.red; color = c.red;
              }
            }

            return (
              <TouchableOpacity
                key={i}
                style={[styles.optionBtn, { backgroundColor: bg, borderColor: border }]}
                onPress={() => handleOption(option)}
                disabled={phase !== 'playing'}
                activeOpacity={0.72}
              >
                <Text style={[styles.optionText, { color }]} numberOfLines={2} adjustsFontSizeToFit>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feedback banner */}
        {phase === 'feedback' && (
          <View
            style={[
              styles.feedbackBanner,
              wasCorrect ? styles.feedbackBannerCorrect : styles.feedbackBannerWrong,
            ]}
          >
            <Text style={styles.feedbackText}>
              {wasCorrect ? '✓  Correct!' : `✗  Answer: ${question.correctAnswer}`}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn:      { padding: 4, width: 32 },
  backBtnText:  { fontSize: 18, color: 'rgba(255,255,255,0.8)' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 18, fontFamily: fonts.display, color: '#FFFFFF' },
  headerSub:    { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  qCounter:     { flexDirection: 'row', alignItems: 'baseline', width: 40, justifyContent: 'center' },
  qNum:         { fontSize: 20, fontFamily: fonts.display, color: '#FFFFFF' },
  qTotal:       { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  // Timer bar
  timerTrack: {
    height: 5,
    backgroundColor: c.borderLight,
    width: '100%',
  },
  timerFill: {
    height: 5,
    borderRadius: 2.5,
  },

  // Body
  body: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.borderLight,
    borderWidth: 1.5,
    borderColor: c.border,
  },
  progressDotDone: {
    backgroundColor: c.green,
    borderColor: c.green,
  },
  progressDotCurrent: {
    backgroundColor: c.indigo,
    borderColor: c.indigo,
    transform: [{ scale: 1.3 }],
  },

  // Word card
  wordCard: {
    backgroundColor: c.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: c.border,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    ...shadows.card,
  },
  wordLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: c.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  wordSpanish: {
    fontSize: 30,
    fontFamily: fonts.display,
    color: c.text,
    textAlign: 'center',
    lineHeight: 38,
  },

  // Options
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionBtn: {
    width: '48%',
    minHeight: 64,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...shadows.card,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 19,
  },

  // Feedback banner
  feedbackBanner: {
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  feedbackBannerCorrect: { backgroundColor: c.greenSoft },
  feedbackBannerWrong:   { backgroundColor: c.redSoft },
  feedbackText: {
    fontSize: 15,
    fontWeight: '700',
    color: c.text,
  },

  // Finished
  finishedBg:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  finishedCard: {
    backgroundColor: c.card,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    gap: 8,
    ...shadows.floating,
  },
  finishedEmoji:      { fontSize: 40, marginBottom: 4 },
  finishedTitle:      { fontSize: 24, fontFamily: fonts.display, color: c.text },
  finishedSub:        { fontSize: 13, color: c.textSecondary, fontWeight: '600', marginBottom: 8 },
  finishedStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: c.borderLight,
    paddingTop: 16,
    marginTop: 4,
    width: '100%',
  },
  finishedStat:      { flex: 1, alignItems: 'center', gap: 4 },
  finishedStatValue: { fontSize: 22, fontFamily: fonts.display, color: c.text },
  finishedStatLabel: { fontSize: 11, color: c.textMuted, fontWeight: '600' },
  finishedStatDiv:   { width: 1, backgroundColor: c.borderLight, marginVertical: 4 },
  doneBtn:           { width: '100%', borderRadius: radius.md, overflow: 'hidden', marginTop: 8 },
  doneBtnGrad:       { paddingVertical: 16, alignItems: 'center' },
  doneBtnText:       { fontSize: 16, fontFamily: fonts.display, color: '#FFFFFF' },
});
