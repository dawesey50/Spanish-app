import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ScrollView,
  Image,
} from 'react-native';

const TYPE_BADGE_ICONS: Record<string, ReturnType<typeof require>> = {
  multipleChoice: require('../../assets/badges/multiple_chioice.png'),
  typing: require('../../assets/badges/typing.png'),
  listening: require('../../assets/badges/listening.png'),
  speaking: require('../../assets/badges/speaking.png'),
};
const TICK_ICON = require('../../assets/icons/green_tick.png');
const CROSS_ICON = require('../../assets/icons/red_cross.png');
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import type { RootStackParamList, Correction } from '../types';
import { LESSONS_BY_ID, UNITS_BY_ID } from '../data/units';
import { WORDS_BY_ID } from '../data/words';
import { completeLesson, recordWrongAnswer, getUserProgress, getUnlockedAchievements, unlockAchievement } from '../database/db';
import { buildQuestions, isCorrect } from '../utils/questionGenerator';
import { checkAchievements } from '../data/achievements';
import { fireAchievementToast } from '../utils/achievementEvents';
import HeartsDisplay from '../components/HeartsDisplay';
import AudioButton from '../components/AudioButton';
import { colors, radius, shadows } from '../theme';
import SpeakingQuestion from '../components/SpeakingQuestion';
import SentenceBuilder from '../components/SentenceBuilder';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Lesson'>;

const MAX_HEARTS = 3;
const XP_PER_CORRECT = 10;
const XP_LESSON_BONUS = 20;
const XP_HEART_BONUS = 10;

type Phase = 'preview' | 'quiz' | 'no_hearts';

