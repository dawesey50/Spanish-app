import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Image,
} from 'react-native';

const TYPE_BADGE_ICONS: Record<string, ReturnType<typeof require>> = {
  multipleChoice: require('../../assets/badges/multiple_chioice.png'),
  typing: require('../../assets/badges/typing.png'),
  listening: require('../../assets/badges/listening.png'),
};
const TICK_ICON = require('../../assets/icons/green_tick.png');
const CROSS_ICON = require('../../assets/icons/red_cross.png');
const STAR_ICON = require('../../assets/icons/star.png');
const BOOK_ICON = require('../../assets/icons/blue_icon_book.png');
const TARGET_ICON = require('../../assets/icons/blue_target.png');

import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import PrimaryButton from '../components/PrimaryButton';
import { WORDS_BY_ID } from '../data/words';
import {
  getDueReviewWords,
  getNextScheduledReview,
  scheduleWordReview,
  awardXP,
  getUserProgress,
  getUnlockedAchievements,
  unlockAchievement,
  getWordsMastered,
} from '../database/db';
import { checkAchievements } from '../data/achievements';
import { fireAchievementToast } from '../utils/achievementEvents';
import { buildReviewQuestions, isCorrect } from '../utils/questionGenerator';
import AudioButton from '../components/AudioButton';
import { colors, radius, shadows } from '../theme';
import type { Question } from '../types';

const XP_PER_CORRECT = 5;

type ReviewPhase = 'list' | 'session' | 'results';

interface DueWord {
  wordId: string;
  wrongCount: number;
  interval: number;
  nextReviewDate: string;
}

interface ReviewResult {
  wordId: string;
  correct: boolean;
  mastered: boolean;
  newInterval: number;
}

function masteryLevel(interval: number): { label: string; bg: string; color: string } {
  if (interval >= 8) return { label: 'Strong', bg: '#D1FAE5', color: '#065F46' };
  if (interval >= 4) return { label: 'Familiar', bg: '#EEF2FF', color: '#4338CA' };
  if (interval >= 2) return { label: 'Learning', bg: '#FEF3C7', color: '#92400E' };
  return { label: 'Struggling', bg: '#FEE2E2', color: '#991B1B' };
}

