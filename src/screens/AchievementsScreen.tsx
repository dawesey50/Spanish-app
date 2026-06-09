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
import { Ionicons } from '@expo/vector-icons';
import { getUnlockedAchievements } from '../database/db';
import { ACHIEVEMENTS, ACHIEVEMENT_ICONS } from '../data/achievements';
import { colors, radius, shadows, spacing } from '../theme';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function AchievementsScreen() {
  const navigation = useNavigation();
  const [unlocked, setUnlocked] = useState<Record<string, string>>({});

  useFocusEffect(
    useCallback(() => {
      getUnlockedAchievements().then((rows) => {
        const map: Record<string, string> = {};
        rows.forEach((r) => { map[r.badgeId] = r.unlockedAt; });
        setUnlocked(map);
      });
    }, [])
  );

  const unlockedCount = Object.keys(unlocked).length;
  const total = ACHIEVEMENTS.length;
  const progress = total > 0 ? unlockedCount / total : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.indigo} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressTitle}>🏆 Trophy Cabinet</Text>
            <View style={styles.progressCountWrap}>
              <Text style={styles.progressNum}>{unlockedCount}</Text>
              <Text style={styles.progressTotal}> / {total}</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.round(progress * 100)}%` as any }]} />
          </View>
          <Text style={styles.progressHint}>
            {unlockedCount === total
              ? '🎉 All achievements unlocked!'
              : `${total - unlockedCount} more to unlock — keep going!`}
          </Text>
        </View>

        <View style={styles.grid}>
          {ACHIEVEMENTS.map((badge) => {
            const date = unlocked[badge.id];
            const isUnlocked = !!date;
            const icon = ACHIEVEMENT_ICONS[badge.id];

            return (
              <View
                key={badge.id}
                style={[styles.badgeCard, isUnlocked ? styles.cardUnlocked : styles.cardLocked]}
              >
                <View style={styles.iconWrap}>
                  <Image
                    source={icon}
                    style={[styles.badgeIcon, !isUnlocked && styles.badgeIconLocked]}
                    resizeMode="contain"
                  />
                  {!isUnlocked && (
                    <View style={styles.lockOverlay}>
                      <Ionicons name="lock-closed" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <Text style={[styles.badgeTitle, !isUnlocked && styles.titleLocked]} numberOfLines={1}>
                  {badge.title}
                </Text>
                <Text style={[styles.badgeDesc, !isUnlocked && styles.descLocked]} numberOfLines={2}>
                  {isUnlocked ? badge.description : badge.hint}
                </Text>
                {isUnlocked && date && (
                  <Text style={styles.badgeDate}>{formatDate(date)}</Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  backBtn: { padding: spacing.sm, width: 40, alignItems: 'center' },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },

  scroll: { padding: spacing.xl, paddingBottom: 48 },

  progressCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  progressTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  progressCountWrap: { flexDirection: 'row', alignItems: 'baseline' },
  progressNum: { fontSize: 26, fontWeight: '800', color: colors.indigo },
  progressTotal: { fontSize: 16, color: colors.textSecondary, fontWeight: '600' },
  progressBarBg: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.indigo,
    borderRadius: radius.pill,
  },
  progressHint: { fontSize: 12, color: colors.textSecondary },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  badgeCard: {
    width: '47%',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 4,
    ...shadows.card,
  },
  cardUnlocked: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  cardLocked: {
    backgroundColor: '#F9FAFB',
    borderColor: colors.border,
  },

  iconWrap: {
    width: 80,
    height: 80,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
  },
  badgeIconLocked: { opacity: 0.2 },
  lockOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F9FAFB',
  },

  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  titleLocked: { color: colors.textMuted },
  badgeDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  descLocked: { color: '#D1D5DB' },
  badgeDate: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '700',
    marginTop: 2,
  },
});
