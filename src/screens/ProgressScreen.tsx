import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProgress } from '../database/db';
import { LESSONS_BY_ID } from '../data/units';
import type { UserProgress } from '../types';

function getLast7Days(): { date: string; label: string; isToday: boolean }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2),
      isToday: i === 6,
    };
  });
}

export default function ProgressScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      getUserProgress().then(setProgress);
    }, [])
  );

  if (!progress) return null;

  const last7 = getLast7Days();
  const activeDates = new Set(progress.history.map((h) => h.date));
  const goalProgress = Math.min(progress.dailyXPToday / progress.dailyGoalXP, 1);
  const goalDone = progress.dailyXPToday >= progress.dailyGoalXP;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>

        {/* 7-day activity calendar */}
        <View style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>Last 7 Days</Text>
          <View style={styles.calendarRow}>
            {last7.map(({ date, label, isToday }) => {
              const active = activeDates.has(date);
              return (
                <View key={date} style={styles.dayCol}>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    {label}
                  </Text>
                  <View
                    style={[
                      styles.dayDot,
                      active && styles.dayDotActive,
                      isToday && !active && styles.dayDotToday,
                    ]}
                  >
                    {active && <Text style={styles.dayCheck}>✓</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Daily goal progress */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Today's Goal</Text>
            <Text style={[styles.goalValues, goalDone && styles.goalDone]}>
              {progress.dailyXPToday} / {progress.dailyGoalXP} XP{goalDone ? ' ✓' : ''}
            </Text>
          </View>
          <View style={styles.goalTrack}>
            <View style={[styles.goalFill, { width: `${goalProgress * 100}%` }, goalDone && styles.goalFillDone]} />
          </View>
          {goalDone && (
            <Text style={styles.goalCompleteMsg}>Goal reached! 🎉 Keep going for bonus XP.</Text>
          )}
        </View>

        {/* Stat grid */}
        <View style={styles.statsGrid}>
          <StatCard emoji="🔥" value={String(progress.streak)} label="Day Streak" color="#D97706" />
          <StatCard emoji="⭐" value={String(progress.xp)} label="Total XP" color="#4F46E5" />
          <StatCard
            emoji="📖"
            value={String(progress.completedLessons.length)}
            label="Lessons Done"
            color="#059669"
          />
          <StatCard
            emoji="⚠️"
            value={String(progress.weakWords.length)}
            label="Words to Review"
            color="#DC2626"
          />
        </View>

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
  color,
}: {
  emoji: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 20 },

  // Calendar
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: { alignItems: 'center', gap: 6 },
  dayLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  dayLabelToday: { color: '#4F46E5' },
  dayDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayDotActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  dayDotToday: { borderColor: '#4F46E5' },
  dayCheck: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },

  // Daily goal
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTitle: { fontSize: 14, fontWeight: '700', color: '#374151' },
  goalValues: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  goalDone: { color: '#059669' },
  goalTrack: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  goalFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 5 },
  goalFillDone: { backgroundColor: '#059669' },
  goalCompleteMsg: { fontSize: 13, color: '#059669', fontWeight: '500' },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
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
  },
  statEmoji: { fontSize: 28, marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500', textAlign: 'center' },

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
