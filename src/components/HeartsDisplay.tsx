import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  count: number;
  max?: number;
}

export default function HeartsDisplay({ count, max = 3 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={[styles.heart, i >= count && styles.empty]}>
          {i < count ? '❤️' : '🖤'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  heart: {
    fontSize: 18,
  },
  empty: {
    opacity: 0.35,
  },
});
