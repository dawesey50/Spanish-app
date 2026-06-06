import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUnlockedAchievements } from '../database/db';
import { ACHIEVEMENTS } from '../data/achievements';

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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.countCard}>
          <Text style={styles.countNum}>{unlockedCount} / {ACHIEVEMENTS.length}</Text>
          <Text style={styles.countLabel}>badges unlocked</Text>
        </View>

        <View style={styles.grid}>
          {ACHIEVEMENTS.map((badge) => {
            const date = unlocked[badge.id];
            const isUnlocked = !!date;
            return (
              <View
                key={badge.id}
                style={[styles.badgeCard, isUnlocked ? styles.badgeCardUnlocked : styles.badgeCardLocked]}
              >
                <Text style={[styles.badgeEmoji, !isUnlocked && styles.lockedEmoji]}>
                  {isUnlocked ? badge.emoji : '🔒'}
                </Text>
                <Text style={[styles.badgeTitle, !isUnlocked && styles.lockedTitle]}>
                  {badge.title}
                </Text>
                <Text style={[styles.badgeDesc, !isUnlocked && styles.lockedDesc]}>
                  {isUnlocked ? badge.description : badge.hint}
                </Text>
                {isUnlocked && (
                  <Text style={styles.badgeDate}>{date}</Text>
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
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backBtn: { padding: 8, width: 40, alignItems: 'center' },
  backBtnText: { fontSize: 22, color: '#4F46E5', fontWeight: '600' },
  title: { flex: 1, fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center' },

  scroll: { padding: 20, paddingBottom: 48 },

  countCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  countNum: { fontSize: 40, fontWeight: '800', color: '#4F46E5' },
  countLabel: { fontSize: 14, color: '#4F46E5', fontWeight: '600', marginTop: 4 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  badgeCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeCardUnlocked: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  badgeCardLocked: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  badgeEmoji: { fontSize: 36, marginBottom: 4 },
  lockedEmoji: { opacity: 0.35 },
  badgeTitle: { fontSize: 13, fontWeight: '800', color: '#111827', textAlign: 'center' },
  lockedTitle: { color: '#9CA3AF' },
  badgeDesc: { fontSize: 11, color: '#6B7280', textAlign: 'center', lineHeight: 16 },
  lockedDesc: { color: '#D1D5DB' },
  badgeDate: { fontSize: 10, color: '#D97706', fontWeight: '700', marginTop: 4 },
});
