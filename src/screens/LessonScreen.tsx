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
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import PrimaryButton from '../components/PrimaryButton';
import PressableScale from '../components/PressableScale';
import ComboPill from '../components/ComboPill';
import { playSound } from '../utils/sounds';
import type { RootStackParamList, Correction } from '../types';
import { LESSONS_BY_ID, UNITS_BY_ID } from '../data/units';
import { WORDS_BY_ID } from '../data/words';
import { completeLesson, recordWrongAnswer, getUserProgress, getUnlockedAchievements, unlockAchievement } from '../database/db';
import { buildQuestions, isCorrect } from '../utils/questionGenerator';
import { checkAchievements } from '../data/achievements';
import { fireAchievementToast } from '../utils/achievementEvents';
import HeartsDisplay from '../components/HeartsDisplay';
import AudioButton from '../components/AudioButton';
import { radius, shadows, gradients, fonts, type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
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
  const { c } = useTheme();
  const styles = useThemedStyles(createStyles);
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

  const [combo, setCombo] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;
  const questionAnim = useRef(new Animated.Value(0)).current;
  const questionOpacity = useRef(new Animated.Value(1)).current;

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

  const onCorrectFeedback = () => {
    const newCombo = combo + 1;
    setCombo(newCombo);
    playSound('correct');
    if (newCombo >= 8) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (newCombo >= 5) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const onWrongFeedback = () => {
    setCombo(0);
    playSound('wrong');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
      onCorrectFeedback();
    } else {
      shake();
      pulseHeart();
      onWrongFeedback();
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

  const advanceWithSlide = () => {
    Animated.parallel([
      Animated.timing(questionAnim, { toValue: -36, duration: 150, useNativeDriver: true }),
      Animated.timing(questionOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setSelected(null);
      setTypedAnswer('');
      setRevealed(false);
      setHintUsed(false);
      setIndex((i) => i + 1);
      questionAnim.setValue(36);
      Animated.parallel([
        Animated.timing(questionAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(questionOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const next = async () => {
    if (index + 1 < questions.length) {
      advanceWithSlide();
      return;
    }
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
      playSound('complete');
      navigation.replace('Results', { lessonId, score, xpEarned, corrections, wordResults });
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
    setCombo(0);
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
      onCorrectFeedback();
      setSelected(current?.correctAnswer ?? '');
    } else {
      shake();
      pulseHeart();
      onWrongFeedback();
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
      onCorrectFeedback();
      setSelected(current.correctAnswer);
    } else {
      shake();
      pulseHeart();
      onWrongFeedback();
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
      <SafeAreaView style={[styles.safe, { backgroundColor: '#4338CA' }]}>
        <LinearGradient
          colors={gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.previewHero}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.quitBtn}>
            <Text style={[styles.quitText, { color: 'rgba(255,255,255,0.75)' }]}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.previewUnitLabel}>{unit?.title}</Text>
          <Text style={styles.previewTitleHero}>{lesson?.title ?? lessonId}</Text>
          <View style={styles.previewMetaPills}>
            <View style={styles.previewMetaPill}><Text style={styles.previewMetaPillText}>{words.length} words</Text></View>
            <View style={styles.previewMetaPill}><Text style={styles.previewMetaPillText}>{questions.length} questions</Text></View>
            <View style={styles.previewMetaPill}><Text style={styles.previewMetaPillText}>{MAX_HEARTS} lives</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.previewContent}>
          <ScrollView contentContainerStyle={styles.previewScroll} showsVerticalScrollIndicator={false}>
            {lesson?.lessonType === 'review' && (
              <View style={styles.reviewBanner}>
                <Text style={styles.reviewBannerIcon}>🏆</Text>
                <Text style={styles.reviewBannerText}>Covers all vocabulary from this unit — test yourself!</Text>
              </View>
            )}

            {lesson?.grammarNote && (
              <View style={styles.grammarCard}>
                <View style={styles.grammarCardHeader}>
                  <Text style={styles.grammarCardIcon}>💡</Text>
                  <Text style={styles.grammarCardTitle}>Grammar Tip</Text>
                </View>
                <Text style={styles.grammarCardTip}>{lesson.grammarNote.tip}</Text>
                {lesson.grammarNote.examples.length > 0 && (
                  <View style={styles.grammarExamples}>
                    {lesson.grammarNote.examples.map((ex, i) => (
                      <View key={i} style={styles.grammarExample}>
                        <Text style={styles.grammarExampleSpanish}>{ex.spanish}</Text>
                        <Text style={styles.grammarExampleEnglish}>{ex.english}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

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
            <PrimaryButton label="Start Lesson →" onPress={() => setPhase('quiz')} />
          </View>
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
          <PrimaryButton label="Try Again" onPress={restartLesson} style={{ alignSelf: 'stretch' }} />
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
                combo >= 5 && styles.progressFillHot,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <ComboPill combo={combo} />
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
          <Animated.View style={{ opacity: questionOpacity, transform: [{ translateX: Animated.add(shakeAnim, questionAnim) }] }}>
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
                  {current.options.map((opt, idx) => {
                    const isSelected = selected === opt;
                    const isRight = opt === current.correctAnswer;
                    const isHighlighted = !revealed ? isSelected : (isRight || isSelected);

                    const cardBg = !revealed
                      ? (isSelected ? c.indigoSoft : c.card)
                      : (isRight ? c.greenSoft : isSelected ? c.redSoft : c.card);
                    const cardBorder = !revealed
                      ? (isSelected ? c.indigo : c.border)
                      : (isRight ? c.green : isSelected ? c.red : c.border);
                    const badgeBg = !revealed
                      ? (isSelected ? c.indigo : c.borderLight)
                      : (isRight ? c.green : isSelected ? c.red : c.borderLight);
                    const optionTextColor = !revealed
                      ? (isSelected ? c.indigo : c.text)
                      : (isRight ? c.green : isSelected ? c.red : c.text);

                    return (
                      <PressableScale
                        key={opt}
                        onPress={() => checkAnswer(opt)}
                        disabled={revealed}
                        scaleTo={0.97}
                      >
                        <View style={[styles.option, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                          <View style={[styles.optionBadge, { backgroundColor: badgeBg }]}>
                            <Text style={[styles.optionBadgeText, { color: isHighlighted ? '#FFFFFF' : c.textMuted }]}>
                              {OPTION_LETTERS[idx] ?? String(idx + 1)}
                            </Text>
                          </View>
                          <Text style={[styles.optionText, { color: optionTextColor }]}>{opt}</Text>
                          {revealed && isRight && (
                            <Image source={TICK_ICON} style={styles.optionMark} resizeMode="contain" />
                          )}
                          {revealed && isSelected && !isRight && (
                            <Image source={CROSS_ICON} style={styles.optionMark} resizeMode="contain" />
                          )}
                        </View>
                      </PressableScale>
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
            <PrimaryButton
              label="Check"
              onPress={() => checkAnswer(typedAnswer.trim())}
              disabled={!typedAnswer.trim()}
            />
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
              <PrimaryButton
                label={index + 1 >= questions.length ? 'Finish →' : 'Continue →'}
                onPress={next}
                variant={wasCorrect ? 'green' : 'indigo'}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  flex: { flex: 1 },

  // Review banner
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: isDark ? 'rgba(251,191,36,0.12)' : '#FFFBEB',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(251,191,36,0.3)' : '#FDE68A',
  },
  reviewBannerIcon: { fontSize: 20 },
  reviewBannerText: { fontSize: 13, fontWeight: '600', color: isDark ? '#FBBF24' : '#92400E', flex: 1, lineHeight: 18 },

  // Grammar note card
  grammarCard: {
    backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : '#EEF2FF',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(99,102,241,0.25)' : '#C7D2FE',
  },
  grammarCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  grammarCardIcon: { fontSize: 16 },
  grammarCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: c.indigo,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  grammarCardTip: { fontSize: 14, color: c.text, lineHeight: 21, marginBottom: 10 },
  grammarExamples: { gap: 6 },
  grammarExample: {
    backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.06)',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: c.indigo,
  },
  grammarExampleSpanish: { fontSize: 14, fontFamily: fonts.bold, color: c.indigo, marginBottom: 2 },
  grammarExampleEnglish: { fontSize: 13, color: c.textSecondary },

  // Preview hero
  previewHero: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 4,
  },
  previewContent: {
    flex: 1,
    backgroundColor: c.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  previewUnitLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 10,
  },
  previewTitleHero: {
    fontSize: 26,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  previewMetaPills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  previewMetaPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  previewMetaPillText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  previewScroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  previewWordsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: c.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  previewWordList: {
    backgroundColor: c.card,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: c.border,
    ...shadows.card,
  },
  previewWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.borderLight,
    gap: 10,
  },
  previewWordSpanish: { fontSize: 15, fontWeight: '700', color: c.text, flex: 1 },
  previewWordEnglish: { fontSize: 14, color: c.textSecondary },
  previewFooter: { padding: 20, paddingBottom: 32 },

  // No hearts
  noHeartsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noHeartsIcon: { width: 72, height: 72, marginBottom: 20, opacity: 0.5 },
  noHeartsTitle: { fontSize: 26, fontFamily: fonts.display, color: c.text, marginBottom: 10 },
  noHeartsDesc: {
    fontSize: 16,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  quitLinkBtn: { padding: 12 },
  quitLinkText: { fontSize: 15, color: c.textSecondary, textDecorationLine: 'underline' },

  // Quiz
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  quitBtn: { padding: 4, width: 32 },
  quitText: { fontSize: 18, color: c.textMuted },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: c.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: c.indigo, borderRadius: 4 },
  progressFillHot: { backgroundColor: c.amber },
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
    backgroundColor: c.indigoSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeIcon: { width: 16, height: 16 },
  typeText: { fontSize: 13, color: c.indigo, fontWeight: '600' },
  counterBadge: { fontSize: 13, color: c.textMuted, fontWeight: '600' },
  prompt: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: c.text,
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
  listeningHint: { fontSize: 13, color: c.textMuted, fontWeight: '500' },

  // Options
  options: { gap: 10 },
  option: {
    borderWidth: 2,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadows.card,
  },
  optionBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBadgeText: { fontSize: 13, fontWeight: '800' },
  optionText: { fontSize: 16, fontWeight: '500', flex: 1 },
  optionMark: { width: 20, height: 20 },

  // Typing
  typingArea: { gap: 8 },
  input: {
    borderWidth: 2,
    borderColor: c.border,
    borderRadius: radius.md,
    padding: 16,
    fontSize: 18,
    color: c.text,
    backgroundColor: c.card,
  },
  inputCorrect: { borderColor: c.green, backgroundColor: c.greenSoft },
  inputWrong: { borderColor: c.red, backgroundColor: c.redSoft },
  correctionText: { fontSize: 15, color: c.green, fontWeight: '600', paddingLeft: 4 },
  hintBtn: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 2 },
  hintBtnText: { fontSize: 13, color: c.textMuted, textDecorationLine: 'underline' },
  hintBox: { flexDirection: 'row', alignItems: 'center', paddingLeft: 2 },
  hintLabel: { fontSize: 13, color: c.textSecondary },
  hintChar: { fontSize: 15, fontWeight: '700', color: c.indigo },

  // Footer
  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  revealedFooter: { gap: 12 },
  resultBanner: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 4,
  },
  bannerIcon: { width: 20, height: 20 },
  bannerCorrect: { backgroundColor: c.greenSoft, borderLeftColor: c.green },
  bannerWrong: { backgroundColor: c.redSoft, borderLeftColor: c.red },
  resultBannerText: { fontSize: 16, fontFamily: fonts.bold, color: c.text },
  actionBtn: { borderRadius: 16, padding: 18, alignItems: 'center' },
  checkBtn: { backgroundColor: c.indigo, ...shadows.glow(c.indigo) },
  nextBtn: { backgroundColor: c.green, ...shadows.glow(c.green) },
  btnDisabled: { backgroundColor: c.indigoBorder },
  actionBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