export default function LessonScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { lessonId } = route.params;

  const lesson = LESSONS_BY_ID[lessonId];
  const unit = lesson ? UNITS_BY_ID[lesson.unitId] : null;

  const [phase, setPhase] = useState<Phase>('preview');
  const [questions, setQuestions] = useState(() => buildQuestions(lessonId));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [wordResults, setWordResults] = useState<{ wordId: string; correct: boolean }[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [ttsRate, setTtsRate] = useState(0.8);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  const current = questions[index];

  useEffect(() => {
    getUserProgress().then((p) => setTtsRate(p.ttsRate));
  }, []);

  useEffect(() => {
    if (phase !== 'quiz') return;
    Animated.timing(progressAnim, {
      toValue: index / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [index, phase]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const pulseHeart = () => {
    Animated.sequence([
      Animated.timing(heartAnim, { toValue: 1.5, duration: 100, useNativeDriver: true }),
      Animated.timing(heartAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const useHint = () => {
    if (hintUsed || revealed) return;
    setHintUsed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const checkAnswer = (answer: string) => {
    if (revealed || !current) return;
    const correct = isCorrect(answer, current.correctAnswer);
    setSelected(answer);
    setRevealed(true);
    if (current.wordId) {
      setWordResults((prev) => [...prev, { wordId: current.wordId!, correct }]);
    }

    if (correct) {
      setCorrectCount((n) => n + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      shake();
      pulseHeart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (current.wordId) recordWrongAnswer(current.wordId);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setCorrections((prev) => [
        ...prev,
        {
          original: answer || '(blank)',
          corrected: current.correctAnswer,
          explanation: `"${answer || '(blank)'}" is incorrect. The correct answer is "${current.correctAnswer}".`,
        },
      ]);
      if (newHearts <= 0) {
        setTimeout(() => setPhase('no_hearts'), 900);
      }
    }
  };

  const next = async () => {
    setSelected(null);
    setTypedAnswer('');
    setRevealed(false);
    setHintUsed(false);

    if (index + 1 >= questions.length) {
      const score = Math.round((correctCount / questions.length) * 100);
      const xpEarned = correctCount * XP_PER_CORRECT + XP_LESSON_BONUS + hearts * XP_HEART_BONUS;
      await completeLesson(lessonId, score, xpEarned);
      const [updatedProgress, alreadyUnlocked] = await Promise.all([
        getUserProgress(),
        getUnlockedAchievements(),
      ]);
      const newBadges = checkAchievements(
        { type: 'lesson', score, streak: updatedProgress.streak, totalXP: updatedProgress.xp, completedLessons: updatedProgress.completedLessons },
        alreadyUnlocked.map((b) => b.badgeId)
      );
      await Promise.all(newBadges.map((id) => unlockAchievement(id)));
      if (newBadges.length > 0) fireAchievementToast(newBadges);
      navigation.replace('Results', { lessonId, score, xpEarned, corrections, wordResults });
    } else {
      setIndex((i) => i + 1);
    }
  };

  const restartLesson = () => {
    setQuestions(buildQuestions(lessonId));
    setIndex(0);
    setSelected(null);
    setTypedAnswer('');
    setRevealed(false);
    setCorrectCount(0);
    setHearts(MAX_HEARTS);
    setCorrections([]);
    setWordResults([]);
    setHintUsed(false);
    setPhase('quiz');
  };

  const confirmQuit = () => {
    Alert.alert('Quit Lesson?', 'Your progress in this lesson will not be saved.', [
      { text: 'Keep Going', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  const handleSentenceResult = (correct: boolean, assembled: string) => {
    if (correct) {
      setCorrectCount((n) => n + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelected(current?.correctAnswer ?? '');
    } else {
      shake();
      pulseHeart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setCorrections((prev) => [
        ...prev,
        {
          original: assembled,
          corrected: current?.correctAnswer ?? '',
          explanation: `You built: "${assembled}". The correct sentence is "${current?.correctAnswer}".`,
        },
      ]);
      if (newHearts <= 0) setTimeout(() => setPhase('no_hearts'), 900);
      setSelected(assembled);
    }
    setRevealed(true);
  };

  const handleSpeakingResult = (correct: boolean, recognized: string) => {
    if (current.wordId) {
      setWordResults((prev) => [...prev, { wordId: current.wordId!, correct }]);
    }
    if (correct) {
      setCorrectCount((n) => n + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelected(current.correctAnswer);
    } else {
      shake();
      pulseHeart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (current.wordId) recordWrongAnswer(current.wordId);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      const displayText = recognized || '(no speech)';
      setCorrections((prev) => [
        ...prev,
        {
          original: displayText,
          corrected: current.correctAnswer,
          explanation: `You said "${displayText}". The correct answer is "${current.correctAnswer}".`,
        },
      ]);
      if (newHearts <= 0) {
        setTimeout(() => setPhase('no_hearts'), 900);
      }
      setSelected(recognized || '');
    }
    setRevealed(true);
  };

  // ─── Preview ─────────────────────────────────────────────────────────────────
  if (phase === 'preview') {
    const words = lesson?.wordIds.map((id) => WORDS_BY_ID[id]).filter(Boolean) ?? [];
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.quitBtn}>
            <Text style={styles.quitText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.previewHeaderTitle} numberOfLines={1}>
            {lesson?.title ?? lessonId}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.previewScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.previewUnit}>{unit?.title}</Text>
          <Text style={styles.previewTitle}>{lesson?.title}</Text>
          <Text style={styles.previewDesc}>
            {words.length} words · {questions.length} questions · {MAX_HEARTS} lives
          </Text>

          <Text style={styles.previewWordsLabel}>Words in this lesson</Text>
          <View style={styles.previewWordList}>
            {words.map((w) => (
              <View key={w.id} style={styles.previewWordRow}>
                <AudioButton text={w.spanish} size="sm" rate={ttsRate} />
                <Text style={styles.previewWordSpanish}>{w.spanish}</Text>
                <Text style={styles.previewWordEnglish}>{w.english}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.previewFooter}>
          <TouchableOpacity style={styles.startBtn} onPress={() => setPhase('quiz')}>
            <Text style={styles.startBtnText}>Start Lesson →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── No Hearts ───────────────────────────────────────────────────────────────
  if (phase === 'no_hearts') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.noHeartsContainer}>
          <Image source={require('../../assets/icons/empty_heart.png')} style={styles.noHeartsIcon} resizeMode="contain" />
          <Text style={styles.noHeartsTitle}>No Hearts Left</Text>
          <Text style={styles.noHeartsDesc}>
            You ran out of lives. Review the words and try again!
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={restartLesson}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quitLinkBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.quitLinkText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Quiz ─────────────────────────────────────────────────────────────────────
  if (!current) return null;

  const answerGiven = current.type === 'typing' ? typedAnswer.trim().length > 0 : selected !== null;
  const wasCorrect =
    revealed &&
    (current.type === 'typing'
      ? isCorrect(typedAnswer, current.correctAnswer)
      : current.type === 'sentenceBuilder' || current.type === 'speaking'
      ? selected === current.correctAnswer
      : selected === current.correctAnswer);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top bar */}
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
          <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
            <HeartsDisplay count={hearts} max={MAX_HEARTS} />
          </Animated.View>
        </View>

        <Animated.ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            {/* Type badge + counter */}
            <View style={styles.typeBadge}>
              <View style={styles.typeBadgeInner}>
                {TYPE_BADGE_ICONS[current.type] ? (
                  <Image
                    source={TYPE_BADGE_ICONS[current.type]}
                    style={styles.typeBadgeIcon}
                    resizeMode="contain"
                  />
                ) : null}
                <Text style={styles.typeText}>
                  {current.type === 'multipleChoice'
                    ? 'Multiple Choice'
                    : current.type === 'typing'
                    ? 'Type the Answer'
                    : current.type === 'speaking'
                    ? 'Speaking'
                    : current.type === 'sentenceBuilder'
                    ? 'Build the Sentence'
                    : 'Listening'}
                </Text>
              </View>
              <Text style={styles.counterBadge}>
                {index + 1}/{questions.length}
              </Text>
            </View>

            {current.type !== 'speaking' && current.type !== 'sentenceBuilder' && (
              <Text style={styles.prompt}>{current.prompt}</Text>
            )}

            {/* Listening: big play button */}
            {current.type === 'listening' && current.audioText && (
              <View style={styles.listeningArea}>
                <AudioButton
                  key={current.id}
                  text={current.audioText}
                  rate={ttsRate}
                  size="lg"
                  autoPlay
                  autoPlayDelay={500}
                />
                <Text style={styles.listeningHint}>Tap to replay</Text>
              </View>
            )}

            {/* MCQ options (both multipleChoice and listening) */}
            {(current.type === 'multipleChoice' || current.type === 'listening') &&
              current.options && (
                <View style={styles.options}>
                  {current.options.map((opt) => {
                    const isSelected = selected === opt;
                    const isRight = opt === current.correctAnswer;
                    let borderColor = '#E5E7EB';
                    let bg = '#FFFFFF';
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
                        {revealed && isRight && (
                          <Image source={TICK_ICON} style={styles.optionMark} resizeMode="contain" />
                        )}
                        {revealed && isSelected && !isRight && (
                          <Image source={CROSS_ICON} style={styles.optionMark} resizeMode="contain" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

            {/* Speaking question */}
            {current.type === 'speaking' && !revealed && (
              <SpeakingQuestion
                key={current.id}
                wordId={current.wordId ?? ''}
                correctAnswer={current.correctAnswer}
                ttsRate={ttsRate}
                onResult={handleSpeakingResult}
                onSkip={next}
              />
            )}

            {/* Sentence builder */}
            {current.type === 'sentenceBuilder' && !revealed && (
              <SentenceBuilder
                key={current.id}
                english={current.prompt}
                correctAnswer={current.correctAnswer}
                tokens={current.tokens ?? []}
                onResult={handleSentenceResult}
              />
            )}

            {/* Typing input */}
            {current.type === 'typing' && (
              <View style={styles.typingArea}>
                <TextInput
                  style={[
                    styles.input,
                    revealed && (isCorrect(typedAnswer, current.correctAnswer)
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
                {!revealed && !hintUsed && (
                  <TouchableOpacity style={styles.hintBtn} onPress={useHint} activeOpacity={0.7}>
                    <Text style={styles.hintBtnText}>Show hint</Text>
                  </TouchableOpacity>
                )}
                {!revealed && hintUsed && (
                  <View style={styles.hintBox}>
                    <Text style={styles.hintLabel}>First letter: </Text>
                    <Text style={styles.hintChar}>"{current.correctAnswer[0]}"</Text>
                  </View>
                )}
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
              style={[styles.actionBtn, styles.checkBtn, !typedAnswer.trim() && styles.btnDisabled]}
              onPress={() => checkAnswer(typedAnswer.trim())}
              disabled={!typedAnswer.trim()}
            >
              <Text style={styles.actionBtnText}>Check</Text>
            </TouchableOpacity>
          )}

          {revealed && (
            <View style={styles.revealedFooter}>
              <View style={[styles.resultBanner, wasCorrect ? styles.bannerCorrect : styles.bannerWrong]}>
                <Image
                  source={wasCorrect ? TICK_ICON : CROSS_ICON}
                  style={styles.bannerIcon}
                  resizeMode="contain"
                />
                <Text style={styles.resultBannerText}>
                  {wasCorrect ? 'Correct!' : `Answer: ${current.correctAnswer}`}
                </Text>
              </View>
              <TouchableOpacity style={[styles.actionBtn, styles.nextBtn]} onPress={next}>
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

  // Preview
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  previewHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  previewScroll: { paddingHorizontal: 20, paddingBottom: 40 },
  previewUnit: { fontSize: 13, color: '#4F46E5', fontWeight: '600', marginBottom: 4 },
  previewTitle: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 6 },
  previewDesc: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  previewWordsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  previewWordList: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...shadows.card,
  },
  previewWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  previewWordSpanish: { fontSize: 15, fontWeight: '700', color: '#111827', flex: 1 },
  previewWordEnglish: { fontSize: 14, color: '#6B7280' },
  previewFooter: { padding: 20, paddingBottom: 32 },
  startBtn: {
    backgroundColor: colors.indigo,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    ...shadows.glow(colors.indigo),
  },
  startBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },

  // No hearts
  noHeartsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noHeartsIcon: { width: 72, height: 72, marginBottom: 20, opacity: 0.5 },
  noHeartsTitle: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 10 },
  noHeartsDesc: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  retryBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 16,
    marginBottom: 14,
    ...shadows.glow(colors.indigo),
  },
  retryBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  quitLinkBtn: { padding: 12 },
  quitLinkText: { fontSize: 15, color: '#6B7280', textDecorationLine: 'underline' },

  // Quiz
  topBar: {
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
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  typeBadge: {
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
  typeText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
  },
  counterBadge: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  prompt: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    lineHeight: 30,
  },

  // Listening
  listeningArea: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
    marginBottom: 16,
  },
  listeningHint: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },

  // Options
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

  // Typing
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
  correctionText: { fontSize: 15, color: '#059669', fontWeight: '600', paddingLeft: 4 },
  hintBtn: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 2 },
  hintBtnText: { fontSize: 13, color: '#9CA3AF', textDecorationLine: 'underline' },
  hintBox: { flexDirection: 'row', alignItems: 'center', paddingLeft: 2 },
  hintLabel: { fontSize: 13, color: '#6B7280' },
  hintChar: { fontSize: 15, fontWeight: '700', color: '#4F46E5' },

  // Footer
  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  revealedFooter: { gap: 12 },
  resultBanner: { borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  bannerIcon: { width: 20, height: 20 },
  bannerCorrect: { backgroundColor: '#D1FAE5' },
  bannerWrong: { backgroundColor: '#FEE2E2' },
  resultBannerText: { fontSize: 16, fontWeight: '700', color: '#111827' },
  actionBtn: { borderRadius: 16, padding: 18, alignItems: 'center' },
  checkBtn: { backgroundColor: '#4F46E5', ...shadows.glow(colors.indigo) },
  nextBtn: { backgroundColor: '#059669', ...shadows.glow(colors.green) },
  btnDisabled: { backgroundColor: '#C7D2FE' },
  actionBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
