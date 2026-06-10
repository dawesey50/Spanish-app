import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { getUserProgress, getUnlockedAchievements, setProfileCharacter } from '../database/db';
import { getUserLevel } from '../utils/level';
import { ACHIEVEMENTS_BY_ID, ACHIEVEMENT_ICONS } from '../data/achievements';
import AvatarPickerModal from '../components/AvatarPickerModal';
import FadeSlideIn from '../components/FadeSlideIn';
import { ScreenSkeleton } from '../components/Skeleton';
import type { MainTabParamList, RootStackParamList, UserProgress } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients, radius, shadows, spacing } from '../theme';

const FIRE_ICON = require('../../assets/icons/fire.png');

type ProfileNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

function AvatarCircle({ emoji, color, initials, size = 80 }: { emoji: string; color: string; initials: string; size?: number }) {
  const style = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: emoji ? color : 'rgba(255,255,255,0.22)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: emoji ? 0 : 2,
    borderColor: 'rgba(255,255,255,0.35)',
  };
  return (
    <View style={style}>
      {emoji ? (
        <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
      ) : (
        <Text style={{ color: '#FFFFFF', fontSize: size * 0.28, fontWeight: '800' }}>{initials}</Text>
      )}
    </View>
  );
}

function StatCard({ icon, value, label, tint }: { icon: string; value: string | number; label: string; tint: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: tint, borderTopWidth: 3 }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: tint }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function formatJoinDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  } catch {
    return isoDate;
  }
}

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNav>();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [unlocked, setUnlocked] = useState<{ badgeId: string; unlockedAt: string }[]>([]);
  const [avatarVisible, setAvatarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      Promise.all([getUserProgress(), getUnlockedAchievements()]).then(([p, a]) => {
        setProgress(p);
        setUnlocked(a);
      });
    }, [])
  );

  const handleSaveCharacter = async (emoji: string, color: string) => {
    await setProfileCharacter(emoji, color);
    const p = await getUserProgress();
    setProgress(p);
  };

  if (!progress) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
        <ScreenSkeleton />
      </SafeAreaView>
    );
  }

  const lvl = getUserLevel(progress.xp);
  const levelProgress = lvl.nextLevelXP
    ? Math.min((progress.xp - lvl.minXP) / (lvl.nextLevelXP - lvl.minXP), 1)
    : 1;

  const initials = progress.profileName
    ? progress.profileName.slice(0, 2).toUpperCase()
    : 'ES';

  const unlockedCount = unlocked.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ backgroundColor: colors.bg }} showsVerticalScrollIndicator={false}>
        {/* ─── Hero Header ─────────────────────────────────────── */}
        <LinearGradient
          colors={gradients.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="settings-outline" size={22} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setAvatarVisible(true)} activeOpacity={0.85}>
            <View style={styles.avatarWrap}>
              <AvatarCircle
                emoji={progress.profileEmoji}
                color={progress.profileColor}
                initials={initials}
                size={88}
              />
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={11} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.heroName}>
            {progress.profileName || 'Spanish Learner'}
          </Text>

          <View style={styles.levelRow}>
            <View style={[styles.levelBadge, { backgroundColor: lvl.color }]}>
              <Text style={styles.levelBadgeText}>Lv.{lvl.level}</Text>
            </View>
            <Text style={styles.levelName}>{lvl.name}</Text>
          </View>

          <View style={styles.xpBarWrap}>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${Math.round(levelProgress * 100)}%` as any }]} />
            </View>
            <Text style={styles.xpLabel}>
              {progress.xp}{lvl.nextLevelXP ? ` / ${lvl.nextLevelXP} XP` : ' XP ✓'}
            </Text>
          </View>

          {progress.streak > 0 && (
            <View style={styles.streakRow}>
              <Image source={FIRE_ICON} style={styles.fireIcon} resizeMode="contain" />
              <Text style={styles.streakText}>{progress.streak}-day streak</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.body}>
          {/* ─── Stats ───────────────────────────────────────────── */}
          <FadeSlideIn index={0}>
          <View style={styles.statsGrid}>
            <StatCard icon="⚡" value={progress.xp} label="Total XP" tint={colors.indigo} />
            <StatCard icon="🔥" value={progress.streak} label="Streak" tint="#EA580C" />
            <StatCard icon="📚" value={progress.completedLessons.length} label="Lessons" tint={colors.green} />
            <StatCard icon="🧠" value={progress.wordsMastered} label="Mastered" tint="#7C3AED" />
          </View>
          </FadeSlideIn>

          {/* ─── Achievements ────────────────────────────────────── */}
          <FadeSlideIn index={1}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Achievements')}
                style={styles.sectionLink}
              >
                <Text style={styles.sectionLinkText}>
                  {unlockedCount} / 15
                </Text>
                <Ionicons name="chevron-forward" size={14} color={colors.indigo} />
              </TouchableOpacity>
            </View>

            {unlockedCount === 0 ? (
              <View style={styles.emptyAchievements}>
                <Text style={styles.emptyAchievementsText}>
                  Complete your first lesson to earn badges!
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.achievementScroll}
              >
                {unlocked.map(({ badgeId }) => {
                  const icon = ACHIEVEMENT_ICONS[badgeId];
                  const badge = ACHIEVEMENTS_BY_ID[badgeId];
                  if (!icon || !badge) return null;
                  return (
                    <TouchableOpacity
                      key={badgeId}
                      style={styles.achievementChip}
                      onPress={() => navigation.navigate('Achievements')}
                      activeOpacity={0.8}
                    >
                      <Image source={icon} style={styles.achievementIcon} resizeMode="contain" />
                      <Text style={styles.achievementLabel} numberOfLines={1}>{badge.title}</Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={styles.achievementMore}
                  onPress={() => navigation.navigate('Achievements')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="grid-outline" size={22} color={colors.indigo} />
                  <Text style={styles.achievementMoreText}>All</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>

          </FadeSlideIn>

          {/* ─── Member since ────────────────────────────────────── */}
          <FadeSlideIn index={2}>
          <View style={styles.memberCard}>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
            <Text style={styles.memberText}>
              Learning since {formatJoinDate(progress.lastActiveDate || new Date().toISOString())}
            </Text>
          </View>
          </FadeSlideIn>
        </View>
      </ScrollView>

      <AvatarPickerModal
        visible={avatarVisible}
        currentEmoji={progress.profileEmoji}
        currentColor={progress.profileColor}
        onSave={handleSaveCharacter}
        onClose={() => setAvatarVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#6366F1' },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  loadingText: { fontSize: 16, color: colors.textSecondary },

  hero: {
    backgroundColor: colors.indigo,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  settingsBtn: {
    position: 'absolute',
    top: 16,
    right: spacing.xl,
    padding: 8,
  },
  avatarWrap: {
    marginTop: 8,
    marginBottom: spacing.md,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.indigo,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  levelBadgeText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  levelName: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  xpBarWrap: { width: '100%', gap: 6 },
  xpTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
  },
  xpLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '600', textAlign: 'right' },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
  },
  fireIcon: { width: 16, height: 16 },
  streakText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },

  body: { padding: spacing.xl, gap: spacing.xl },

  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 2,
    ...shadows.card,
  },
  statIcon: { fontSize: 18, marginBottom: 2 },
  statValue: { fontSize: 18, fontFamily: fonts.display },
  statLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600', textAlign: 'center' },

  section: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 16, fontFamily: fonts.display, color: colors.text },
  sectionLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sectionLinkText: { fontSize: 13, fontWeight: '700', color: colors.indigo },

  emptyAchievements: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  emptyAchievementsText: { fontSize: 13, color: colors.textSecondary },

  achievementScroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  achievementChip: {
    alignItems: 'center',
    gap: 4,
    width: 68,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
  },
  achievementLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  achievementMore: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  achievementMoreText: { fontSize: 10, fontWeight: '700', color: colors.indigo },

  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.card,
  },
  memberText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
});
