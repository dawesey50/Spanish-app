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

export default function ProgressScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      getUserProgress().then(setProgress);
    }, [])
  );

  if (!progress) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>

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

        <Text style={styles.sectionTitle}>Recent Lessons</Text>
        {progress.history.length === 0 ? (
          <Text style={styles.empty}>No lessons completed yet. Start learning!</Text>
        ) : (
          progress.history.slice(0, 10).map((entry, i) => {
            const lesson = LESSONS_BY_ID[entry.lessonId];
            return (
              <View key={i} style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyLesson}>{lesson?.title ?? entry.lessonId}</Text>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                </View>
                <View
                  style={[
                    styles.scoreBadge,
                    {
                      backgroundColor:
                        entry.score >= 80
                          ? '#D1FAE5'
                          : entry.score >= 60
                          ? '#FEF3C7'
                          : '#FEE2E2',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      {
                        color:
                          entry.score >= 80
                            ? '#065F46'
                            : entry.score >= 60
                            ? '#92400E'
                            : '#991B1B',
                      },
                    ]}
                  >
                    {entry.score}%
                  </Text>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
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
