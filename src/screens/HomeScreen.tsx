import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FIRE_ICON   = require('../../assets/icons/fire.png');
const CHAT_ICON   = require('../../assets/icons/white_message_icon.png');
const TARGET_ICON = require('../../assets/icons/blue_target.png');
const TICK_ICON   = require('../../assets/icons/green_tick.png');

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, UserProgress } from '../types';
import { getUserProgress } from '../database/db';
import { getUserLevel } from '../utils/level';
import UnitMap from '../components/UnitMap';
import DailyChallengeCard from '../components/DailyChallengeCard';
import PressableScale from '../components/PressableScale';
import PulseImage from '../components/PulseImage';
import CountUp from '../components/CountUp';
import FadeSlideIn from '../components/FadeSlideIn';
import { ScreenSkeleton } from '../components/Skeleton';
import { fonts, gradients } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    (async () => {
      const p = await getUserProgress();
      setProgress(p);
    })();
  }, []);

  useFocusEffect(load);

  const onRefresh = async () => {
    setRefreshing(true);
    const p = await getUserProgress();
    setProgress(p);
    setRefreshing(false);
  };

  if (!progress) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: '#F8F9FC' }]}>
        <ScreenSkeleton />
      </SafeAreaView>
    );
  }

  const lvl = getUserLevel(progress.xp);
  const levelProgress = lvl.nextLevelXP
    ? Math.min((progress.xp - lvl.minXP) / (lvl.nextLevelXP - lvl.minXP), 1)
    : 1;

  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = progress.lastChallengeDate === todayStr;

  const initials = progress.profileName
    ? progress.profileName.slice(0, 2).toUpperCase()
    : 'ES';

  return (
    <SafeAreaView style={styles.safe}>
      {/* ─── Indigo header ─────────────────────────────────────────────── */}
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Row 1: avatar + greeting + streak */}
        <View style={styles.headerTop}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, progress.profileEmoji ? { backgroundColor: progress.profileColor } : {}]}>
              {progress.profileEmoji ? (
                <Text style={styles.avatarEmoji}>{progress.profileEmoji}</Text>
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <View>
              <Text style={styles.greeting}>
                {progress.profileName ? `¡Hola, ${progress.profileName}!` : '¡Hola!'}
              </Text>
              <Text style={styles.subtitle}>Ready to practice today?</Text>
            </View>
          </View>

          <View style={styles.streakPill}>
            {progress.streak > 0 ? (
              <PulseImage source={FIRE_ICON} style={styles.streakFire} />
            ) : (
              <Image source={FIRE_ICON} style={[styles.streakFire, { opacity: 0.5 }]} resizeMode="contain" />
            )}
            <Text style={styles.streakCount}>{progress.streak}</Text>
          </View>
        </View>

        {/* Row 2: level + XP */}
        <View style={styles.xpRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv.{lvl.level} · {lvl.name}</Text>
          </View>
          <Text style={styles.xpText}>
            {progress.xp}{lvl.nextLevelXP ? ` / ${lvl.nextLevelXP} XP` : ' XP'}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${levelProgress * 100}%` as any }]} />
        </View>

        {/* Multiplier hint */}
        {progress.streak >= 7 && (
          <Text style={styles.multiplierHint}>🔥 ×1.5 XP bonus active this streak</Text>
        )}
      </LinearGradient>

      {/* ─── White content area ────────────────────────────────────────── */}
      <View style={styles.contentWrapper}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />}
        >
          {/* Daily challenge */}
          <FadeSlideIn index={0}>
            <Text style={styles.sectionTitle}>Today</Text>
            <DailyChallengeCard
              completedLessons={progress.completedLessons}
              completedToday={completedToday}
              onStart={() => navigation.navigate('DailyChallenge')}
            />
          </FadeSlideIn>

          {/* AI Conversation button */}
          <FadeSlideIn index={1}>
          <PressableScale
            style={styles.chatCard}
            onPress={() => navigation.navigate('Conversation', {})}
          >
            <View style={styles.chatLeft}>
              <View style={styles.chatIconWrap}>
                <Image source={CHAT_ICON} style={styles.chatIcon} resizeMode="contain" />
              </View>
              <View>
                <Text style={styles.chatTitle}>AI Conversation</Text>
                <Text style={styles.chatDesc}>Practice Spanish with an AI tutor</Text>
              </View>
            </View>
            <Text style={styles.chatArrow}>›</Text>
          </PressableScale>
          </FadeSlideIn>

          {/* Stats strip */}
          <FadeSlideIn index={2}>
          <View style={styles.statsStrip}>
            <View style={styles.stripStat}>
              <Image source={TICK_ICON} style={styles.stripIcon} resizeMode="contain" />
              <CountUp value={progress.completedLessons.length} style={styles.stripValue} />
              <Text style={styles.stripLabel}>Lessons</Text>
            </View>
            <View style={styles.stripDivider} />
            <View style={styles.stripStat}>
              <Image source={TARGET_ICON} style={styles.stripIcon} resizeMode="contain" />
              <CountUp value={progress.wordsMastered} style={styles.stripValue} />
              <Text style={styles.stripLabel}>Mastered</Text>
            </View>
            <View style={styles.stripDivider} />
            <View style={styles.stripStat}>
              <Image source={FIRE_ICON} style={styles.stripIcon} resizeMode="contain" />
              <CountUp value={Math.max(progress.streak, progress.longestStreak)} style={styles.stripValue} />
              <Text style={styles.stripLabel}>Best Streak</Text>
            </View>
          </View>
          </FadeSlideIn>

          {/* Lessons */}
          <FadeSlideIn index={3}>
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
          </FadeSlideIn>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#6366F1' },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FC' },
  loadingText: { fontSize: 16, color: '#6B7280' },

  // ─── Header ───────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 22,
    gap: 14,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  avatarEmoji: { fontSize: 22 },
  greeting: { fontSize: 20, fontFamily: fonts.display, color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 1 },

  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
  },
  streakFire: { width: 18, height: 18 },
  streakCount: { fontSize: 18, fontFamily: fonts.display, color: '#FFFFFF' },

  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  xpText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600' },

  xpTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },

  multiplierHint: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ─── Content ──────────────────────────────────────────────────────────
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FC',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  scroll: { padding: 20, paddingBottom: 40 },

  // AI chat card
  chatCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  chatLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  chatIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIcon: { width: 22, height: 22 },
  chatTitle: { fontSize: 16, fontFamily: fonts.bold, color: '#FFFFFF' },
  chatDesc: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  chatArrow: { fontSize: 26, color: 'rgba(255,255,255,0.6)', fontWeight: '300' },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  stripStat: { flex: 1, alignItems: 'center', gap: 4 },
  stripIcon: { width: 22, height: 22 },
  stripValue: { fontSize: 20, fontFamily: fonts.display, color: '#111827' },
  stripLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  stripDivider: { width: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
});
