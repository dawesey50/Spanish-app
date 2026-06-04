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
import { getUserProgress, updateDailyGoal, updateTTSRate, clearAllProgress } from '../database/db';
import AudioButton from '../components/AudioButton';
import type { UserProgress } from '../types';

const GOAL_OPTIONS = [10, 20, 30, 50];

const TTS_SPEEDS: { label: string; value: number; desc: string }[] = [
  { label: 'Slow', value: 0.6, desc: 'Good for beginners' },
  { label: 'Normal', value: 0.8, desc: 'Recommended' },
  { label: 'Fast', value: 1.0, desc: 'Challenge yourself' },
];

const DEMO_WORD = 'Buenos días';

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

  const setSpeed = async (rate: number) => {
    await updateTTSRate(rate);
    setProgress((p) => (p ? { ...p, ttsRate: rate } : p));
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

        {/* Daily Goal */}
        <Text style={styles.sectionTitle}>Daily XP Goal</Text>
        <Text style={styles.sectionDesc}>How much XP do you want to earn each day?</Text>
        <View style={styles.optionRow}>
          {GOAL_OPTIONS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chipBtn, progress.dailyGoalXP === g && styles.chipBtnActive]}
              onPress={() => setGoal(g)}
            >
              <Text style={[styles.chipText, progress.dailyGoalXP === g && styles.chipTextActive]}>
                {g} XP
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Audio Speed */}
        <Text style={styles.sectionTitle}>Audio Speed</Text>
        <Text style={styles.sectionDesc}>
          Controls how fast Spanish is spoken in listening questions and word previews.
        </Text>
        <View style={styles.speedCards}>
          {TTS_SPEEDS.map((s) => (
            <TouchableOpacity
              key={s.value}
              style={[styles.speedCard, progress.ttsRate === s.value && styles.speedCardActive]}
              onPress={() => setSpeed(s.value)}
            >
              <Text style={[styles.speedLabel, progress.ttsRate === s.value && styles.speedLabelActive]}>
                {s.label}
              </Text>
              <Text style={styles.speedDesc}>{s.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.demoRow}>
          <AudioButton text={DEMO_WORD} rate={progress.ttsRate} size="sm" />
          <Text style={styles.demoText}>
            Tap to hear "{DEMO_WORD}" at current speed
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Text style={styles.sectionDesc}>
          Daily reminders will be added in Phase 4.
        </Text>
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>Coming in Phase 4</Text>
        </View>

        <View style={styles.divider} />

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Row label="Version" value="1.0.0 (Phase 3)" />
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
  optionRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  chipBtn: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  chipBtnActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  chipText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: '#4F46E5' },
  speedCards: { flexDirection: 'row', gap: 10 },
  speedCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  speedCardActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  speedLabel: { fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 2 },
  speedLabelActive: { color: '#4F46E5' },
  speedDesc: { fontSize: 11, color: '#9CA3AF', textAlign: 'center' },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoText: { fontSize: 14, color: '#6B7280', flex: 1 },
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
