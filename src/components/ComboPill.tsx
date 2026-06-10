import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { fonts } from '../theme';

interface Props {
  /** Current run of consecutive correct answers. Pill shows at 3+. */
  combo: number;
}

function tierColor(combo: number): string {
  if (combo >= 8) return '#DC2626';
  if (combo >= 5) return '#D97706';
  return '#4F46E5';
}

export default function ComboPill({ combo }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const prev = useRef(0);

  useEffect(() => {
    const was = prev.current;
    prev.current = combo;

    if (combo >= 3) {
      if (was < 3) {
        // First appearance — spring in
        scale.setValue(0);
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true }).start();
      } else {
        // Increment — punchy pulse
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.25, duration: 90, useNativeDriver: true }),
          Animated.spring(scale, { toValue: 1, friction: 4, tension: 180, useNativeDriver: true }),
        ]).start();
      }
    } else if (was >= 3) {
      // Combo broken — shrink away
      Animated.timing(scale, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    }
  }, [combo]);

  // Keep mounted so the exit animation can play
  const color = tierColor(Math.max(combo, prev.current));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pill,
        { backgroundColor: color, shadowColor: color, transform: [{ scale }] },
      ]}
    >
      <Text style={styles.text}>🔥 ¡Racha! ×{Math.max(combo, 3)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    top: 54,
    right: 16,
    zIndex: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontSize: 13,
    fontFamily: fonts.display,
    color: '#FFFFFF',
  },
});
