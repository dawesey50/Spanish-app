import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { UNITS, LESSONS_BY_ID, isUnitUnlocked, isLessonUnlocked } from '../data/units';

interface Props {
  completedLessons: string[];
  onLessonPress: (lessonId: string) => void;
}

export default function UnitMap({ completedLessons, onLessonPress }: Props) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {UNITS.map((unit) => {
        const unlocked = isUnitUnlocked(unit.id, completedLessons);
        const allDone = unit.lessonIds.every((id) => completedLessons.includes(id));

        return (
          <View key={unit.id} style={styles.unitBlock}>
            <View style={[styles.unitHeader, !unlocked && styles.unitHeaderLocked]}>
              <Text style={styles.unitIcon}>{unlocked ? unit.icon : '🔒'}</Text>
              <View style={styles.unitHeaderText}>
                <Text style={[styles.unitTitle, !unlocked && styles.lockedText]}>
                  {unit.title}
                </Text>
                <Text style={[styles.unitDesc, !unlocked && styles.lockedText]} numberOfLines={2}>
                  {unlocked ? unit.description : 'Complete the previous unit to unlock'}
                </Text>
              </View>
              {allDone && <Text style={styles.completeBadge}>✓</Text>}
            </View>

            <View style={styles.lessonList}>
              {unit.lessonIds.map((lessonId, index) => {
                const lesson = LESSONS_BY_ID[lessonId];
                const lessonUnlocked = isLessonUnlocked(lessonId, completedLessons);
                const lessonDone = completedLessons.includes(lessonId);

                return (
                  <TouchableOpacity
                    key={lessonId}
                    style={[
                      styles.lessonRow,
                      lessonDone && styles.lessonDone,
                      !lessonUnlocked && styles.lessonLocked,
                    ]}
                    onPress={() => lessonUnlocked && onLessonPress(lessonId)}
                    disabled={!lessonUnlocked}
                    activeOpacity={lessonUnlocked ? 0.7 : 1}
                  >
                    <View style={[styles.lessonNumber, lessonDone && styles.lessonNumberDone]}>
                      <Text style={styles.lessonNumberText}>
                        {lessonDone ? '✓' : String(index + 1)}
                      </Text>
                    </View>
                    <View style={styles.lessonInfo}>
                      <Text style={[styles.lessonTitle, !lessonUnlocked && styles.lockedText]}>
                        {lesson?.title ?? lessonId}
                      </Text>
                      <Text style={[styles.lessonMeta, !lessonUnlocked && styles.lockedText]}>
                        {lesson?.wordIds.length ?? 0} words
                      </Text>
                    </View>
                    {!lessonUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  unitBlock: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4F46E5',
    gap: 12,
  },
  unitHeaderLocked: {
    backgroundColor: '#9CA3AF',
  },
  unitIcon: {
    fontSize: 32,
  },
  unitHeaderText: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  unitDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  lockedText: {
    color: 'rgba(255,255,255,0.6)',
  },
  completeBadge: {
    fontSize: 20,
    color: '#A7F3D0',
  },
  lessonList: {
    paddingVertical: 4,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  lessonDone: {
    backgroundColor: '#F0FDF4',
  },
  lessonLocked: {
    backgroundColor: '#F9FAFB',
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberDone: {
    backgroundColor: '#059669',
  },
  lessonNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  lessonMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  lockIcon: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
