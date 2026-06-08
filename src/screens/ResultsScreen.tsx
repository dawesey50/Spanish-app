import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { LESSONS_BY_ID, UNITS_BY_ID } from '../data/units';
import { WORDS_BY_ID } from '../data/words';
import { getUserProgress } from '../database/db';
import AudioButton from '../components/AudioButton';

const STAR_ICON = require('../../assets/icons/star.png');
const TICK_ICON = require('../../assets/icons/green_tick.png');
const TARGET_ICON = require('../../assets/icons/blue_target.png');
const BOOK_ICON = require('../../assets/icons/blue_icon_book.png');
const CROSS_ICON = require('../../assets/icons/red_cross.png');

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { lessonId, score, xpEarned, corrections, wordResults } = route.params;

  const lesson = LESSONS_BY_ID[lessonId];
  const unit = lesson ? UNITS_BY_ID[lesson.unitId] : undefined;
  const lessonWords = (lesson?.wordIds ?? [])
    .map((id) => WORDS_BY_ID[id])
    .filter(Boolean);

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  useEffect(() => {
    getUserProgress().then((p) => setCompletedLessons(p.completedLessons));
  }, []);

  const unitLessons = unit?.lessonIds ?? [];
  const lessonIdx = unitLessons.indexOf(lessonId);
  const nextLessonId = lessonIdx >= 0 && lessonIdx + 1 < unitLessons.length
    ? unitLessons[lessonIdx + 1]
    : null;
  const nextLesson = nextLessonId ? LESSONS_BY_ID[nextLessonId] : null;
  const isUnitComplete = unitLessons.length > 0 &&
    unitLessons.every((id) => completedLessons.includes(id));

  const grade =
    score >= 90 ? { label: 'Excellent!', color: '#059669', icon: STAR_ICON }
    : score >= 70 ? { label: 'Good job!', color: '#4F46E5', icon: TICK_ICON }
    : score >= 50 ? { label: 'Keep practicing!', color: '#D97706', icon: TARGET_ICON }
    : { label: 'Keep at it!', color: '#DC2626', icon: BOOK_ICON };

  // Build per-word performance map from wordResults
  const wordPerformance: Record<string, boolean> = {};
  if (wordResults) {
    wordResults.forEach(({ wordId, correct }) => {
      // If a word was answered multiple times, "ever wrong" = red
      if (wordPerformance[wordId] === undefined) {
        wordPerformance[wordId] = correct;
      } else if (!correct) {
        wordPerformance[wordId] = false;
      }
    });
  }
  const hasPerformance = wordResults && wordResults.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Unit complete banner */}
        {isUnitComplete && unit && (
          <View style={styles.unitCompleteBanner}>
            <Image source={STAR_ICON} style={styles.unitCompleteIcon} resizeMode="contain" />
            <View>
              <Text style={styles.unitCompleteTitle}>Unit Complete!</Text>
              <Text style={styles.unitCompleteDesc}>{unit.title} — all lessons done</Text>
            </View>
          </View>
        )}

        {/* Score card */}
        <View style={styles.scoreCard}>
          <Image source={grade.icon} style={styles.gradeIcon} resizeMode="contain" />
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

        {/* Corrections */}
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

        {/* Words in lesson with performance indicators */}
        {lessonWords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Words in This Lesson</Text>
            <View style={styles.wordList}>
              {lessonWords.map((w) => {
                const perf = hasPerformance ? wordPerformance[w.id] : undefined;
                return (
                  <View key={w.id} style={styles.wordRow}>
                    <AudioButton text={w.spanish} size="sm" />
                    <View style={styles.wordLeft}>
                      <Text style={styles.wordSpanish}>{w.spanish}</Text>
                      <Text style={styles.wordExample} numberOfLines={1}>{w.example}</Text>
                    </View>
                    <Text style={styles.wordEnglish}>{w.english}</Text>
                    {perf !== undefined && (
                      <Image
                        source={perf ? TICK_ICON : CROSS_ICON}
                        style={styles.wordMark}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          {nextLesson && (
            <TouchableOpacity
              style={styles.nextLessonBtn}
              onPress={() => navigation.replace('Lesson', { lessonId: nextLessonId! })}
            >
              <View style={styles.nextLessonContent}>
                <Text style={styles.nextLessonLabel}>Up Next</Text>
                <Text style={styles.nextLessonTitle}>{nextLesson.title} →</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
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

  unitCompleteBanner: {
    backgroundColor: '#FEF9C3',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  unitCompleteIcon: { width: 32, height: 32 },
  unitCompleteTitle: { fontSize: 15, fontWeight: '800', color: '#78350F' },
  unitCompleteDesc: { fontSize: 12, color: '#92400E', marginTop: 1 },

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
  gradeIcon: { width: 64, height: 64, marginBottom: 12 },
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
  wordEnglish: { fontSize: 13, color: '#4F46E5', fontWeight: '600' },
  wordMark: { width: 18, height: 18 },

  actions: { gap: 12 },
  nextLessonBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  nextLessonContent: { alignItems: 'center', gap: 2 },
  nextLessonLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.8, textTransform: 'uppercase' },
  nextLessonTitle: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  primaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  primaryBtnText: { color: '#374151', fontSize: 17, fontWeight: '600' },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#9CA3AF', fontSize: 15, fontWeight: '600' },
});
