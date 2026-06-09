import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { registerToastCallback } from '../utils/achievementEvents';
import { ACHIEVEMENTS_BY_ID, ACHIEVEMENT_ICONS } from '../data/achievements';

export default function AchievementToast() {
  const [queue, setQueue] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    registerToastCallback((ids) => {
      setQueue((prev) => [...prev, ...ids]);
    });
  }, []);

  useEffect(() => {
    if (queue.length > 0 && current === null) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
    }
  }, [queue, current]);

  useEffect(() => {
    if (current === null) return;
    slideAnim.setValue(-120);
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
      Animated.delay(2400),
      Animated.timing(slideAnim, { toValue: -120, duration: 280, useNativeDriver: true }),
    ]).start(() => setCurrent(null));
  }, [current]);

  const badge = current ? ACHIEVEMENTS_BY_ID[current] : null;
  if (!badge) return null;

  return (
    <Animated.View style={[styles.toast, { transform: [{ translateY: slideAnim }] }]}>
      <Image source={ACHIEVEMENT_ICONS[badge.id]} style={styles.icon} resizeMode="contain" />
      <View style={styles.textWrap}>
        <Text style={styles.label}>Achievement Unlocked!</Text>
        <Text style={styles.title}>{badge.title}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 56,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 999,
  },
  icon: { width: 52, height: 52, borderRadius: 10 },
  textWrap: { flex: 1 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 2 },
});
