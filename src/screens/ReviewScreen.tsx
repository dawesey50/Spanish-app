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
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { WORDS_BY_ID } from '../data/words';
import {
  getWeakWordsWithCounts,
  markWordReviewed,
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
import type { Question } from '../types';

const XP_PER_CORRECT = 5;

type ReviewPhase = 'list' | 'session' | 'results';
interface WeakWord { wordId: string; wrongCount: number; }
interface ReviewResult { wordId: string; correct: boolean; }

export default function ReviewScreen() {
  const [phase, setPhase] = useState<ReviewPhase>('list');
  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);
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

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [words, progress] = await Promise.all([
          getWeakWordsWithCounts(),
          getUserProgress(),
        ]);
        setWeakWords(words);
        setTtsRate(progress.ttsRate);
      })();
    }, [])
  );

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const startSession = (wordList = weakWords) => {
    const qs = buildReviewQuestions(wordList.map((w) => w.wordId));
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
    resultsRef.current = [
      ...resultsRef.current,
      { wordId: current.wordId, correct: wasCorrect },
    ];

    const isLast = index + 1 >= questions.length;
    setSelected(null);
    setTypedAnswer('');
    setRevealed(false);

    if (isLast) {
      const finalResults = resultsRef.current;
      const correctOnes = finalResults.filter((r) => r.correct && r.wordId);
      if (correctOnes.length > 0) {
        await awardXP(correctOnes.length * XP_PER_CORRECT);
        await Promise.all(correctOnes.map((r) => markWordReviewed(r.wordId!)));
      }
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
      const fresh = await getWeakWordsWithCounts();
      setWeakWords(fresh);
      setResults(finalResults);
      setPhase('results');
    } else {
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
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.listScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.listTitle}>Review</Text>

          {weakWords.length === 0 ? (
            <View style={styles.emptyState}>
              <Image source={STAR_ICON} style={styles.emptyStarIcon} resizeMode="contain" />
              <Text style={styles.emptyTitle}>Nothing to review!</Text>
              <Text style={styles.emptyDesc}>
                Complete lessons — any words you find difficult will appear here for extra practice.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryCount}>{weakWords.length}</Text>
                <Text style={styles.summaryLabel}>
                  {weakWords.length === 1 ? 'word needs practice' : 'words need practice'}
                </Text>
              </View>

              <View style={styles.wordList}>
                {weakWords.map((ww) => {
                  const word = WORDS_BY_ID[ww.wordId];
                  if (!word) return null;
                  return (
                    <View key={ww.wordId} style={styles.wordRow}>
                      <AudioButton text={word.spanish} rate={ttsRate} size="sm" />
                      <View style={styles.wordInfo}>
                        <Text style={styles.wordSpanish}>{word.spanish}</Text>
                        <Text style={styles.wordEnglish}>{word.english}</Text>
                      </View>
                      <View style={styles.wrongBadge}>
                        <Text style={styles.wrongBadgeText}>✗ {ww.wrongCount}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.startBtn} onPress={() => startSession()}>
                <Text style={styles.startBtnText}>Start Review →</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Results ──────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const correctCount = results.filter((r) => r.correct).length;
    const xpEarned = correctCount * XP_PER_CORRECT;
    const allCorrect = correctCount === results.length;

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.resultsScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.resultsEmoji}>
            {allCorrect ? '🏆' : correctCount > results.length / 2 ? '⭐' : '📚'}
          </Text>
          <Text style={styles.resultsTitle}>Review Complete!</Text>
          <Text style={styles.resultsScore}>
            {correctCount} / {results.length} correct
          </Text>

          {xpEarned > 0 && (
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>+{xpEarned} XP</Text>
            </View>
          )}

          <View style={styles.resultWordList}>
            {results.map((r) => {
              const word = WORDS_BY_ID[r.wordId];
              if (!word) return null;
              const stillWeak = !!weakWords.find((w) => w.wordId === r.wordId);
              return (
                <View
                  key={r.wordId}
                  style={[
                    styles.resultRow,
                    r.correct ? styles.resultRowCorrect : styles.resultRowWrong,
                  ]}
                >
                  <Text style={[styles.resultMark, r.correct ? styles.markGreen : styles.markRed]}>
                    {r.correct ? '✓' : '✗'}
                  </Text>
                  <View style={styles.resultWordInfo}>
                    <Text style={styles.resultSpanish}>{word.spanish}</Text>
                    <Text style={styles.resultEnglish}>{word.english}</Text>
                  </View>
                  {r.correct && !stillWeak && (
                    <Text style={styles.masteredTag}>mastered!</Text>
                  )}
                </View>
              );
            })}
          </View>

          {weakWords.length > 0 && (
            <TouchableOpacity style={styles.startBtn} onPress={() => startSession()}>
              <Text style={styles.startBtnText}>Review Again</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.doneBtn} onPress={() => setPhase('list')}>
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
              <Text style={styles.reviewPill}>Review</Text>
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
                  <Text style={styles.correctionText}>✓ {current.correctAnswer}</Text>
                )}
              </View>
            )}
          </Animated.View>
        </Animated.ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {!revealed && current.type === 'typing' && (
            <TouchableOpacity
              style={[styles.actionBtn, !typedAnswer.trim() && styles.btnDisabled]}
              onPress={() => checkAnswer(typedAnswer.trim())}
              disabled={!typedAnswer.trim()}
            >
              <Text style={styles.actionBtnText}>Check</Text>
            </TouchableOpacity>
          )}
          {revealed && (
            <View style={styles.revealedArea}>
              <View style={[styles.resultBanner, wasCorrect ? styles.bannerCorrect : styles.bannerWrong]}>
                <Text style={styles.resultBannerText}>
                  {wasCorrect ? '🎉 Correct!' : `💡 Answer: ${current.correctAnswer}`}
                </Text>
              </View>
              <TouchableOpacity style={[styles.actionBtn, styles.continueBtn]} onPress={handleNext}>
                <Text style={styles.actionBtnText}>
                  {index + 1 >= questions.length ? 'Finish →' : 'Continue →'}
                </Text>
              </TouchableOpacity>
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

  // ─── List ─────────────────────────────────────────────────────────────────
  listScroll: { padding: 20, paddingBottom: 40 },
  listTitle: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 20 },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyStarIcon: { width: 64, height: 64, marginBottom: 16, opacity: 0.6 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 21 },

  summaryCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  summaryCount: { fontSize: 48, fontWeight: '800', color: '#4F46E5' },
  summaryLabel: { fontSize: 15, color: '#4F46E5', fontWeight: '600', marginTop: 4 },

  wordList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
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
  wrongBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  wrongBadgeText: { fontSize: 12, fontWeight: '700', color: '#DC2626' },

  startBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  startBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },

  // ─── Results ──────────────────────────────────────────────────────────────
  resultsScroll: { padding: 24, alignItems: 'center', paddingBottom: 48 },
  resultsEmoji: { fontSize: 72, marginBottom: 12 },
  resultsTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  resultsScore: { fontSize: 15, color: '#6B7280', marginBottom: 16 },

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
  resultMark: { fontSize: 16, fontWeight: '800', width: 20, textAlign: 'center' },
  resultWordInfo: { flex: 1 },
  resultSpanish: { fontSize: 14, fontWeight: '700', color: '#111827' },
  resultEnglish: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  masteredTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },

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
  typeBadge: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
  },
  reviewPill: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },

  prompt: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 24, lineHeight: 30 },

  listeningArea: { alignItems: 'center', paddingVertical: 16, gap: 10, marginBottom: 16 },
  listeningHint: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },

  options: { gap: 10 },
  option: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: { fontSize: 16, color: '#111827', fontWeight: '500', flex: 1 },
  optionMark: { width: 20, height: 20 },

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
  correctionText: { fontSize: 15, color: '#059669', fontWeight: '600', paddingLeft: 4 },

  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  revealedArea: { gap: 12 },
  resultBanner: { borderRadius: 12, padding: 14, alignItems: 'center' },
  bannerCorrect: { backgroundColor: '#D1FAE5' },
  bannerWrong: { backgroundColor: '#FEE2E2' },
  resultBannerText: { fontSize: 16, fontWeight: '700', color: '#111827' },
  actionBtn: { backgroundColor: '#4F46E5', borderRadius: 14, padding: 18, alignItems: 'center' },
  continueBtn: { backgroundColor: '#059669' },
  btnDisabled: { backgroundColor: '#C7D2FE' },
  actionBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
