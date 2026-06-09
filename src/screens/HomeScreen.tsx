import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

const CHAT_ICON = require('../../assets/icons/white_message_icon.png');
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, UserProgress } from '../types';
import { getUserProgress } from '../database/db';
import StreakDisplay from '../components/StreakDisplay';
import XPBar from '../components/XPBar';
import UnitMap from '../components/UnitMap';
import DailyChallengeCard from '../components/DailyChallengeCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProgress = async () => {
    const p = await getUserProgress();
    setProgress(p);
  };

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  if (!progress) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {progress.profileName ? `¡Hola, ${progress.profileName}!` : '¡Hola!'}
            </Text>
            <Text style={styles.subtitle}>Ready to practice today?</Text>
          </View>
          <StreakDisplay streak={progress.streak} />
        </View>

        <View style={styles.xpCard}>
          <XPBar current={progress.dailyXPToday} goal={progress.dailyGoalXP} />
          <Text style={styles.totalXP}>{progress.xp} total XP</Text>
        </View>

        <DailyChallengeCard
          completedLessons={progress.completedLessons}
          completedToday={progress.lastChallengeDate === new Date().toISOString().split('T')[0]}
          onStart={() => navigation.navigate('DailyChallenge')}
        />

        <TouchableOpacity
          style={styles.chatCard}
          onPress={() => navigation.navigate('Conversation', {})}
          activeOpacity={0.82}
        >
          <View style={styles.chatCardLeft}>
            <Image source={CHAT_ICON} style={styles.chatCardEmoji} resizeMode="contain" />
            <View>
              <Text style={styles.chatCardTitle}>AI Conversation</Text>
              <Text style={styles.chatCardDesc}>Practice Spanish with an AI tutor</Text>
            </View>
          </View>
          <Text style={styles.chatCardArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your Lessons</Text>
        <UnitMap
          completedLessons={progress.completedLessons}
          onLessonPress={(lessonId) => navigation.navigate('Lesson', { lessonId })}
          unlockAll={progress.developerMode}
          lessonScores={progress.history.reduce<Record<string, number>>((acc, h) => {
            acc[h.lessonId] = Math.max(acc[h.lessonId] ?? 0, h.score);
            return acc;
          }, {})}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  xpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  totalXP: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  chatCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chatCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  chatCardEmoji: { width: 36, height: 36 },
  chatCardTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  chatCardDesc: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  chatCardArrow: { fontSize: 20, color: 'rgba(255,255,255,0.7)' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
});
