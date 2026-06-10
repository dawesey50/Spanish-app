import React, { useCallback, useRef, useState } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUserProgress, getXPHistory } from '../database/db';
import { getUserLevel } from '../utils/level';
import { UNITS, LESSONS_BY_ID } from '../data/units';
import type { UserProgress } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import CountUp from '../components/CountUp';
import FadeSlideIn from '../components/FadeSlideIn';
import { ScreenSkeleton } from '../components/Skeleton';
import PulseImage from '../components/PulseImage';
import { fonts, gradients, radius, shadows, spacing, type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';

const FIRE_ICON = require('../../assets/icons/fire.png');
const UNIT_IMAGES: Record<string, ReturnType<typeof require>> = {
  unit_01: require('../../assets/units/Greetings.png'),
  unit_02: require('../../assets/units/Food.png'),
  unit_03: require('../../assets/units/travel.png'),
  unit_04: require('../../assets/units/People.png'),
};

const BAR_MAX = 80;
const CAL_DAYS = 30;

// ─── Helpers ─────────────────────────────────────────────────────────────

function labelDate(iso: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (iso === today) return 'Today';
  if (iso === yesterday) return 'Yesterday';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() - (count - 1 - i) * 86400000);
    return d.toISOString().split('T')[0];
  });
}

function groupHistory(history: UserProgress['history']) {
  const map: Record<string, typeof history> = {};
  history.forEach((h) => { (map[h.date] = map[h.date] || []).push(h); });
  return Object.entries(map).sort(([a], [b]) => b.localeCompare(a)).slice(0, 8);
}

// ─── Sub-components ──────────────────────────────────────────────────────

function StatCard({ emoji, value, label, sub, tint }: {
  emoji: string; value: string; label: string; sub?: string; tint: string;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.statCard, { borderTopColor: tint, borderTopWidth: 3 }]}>
      <View style={[styles.statIconCircle, { backgroundColor: tint + '22' }]}>
        <Text style={styles.statEmoji}>{emoji}</Text>
      </View>
      {/^[0-9,]+$/.test(value) ? (
        <CountUp value={parseInt(value.replace(/,/g, ''), 10)} style={[styles.statValue, { color: tint }]} format={(n) => n.toLocaleString()} />
      ) : (
        <Text style={[styles.statValue, { color: tint }]}>{value}</Text>
      )}
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function ScoreRing({ score }: { score: number }) {
  const { c } = useTheme();
  const styles = useThemedStyles(createStyles);
  const tint = score >= 80 ? c.green : score >= 60 ? c.amber : c.red;
  const bg   = score >= 80 ? c.greenSoft : score >= 60 ? c.amberSoft : c.redSoft;
  return (
    <View style={[styles.scoreChip, { backgroundColor: bg, borderColor: tint + '66' }]}>
      <Text style={[styles.scoreChipText, { color: tint }]}>{score}%</Text>
    </View>
  );
}

