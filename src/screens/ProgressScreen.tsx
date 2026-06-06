import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUserProgress, getXPHistory } from '../database/db';
import { LESSONS, LESSONS_BY_ID } from '../data/units';
import type { UserProgress } from '../types';

const BAR_MAX_H = 72;
const CHART_DAYS = 7;
const CAL_DAYS = 30;

function getDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() - (count - 1 - i) * 86400000);
    return d.toISOString().split('T')[0];
  });
}

export default function ProgressScreen() {
  const navigation = useNavigation<any>();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [xpHistory, setXpHistory] = useState<{ date: string; xp: number }[]>([]);

  useFocusEffect(
    useCallback(() => {
      Promise.all([getUserProgress(), getXPHistory(CHART_DAYS)]).then(([p, xp]) => {
        setProgress(p);
        setXpHistory(xp);
      });
    }, [])
  );

  if (!progress) return null;

  const today = new Date().toISOString().split('T')[0];
  const activeDates = new Set(progress.history.map((h) => h.date));
  const last30 = getDates(CAL_DAYS);

  const totalLessons = LESSONS.length;
  const completedCount = progress.completedLessons.length;

  const accuracy =
    progress.history.length > 0
      ? Math.round(
          progress.history.reduce((sum, h) => sum + h.score, 0) / progress.history.length
        )
      : null;

  const goalProgress = Math.min(progress.dailyXPToday / progress.dailyGoalXP, 1);
  const goalDone = progress.dailyXPToday >= progress.dailyGoalXP;

  const maxXP = Math.max(...xpHistory.map((d) => d.xp), 1);
  const totalWeekXP = xpHistory.reduce((s, d) => s + d.xp, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>

        {/* Today's Goal */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Today's Goal</Text>
            <Text style={[styles.goalValues, goalDone && styles.textGreen]}>
              {progress.dailyXPToday} / {progress.dailyGoalXP} XP{goalDone ? ' ✓' : ''}
            </Text>
          </View>
          <View style={styles.goalTrack}>
            <View
              style={[
                styles.goalFill,
                { width: `${goalProgress * 100}%` },
                goalDone && styles.goalFillDone,
              ]}
            />
          </View>
          {goalDone && (
            <Text style={styles.goalCompleteMsg}>Goal reached! 🎉 Keep going for bonus XP.</Text>
          )}
        </View>

        {/* 30-day activity calendar */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>30-Day Activity</Text>
            <Text style={styles.calSummary}>
              {[...activeDates].filter((d) => last30.includes(d)).length} / {CAL_DAYS} days
            </Text>
          </View>
          <View style={styles.calGrid}>
            {last30.map((date) => {
              const active = activeDates.has(date);
              const isToday = date === today;
              return (
                <View
                  key={date}
                  style={[
                    styles.calDot,
                    active && styles.calDotActive,
                    isToday && !active && styles.calDotToday,
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.calLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4F46E5' }]} />
              <Text style={styles.legendText}>Practiced</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E5E7EB' }]} />
              <Text style={styles.legendText}>Missed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { borderWidth: 2, borderColor: '#4F46E5', backgroundColor: '#EEF2FF' }]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
          </View>
        </View>

        {/* XP this week chart */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>XP This Week</Text>
            <Text style={styles.chartTotal}>{totalWeekXP > 0 ? `+${totalWeekXP} XP` : 'No lessons yet'}</Text>
          </View>
          <View style={styles.chart}>
            {xpHistory.map(({ date, xp }) => {
              const barH = xp > 0 ? Math.max((xp / maxXP) * BAR_MAX_H, 8) : 0;
              const label = new Date(`${date}T12:00:00`)
                .toLocaleDateString('en', { weekday: 'short' })
                .slice(0, 2);
              const isToday = date === today;
              return (
                <View key={date} style={styles.chartCol}>
                  {xp > 0 && <Text style={styles.chartXPLabel}>{xp}</Text>}
                  <View style={styles.chartBarArea}>
                    {xp > 0 && (
                      <View
                        style={[
                          styles.chartBar,
                          { height: barH },
                          isToday && styles.chartBarToday,
                        ]}
                      />
                    )}
                  </View>
                  <Text style={[styles.chartDayLabel, isToday && styles.chartDayToday]}>
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            emoji="🔥"
            value={String(progress.streak)}
            label="Current Streak"
            sub={`Best: ${Math.max(progress.longestStreak, progress.streak)} days`}
            color="#D97706"
          />
          <StatCard
            emoji="⭐"
            value={String(progress.xp)}
            label="Total XP"
            color="#4F46E5"
          />
          <StatCard
            emoji="📖"
            value={`${completedCount}/${totalLessons}`}
            label="Lessons Done"
            color="#059669"
          />
          <StatCard
            emoji="🎯"
            value={accuracy !== null ? `${accuracy}%` : '—'}
            label="Avg. Accuracy"
            color="#0EA5E9"
          />
        </View>

        {/* Weak words shortcut */}
        {progress.weakWords.length > 0 && (
          <TouchableOpacity
            style={styles.reviewBanner}
            onPress={() => navigation.navigate('Review')}
            activeOpacity={0.8}
          >
            <View>
              <Text style={styles.reviewBannerTitle}>
                ⚠️{' '}{progress.weakWords.length} word{progress.weakWords.length !== 1 ? 's' : ''} need practice
              </Text>
              <Text style={styles.reviewBannerSub}>Tap to start a review session →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Lesson history */}
        <Text style={styles.sectionTitle}>Lesson History</Text>
        {progress.history.length === 0 ? (
          <Text style={styles.empty}>No lessons completed yet. Start learning!</Text>
        ) : (
          progress.history.slice(0, 15).map((entry, i) => {
            const lesson = LESSONS_BY_ID[entry.lessonId];
            const scoreColor =
              entry.score >= 80 ? '#065F46' : entry.score >= 60 ? '#92400E' : '#991B1B';
            const scoreBg =
              entry.score >= 80 ? '#D1FAE5' : entry.score >= 60 ? '#FEF3C7' : '#FEE2E2';
            return (
              <View key={i} style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyLesson}>{lesson?.title ?? entry.lessonId}</Text>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                </View>
                <View style={[styles.scoreBadge, { backgroundColor: scoreBg }]}>
                  <Text style={[styles.scoreText, { color: scoreColor }]}>{entry.score}%</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  emoji,
  value,
  label,
  sub,
  color,
}: {
  emoji: string;
  value: string;
  label: string;
  sub?: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 20 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Goal
  goalValues: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  textGreen: { color: '#059669' },
  goalTrack: { height: 10, backgroundColor: '#E5E7EB', borderRadius: 5, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 5 },
  goalFillDone: { backgroundColor: '#059669' },
  goalCompleteMsg: { fontSize: 13, color: '#059669', fontWeight: '500' },

  // 30-day calendar
  calSummary: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  calDot: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  calDotActive: { backgroundColor: '#4F46E5' },
  calDotToday: { backgroundColor: '#EEF2FF', borderWidth: 2, borderColor: '#4F46E5' },
  calLegend: { flexDirection: 'row', gap: 16, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 11, color: '#9CA3AF' },

  // XP bar chart
  chartTotal: { fontSize: 13, fontWeight: '700', color: '#4F46E5' },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_H + 36,
    paddingTop: 20,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  chartXPLabel: { fontSize: 9, color: '#9CA3AF', fontWeight: '600' },
  chartBarArea: { width: '70%', height: BAR_MAX_H, justifyContent: 'flex-end' },
  chartBar: {
    width: '100%',
    backgroundColor: '#C7D2FE',
    borderRadius: 4,
    minHeight: 8,
  },
  chartBarToday: { backgroundColor: '#4F46E5' },
  chartDayLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  chartDayToday: { color: '#4F46E5' },

  // Stats grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 2,
  },
  statEmoji: { fontSize: 26, marginBottom: 4 },
  statValue: { fontSize: 26, fontWeight: '800' },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500', textAlign: 'center' },
  statSub: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 2 },

  // Review banner
  reviewBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewBannerTitle: { fontSize: 14, fontWeight: '700', color: '#92400E' },
  reviewBannerSub: { fontSize: 12, color: '#A16207', marginTop: 3 },

  // History
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 12 },
  empty: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', paddingVertical: 20 },
  historyRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyLeft: { flex: 1 },
  historyLesson: { fontSize: 15, fontWeight: '600', color: '#111827' },
  historyDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  scoreText: { fontSize: 14, fontWeight: '700' },
});
