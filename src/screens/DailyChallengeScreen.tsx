import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { playSound } from '../utils/sounds';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Question } from '../types';
import { getUserProgress, completeDailyChallenge } from '../database/db';
import { buildDailyChallenge, isCorrect } from '../utils/questionGenerator';

const TICK_ICON = require('../../assets/icons/green_tick.png');
const CROSS_ICON = require('../../assets/icons/red_cross.png');
const TARGET_ICON = require('../../assets/icons/blue_target.png');
const STAR_ICON = require('../../assets/icons/star.png');

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CONFETTI_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#F97316'];

function Confetti() {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * 2 * Math.PI;
      const distance = 100 + (i % 4) * 35;
      return {
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0),
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance - 60,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 8 + (i % 3) * 4,
      };
    })
  ).current;

  useEffect(() => {
    particles.forEach((p, i) => {
      Animated.sequence([
        Animated.delay(i * 25),
        Animated.parallel([
          Animated.spring(p.scale, { toValue: 1, friction: 5, useNativeDriver: true }),
          Animated.spring(p.opacity, { toValue: 1, friction: 5, useNativeDriver: true }),
          Animated.timing(p.translateX, { toValue: p.tx, duration: 700, useNativeDriver: true }),
          Animated.timing(p.translateY, { toValue: p.ty, duration: 700, useNativeDriver: true }),
        ]),
      ]).start(() => {
        Animated.timing(p.opacity, { toValue: 0, duration: 500, delay: 200, useNativeDriver: true }).start();
      });
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.confettiOrigin}>
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              transform: [
                { translateX: p.translateX },
                { translateY: p.translateY },
                { scale: p.scale },
              ],
              opacity: p.opacity,
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default function DailyChallengeScreen() {
  const navigation = useNavigation<Nav>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const doneAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const p = await getUserProgress();
      const today = new Date().toISOString().split('T')[0];
      const qs = buildDailyChallenge(today, p.completedLessons);
      setQuestions(qs);
      setLoading(false);
    })();
  }, []);

  const current = questions[index];
  const total = questions.length;

  useEffect(() => {
    if (!done) return;
    Animated.spring(doneAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, [done]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const animateProgress = (nextIndex: number) => {
    Animated.timing(progressAnim, {
      toValue: nextIndex / total,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const reveal = (correct: boolean) => {
    setAnsweredCorrectly(correct);
    setRevealed(true);
    if (correct) {
      setCorrectCount((c) => c + 1);
      playSound('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      shake();
      playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleSelectMCQ = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    reveal(opt === current.correctAnswer);
  };

  const handleCheckTyping = () => {
    if (revealed || !typedAnswer.trim()) return;
    reveal(isCorrect(typedAnswer, current.correctAnswer));
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= total) {
      setDone(true);
    } else {
      animateProgress(nextIndex);
      setIndex(nextIndex);
      setSelected(null);
      setTypedAnswer('');
      setRevealed(false);
    }
  };

  const handleFinish = async () => {
    if (finishing) return;
    setFinishing(true);
    await completeDailyChallenge();
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Image source={TARGET_ICON} style={{ width: 64, height: 64, marginBottom: 16, opacity: 0.4 }} resizeMode="contain" />
          <Text style={[styles.loadingText, { fontSize: 18, fontWeight: '700', color: '#374151' }]}>
            Complete a lesson first
          </Text>
          <Text style={[styles.loadingText, { marginTop: 8 }]}>
            Finish at least one lesson to unlock the daily challenge.
          </Text>
          <TouchableOpacity
            style={[styles.footerBtn, { marginTop: 24, paddingHorizontal: 32 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.footerBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!current) return null;

  const isMCQ = current.type === 'multipleChoice';
  const optionStyle = (opt: string) => {
    if (!revealed) return styles.option;
    if (opt === current.correctAnswer) return [styles.option, styles.optionCorrect];
    if (opt === selected) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDimmed];
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
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
          <Text style={styles.counter}>{index + 1}/{total}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Badge */}
          <View style={styles.challengeBadge}>
            <Image source={TARGET_ICON} style={styles.badgeIcon} resizeMode="contain" />
            <Text style={styles.badgeLabel}>Daily Challenge</Text>
          </View>

          {/* Question card */}
          <Animated.View style={[styles.questionCard, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.questionText}>{current.prompt}</Text>
          </Animated.View>

          {/* MCQ options */}
          {isMCQ && (
            <View style={styles.options}>
              {(current.options ?? []).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={optionStyle(opt)}
                  onPress={() => handleSelectMCQ(opt)}
                  activeOpacity={0.75}
                  disabled={revealed}
                >
                  <Text
                    style={[
                      styles.optionText,
                      revealed && opt === current.correctAnswer && styles.optionTextCorrect,
                      revealed && opt === selected && opt !== current.correctAnswer && styles.optionTextWrong,
                    ]}
                  >
                    {opt}
                  </Text>
                  {revealed && opt === current.correctAnswer && (
                    <Image source={TICK_ICON} style={styles.markIcon} resizeMode="contain" />
                  )}
                  {revealed && opt === selected && opt !== current.correctAnswer && (
                    <Image source={CROSS_ICON} style={styles.markIcon} resizeMode="contain" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Typing input */}
          {!isMCQ && (
            <View style={styles.typingArea}>
              <TextInput
                style={[styles.textInput, revealed && (answeredCorrectly ? styles.inputCorrect : styles.inputWrong)]}
                value={typedAnswer}
                onChangeText={setTypedAnswer}
                placeholder="Type in Spanish…"
                placeholderTextColor="#9CA3AF"
                autoCorrect={false}
                autoCapitalize="none"
                editable={!revealed}
                returnKeyType="done"
                onSubmitEditing={handleCheckTyping}
              />
              {revealed && !answeredCorrectly && (
                <View style={styles.correctAnswerBox}>
                  <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
                  <Text style={styles.correctAnswerText}>{current.correctAnswer}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {!isMCQ && !revealed && (
            <TouchableOpacity
              style={[styles.footerBtn, !typedAnswer.trim() && styles.footerBtnDisabled]}
              onPress={handleCheckTyping}
              disabled={!typedAnswer.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.footerBtnText}>Check</Text>
            </TouchableOpacity>
          )}
          {revealed && (
            <TouchableOpacity style={styles.footerBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.footerBtnText}>{index + 1 >= total ? 'Finish' : 'Next →'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Results overlay */}
      {done && (
        <View style={styles.resultsOverlay}>
          <Confetti />
          <Animated.View
            style={[styles.resultsCard, { transform: [{ scale: doneAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }], opacity: doneAnim }]}
          >
            <Image source={STAR_ICON} style={styles.resultsIcon} resizeMode="contain" />
            <Text style={styles.resultsTitle}>
              {correctCount === total ? 'Perfect!' : 'Challenge Complete!'}
            </Text>
            <Text style={styles.resultsScore}>{correctCount}/{total}</Text>
            <Text style={styles.resultsScoreLabel}>
              {correctCount === total ? 'Flawless run!' : `${total - correctCount} mistake${total - correctCount === 1 ? '' : 's'}`}
            </Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>+25 XP</Text>
            </View>
            <TouchableOpacity
              style={styles.collectBtn}
              onPress={handleFinish}
              activeOpacity={0.85}
              disabled={finishing}
            >
              <Text style={styles.collectBtnText}>Collect Reward</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: '#9CA3AF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 18, color: '#9CA3AF' },
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
  counter: { fontSize: 13, fontWeight: '700', color: '#6B7280', minWidth: 28, textAlign: 'right' },

  scroll: { paddingHorizontal: 20, paddingBottom: 20 },

  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeIcon: { width: 16, height: 16 },
  badgeLabel: { fontSize: 12, fontWeight: '700', color: '#4F46E5' },

  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: { fontSize: 20, fontWeight: '700', color: '#111827', lineHeight: 30, textAlign: 'center' },

  options: { gap: 10 },
  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  optionDimmed: { opacity: 0.45 },
  optionText: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1 },
  optionTextCorrect: { color: '#065F46' },
  optionTextWrong: { color: '#991B1B' },
  markIcon: { width: 20, height: 20 },

  typingArea: { gap: 12 },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  inputCorrect: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  inputWrong: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  correctAnswerBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  correctAnswerLabel: { fontSize: 11, fontWeight: '700', color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  correctAnswerText: { fontSize: 17, fontWeight: '700', color: '#78350F' },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerBtnDisabled: { backgroundColor: '#C7D2FE' },
  footerBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  // Results overlay
  resultsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confettiOrigin: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  resultsIcon: { width: 64, height: 64, marginBottom: 8 },
  resultsTitle: { fontSize: 26, fontWeight: '800', color: '#111827' },
  resultsScore: { fontSize: 52, fontWeight: '800', color: '#4F46E5', lineHeight: 60 },
  resultsScoreLabel: { fontSize: 15, color: '#6B7280', marginBottom: 8 },
  xpBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 8,
  },
  xpBadgeText: { fontSize: 20, fontWeight: '800', color: '#92400E' },
  collectBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  collectBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
