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
import { fonts, gradients, radius, shadows, type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
import type { RootStackParamList } from '../types';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'MiniGame'>;

const NUM_PAIRS    = 4;
const XP_MINI_GAME = 30;

type Card = { pairId: string; text: string; side: 'left' | 'right' };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MiniGameScreen() {
  const { c } = useTheme();
  const styles     = useThemedStyles(createStyles);
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { wordIds, sectionLabel } = route.params;

  const [pairs] = useState(() => {
    const available = wordIds.filter((id) => WORDS_BY_ID[id]);
    const pool = [...available];
    const sampled: string[] = [];
    while (sampled.length < NUM_PAIRS && pool.length > 0) {
      const i = Math.floor(Math.random() * pool.length);
      sampled.push(pool.splice(i, 1)[0]);
    }
    return sampled.map((id) => ({
      id,
      spanish: WORDS_BY_ID[id]?.spanish ?? id,
      english: WORDS_BY_ID[id]?.english ?? id,
    }));
  });

  const [leftCards]  = useState(() => shuffle(pairs.map((p) => ({ pairId: p.id, text: p.spanish, side: 'left'  as const }))));
  const [rightCards] = useState(() => shuffle(pairs.map((p) => ({ pairId: p.id, text: p.english, side: 'right' as const }))));

  const [selectedLeft,  setSelectedLeft]  = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched,   setMatched]   = useState<Set<string>>(new Set());
  const [wrong,     setWrong]     = useState(false);
  const [phase,     setPhase]     = useState<'playing' | 'finished'>('playing');
  const [attempts,  setAttempts]  = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const celebrate = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }).start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [scaleAnim]);

  useEffect(() => {
    if (phase === 'finished') celebrate();
  }, [phase, celebrate]);

  const doShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   5, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const tryMatch = (leftId: string, rightId: string) => {
    setAttempts((n) => n + 1);
    if (leftId === rightId) {
      const next = new Set(matched).add(leftId);
      setMatched(next);
      setSelectedLeft(null);
      setSelectedRight(null);
      playSound('correct');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (next.size === NUM_PAIRS) {
        setTimeout(() => setPhase('finished'), 350);
      }
    } else {
      setWrong(true);
      doShake();
      playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrong(false);
      }, 700);
    }
  };

  const tapLeft = (pairId: string) => {
    if (matched.has(pairId) || wrong) return;
    if (selectedLeft === pairId) { setSelectedLeft(null); return; }
    setSelectedLeft(pairId);
    if (selectedRight !== null) tryMatch(pairId, selectedRight);
  };

  const tapRight = (pairId: string) => {
    if (matched.has(pairId) || wrong) return;
    if (selectedRight === pairId) { setSelectedRight(null); return; }
    setSelectedRight(pairId);
    if (selectedLeft !== null) tryMatch(selectedLeft, pairId);
  };

  const cardState = (card: Card): 'idle' | 'selected' | 'matched' | 'wrong' => {
    if (matched.has(card.pairId)) return 'matched';
    const isSel = card.side === 'left'
      ? selectedLeft  === card.pairId
      : selectedRight === card.pairId;
    if (wrong && isSel) return 'wrong';
    if (isSel)           return 'selected';
    return 'idle';
  };

  const renderCard = (card: Card, onPress: () => void) => {
    const state = cardState(card);
    const bg     = state === 'matched' ? c.greenSoft  : state === 'wrong' ? c.redSoft    : state === 'selected' ? c.indigoSoft : c.card;
    const border = state === 'matched' ? c.green       : state === 'wrong' ? c.red         : state === 'selected' ? c.indigo     : c.border;
    const color  = state === 'matched' ? c.green       : state === 'wrong' ? c.red         : state === 'selected' ? c.indigo     : c.text;

    return (
      <TouchableOpacity
        key={card.pairId}
        onPress={onPress}
        disabled={state === 'matched' || wrong}
        activeOpacity={0.75}
        style={[styles.card, { backgroundColor: bg, borderColor: border }]}
      >
        <Animated.Text
          style={[
            styles.cardText,
            { color },
            state === 'wrong' && { transform: [{ translateX: shakeAnim }] },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {card.text}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  // ── Finished ─────────────────────────────────────────────────────────────
  if (phase === 'finished') {
    const accuracy = Math.round((NUM_PAIRS / Math.max(attempts, NUM_PAIRS)) * 100);
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={['#34D399', '#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.finishedBg}
        >
          <Animated.View style={[styles.finishedCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.finishedEmoji}>🎉</Text>
            <Text style={styles.finishedTitle}>Section Complete!</Text>
            <Text style={styles.finishedSub}>{sectionLabel} · Word Match</Text>
            <View style={styles.finishedStats}>
              <View style={styles.finishedStat}>
                <Text style={styles.finishedStatValue}>{NUM_PAIRS}/{NUM_PAIRS}</Text>
                <Text style={styles.finishedStatLabel}>Pairs</Text>
              </View>
              <View style={styles.finishedStatDiv} />
              <View style={styles.finishedStat}>
                <Text style={styles.finishedStatValue}>{accuracy}%</Text>
                <Text style={styles.finishedStatLabel}>Accuracy</Text>
              </View>
              <View style={styles.finishedStatDiv} />
              <View style={styles.finishedStat}>
                <Text style={[styles.finishedStatValue, { color: '#10B981' }]}>+{XP_MINI_GAME}</Text>
                <Text style={styles.finishedStatLabel}>XP</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
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

  // ── Playing ───────────────────────────────────────────────────────────────
  const pairsLeft = NUM_PAIRS - matched.size;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Word Match</Text>
          <Text style={styles.headerSub}>{sectionLabel}</Text>
        </View>
        <View style={styles.pairsCounter}>
          <Text style={styles.pairsNum}>{pairsLeft}</Text>
          <Text style={styles.pairsLabel}>left</Text>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.instruction}>Match each Spanish word to its English meaning</Text>

        <View style={styles.grid}>
          <View style={styles.column}>
            {leftCards.map((card) => renderCard(card, () => tapLeft(card.pairId)))}
          </View>
          <View style={styles.column}>
            {rightCards.map((card) => renderCard(card, () => tapRight(card.pairId)))}
          </View>
        </View>

        <View style={styles.progressRow}>
          {Array.from({ length: NUM_PAIRS }, (_, i) => (
            <View
              key={i}
              style={[styles.progressDot, i < matched.size && styles.progressDotFilled]}
            />
          ))}
        </View>
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
  backBtn: { padding: 4, width: 32 },
  backBtnText: { fontSize: 18, color: 'rgba(255,255,255,0.8)' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontFamily: fonts.display, color: '#FFFFFF' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  pairsCounter: { width: 40, alignItems: 'center' },
  pairsNum: { fontSize: 20, fontFamily: fonts.display, color: '#FFFFFF' },
  pairsLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },

  // Body
  body: { flex: 1, padding: 20, justifyContent: 'space-between' },
  instruction: {
    fontSize: 13,
    color: c.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },

  // Game grid
  grid: { flexDirection: 'row', gap: 12, flex: 1 },
  column: { flex: 1, gap: 10 },
  card: {
    flex: 1,
    minHeight: 72,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...shadows.card,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Progress dots
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.borderLight,
    borderWidth: 1.5,
    borderColor: c.border,
  },
  progressDotFilled: {
    backgroundColor: c.green,
    borderColor: c.green,
  },

  // Finished screen
  finishedBg: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  finishedCard: {
    backgroundColor: c.card,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    gap: 8,
    ...shadows.floating,
  },
  finishedEmoji: { fontSize: 48, marginBottom: 4 },
  finishedTitle: { fontSize: 24, fontFamily: fonts.display, color: c.text },
  finishedSub: { fontSize: 13, color: c.textSecondary, fontWeight: '600', marginBottom: 8 },
  finishedStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: c.borderLight,
    paddingTop: 16,
    marginTop: 4,
    width: '100%',
  },
  finishedStat: { flex: 1, alignItems: 'center', gap: 4 },
  finishedStatValue: { fontSize: 22, fontFamily: fonts.display, color: c.text },
  finishedStatLabel: { fontSize: 11, color: c.textMuted, fontWeight: '600' },
  finishedStatDiv: { width: 1, backgroundColor: c.borderLight, marginVertical: 4 },
  doneBtn: { width: '100%', borderRadius: radius.md, overflow: 'hidden', marginTop: 8 },
  doneBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  doneBtnText: { fontSize: 16, fontFamily: fonts.display, color: '#FFFFFF' },
});
