import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const RED_HEART = require('../../assets/icons/red_heart.png');
const EMPTY_HEART = require('../../assets/icons/empty_heart.png');

interface Props {
  count: number;
  max?: number;
}

export default function HeartsDisplay({ count, max = 3 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: max }).map((_, i) => (
        <Image
          key={i}
          source={i < count ? RED_HEART : EMPTY_HEART}
          style={[styles.heart, i >= count && styles.empty]}
          resizeMode="contain"
        />
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
    width: 22,
    height: 22,
  },
  empty: {
    opacity: 0.35,
  },
});
