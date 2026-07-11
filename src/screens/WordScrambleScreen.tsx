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
type Route = RouteProp<RootStackParamList, 'WordScramble'>;

const NUM_WORDS   = 5;
const XP_SCRAMBLE = 35;

type ScrambleWord = {
  id: string;
  article: string;   // 'el ', 'la ', … or ''
  main: string;      // the word to unscramble (lowercase)
  english: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scrambleLetters(word: string): string[] {
  const letters = word.split('');
  if (letters.length < 2) return letters;
  let out = shuffle(letters);
  let guard = 0;
  while (out.join('') === word && guard < 10) {
    out = shuffle(letters);
    guard++;
  }
  return out;
}

const ARTICLE_RE = /^(el|la|los|las)\s+/i;

function buildWords(wordIds: string[]): ScrambleWord[] {
  const candidates: ScrambleWord[] = [];
  for (const id of wordIds) {
    const w = WORDS_BY_ID[id];
    if (!w) continue;
    const m = w.spanish.match(ARTICLE_RE);
    const article = m ? m[0] : '';
    const main = w.spanish.slice(article.length).toLowerCase();
    // single word only, sensible tile count
    if (main.includes(' ') || main.length < 3 || main.length > 10) continue;
    candidates.push({ id, article: article.trim(), main, english: w.english });
  }
  return shuffle(candidates).slice(0, NUM_WORDS);
}

export default function WordScrambleScreen() {
  const { c } = useTheme();
  const styles     = useThemedStyles(createStyles);
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { wordIds, sectionLabel } = route.params;

  const [words] = useState(() => buildWords(wordIds));
  const [idx,   setIdx]   = useState(0);
  const [tiles, setTiles] = useState<string[]>(() =>
    words.length > 0 ? scrambleLetters(words[0].main) : []
  );
  const [placed, setPlaced] = useState<number[]>([]); // indices into tiles, in placement order
  const [wrong,  setWrong]  = useState(false);
  const [solved, setSolved] = useState(false);
  const [phase,  setPhase]  = useState<'playing' | 'finished'>(words.length > 0 ? 'playing' : 'finished');
  const [firstTrySolves, setFirstTrySolves] = useState(0);
  const missedThisWord = useRef(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const xpAwarded = useRef(false);

  const word = words[idx];

  useEffect(() => {
    if (phase === 'finished') {
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }).start();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (!xpAwarded.current && words.length > 0) {
        xpAwarded.current = true;
        const earned = Math.max(10, Math.round((firstTrySolves / words.length) * XP_SCRAMBLE));
        awardXP(earned).catch(() => {});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const doShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   5, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const advance = useCallback(() => {
    const next = idx + 1;
    if (next >= words.length) {
      setPhase('finished');
      return;
    }
    setIdx(next);
    setTiles(scrambleLetters(words[next].main));
    setPlaced([]);
    setSolved(false);
    setWrong(false);
    missedThisWord.current = false;
  }, [idx, words]);

  const checkAnswer = (placedNow: number[]) => {
    const attempt = placedNow.map((t) => tiles[t]).join('');
    if (attempt === word.main) {
      setSolved(true);
      playSound('correct');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (!missedThisWord.current) {
        setFirstTrySolves((n) => n + 1);
        scheduleWordReview(word.id, true).catch(() => {});
      }
      setTimeout(advance, 650);
    } else {
      setWrong(true);
      missedThisWord.current = true;
      doShake();
      playSound('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      recordWrongAnswer(word.id).catch(() => {});
      setTimeout(() => {
        setPlaced([]);
        setWrong(false);
      }, 650);
    }
  };

  const tapTile = (tileIdx: number) => {
    if (solved || wrong || placed.includes(tileIdx)) return;
    const next = [...placed, tileIdx];
    setPlaced(next);
    if (next.length === tiles.length) checkAnswer(next);
  };

  const tapSlot = (slotIdx: number) => {
    if (solved || wrong || slotIdx >= placed.length) return;
    const next = [...placed];
    next.splice(slotIdx, 1);
    setPlaced(next);
  };

  const reshuffle = () => {
    if (solved || wrong) return;
    setTiles(scrambleLetters(word.main));
    setPlaced([]);
  };

  // ── Finished ───────────────────────────────────────────────────────────────────
  if (phase === 'finished') {
    const total    = Math.max(words.length, 1);
    const accuracy = Math.round((firstTrySolves / total) * 100);
    const earned   = Math.max(10, Math.round((firstTrySolves / total) * XP_SCRAMBLE));
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={['#A78BFA', '#8B5CF6', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.finishedBg}
        >
          <Animated.View style={[styles.finishedCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.finishedEmoji}>🔤</Text>
            <Text style={styles.finishedTitle}>Scramble Solved!</Text>
            <Text style={styles.finishedSub}>{sectionLabel} · Word Scramble</Text>
            <View style={styles.finishedStats}>
              <View style={styles.finishedStat}>
                <Text style={styles.finishedStatValue}>{words.length}</Text>
                <Text style={styles.finishedStatLabel}>Words</Text>
              </View>
              <View style={styles.finishedStatDiv} />
              <View style={styles.finishedStat}>
                <Text style={styles.finishedStatValue}>{accuracy}%</Text>
                <Text style={styles.finishedStatLabel}>First try</Text>
              </View>
              <View style={styles.finishedStatDiv} />
              <View style={styles.finishedStat}>
                <Text style={[styles.finishedStatValue, { color: '#8B5CF6' }]}>+{earned}</Text>
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

  // ── Playing ─────────────────────────────────────────────────────────────────────
  const slotColor = solved ? c.green : wrong ? c.red : c.indigo;

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
          <Text style={styles.headerTitle}>Word Scramble</Text>
          <Text style={styles.headerSub}>{sectionLabel}</Text>
        </View>
        <View style={styles.qCounter}>
          <Text style={styles.qNum}>{idx + 1}</Text>
          <Text style={styles.qTotal}>/{words.length}</Text>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Progress dots */}
        <View style={styles.progressRow}>
          {words.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < idx && styles.progressDotDone,
                i === idx && styles.progressDotCurrent,
              ]}
            />
          ))}
        </View>

        {/* Clue card */}
        <View style={styles.clueCard}>
          <Text style={styles.clueLabel}>Unscramble the Spanish for</Text>
          <Text style={styles.clueEnglish}>{word.english}</Text>
          {word.article !== '' && (
            <View style={styles.articleChip}>
              <Text style={styles.articleChipText}>{word.article} …</Text>
            </View>
          )}
        </View>

        {/* Answer slots */}
        <Animated.View style={[styles.slotRow, { transform: [{ translateX: shakeAnim }] }]}>
          {tiles.map((_, slotIdx) => {
            const tileIdx = placed[slotIdx];
            const letter  = tileIdx !== undefined ? tiles[tileIdx] : '';
            return (
              <TouchableOpacity
                key={slotIdx}
                style={[
                  styles.slot,
                  letter !== '' && { borderColor: slotColor, backgroundColor: solved ? c.greenSoft : wrong ? c.redSoft : c.indigoSoft },
                ]}
                onPress={() => tapSlot(slotIdx)}
                disabled={letter === ''}
                activeOpacity={0.7}
              >
                <Text style={[styles.slotText, letter !== '' && { color: slotColor }]}>
                  {letter.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Letter tiles */}
        <View style={styles.tileArea}>
          <View style={styles.tileRow}>
            {tiles.map((letter, tileIdx) => {
              const used = placed.includes(tileIdx);
              return (
                <TouchableOpacity
                  key={tileIdx}
                  style={[styles.tile, used && styles.tileUsed]}
                  onPress={() => tapTile(tileIdx)}
                  disabled={used || solved || wrong}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tileText, used && styles.tileTextUsed]}>
                    {letter.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.shuffleBtn} onPress={reshuffle} activeOpacity={0.75}>
            <Text style={styles.shuffleBtnText}>🔀  Shuffle letters</Text>
          </TouchableOpacity>
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
  backBtn:      { padding: 4, width: 32 },
  backBtnText:  { fontSize: 18, color: 'rgba(255,255,255,0.8)' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 18, fontFamily: fonts.display, color: '#FFFFFF' },
  headerSub:    { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  qCounter:     { flexDirection: 'row', alignItems: 'baseline', width: 40, justifyContent: 'center' },
  qNum:         { fontSize: 20, fontFamily: fonts.display, color: '#FFFFFF' },
  qTotal:       { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  // Body
  body: { flex: 1, padding: 20, gap: 18 },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
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

  // Clue card
  clueCard: {
    backgroundColor: c.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: c.border,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
    ...shadows.card,
  },
  clueLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: c.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  clueEnglish: {
    fontSize: 24,
    fontFamily: fonts.display,
    color: c.text,
    textAlign: 'center',
    lineHeight: 31,
  },
  articleChip: {
    backgroundColor: c.indigoSoft,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  articleChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: c.indigo,
  },

  // Slots
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
  },
  slot: {
    width: 40,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: c.border,
    backgroundColor: c.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    fontSize: 20,
    fontFamily: fonts.display,
    color: c.text,
  },

  // Tiles
  tileArea: { flex: 1, justifyContent: 'flex-end', gap: 16, paddingBottom: 8 },
  tileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 9,
  },
  tile: {
    width: 46,
    height: 54,
    borderRadius: 12,
    backgroundColor: c.card,
    borderWidth: 2,
    borderColor: c.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  tileUsed: {
    borderColor: c.borderLight,
    backgroundColor: isDark ? c.bg : '#F8FAFC',
    shadowOpacity: 0,
    elevation: 0,
  },
  tileText: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: c.indigo,
  },
  tileTextUsed: { color: 'transparent' },

  shuffleBtn: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.border,
  },
  shuffleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: c.textSecondary,
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
  finishedEmoji:      { fontSize: 44, marginBottom: 4 },
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
