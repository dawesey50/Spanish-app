import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { type ThemeColors } from '../theme';
import { useThemedStyles } from '../ThemeContext';

const TARGET_ICON = require('../../assets/icons/blue_target.png');
const TICK_ICON = require('../../assets/icons/green_tick.png');

interface Props {
  completedLessons: string[];
  completedToday: boolean;
  onStart: () => void;
}

function timeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const ms = midnight.getTime() - now.getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function DailyChallengeCard({ completedLessons, completedToday, onStart }: Props) {
  const styles = useThemedStyles(createStyles);
  const [timeLeft, setTimeLeft] = useState(timeUntilMidnight);

  useEffect(() => {
    if (!completedToday) return;
    const timer = setInterval(() => setTimeLeft(timeUntilMidnight()), 60000);
    return () => clearInterval(timer);
  }, [completedToday]);

  if (completedLessons.length === 0) return null;

  if (completedToday) {
    return (
      <View style={[styles.card, styles.cardDone]}>
        <View style={styles.left}>
          <View style={styles.badgeRow}>
            <Image source={TICK_ICON} style={styles.badgeIcon} resizeMode="contain" />
            <Text style={styles.doneBadgeText}>Completed</Text>
          </View>
          <Text style={styles.doneTitle}>Daily Challenge</Text>
          <Text style={styles.doneReset}>Resets in {timeLeft}</Text>
        </View>
        <Image source={TARGET_ICON} style={styles.targetIcon} resizeMode="contain" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onStart} activeOpacity={0.85}>
      <View style={styles.left}>
        <Text style={styles.badge}>DAILY CHALLENGE</Text>
        <Text style={styles.title}>5 Quick Questions</Text>
        <Text style={styles.desc}>Earn +25 bonus XP</Text>
      </View>
      <Image source={TARGET_ICON} style={styles.targetIcon} resizeMode="contain" />
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: c.indigo,
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
  cardDone: {
    backgroundColor: c.greenSoft,
    shadowColor: '#000',
    shadowOpacity: 0.06,
  },
  left: { flex: 1, gap: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeIcon: { width: 14, height: 14 },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  doneBadgeText: { fontSize: 12, fontWeight: '700', color: c.green },
  title: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  desc: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  doneTitle: { fontSize: 16, fontWeight: '700', color: '#065F46' },
  doneReset: { fontSize: 12, color: c.textSecondary },
  targetIcon: { width: 44, height: 44, marginLeft: 12, opacity: 0.9 },
});
