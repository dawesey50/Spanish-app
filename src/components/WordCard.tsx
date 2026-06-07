import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { Word } from '../types';

const STAR_FILLED = require('../../assets/icons/star.png');
const WARNING_ICON = require('../../assets/icons/warning_sign.png');

interface Props {
  word: Word;
  isFavourite: boolean;
  isWeak: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
}

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <View style={styles.dots}>
      {[1, 2, 3].map((n) => (
        <View key={n} style={[styles.dot, n <= level && styles.dotFilled]} />
      ))}
    </View>
  );
}

function WordCard({ word, isFavourite, isWeak, onPress, onToggleFavourite }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.left}>
        <View style={styles.wordRow}>
          <Text style={styles.spanish}>{word.spanish}</Text>
          {isWeak && (
            <Image source={WARNING_ICON} style={styles.weakIcon} resizeMode="contain" />
          )}
        </View>
        <Text style={styles.english}>{word.english}</Text>
        <DifficultyDots level={word.difficulty} />
      </View>
      <TouchableOpacity
        style={styles.starBtn}
        onPress={onToggleFavourite}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        activeOpacity={0.7}
      >
        <Image
          source={STAR_FILLED}
          style={[styles.star, !isFavourite && styles.starInactive]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default memo(WordCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  left: { flex: 1, gap: 3 },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  spanish: { fontSize: 17, fontWeight: '700', color: '#111827' },
  english: { fontSize: 14, color: '#6B7280' },
  weakIcon: { width: 14, height: 14 },
  dots: { flexDirection: 'row', gap: 4, marginTop: 4 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  dotFilled: { backgroundColor: '#4F46E5' },
  starBtn: { paddingLeft: 12 },
  star: { width: 22, height: 22 },
  starInactive: { opacity: 0.2 },
});
