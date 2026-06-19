import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const FIRE_ICON   = require('../../assets/icons/fire.png');
const CHAT_ICON   = require('../../assets/icons/white_message_icon.png');
const TARGET_ICON = require('../../assets/icons/blue_target.png');
const TICK_ICON   = require('../../assets/icons/green_tick.png');

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, UserProgress } from '../types';
import { getUserProgress } from '../database/db';
import { WORDS } from '../data/words';
import { UNITS, LESSONS_BY_ID, isLessonUnlocked } from '../data/units';
import AudioButton from '../components/AudioButton';
import { getUserLevel } from '../utils/level';
import UnitMap from '../components/UnitMap';
import PressableScale from '../components/PressableScale';
import PulseImage from '../components/PulseImage';
import CountUp from '../components/CountUp';
import FadeSlideIn from '../components/FadeSlideIn';
import { ScreenSkeleton } from '../components/Skeleton';
import { fonts, gradients, type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
import { getAvatarGradient } from '../components/AvatarPickerModal';
import { AvatarSvg, isCustomAvatar } from '../components/AvatarCharacters';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { c } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const xpFillAnim = useRef(new Animated.Value(0)).current;
  const scrollRef  = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  useEffect(() => {
    if (!progress) return;
    const lvl = getUserLevel(progress.xp);
    const lp = lvl.nextLevelXP
      ? Math.min((progress.xp - lvl.minXP) / (lvl.nextLevelXP - lvl.minXP), 1)
      : 1;
    Animated.timing(xpFillAnim, {
      toValue: lp,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [progress]);

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
      <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
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
  const shieldUsedToday = progress.shieldUsedDate === todayStr;

  // Word of the day — deterministic daily rotation
  const dayIndex = Math.floor(Date.now() / 86400000);
  const wotd = WORDS[dayIndex % WORDS.length];

  // Shield recharge countdown (7-day cooldown)
  const shieldRechargesIn = !progress.streakShieldAvailable && progress.shieldUsedDate
    ? Math.max(0, 7 - Math.floor((Date.now() - new Date(progress.shieldUsedDate + 'T00:00:00').getTime()) / 86400000))
    : 0;

  // Next unlocked lesson to continue
  const totalLessons = UNITS.reduce((s, u) => s + u.lessonIds.length, 0);
  let nextLessonId: string | null = null;
  let nextUnitTitle = '';
  let nextLessonTitle = '';
  let nextLessonIndex = 0;
  outer: for (const unit of UNITS) {
    for (let i = 0; i < unit.lessonIds.length; i++) {
      const id = unit.lessonIds[i];
      if (!progress.completedLessons.includes(id) &&
          (progress.developerMode || isLessonUnlocked(id, progress.completedLessons))) {
        nextLessonId = id;
        nextUnitTitle = unit.title;
        nextLessonTitle = LESSONS_BY_ID[id]?.title ?? id;
        nextLessonIndex = i;
        break outer;
      }
    }
  }

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
            {isCustomAvatar(progress.profileEmoji) ? (
              <LinearGradient
                colors={getAvatarGradient(progress.profileColor) as unknown as [string, string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <AvatarSvg id={progress.profileEmoji} size={40} />
              </LinearGradient>
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
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
            {progress.streakShieldAvailable ? (
              <Text style={styles.shieldIcon}>🛡️</Text>
            ) : shieldRechargesIn > 0 ? (
              <Text style={styles.shieldCooldown}>🛡️{shieldRechargesIn}d</Text>
            ) : null}
          </View>
        </View>

        {/* Row 2: level + XP */}
        <View style={styles.xpRow}>
          <View style={[styles.levelBadge, { backgroundColor: lvl.color + 'CC' }]}>
            <Text style={styles.levelText}>Lv.{lvl.level} · {lvl.name}</Text>
          </View>
          <Text style={styles.xpText}>
            {progress.xp.toLocaleString()}{lvl.nextLevelXP ? ` / ${lvl.nextLevelXP.toLocaleString()} XP` : ' XP (Max)'}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.xpTrack}>
          <Animated.View
            style={[styles.xpFill, {
              backgroundColor: lvl.color,
              width: xpFillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }]}
          />
        </View>

        {/* Multiplier hint */}
        {progress.streak >= 7 && (
          <Text style={styles.multiplierHint}>🔥 ×1.5 XP bonus active this streak</Text>
        )}

        {/* Shield used banner */}
        {shieldUsedToday && (
          <View style={styles.shieldBanner}>
            <Text style={styles.shieldBannerIcon}>🛡️</Text>
            <Text style={styles.shieldBannerText}>
              Streak protected! Your shield saved your {progress.streak}-day streak.
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* ─── White content area ────────────────────────────────────────── */}
      <View style={styles.contentWrapper}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />}
        >
          {/* ── Continue CTA ─────────────────────────────────────────── */}
          <FadeSlideIn index={0}>
            {nextLessonId ? (
              <PressableScale
                onPress={() => navigation.navigate('Lesson', { lessonId: nextLessonId! })}
                style={styles.continueCard}
              >
                <LinearGradient
                  colors={gradients.hero}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.continueGradient}
                >
                  <View style={styles.continueLeft}>
                    <Text style={styles.continueUnitLabel}>{nextUnitTitle.toUpperCase()}</Text>
                    <Text style={styles.continueTitle}>{nextLessonTitle}</Text>
                    <Text style={styles.continueSub}>
                      Lesson {nextLessonIndex + 1} · {progress.completedLessons.length}/{totalLessons} complete
                    </Text>
                  </View>
                  <View style={styles.continueBtn}>
                    <Text style={styles.continueBtnText}>▶</Text>
                  </View>
                </LinearGradient>
              </PressableScale>
            ) : (
              <View style={styles.allDoneCard}>
                <Text style={styles.allDoneEmoji}>🏆</Text>
                <View>
                  <Text style={styles.allDoneTitle}>All lessons complete!</Text>
                  <Text style={styles.allDoneSub}>Keep reviewing and chatting to build fluency</Text>
                </View>
              </View>
            )}
          </FadeSlideIn>

          {/* ── Quick Actions ─────────────────────────────────────────── */}
          <FadeSlideIn index={1}>
            <View style={styles.quickRow}>
              <PressableScale
                style={[
                  styles.quickPill,
                  completedToday
                    ? styles.quickPillDone
                    : progress.completedLessons.length > 0
                    ? styles.quickPillChallenge
                    : styles.quickPillLocked,
                ]}
                onPress={() => {
                  if (!completedToday && progress.completedLessons.length > 0) {
                    navigation.navigate('DailyChallenge');
                  }
                }}
              >
                <Image
                  source={completedToday ? TICK_ICON : TARGET_ICON}
                  style={styles.quickPillIcon}
                  resizeMode="contain"
                />
                <Text style={[styles.quickPillTitle, completedToday && styles.quickPillTitleDark]}>
                  {completedToday ? 'Challenge Done' : 'Daily Challenge'}
                </Text>
                <Text style={[styles.quickPillDesc, completedToday && styles.quickPillDescDark]}>
                  {completedToday
                    ? 'Resets at midnight'
                    : progress.completedLessons.length === 0
                    ? 'Finish a lesson first'
                    : '+25 XP · 5 questions'}
                </Text>
              </PressableScale>

              <PressableScale
                style={[styles.quickPill, styles.quickPillChat]}
                onPress={() => navigation.navigate('Conversation', {})}
              >
                <Image source={CHAT_ICON} style={styles.quickPillIcon} resizeMode="contain" />
                <Text style={styles.quickPillTitle}>AI Chat</Text>
                <Text style={styles.quickPillDesc}>Practice Spanish</Text>
              </PressableScale>
            </View>
          </FadeSlideIn>

          {/* ── Word of the Day ───────────────────────────────────────── */}
          <FadeSlideIn index={2}>
            <View style={styles.wotdCard}>
              <View style={styles.wotdHeader}>
                <Text style={styles.wotdLabel}>Word of the Day</Text>
                <View style={[styles.wotdDiffDot, { backgroundColor: ['#10B981','#F59E0B','#EF4444'][wotd.difficulty - 1] }]} />
              </View>
              <View style={styles.wotdBody}>
                <View style={styles.wotdTextCol}>
                  <Text style={styles.wotdSpanish}>{wotd.spanish}</Text>
                  <Text style={styles.wotdEnglish}>{wotd.english}</Text>
                  {wotd.gender && (
                    <Text style={styles.wotdGender}>{wotd.gender === 'm' ? '♂ masculine' : '♀ feminine'}</Text>
                  )}
                </View>
                <AudioButton text={wotd.spanish} rate={progress.ttsRate} size="sm" />
              </View>
              <Text style={styles.wotdExample} numberOfLines={2}>{wotd.example}</Text>
            </View>
          </FadeSlideIn>

          {/* ── Your Lessons ─────────────────────────────────────────── */}
          <FadeSlideIn index={3}>
            <Text style={styles.sectionTitle}>Your Lessons</Text>
            <UnitMap
              completedLessons={progress.completedLessons}
              onLessonPress={(lessonId) => navigation.navigate('Lesson', { lessonId })}
              onMiniGamePress={(wordIds, sectionLabel) =>
                navigation.navigate('MiniGame', { wordIds, sectionLabel })
              }
              unlockAll={progress.developerMode}
              lessonScores={progress.history.reduce<Record<string, number>>((acc, h) => {
                acc[h.lessonId] = Math.max(acc[h.lessonId] ?? 0, h.score);
                return acc;
              }, {})}
            />
          </FadeSlideIn>

          {/* ── Stats ────────────────────────────────────────────────── */}
          <FadeSlideIn index={4}>
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#6366F1' },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg },
  loadingText: { fontSize: 16, color: c.textSecondary },

  // ─── Header ───────────────────────────────────────────────────────────
  header: {
    backgroundColor: c.indigo,
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
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
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
    backgroundColor: c.card,
    borderRadius: 3,
  },

  multiplierHint: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  shieldIcon: { fontSize: 14 },
  shieldCooldown: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
  shieldBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  shieldBannerIcon: { fontSize: 18 },
  shieldBannerText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', flex: 1 },

  // ─── Content ──────────────────────────────────────────────────────────
  contentWrapper: {
    flex: 1,
    backgroundColor: c.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  scroll: { padding: 20, paddingBottom: 40 },

  // Quick Actions row
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'stretch',
  },
  quickPill: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    gap: 5,
    minHeight: 90,
  },
  quickPillChallenge: {
    backgroundColor: c.indigo,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  quickPillDone: {
    backgroundColor: c.greenSoft,
    borderWidth: 1,
    borderColor: c.greenBorder,
  },
  quickPillLocked: {
    backgroundColor: isDark ? c.card : '#F1F5F9',
    borderWidth: 1,
    borderColor: c.border,
    opacity: 0.65,
  },
  quickPillChat: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  quickPillIcon: { width: 26, height: 26 },
  quickPillTitle: { fontSize: 13, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  quickPillDesc: { fontSize: 11, color: 'rgba(255,255,255,0.72)' },
  quickPillTitleDark: { color: '#065F46' },
  quickPillDescDark: { color: c.textSecondary },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: c.card,
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
  stripValue: { fontSize: 20, fontFamily: fonts.display, color: c.text },
  stripLabel: { fontSize: 11, color: c.textMuted, fontWeight: '500' },
  stripDivider: { width: 1, backgroundColor: c.borderLight, marginVertical: 4 },

  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.display,
    color: c.text,
    marginBottom: 12,
  },

  // Word of the Day
  wotdCard: {
    backgroundColor: c.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.indigoBorder,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wotdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wotdLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: c.indigo,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  wotdDiffDot: { width: 8, height: 8, borderRadius: 4 },
  wotdBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  wotdTextCol: { flex: 1 },
  wotdSpanish: { fontSize: 22, fontFamily: fonts.display, color: c.text },
  wotdEnglish: { fontSize: 14, color: c.textSecondary, marginTop: 1 },
  wotdGender: { fontSize: 11, color: c.textMuted, marginTop: 3 },
  wotdExample: {
    fontSize: 13,
    color: c.textMuted,
    fontStyle: 'italic',
    lineHeight: 19,
    borderTopWidth: 1,
    borderTopColor: c.borderLight,
    paddingTop: 8,
  },

  // Continue CTA card
  continueCard: { marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  continueLeft: { flex: 1 },
  continueUnitLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  continueTitle: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueSub: { fontSize: 12, color: 'rgba(255,255,255,0.72)' },
  continueBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  continueBtnText: { fontSize: 20, color: '#FFFFFF' },

  // All done card (no more lessons)
  allDoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: c.greenSoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: c.greenBorder,
  },
  allDoneEmoji: { fontSize: 32 },
  allDoneTitle: { fontSize: 16, fontFamily: fonts.bold, color: '#065F46' },
  allDoneSub: { fontSize: 12, color: c.textSecondary, marginTop: 2 },
});
