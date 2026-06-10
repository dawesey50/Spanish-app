import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from 'react-native';

const RED_LOCK_ICON = require('../../assets/icons/red_lock.png');
import { useFocusEffect } from '@react-navigation/native';
import {
  getUserProgress,
  updateDailyGoal,
  updateTTSRate,
  updateNotificationSettings,
  updateDeveloperMode,
  updateProfileName,
  resetUnit,
  clearAllProgress,
} from '../database/db';
import { UNITS, LESSONS_BY_ID } from '../data/units';
import type { Unit } from '../types';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
  cancelDailyReminder,
} from '../notifications';
import AudioButton from '../components/AudioButton';
import type { UserProgress } from '../types';

const GOAL_OPTIONS = [10, 20, 30, 50];

const TTS_SPEEDS: { label: string; value: number; desc: string }[] = [
  { label: 'Slow', value: 0.4, desc: 'Great for beginners' },
  { label: 'Normal', value: 0.8, desc: 'Recommended' },
  { label: 'Fast', value: 1.4, desc: 'Challenge yourself' },
];

const REMINDER_TIMES: { label: string; hour: number }[] = [
  { label: 'Morning 8am', hour: 8 },
  { label: 'Midday 12pm', hour: 12 },
  { label: 'Evening 6pm', hour: 18 },
  { label: 'Night 9pm', hour: 21 },
];

const DEMO_WORD = 'Buenos días';

