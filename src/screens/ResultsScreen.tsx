import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { LESSONS_BY_ID, UNITS_BY_ID } from '../data/units';
import { WORDS_BY_ID } from '../data/words';
import { getUserProgress } from '../database/db';
import AudioButton from '../components/AudioButton';

const STAR_ICON  = require('../../assets/icons/star.png');
const TICK_ICON  = require('../../assets/icons/green_tick.png');
const CROSS_ICON = require('../../assets/icons/red_cross.png');

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Results'>;

const PARTICLE_COLORS   = ['#FCD34D', '#F87171', '#34D399', '#60A5FA', '#A78BFA', '#F472B6', '#FB923C', '#4ADE80'];
const PARTICLE_COUNT    = 8;
const PARTICLE_DISTANCE = 88;
const CIRCLE_OUTER_SIZE = 180;
const PARTICLE_SIZE     = 10;
const PARTICLE_CENTER   = (CIRCLE_OUTER_SIZE - PARTICLE_SIZE) / 2;

export default function ResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { lessonId, score, xpEarned, corrections, wordResults } = route.params;

  const lesson      = LESSONS_BY_ID[lessonId];
  const unit        = lesson ? UNITS_BY_ID[lesson.unitId] : undefined;
  const lessonWords = (lesson?.wordIds ?? []).map((id) => WORDS_BY_ID[id]).filter(Boolean);

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [displayScore, setDisplayScore]         = useState(0);

  const circleScale   = useRef(new Animated.Value(0.3)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const scoreNum      = useRef(new Animated.Value(0)).current;
  const xpScale       = useRef(new Animated.Value(0)).current;

  const particleAnims = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      tx:      new Animated.Value(0),
      ty:      new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale:   new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    getUserProgress().then((p) => setCompletedLessons(p.completedLessons));

    const listenerId = scoreNum.addListener(({ value }) => setDisplayScore(Math.round(value)));

    Animated.parallel([
      Animated.spring(circleScale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(scoreNum, { toValue: score, duration: 1000, useNativeDriver: false }),
    ]).start(() => {
      Animated.spring(xpScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();

      if (score >= 70) {
        particleAnims.forEach((p, i) => {
          const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
          const tx    = Math.cos(angle) * PARTICLE_DISTANCE;
          const ty    = Math.sin(angle) * PARTICLE_DISTANCE;
          p.tx.setValue(0);
          p.ty.setValue(0);
          p.opacity.setValue(0);
          p.scale.setValue(0);
          Animated.sequence([
            Animated.parallel([
              Animated.timing(p.scale,   { toValue: 1, duration: 250, useNativeDriver: true }),
              Animated.timing(p.opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
              Animated.timing(p.tx,      { toValue: tx, duration: 500, useNativeDriver: true }),
              Animated.timing(p.ty,      { toValue: ty, duration: 500, useNativeDriver: true }),
            ]),
            Animated.timing(p.opacity, { toValue: 0, duration: 350, useNativeDriver: true }),
          ]).start();
        });
      }
    });

    return () => scoreNum.removeListener(listenerId);
  }, []);

  const unitLessons  = unit?.lessonIds ?? [];
  const lessonIdx    = unitLessons.indexOf(lessonId);
  const nextLessonId = lessonIdx >= 0 && lessonIdx + 1 < unitLessons.length ? unitLessons[lessonIdx + 1] : null;
  const nextLesson   = nextLessonId ? LESSONS_BY_ID[nextLessonId] : null;
  const isUnitComplete = unitLessons.length > 0 && unitLessons.every((id) => completedLessons.includes(id));

  const grade =
    score >= 90 ? { label: '¡Excelente!', sub: 'Outstanding performance',       bg: '#059669' }
    : score >= 70 ? { label: '¡Bien hecho!', sub: 'Great job!',                  bg: '#4F46E5' }
    : score >= 50 ? { label: 'Keep going!',  sub: "You're making progress",      bg: '#D97706' }
    :               { label: 'Keep at it!',  sub: 'Every attempt makes you better', bg: '#DC2626' };

  const wordPerformance: Record<string, boolean> = {};
  if (wordResults) {
    wordResults.forEach(({ wordId, correct }) => {
      if (wordPerformance[wordId] === undefined) wordPerformance[wordId] = correct;
      else if (!correct) wordPerformance[wordId] = false;
    });
  }
  const hasPerformance = wordResults && wordResults.length > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: grade.bg }]}>
      {/* ─── Grade header ─────────────────────────────────────────────── */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.gradeLabel}>{grade.label}</Text>
        <Text style={styles.gradeSub}>{grade.sub}</Text>

        {/* Score circle + particle burst */}
        <View style={styles.circleOuter}>
          <Animated.View style={[styles.circle, { transform: [{ scale: circleScale }] }]}>
            <Text style={styles.scoreNum}>{displayScore}</Text>
            <Text style={styles.scorePct}>%</Text>
          </Animated.View>

          {score >= 70 && particleAnims.map((p, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                { backgroundColor: PARTICLE_COLORS[i] },
                { opacity: p.opacity, transform: [{ translateX: p.tx }, { translateY: p.ty }, { scale: p.scale }] },
              ]}
            />
          ))}
        </View>

        <Text style={styles.lessonName}>{lesson?.title ?? lessonId}</Text>
      </Animated.View>

      {/* ─── White content card ────────────────────────────────────────── */}
      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Stats strip */}
          <View style={styles.statsRow}>
            <Animated.View style={[styles.xpBadge, { transform: [{ scale: xpScale }] }]}>
              <Text style={styles.xpValue}>+{xpEarned}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </Animated.View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: corrections.length > 0 ? '#DC2626' : '#059669' }]}>
                {corrections.length}
              </Text>
              <Text style={styles.statLabel}>Mistakes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lessonWords.length}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
          </View>

          {/* Unit complete banner */}
          {isUnitComplete && unit && (
            <View style={styles.unitBanner}>
              <Image source={STAR_ICON} style={styles.unitIcon} resizeMode="contain" />
              <View>
                <Text style={styles.unitTitle}>Unit Complete! 🎉</Text>
                <Text style={styles.unitDesc}>{unit.title} — all lessons done</Text>
              </View>
            </View>
          )}

          {/* Corrections */}
          {corrections.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Review Corrections</Text>
              {corrections.map((c, i) => (
                <View key={i} style={styles.correctionCard}>
                  <Text style={styles.wrongAnswer}>✗  {c.original}</Text>
                  <Text style={styles.rightAnswer}>✓  {c.corrected}</Text>
                  {c.explanation ? <Text style={styles.explanation}>{c.explanation}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {/* Words in lesson */}
          {lessonWords.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Words in This Lesson</Text>
              <View style={styles.wordList}>
                {lessonWords.map((w) => {
                  const perf = hasPerformance ? wordPerformance[w.id] : undefined;
                  return (
                    <View key={w.id} style={styles.wordRow}>
                      <AudioButton text={w.spanish} size="sm" />
                      <View style={styles.wordLeft}>
                        <Text style={styles.wordSpanish}>{w.spanish}</Text>
                        <Text style={styles.wordExample} numberOfLines={1}>{w.example}</Text>
                      </View>
                      <Text style={styles.wordEnglish}>{w.english}</Text>
                      {perf !== undefined && (
                        <Image
                          source={perf ? TICK_ICON : CROSS_ICON}
                          style={styles.wordMark}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {nextLesson && (
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: grade.bg }]}
                onPress={() => navigation.replace('Lesson', { lessonId: nextLessonId! })}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnSub}>UP NEXT</Text>
                <Text style={styles.nextBtnTitle}>{nextLesson.title} →</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => navigation.navigate('Main')}
              activeOpacity={0.85}
            >
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => navigation.replace('Lesson', { lessonId })}
              activeOpacity={0.7}
            >
              <Text style={styles.retryBtnText}>Practice Again</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // ─── Header ───────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  gradeLabel:  { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  gradeSub:    { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 4, marginBottom: 20 },

  circleOuter: {
    width: CIRCLE_OUTER_SIZE,
    height: CIRCLE_OUTER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreNum: { fontSize: 52, fontWeight: '900', color: '#FFFFFF' },
  scorePct: { fontSize: 20, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginTop: 18 },

  particle: {
    position: 'absolute',
    top:          PARTICLE_CENTER,
    left:         PARTICLE_CENTER,
    width:        PARTICLE_SIZE,
    height:       PARTICLE_SIZE,
    borderRadius: PARTICLE_SIZE / 2,
  },

  lessonName: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 14, fontWeight: '500' },

  // ─── Content card ─────────────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: '#F8F9FC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scroll: { padding: 20, paddingBottom: 48 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  xpBadge:    { flex: 1, alignItems: 'center' },
  xpValue:    { fontSize: 24, fontWeight: '900', color: '#4F46E5' },
  statDivider: { width: 1, height: 36, backgroundColor: '#F3F4F6' },
  statItem:   { flex: 1, alignItems: 'center' },
  statValue:  { fontSize: 24, fontWeight: '800', color: '#111827' },
  statLabel:  { fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },

  // Unit banner
  unitBanner: {
    backgroundColor: '#FEF9C3',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  unitIcon:  { width: 28, height: 28 },
  unitTitle: { fontSize: 15, fontWeight: '800', color: '#78350F' },
  unitDesc:  { fontSize: 12, color: '#92400E', marginTop: 1 },

  // Sections
  section:      { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },

  correctionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  wrongAnswer: { fontSize: 14, color: '#DC2626', fontWeight: '600', marginBottom: 4 },
  rightAnswer: { fontSize: 14, color: '#059669', fontWeight: '600', marginBottom: 4 },
  explanation: { fontSize: 13, color: '#6B7280', marginTop: 2 },

  wordList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  wordLeft:    { flex: 1 },
  wordSpanish: { fontSize: 15, fontWeight: '700', color: '#111827' },
  wordExample: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  wordEnglish: { fontSize: 13, color: '#4F46E5', fontWeight: '600' },
  wordMark:    { width: 18, height: 18 },

  // Actions
  actions: { gap: 10 },
  nextBtn: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnSub:   { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 1 },
  nextBtnTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginTop: 3 },
  homeBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  homeBtnText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  retryBtn:    { borderRadius: 16, padding: 14, alignItems: 'center' },
  retryBtnText: { color: '#9CA3AF', fontSize: 15, fontWeight: '600' },
});
