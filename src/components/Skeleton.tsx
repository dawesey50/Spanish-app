import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { type ThemeColors } from '../theme';
import { useThemedStyles } from '../ThemeContext';

interface BlockProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/** Single shimmering placeholder block. */
export function Skeleton({ width = '100%', height = 16, radius = 8, style }: BlockProps) {
  const styles = useThemedStyles(createStyles);
  const sweep = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: 1100, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateX = sweep.interpolate({
    inputRange: [-1, 1],
    outputRange: [-220, 220],
  });

  return (
    <View style={[styles.block, { width, height, borderRadius: radius }, style]}>
      <Animated.View style={[styles.shine, { transform: [{ translateX }, { rotate: '18deg' }] }]} />
    </View>
  );
}

/** Full-screen skeleton used while a tab screen loads its data. */
export function ScreenSkeleton() {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Skeleton width={48} height={48} radius={24} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      <Skeleton height={14} radius={7} style={{ marginTop: 20 }} />
      <Skeleton height={120} radius={18} style={{ marginTop: 24 }} />
      <Skeleton height={76} radius={18} style={{ marginTop: 14 }} />
      <View style={styles.cardRow}>
        <Skeleton width="48%" height={90} radius={14} />
        <Skeleton width="48%" height={90} radius={14} />
      </View>
      <Skeleton height={180} radius={18} style={{ marginTop: 14 }} />
    </View>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  block: {
    backgroundColor: c.border,
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 90,
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.45)',
  },
  screen: {
    flex: 1,
    backgroundColor: c.bg,
    padding: 20,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
});
