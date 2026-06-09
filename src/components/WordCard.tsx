import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { Word } from '../types';
import { colors, radius, shadows } from '../theme';
import PressableScale from './PressableScale';

const STAR_FILLED = require('../../assets/icons/star.png');
const WARNING_ICON = require('../../assets/icons/warning_sign.png');

interface Props {
  word: Word;
  isFavourite: boolean;
  isWeak: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
  topicLabel?: string;
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

function WordCard({ word, isFavourite, isWeak, onPress, onToggleFavourite, topicLabel }: Props) {
  return (
    <PressableScale style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.wordRow}>
          {word.gender != null && (
            <View style={[styles.genderBadge, word.gender === 'f' ? styles.genderF : styles.genderM]}>
              <Text style={styles.genderText}>{word.gender === 'f' ? 'la' : 'el'}</Text>
            </View>
          )}
          <Text style={styles.spanish}>{word.spanish}</Text>
          {isWeak && (
            <Image source={WARNING_ICON} style={styles.weakIcon} resizeMode="contain" />
          )}
        </View>
        <Text style={styles.english}>{word.english}</Text>
        <View style={styles.metaRow}>
          <DifficultyDots level={word.difficulty} />
          {topicLabel ? (
            <View style={styles.topicTag}>
              <Text style={styles.topicTagText}>{topicLabel}</Text>
            </View>
          ) : null}
        </View>
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
    </PressableScale>
  );
}

export default memo(WordCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    ...shadows.card,
  },
  left: { flex: 1, gap: 3 },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  spanish: { fontSize: 17, fontWeight: '700', color: colors.text },
  english: { fontSize: 14, color: colors.textSecondary },
  weakIcon: { width: 14, height: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  dots: { flexDirection: 'row', gap: 4 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotFilled: { backgroundColor: colors.indigo },
  topicTag: {
    backgroundColor: colors.borderLight,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  topicTagText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  genderBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 2,
  },
  genderM: { backgroundColor: '#DBEAFE' },
  genderF: { backgroundColor: '#FCE7F3' },
  genderText: { fontSize: 11, fontWeight: '700' },
  starBtn: { paddingLeft: 12 },
  star: { width: 22, height: 22 },
  starInactive: { opacity: 0.2 },
});
