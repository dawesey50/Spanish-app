import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProgress, updateDailyGoal, clearAllProgress } from '../database/db';
import type { UserProgress } from '../types';

const GOAL_OPTIONS = [10, 20, 30, 50];

export default function SettingsScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      getUserProgress().then(setProgress);
    }, [])
  );

  const setGoal = async (goal: number) => {
    await updateDailyGoal(goal);
    setProgress((p) => (p ? { ...p, dailyGoalXP: goal } : p));
  };

  const confirmClear = () => {
    Alert.alert(
      'Clear All Progress?',
      'This will delete your streak, XP, and lesson history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllProgress();
            const fresh = await getUserProgress();
            setProgress(fresh);
            Alert.alert('Done', 'All progress has been cleared.');
          },
        },
      ]
    );
  };

  if (!progress) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Daily XP Goal</Text>
        <Text style={styles.sectionDesc}>
          How much XP do you want to earn each day?
        </Text>
        <View style={styles.goalRow}>
          {GOAL_OPTIONS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.goalBtn, progress.dailyGoalXP === g && styles.goalBtnActive]}
              onPress={() => setGoal(g)}
            >
              <Text
                style={[styles.goalBtnText, progress.dailyGoalXP === g && styles.goalBtnTextActive]}
              >
                {g} XP
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Notifications</Text>
        <Text style={styles.sectionDesc}>
          Daily reminders coming in Phase 4 when push notifications are configured.
        </Text>
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>Coming in Phase 4</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Row label="Version" value="1.0.0 (Phase 1)" />
          <Row label="Progress stored" value="On-device (SQLite)" />
          <Row label="AI conversation" value="Groq → Gemini → HuggingFace" />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.dangerBtn} onPress={confirmClear}>
          <Text style={styles.dangerBtnText}>Clear All Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  sectionDesc: { fontSize: 13, color: '#6B7280', marginBottom: 14, lineHeight: 19 },
  goalRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  goalBtn: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  goalBtnActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  goalBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  goalBtnTextActive: { color: '#4F46E5' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },
  comingSoon: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  comingSoonText: { fontSize: 13, color: '#4F46E5', fontWeight: '600' },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },
  rowValue: { fontSize: 14, color: '#6B7280' },
  dangerBtn: {
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  dangerBtnText: { color: '#DC2626', fontSize: 16, fontWeight: '700' },
});
