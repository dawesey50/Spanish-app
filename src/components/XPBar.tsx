import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  current: number;
  goal: number;
}

export default function XPBar({ current, goal }: Props) {
  const progress = Math.min(current / goal, 1);
  const done = progress >= 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Daily Goal</Text>
        <Text style={[styles.values, done && styles.done]}>
          {current} / {goal} XP {done ? '✓' : ''}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }, done && styles.fillDone]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  values: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  done: {
    color: '#059669',
  },
  track: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 5,
  },
  fillDone: {
    backgroundColor: '#059669',
  },
});