function XPChart({ data, goalXP }: { data: { date: string; xp: number }[]; goalXP: number }) {
  const { c } = useTheme();
  const styles = useThemedStyles(createStyles);
  const today  = new Date().toISOString().split('T')[0];
  const maxXP  = Math.max(...data.map((d) => d.xp), goalXP, 1);
  const total  = data.reduce((s, d) => s + d.xp, 0);
  const bars   = useRef(data.map(() => new Animated.Value(0))).current;

  useFocusEffect(useCallback(() => {
    bars.forEach((b) => b.setValue(0));
    Animated.stagger(50, bars.map((b, i) =>
      Animated.timing(b, {
        toValue: data[i].xp > 0 ? Math.max((data[i].xp / maxXP) * BAR_MAX, 6) : 0,
        duration: 420,
        useNativeDriver: false,
      })
    )).start();
  }, [JSON.stringify(data)]));

  const goalY = (goalXP / maxXP) * BAR_MAX;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>XP This Week</Text>
        <Text style={styles.sectionSub}>{total > 0 ? `+${total} XP` : 'No lessons yet'}</Text>
      </View>
      <View style={styles.chart}>
        <View style={[styles.goalLine, { bottom: goalY + 20 }]}>
          <Text style={styles.goalLineLabel}>{goalXP} goal</Text>
          <View style={styles.goalLineDash} />
        </View>
        {data.map(({ date, xp }, i) => {
          const isToday = date === today;
          const dayLabel = new Date(`${date}T12:00:00`).toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
          return (
            <View key={date} style={styles.chartCol}>
              {xp > 0 && (
                <Text style={[styles.chartXPLabel, isToday && { color: c.amber }]}>{xp}</Text>
              )}
              <View style={{ height: BAR_MAX, justifyContent: 'flex-end' }}>
                <Animated.View style={[
                  styles.bar,
                  { height: bars[i] },
                  isToday ? styles.barToday : styles.barNormal,
                ]} />
              </View>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{dayLabel}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────

export default function ProgressScreen() {
  const navigation = useNavigation<any>();
  const { c } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [progress, setProgress]   = useState<UserProgress | null>(null);
  const [weekXP, setWeekXP]       = useState<{ date: string; xp: number }[]>([]);
  const [monthXP, setMonthXP]     = useState<{ date: string; xp: number }[]>([]);

  useFocusEffect(useCallback(() => {
    Promise.all([getUserProgress(), getXPHistory(7), getXPHistory(CAL_DAYS)]).then(
      ([p, week, month]) => { setProgress(p); setWeekXP(week); setMonthXP(month); }
    );
  }, []));

  if (!progress) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
        <ScreenSkeleton />
      </SafeAreaView>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const lvl   = getUserLevel(progress.xp);
  const lvlPct = lvl.nextLevelXP
    ? Math.min((progress.xp - lvl.minXP) / (lvl.nextLevelXP - lvl.minXP), 1)
    : 1;

  const accuracy = progress.history.length > 0
    ? Math.round(progress.history.reduce((s, h) => s + h.score, 0) / progress.history.length)
    : null;

  const totalLessons = UNITS.reduce((s, u) => s + u.lessonIds.length, 0);
  const activeDays   = new Set(progress.history.map((h) => h.date)).size;

  // Calendar
  const calMap    = Object.fromEntries(monthXP.map((d) => [d.date, d.xp]));
  const maxCalXP  = Math.max(...monthXP.map((d) => d.xp), 1);
  const last30    = getDates(CAL_DAYS);
  const startDay  = new Date(`${last30[0]}T12:00:00`).getDay(); // 0=Sun

  const histGroups = groupHistory(progress.history);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ backgroundColor: c.bg }} showsVerticalScrollIndicator={false}>

        {/* ─── Hero header ─────────────────────────────────────── */}
        <LinearGradient
          colors={gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Medal badge */}
          <View style={[styles.medalRing, { borderColor: lvl.color + '66' }]}>
            <View style={[styles.medalCore, { borderColor: lvl.color }]}>
              <Text style={[styles.medalNum, { color: lvl.color }]}>{lvl.level}</Text>
            </View>
          </View>

          <Text style={styles.heroLevelName}>{lvl.name}</Text>
          <Text style={styles.heroXP}>
            {progress.xp.toLocaleString()}
            {lvl.nextLevelXP ? ` / ${lvl.nextLevelXP.toLocaleString()} XP` : ' XP — MAX LEVEL'}
          </Text>

          <View style={styles.heroBarWrap}>
            <View style={styles.heroBarTrack}>
              <View style={[styles.heroBarFill, { width: `${Math.round(lvlPct * 100)}%` as any }]} />
            </View>
            <Text style={styles.heroBarPct}>{Math.round(lvlPct * 100)}%</Text>
          </View>

          {lvl.nextLevelXP && (
            <Text style={styles.heroHint}>
              {(lvl.nextLevelXP - progress.xp).toLocaleString()} XP to Level {lvl.level + 1}
            </Text>
          )}

          {progress.streak > 0 && (
            <View style={styles.heroStreak}>
              <PulseImage source={FIRE_ICON} style={styles.heroFireIcon} />
              <Text style={styles.heroStreakText}>{progress.streak}-day streak</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.body}>

          {/* ─── Stats grid ──────────────────────────────────────── */}
          <FadeSlideIn index={0}>
          <View style={styles.statsGrid}>
            <StatCard emoji="🔥" value={String(progress.streak)} label="Streak"
              sub={`Best: ${Math.max(progress.longestStreak, progress.streak)}d`} tint="#EA580C" />
            <StatCard emoji="⚡" value={progress.xp.toLocaleString()} label="Total XP"
              sub={`Today: +${progress.dailyXPToday}`} tint={c.indigo} />
            <StatCard emoji="📚" value={`${progress.completedLessons.length}/${totalLessons}`}
              label="Lessons" tint={c.green} />
            <StatCard emoji="🎯" value={accuracy !== null ? `${accuracy}%` : '—'}
              label="Accuracy" tint={c.sky} />
            <StatCard emoji="🧠" value={String(progress.wordsMastered)} label="Mastered"
              sub="spaced repetition" tint="#7C3AED" />
            <StatCard emoji="📅" value={String(activeDays)} label="Active Days" tint="#D97706" />
          </View>
          </FadeSlideIn>

          {/* ─── XP chart ────────────────────────────────────────── */}
          <FadeSlideIn index={1}>
            <XPChart data={weekXP} goalXP={progress.dailyGoalXP} />
          </FadeSlideIn>

          {/* ─── 30-day calendar ─────────────────────────────────── */}
          <FadeSlideIn index={2}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>30-Day Activity</Text>
              <Text style={styles.sectionSub}>
                {monthXP.filter((d) => d.xp > 0).length} / {CAL_DAYS} days
              </Text>
            </View>

            {/* Weekday headers */}
            <View style={styles.calRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <Text key={i} style={styles.calDayHeader}>{d}</Text>
              ))}
            </View>

            {/* Grid */}
            <View style={styles.calGrid}>
              {Array.from({ length: startDay }, (_, i) => (
                <View key={`pad-${i}`} style={styles.calCell} />
              ))}
              {last30.map((date) => {
                const xp       = calMap[date] ?? 0;
                const isToday  = date === today;
                const lvlIdx   = xp === 0 ? 0 : xp < maxCalXP * 0.33 ? 1 : xp < maxCalXP * 0.67 ? 2 : 3;
                const bg       = [c.border, '#A7F3D0', '#34D399', '#059669'][lvlIdx];
                return (
                  <View key={date} style={[styles.calCell, { backgroundColor: bg },
                    isToday && styles.calToday]} />
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.calLegend}>
              {(['None', 'Low', 'Mid', 'High'] as const).map((l, i) => (
                <View key={l} style={styles.calLegendItem}>
                  <View style={[styles.calLegendDot,
                    { backgroundColor: [c.border, '#A7F3D0', '#34D399', '#059669'][i] }]} />
                  <Text style={styles.calLegendText}>{l}</Text>
                </View>
              ))}
            </View>

            {progress.streak >= 3 && (
              <View style={styles.streakCallout}>
                <Image source={FIRE_ICON} style={styles.streakCalloutIcon} resizeMode="contain" />
                <Text style={styles.streakCalloutText}>
                  {progress.streak >= 30 ? 'Monthly Legend!' : progress.streak >= 14
                    ? 'Two Weeks Strong!' : progress.streak >= 7 ? 'Week Warrior!' : 'On a Roll!'}
                  {' '}· {progress.streak}-day streak
                </Text>
              </View>
            )}
          </View>

          </FadeSlideIn>

          {/* ─── Unit mastery ────────────────────────────────────── */}
          <FadeSlideIn index={3}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Unit Mastery</Text>
            </View>
            {UNITS.map((unit) => {
              const done  = unit.lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
              const total = unit.lessonIds.length;
              const pct   = done / total;
              const full  = pct === 1;
              return (
                <View key={unit.id} style={styles.unitRow}>
                  <Image source={UNIT_IMAGES[unit.id]} style={styles.unitImg} resizeMode="contain" />
                  <View style={styles.unitInfo}>
                    <View style={styles.unitTitleRow}>
                      <Text style={styles.unitName}>{unit.title}</Text>
                      <Text style={[styles.unitCount, full && { color: c.green }]}>
                        {done}/{total}
                      </Text>
                    </View>
                    <View style={styles.unitTrack}>
                      <View style={[styles.unitFill, {
                        width: `${Math.round(pct * 100)}%` as any,
                        backgroundColor: full ? c.green : c.indigo,
                      }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          </FadeSlideIn>

          {/* ─── Review shortcut ─────────────────────────────────── */}
          <FadeSlideIn index={4}>
          {progress.weakWords.length > 0 && (
            <TouchableOpacity
              style={styles.reviewBanner}
              onPress={() => navigation.navigate('Review')}
              activeOpacity={0.85}
            >
              <Text style={styles.reviewBannerEmoji}>⚠️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewBannerTitle}>
                  {progress.weakWords.length} word{progress.weakWords.length !== 1 ? 's' : ''} need practice
                </Text>
                <Text style={styles.reviewBannerSub}>Tap to start a review session</Text>
              </View>
              <Text style={styles.reviewBannerArrow}>→</Text>
            </TouchableOpacity>
          )}
          </FadeSlideIn>

          {/* ─── Lesson history ──────────────────────────────────── */}
          <FadeSlideIn index={5}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lesson History</Text>
            </View>
            {progress.history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>
                  Complete a lesson to see your history here.
                </Text>
              </View>
            ) : (
              histGroups.map(([date, entries]) => (
                <View key={date}>
                  <Text style={styles.histDateHeader}>{labelDate(date)}</Text>
                  {entries.map((entry, i) => {
                    const lesson = LESSONS_BY_ID[entry.lessonId];
                    return (
                      <View key={i} style={styles.histRow}>
                        <Text style={styles.histLesson} numberOfLines={1}>
                          {lesson?.title ?? entry.lessonId}
                        </Text>
                        <ScoreRing score={entry.score} />
                      </View>
                    );
                  })}
                </View>
              ))
            )}
          </View>
          </FadeSlideIn>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#6366F1' },

  // Hero
  hero: {
    backgroundColor: c.indigo,
    paddingTop: spacing.xl,
    paddingBottom: 36,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  medalRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  medalCore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalNum: {
    fontSize: 34,
    fontFamily: fonts.display,
  },
  heroLevelName: { fontSize: 20, fontFamily: fonts.display, color: '#FFFFFF' },
  heroXP: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  heroBarWrap: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  heroBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  heroBarFill: {
    height: '100%',
    backgroundColor: c.card,
    borderRadius: radius.pill,
  },
  heroBarPct: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '700', width: 36, textAlign: 'right' },
  heroHint: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  heroStreak: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  heroFireIcon: { width: 14, height: 14 },
  heroStreakText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },

  body: { padding: spacing.xl, gap: spacing.xl },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: {
    width: '47%',
    backgroundColor: c.card,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 3,
    ...shadows.card,
  },
  statIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statEmoji: { fontSize: 18 },
  statValue: { fontSize: 22, fontFamily: fonts.display },
  statLabel: { fontSize: 11, color: c.textSecondary, fontWeight: '600', textAlign: 'center' },
  statSub: { fontSize: 10, color: c.textMuted, textAlign: 'center' },

  // Section wrapper
  section: {
    backgroundColor: c.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 16, fontFamily: fonts.display, color: c.text },
  sectionSub: { fontSize: 12, color: c.textMuted, fontWeight: '600' },

  // XP Chart
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    height: BAR_MAX + 56,
    position: 'relative',
  },
  goalLine: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goalLineLabel: { fontSize: 9, color: c.textMuted, fontWeight: '700' },
  goalLineDash: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: c.textMuted,
    opacity: 0.5,
  },
  chartCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartXPLabel: { fontSize: 9, color: c.textMuted, fontWeight: '700' },
  bar: { width: '70%', borderRadius: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  barNormal: { backgroundColor: c.indigoBorder },
  barToday: { backgroundColor: c.amber },
  dayLabel: { fontSize: 10, color: c.textMuted, fontWeight: '600' },
  dayLabelToday: { color: c.amber, fontWeight: '800' },

  // Calendar
  calRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: 4,
  },
  calDayHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: '700',
    color: c.textMuted,
    textAlign: 'center',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: 4,
  },
  calCell: {
    flex: 1,
    minWidth: '12%',
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: c.border,
  },
  calToday: {
    borderWidth: 2,
    borderColor: c.indigo,
  },
  calLegend: {
    flexDirection: 'row',
    gap: 12,
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  calLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  calLegendDot: { width: 10, height: 10, borderRadius: 2 },
  calLegendText: { fontSize: 10, color: c.textMuted },
  streakCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: isDark ? c.amberSoft : '#FFF7ED',
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  streakCalloutIcon: { width: 18, height: 18 },
  streakCalloutText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#C2410C' },

  // Unit mastery
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.borderLight,
  },
  unitImg: { width: 36, height: 36, borderRadius: 8 },
  unitInfo: { flex: 1, gap: 6 },
  unitTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unitName: { fontSize: 14, fontWeight: '700', color: c.text },
  unitCount: { fontSize: 12, fontWeight: '700', color: c.textMuted },
  unitTrack: {
    height: 6,
    backgroundColor: c.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  unitFill: { height: '100%', borderRadius: radius.pill },

  // Review banner
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: c.amberSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: c.amberBorder,
  },
  reviewBannerEmoji: { fontSize: 22 },
  reviewBannerTitle: { fontSize: 14, fontWeight: '700', color: '#92400E' },
  reviewBannerSub: { fontSize: 12, color: '#A16207', marginTop: 2 },
  reviewBannerArrow: { fontSize: 18, color: '#A16207', fontWeight: '700' },

  // Score chip
  scoreChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  scoreChipText: { fontSize: 13, fontWeight: '800' },

  // History
  emptyHistory: { padding: spacing.lg, paddingTop: spacing.xs },
  emptyHistoryText: { fontSize: 13, color: c.textSecondary },
  histDateHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: c.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.borderLight,
  },
  histLesson: { flex: 1, fontSize: 14, fontWeight: '600', color: c.text, marginRight: spacing.sm },
});
