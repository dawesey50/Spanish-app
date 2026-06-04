import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { LESSONS_BY_ID } from '../data/units';
import { WORDS_BY_ID } from '../data/words';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { lessonId, score, xpEarned, corrections } = route.params;
  const lesson = LESSONS_BY_ID[lessonId];
  const lessonWords = (lesson?.wordIds ?? [])
    .map((id) => WORDS_BY_ID[id])
    .filter(Boolean);

  const grade =
    score >= 90 ? { label: 'Excellent!', color: '#059669', emoji: '🌟' }
    : score >= 70 ? { label: 'Good job!', color: '#4F46E5', emoji: '👍' }
    : score >= 50 ? { label: 'Keep practicing!', color: '#D97706', emoji: '💪' }
    : { label: 'Keep at it!', color: '#DC2626', emoji: '📚' };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreCard}>
          <Text style={styles.emoji}>{grade.emoji}</Text>
          <Text style={[styles.gradeLabel, { color: grade.color }]}>{grade.label}</Text>
          <Text style={styles.lessonName}>{lesson?.title ?? lessonId}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{score}%</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: '#4F46E5' }]}>+{xpEarned}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{corrections.length}</Text>
              <Text style={styles.statLabel}>Mistakes</Text>
            </View>
          </View>
        </View>

        {corrections.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Corrections</Text>
            {corrections.map((c, i) => (
              <View key={i} style={styles.correctionCard}>
                <Text style={styles.wrongAnswer}>✗ {c.original}</Text>
                <Text style={styles.rightAnswer}>✓ {c.corrected}</Text>
                <Text style={styles.explanation}>{c.explanation}</Text>
              </View>
            ))}
          </View>
        )}

        {lessonWords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Words in This Lesson</Text>
            <View style={styles.wordList}>
              {lessonWords.map((w) => (
                <View key={w.id} style={styles.wordRow}>
                  <View style={styles.wordLeft}>
                    <Text style={styles.wordSpanish}>{w.spanish}</Text>
                    <Text style={styles.wordExample} numberOfLines={1}>{w.example}</Text>
                  </View>
                  <Text style={styles.wordEnglish}>{w.english}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.replace('Lesson', { lessonId })}
          >
            <Text style={styles.secondaryBtnText}>Practice Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { padding: 20, paddingBottom: 40 },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  emoji: { fontSize: 56, marginBottom: 8 },
  gradeLabel: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
  lessonName: { fontSize: 15, color: '#6B7280', marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 0 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  divider: { width: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 12 },
  correctionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  wrongAnswer: { fontSize: 14, color: '#DC2626', fontWeight: '600', marginBottom: 4 },
  rightAnswer: { fontSize: 14, color: '#059669', fontWeight: '600', marginBottom: 4 },
  explanation: { fontSize: 13, color: '#6B7280' },
  wordList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
    gap: 8,
  },
  wordLeft: { flex: 1 },
  wordSpanish: { fontSize: 15, fontWeight: '700', color: '#111827' },
  wordExample: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  wordEnglish: { fontSize: 13, color: '#4F46E5', fontWeight: '600', textAlign: 'right' },
  actions: { gap: 12 },
  primaryBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryBtnText: { color: '#374151', fontSize: 17, fontWeight: '600' },
});