export default function SettingsScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [nameInput, setNameInput] = useState('');

  useFocusEffect(
    useCallback(() => {
      getUserProgress().then((p) => {
        setProgress(p);
        setNameInput(p.profileName ?? '');
      });
    }, [])
  );

  const saveName = async () => {
    const trimmed = nameInput.trim();
    await updateProfileName(trimmed);
    setProgress((p) => (p ? { ...p, profileName: trimmed } : p));
  };

  const setGoal = async (goal: number) => {
    await updateDailyGoal(goal);
    setProgress((p) => (p ? { ...p, dailyGoalXP: goal } : p));
  };

  const setSpeed = async (rate: number) => {
    await updateTTSRate(rate);
    setProgress((p) => (p ? { ...p, ttsRate: rate } : p));
  };

  const toggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please allow notifications in your device settings to enable reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
      const hour = progress?.notificationHour ?? 20;
      await scheduleDailyReminder(hour, 0);
    } else {
      await cancelDailyReminder();
    }
    await updateNotificationSettings(enabled, progress?.notificationHour ?? 20);
    setProgress((p) => (p ? { ...p, notificationsEnabled: enabled } : p));
  };

  const setReminderTime = async (hour: number) => {
    if (progress?.notificationsEnabled) {
      await scheduleDailyReminder(hour, 0);
    }
    await updateNotificationSettings(progress?.notificationsEnabled ?? false, hour);
    setProgress((p) => (p ? { ...p, notificationHour: hour } : p));
  };

  const toggleDeveloperMode = async (enabled: boolean) => {
    await updateDeveloperMode(enabled);
    setProgress((p) => (p ? { ...p, developerMode: enabled } : p));
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

  const confirmResetUnit = (unit: Unit) => {
    const doneCount = unit.lessonIds.filter((id) => progress?.completedLessons.includes(id)).length;
    Alert.alert(
      `Reset "${unit.title}"?`,
      `This will mark all ${doneCount} completed lesson${doneCount !== 1 ? 's' : ''} as incomplete and remove associated review words. XP and streak are kept.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Unit',
          style: 'destructive',
          onPress: async () => {
            const wordIds = unit.lessonIds.flatMap(
              (lid) => LESSONS_BY_ID[lid]?.wordIds ?? []
            );
            await resetUnit(unit.lessonIds, wordIds);
            const fresh = await getUserProgress();
            setProgress(fresh);
            Alert.alert('Done', `"${unit.title}" progress has been reset.`);
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

        {/* Profile */}
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.nameCard}>
          <Text style={styles.nameCardLabel}>Your name</Text>
          <TextInput
            style={styles.nameInput}
            value={nameInput}
            onChangeText={setNameInput}
            onBlur={saveName}
            onSubmitEditing={saveName}
            placeholder="Add your name…"
            placeholderTextColor="#9CA3AF"
            returnKeyType="done"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={30}
          />
        </View>

        <View style={styles.divider} />

        {/* Daily Goal */}
        <Text style={styles.sectionTitle}>Daily XP Goal</Text>
        <Text style={styles.sectionDesc}>How much XP do you want to earn each day?</Text>
        <View style={styles.chipRow}>
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
          Controls how fast Spanish words are spoken in listening questions and previews.
        </Text>
        <View style={styles.speedRow}>
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
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>Daily Reminders</Text>
            <Text style={styles.sectionDesc}>
              Get a notification if you haven't practised by the set time.
            </Text>
          </View>
          <Switch
            value={progress.notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#E5E7EB', true: '#A5B4FC' }}
            thumbColor={progress.notificationsEnabled ? '#4F46E5' : '#9CA3AF'}
          />
        </View>

        {progress.notificationsEnabled && (
          <View style={styles.timeGrid}>
            {REMINDER_TIMES.map((t) => (
              <TouchableOpacity
                key={t.hour}
                style={[
                  styles.timeBtn,
                  progress.notificationHour === t.hour && styles.timeBtnActive,
                ]}
                onPress={() => setReminderTime(t.hour)}
              >
                <Text
                  style={[
                    styles.timeText,
                    progress.notificationHour === t.hour && styles.timeTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* Developer Options */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>Developer Options</Text>
            <Text style={styles.sectionDesc}>
              Testing tools — unlock all lessons without completing prerequisites.
            </Text>
          </View>
          <Switch
            value={progress.developerMode}
            onValueChange={toggleDeveloperMode}
            trackColor={{ false: '#E5E7EB', true: '#FCA5A5' }}
            thumbColor={progress.developerMode ? '#DC2626' : '#9CA3AF'}
          />
        </View>
        {progress.developerMode && (
          <View style={styles.devWarning}>
            <View style={styles.devWarningRow}>
              <Image source={RED_LOCK_ICON} style={styles.devLockIcon} resizeMode="contain" />
              <Text style={styles.devWarningText}>All lessons unlocked for testing. Turn off when done.</Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Row label="Version" value="1.0.0 (Phase 24)" />
          <Row label="Progress stored" value="On-device (SQLite)" />
          <Row label="AI conversation" value="Groq → Gemini → HuggingFace" />
        </View>

        <View style={styles.divider} />

        {/* Per-unit reset */}
        <Text style={styles.sectionTitle}>Reset Unit Progress</Text>
        <Text style={styles.sectionDesc}>
          Mark lessons as incomplete and clear review words for a single unit. XP and streak are kept.
        </Text>
        {UNITS.filter((u) => u.lessonIds.some((id) => progress.completedLessons.includes(id))).length === 0 ? (
          <Text style={styles.noUnitsText}>Complete some lessons to reset them here.</Text>
        ) : (
          <View style={styles.unitResetList}>
            {UNITS.filter((u) => u.lessonIds.some((id) => progress.completedLessons.includes(id))).map((unit) => {
              const done = unit.lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
              return (
                <TouchableOpacity
                  key={unit.id}
                  style={styles.unitResetRow}
                  onPress={() => confirmResetUnit(unit)}
                  activeOpacity={0.75}
                >
                  <View style={styles.unitResetLeft}>
                    <Text style={styles.unitResetName}>{unit.title}</Text>
                    <Text style={styles.unitResetMeta}>{done}/{unit.lessonIds.length} lessons done</Text>
                  </View>
                  <Text style={styles.unitResetBtn}>Reset →</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 4,
  },
  sectionHeaderText: {
    flex: 1,
  },
  chipRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
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
  speedRow: { flexDirection: 'row', gap: 10 },
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
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoText: { fontSize: 14, color: '#6B7280', flex: 1 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  timeBtn: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    minWidth: '45%',
    flex: 1,
    alignItems: 'center',
  },
  timeBtnActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  timeText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  timeTextActive: { color: '#4F46E5' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },
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
  devWarning: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginTop: 4,
  },
  devWarningRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  devLockIcon: { width: 18, height: 18 },
  devWarningText: { fontSize: 13, color: '#DC2626', fontWeight: '600', flex: 1 },
  // Profile name
  nameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameCardLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', width: 72 },
  nameInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 4,
  },

  // Per-unit reset
  noUnitsText: { fontSize: 13, color: '#9CA3AF', fontStyle: 'italic', marginBottom: 4 },
  unitResetList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  unitResetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  unitResetLeft: { flex: 1 },
  unitResetName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  unitResetMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  unitResetBtn: { fontSize: 13, fontWeight: '700', color: '#DC2626' },

  dangerBtn: {
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  dangerBtnText: { color: '#DC2626', fontSize: 16, fontWeight: '700' },
});