function daysUntilLabel(dateStr: string): string {
  if (!dateStr) return 'today';
  const diff = Math.round(
    (new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000
  );
  if (diff <= 0) return 'today';
  if (diff === 1) return 'tomorrow';
  return `in ${diff} days`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export default function ReviewScreen() {
  const [phase, setPhase] = useState<ReviewPhase>('list');
  const [dueWords, setDueWords] = useState<DueWord[]>([]);
  const [totalScheduled, setTotalScheduled] = useState(0);
  const [nextScheduledDate, setNextScheduledDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [ttsRate, setTtsRate] = useState(0.8);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const resultsRef = useRef<ReviewResult[]>([]);

  const loadState = useCallback(() => {
    (async () => {
      setLoading(true);
      const [due, nextDate, progress] = await Promise.all([
        getDueReviewWords(),
        getNextScheduledReview(),
        getUserProgress(),
      ]);
      setDueWords(due);
      setNextScheduledDate(nextDate);
      setTotalScheduled(due.length + (nextDate ? 1 : 0));
      setTtsRate(progress.ttsRate);
      setLoading(false);
    })();
  }, []);

  useFocusEffect(loadState);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const startSession = () => {
    const qs = buildReviewQuestions(dueWords.map((w) => w.wordId));
    setQuestions(qs);
    setIndex(0);
    setSelected(null);
    setTypedAnswer('');
    setRevealed(false);
    setResults([]);
    resultsRef.current = [];
    progressAnim.setValue(0);
    setPhase('session');
  };

  const current = questions[index];

  const wasCorrect =
    revealed &&
    !!current &&
    (current.type === 'typing'
      ? isCorrect(typedAnswer, current.correctAnswer)
      : selected === current.correctAnswer);

  const checkAnswer = (answer: string) => {
    if (revealed || !current) return;
    setSelected(answer);
    setRevealed(true);
    if (isCorrect(answer, current.correctAnswer)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = async () => {
    const isLast = index + 1 >= questions.length;
    setSelected(null);
    setTypedAnswer('');
    setRevealed(false);

    if (isLast) {
      const finalResults = [...resultsRef.current, { wordId: current.wordId ?? '', correct: wasCorrect, mastered: false, newInterval: 1 }];

      const correctCount = finalResults.filter((r) => r.correct).length;
      if (correctCount > 0) await awardXP(correctCount * XP_PER_CORRECT);

      const scheduled = await Promise.all(
        finalResults.map((r) => r.wordId ? scheduleWordReview(r.wordId, r.correct) : Promise.resolve({ mastered: false, newInterval: 1 }))
      );

      const enriched: ReviewResult[] = finalResults.map((r, i) => ({
        ...r,
        mastered: scheduled[i].mastered,
        newInterval: scheduled[i].newInterval,
      }));

      const [totalWordsMastered, alreadyUnlocked] = await Promise.all([
        getWordsMastered(),
        getUnlockedAchievements(),
      ]);
      const newBadges = checkAchievements(
        { type: 'review', totalWordsMastered },
        alreadyUnlocked.map((b) => b.badgeId)
      );
      await Promise.all(newBadges.map((id) => unlockAchievement(id)));
      if (newBadges.length > 0) fireAchievementToast(newBadges);

      const [freshDue, freshNext] = await Promise.all([
        getDueReviewWords(),
        getNextScheduledReview(),
      ]);
      setDueWords(freshDue);
      setNextScheduledDate(freshNext);

      setResults(enriched);
      setPhase('results');
    } else {
      resultsRef.current = [
        ...resultsRef.current,
        { wordId: current.wordId ?? '', correct: wasCorrect, mastered: false, newInterval: 1 },
      ];
      Animated.timing(progressAnim, {
        toValue: (index + 1) / questions.length,
        duration: 250,
        useNativeDriver: false,
      }).start();
      setIndex((i) => i + 1);
    }
  };

  // ─── List ─────────────────────────────────────────────────────────────────
  if (phase === 'list') {
    if (loading) {
      return (
        <SafeAreaView style={styles.safe}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        </SafeAreaView>
      );
    }

    // No weak words at all
    if (dueWords.length === 0 && !nextScheduledDate) {
      return (
        <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={[styles.listScroll, styles.listScrollGrow]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.listTitle}>Review</Text>
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Image source={STAR_ICON} style={styles.emptyIcon} resizeMode="contain" />
              </View>
              <Text style={styles.emptyTitle}>Nothing to review yet</Text>
              <Text style={styles.emptyDesc}>
                Complete lessons — any words you find difficult will appear here for extra practice.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // All words scheduled for future — nothing due today
    if (dueWords.length === 0 && nextScheduledDate) {
      return (
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.listScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.listTitle}>Review</Text>
            <View style={styles.caughtUpCard}>
              <Image source={TICK_ICON} style={styles.caughtUpIcon} resizeMode="contain" />
              <Text style={styles.caughtUpTitle}>All caught up for today!</Text>
              <Text style={styles.caughtUpDesc}>
                Next review {daysUntilLabel(nextScheduledDate)} · {formatDate(nextScheduledDate)}
              </Text>
            </View>
            <Text style={styles.caughtUpHint}>
              Keep completing lessons to add more words to your review queue.
            </Text>
          </ScrollView>
        </SafeAreaView>
      );
    }

    // Words due today
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.listScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.listTitle}>Review</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryCount}>{dueWords.length}</Text>
            <Text style={styles.summaryLabel}>
              {dueWords.length === 1 ? 'word due today' : 'words due today'}
            </Text>
            {nextScheduledDate && (
              <Text style={styles.summaryNext}>
                More coming {daysUntilLabel(nextScheduledDate)}
              </Text>
            )}
          </View>

          <Text style={styles.dueSectionTitle}>Due for review</Text>
          <View style={styles.wordList}>
            {dueWords.map((dw) => {
              const word = WORDS_BY_ID[dw.wordId];
              if (!word) return null;
              const level = masteryLevel(dw.interval);
              return (
                <View key={dw.wordId} style={styles.wordRow}>
                  <AudioButton text={word.spanish} rate={ttsRate} size="sm" />
                  <View style={styles.wordInfo}>
                    <Text style={styles.wordSpanish}>{word.spanish}</Text>
                    <Text style={styles.wordEnglish}>{word.english}</Text>
                  </View>
                  <View style={[styles.levelBadge, { backgroundColor: level.bg }]}>
                    <Text style={[styles.levelBadgeText, { color: level.color }]}>{level.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <PrimaryButton label="Start Review →" onPress={startSession} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Results ──────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const correctCount = results.filter((r) => r.correct).length;
    const masteredCount = results.filter((r) => r.mastered).length;
    const xpEarned = correctCount * XP_PER_CORRECT;
    const allCorrect = correctCount === results.length;

    const resultIcon = allCorrect ? STAR_ICON : correctCount > results.length / 2 ? TICK_ICON : BOOK_ICON;

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.resultsScroll} showsVerticalScrollIndicator={false}>
          <Image source={resultIcon} style={styles.resultsIcon} resizeMode="contain" />
          <Text style={styles.resultsTitle}>Review Complete!</Text>
          <Text style={styles.resultsScore}>{correctCount} / {results.length} correct</Text>

          {masteredCount > 0 && (
            <View style={styles.masteredBanner}>
              <Image source={STAR_ICON} style={styles.masteredBannerIcon} resizeMode="contain" />
              <Text style={styles.masteredBannerText}>
                {masteredCount} word{masteredCount !== 1 ? 's' : ''} mastered!
              </Text>
            </View>
          )}

          {xpEarned > 0 && (
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>+{xpEarned} XP</Text>
            </View>
          )}

          <View style={styles.resultWordList}>
            {results.map((r) => {
              const word = WORDS_BY_ID[r.wordId];
              if (!word) return null;
              return (
                <View
                  key={r.wordId}
                  style={[
                    styles.resultRow,
                    r.correct ? styles.resultRowCorrect : styles.resultRowWrong,
                  ]}
                >
                  <Image
                    source={r.correct ? TICK_ICON : CROSS_ICON}
                    style={styles.resultMark}
                    resizeMode="contain"
                  />
                  <View style={styles.resultWordInfo}>
                    <Text style={styles.resultSpanish}>{word.spanish}</Text>
                    <Text style={styles.resultEnglish}>{word.english}</Text>
                  </View>
                  {r.mastered ? (
                    <View style={styles.masteredTag}>
                      <Text style={styles.masteredTagText}>Mastered ✓</Text>
                    </View>
                  ) : r.correct ? (
                    <View style={styles.intervalTag}>
                      <Text style={styles.intervalTagText}>In {r.newInterval}d</Text>
                    </View>
                  ) : (
                    <View style={styles.dueAgainTag}>
                      <Text style={styles.dueAgainTagText}>Due again</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {dueWords.length > 0 && (
            <PrimaryButton label="Review Again" onPress={startSession} style={{ alignSelf: 'stretch' }} />
          )}
          <TouchableOpacity style={styles.doneBtn} onPress={() => { setPhase('list'); loadState(); }}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Session ──────────────────────────────────────────────────────────────
  if (!current) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.sessionHeader}>
          <TouchableOpacity onPress={() => setPhase('list')} style={styles.quitBtn}>
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
          <Text style={styles.sessionCounter}>{index + 1}/{questions.length}</Text>
        </View>

        <Animated.ScrollView
          style={styles.flex}
          contentContainerStyle={styles.sessionContent}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={false}
        >
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            {/* Type badge */}
            <View style={styles.typeBadgeRow}>
              <View style={styles.typeBadgeInner}>
                <Image
                  source={TYPE_BADGE_ICONS[current.type]}
                  style={styles.typeBadgeIcon}
                  resizeMode="contain"
                />
                <Text style={styles.typeBadge}>
                  {current.type === 'multipleChoice'
                    ? 'Multiple Choice'
                    : current.type === 'typing'
                    ? 'Type the Answer'
                    : 'Listening'}
                </Text>
              </View>
              <View style={styles.reviewPillWrap}>
                <Image source={TARGET_ICON} style={styles.reviewPillIcon} resizeMode="contain" />
                <Text style={styles.reviewPill}>Review</Text>
              </View>
            </View>

            <Text style={styles.prompt}>{current.prompt}</Text>

            {/* Listening audio */}
            {current.type === 'listening' && current.audioText && (
              <View style={styles.listeningArea}>
                <AudioButton
                  key={current.id}
                  text={current.audioText}
                  rate={ttsRate}
                  size="lg"
                  autoPlay
                  autoPlayDelay={400}
                />
                <Text style={styles.listeningHint}>Tap to replay</Text>
              </View>
            )}

            {/* MCQ options */}
            {(current.type === 'multipleChoice' || current.type === 'listening') &&
              current.options && (
                <View style={styles.options}>
                  {current.options.map((opt) => {
                    const isSelected = selected === opt;
                    const isRight = opt === current.correctAnswer;
                    let bg = '#FFFFFF';
                    let borderColor = '#E5E7EB';
                    if (revealed && isSelected && isRight) { bg = '#D1FAE5'; borderColor = '#059669'; }
                    if (revealed && isSelected && !isRight) { bg = '#FEE2E2'; borderColor = '#DC2626'; }
                    if (revealed && !isSelected && isRight) { bg = '#D1FAE5'; borderColor = '#059669'; }
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.option, { backgroundColor: bg, borderColor }]}
                        onPress={() => checkAnswer(opt)}
                        disabled={revealed}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.optionText}>{opt}</Text>
                        {revealed && isRight && <Image source={TICK_ICON} style={styles.optionMark} resizeMode="contain" />}
                        {revealed && isSelected && !isRight && <Image source={CROSS_ICON} style={styles.optionMark} resizeMode="contain" />}
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
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (!revealed && typedAnswer.trim()) checkAnswer(typedAnswer.trim());
                  }}
                />
                {revealed && !isCorrect(typedAnswer, current.correctAnswer) && (
                  <View style={styles.correctionBox}>
                    <Text style={styles.correctionLabel}>Correct answer</Text>
                    <Text style={styles.correctionText}>{current.correctAnswer}</Text>
                  </View>
                )}
              </View>
            )}
          </Animated.View>
        </Animated.ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {!revealed && current.type === 'typing' && (
            <PrimaryButton
              label="Check"
              onPress={() => checkAnswer(typedAnswer.trim())}
              disabled={!typedAnswer.trim()}
            />
          )}
          {revealed && (
            <View style={styles.revealedArea}>
              <View style={[styles.resultBanner, wasCorrect ? styles.bannerCorrect : styles.bannerWrong]}>
                <Image source={wasCorrect ? TICK_ICON : CROSS_ICON} style={styles.bannerIcon} resizeMode="contain" />
                <Text style={[styles.resultBannerText, wasCorrect ? styles.bannerTextCorrect : styles.bannerTextWrong]}>
                  {wasCorrect ? 'Correct!' : `Answer: ${current.correctAnswer}`}
                </Text>
              </View>
              <PrimaryButton
                label={index + 1 >= questions.length ? 'Finish →' : 'Continue →'}
                onPress={handleNext}
                variant={wasCorrect ? 'green' : 'indigo'}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // ─── List ─────────────────────────────────────────────────────────────────
  listScroll: { padding: 20, paddingBottom: 40 },
  listScrollGrow: { flexGrow: 1 },
  listTitle: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 20 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60, paddingHorizontal: 12 },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.indigoSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyIcon: { width: 44, height: 44 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 21 },

  caughtUpCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 16,
    ...shadows.card,
  },
  caughtUpIcon: { width: 52, height: 52, marginBottom: 4 },
  caughtUpTitle: { fontSize: 20, fontWeight: '800', color: '#065F46' },
  caughtUpDesc: { fontSize: 14, color: '#059669', fontWeight: '600', textAlign: 'center' },
  caughtUpHint: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },

  summaryCard: {
    backgroundColor: colors.indigo,
    borderRadius: radius.lg,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    gap: 2,
    ...shadows.glow(colors.indigo),
  },
  summaryCount: { fontSize: 50, fontWeight: '900', color: '#FFFFFF' },
  summaryLabel: { fontSize: 15, color: 'rgba(255,255,255,0.92)', fontWeight: '600' },
  summaryNext: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 },

  dueSectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 },

  wordList: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    ...shadows.card,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  wordInfo: { flex: 1 },
  wordSpanish: { fontSize: 15, fontWeight: '700', color: '#111827' },
  wordEnglish: { fontSize: 13, color: '#6B7280', marginTop: 1 },
  levelBadge: {
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  levelBadgeText: { fontSize: 11, fontWeight: '700' },

  startBtn: {
    backgroundColor: colors.indigo,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    ...shadows.glow(colors.indigo),
  },
  startBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },

  // ─── Results ──────────────────────────────────────────────────────────────
  resultsScroll: { padding: 24, alignItems: 'center', paddingBottom: 48 },
  resultsIcon: { width: 72, height: 72, marginBottom: 12 },
  resultsTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  resultsScore: { fontSize: 15, color: '#6B7280', marginBottom: 16 },

  masteredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF9C3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  masteredBannerIcon: { width: 20, height: 20 },
  masteredBannerText: { fontSize: 14, fontWeight: '700', color: '#78350F' },

  xpBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginBottom: 20,
  },
  xpBadgeText: { fontSize: 18, fontWeight: '800', color: '#059669' },

  resultWordList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  resultRowCorrect: { backgroundColor: '#F0FDF4' },
  resultRowWrong: { backgroundColor: '#FFF5F5' },
  resultMark: { width: 18, height: 18 },
  resultWordInfo: { flex: 1 },
  resultSpanish: { fontSize: 14, fontWeight: '700', color: '#111827' },
  resultEnglish: { fontSize: 12, color: '#6B7280', marginTop: 1 },

  masteredTag: {
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  masteredTagText: { fontSize: 11, fontWeight: '700', color: '#065F46' },
  intervalTag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  intervalTagText: { fontSize: 11, fontWeight: '700', color: '#4338CA' },
  dueAgainTag: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  dueAgainTagText: { fontSize: 11, fontWeight: '700', color: '#991B1B' },

  doneBtn: { padding: 14 },
  doneBtnText: { fontSize: 14, color: '#6B7280', textDecorationLine: 'underline' },

  // ─── Session ──────────────────────────────────────────────────────────────
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  quitBtn: { padding: 4, width: 32 },
  quitText: { fontSize: 18, color: '#9CA3AF' },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 4 },
  sessionCounter: { fontSize: 13, color: '#9CA3AF', fontWeight: '600', width: 36, textAlign: 'right' },

  sessionContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },

  typeBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  typeBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeIcon: { width: 16, height: 16 },
  typeBadge: { fontSize: 13, color: '#4F46E5', fontWeight: '600' },
  reviewPillWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  reviewPillIcon: { width: 12, height: 12 },
  reviewPill: { fontSize: 11, fontWeight: '700', color: '#D97706' },

  prompt: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 24, lineHeight: 30 },

  listeningArea: { alignItems: 'center', paddingVertical: 16, gap: 10, marginBottom: 16 },
  listeningHint: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },

  options: { gap: 10 },
  option: {
    borderWidth: 2,
    borderRadius: radius.md,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.card,
  },
  optionText: { fontSize: 16, color: '#111827', fontWeight: '500', flex: 1 },
  optionMark: { width: 20, height: 20 },

  typingArea: { gap: 8 },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: radius.md,
    padding: 16,
    fontSize: 18,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputCorrect: { borderColor: '#059669', backgroundColor: '#D1FAE5' },
  inputWrong: { borderColor: '#DC2626', backgroundColor: '#FEE2E2' },
  correctionBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  correctionLabel: { fontSize: 11, fontWeight: '700', color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  correctionText: { fontSize: 16, fontWeight: '700', color: '#78350F' },

  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  revealedArea: { gap: 12 },
  resultBanner: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerCorrect: { backgroundColor: '#D1FAE5' },
  bannerWrong: { backgroundColor: '#FEE2E2' },
  bannerIcon: { width: 20, height: 20 },
  resultBannerText: { fontSize: 16, fontWeight: '700', flex: 1 },
  bannerTextCorrect: { color: '#065F46' },
  bannerTextWrong: { color: '#991B1B' },
  actionBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    ...shadows.glow(colors.indigo),
  },
  continueBtn: { backgroundColor: '#059669', ...shadows.glow(colors.green) },
  btnDisabled: { backgroundColor: '#C7D2FE' },
  actionBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
