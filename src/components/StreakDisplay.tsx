import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  streak: number;
}

export default function StreakDisplay({ streak }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
      <Text style={styles.label}>{streak === 1 ? 'day streak' : 'day streak'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  flame: {
    fontSize: 20,
  },
  count: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D97706',
  },
  label: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '500',
  },
});
