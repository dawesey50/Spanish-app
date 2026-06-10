import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from './PrimaryButton';
import { fonts } from '../theme';
import type { UserLevel } from '../utils/level';

const PARTICLE_COLORS = ['#FCD34D', '#F87171', '#34D399', '#60A5FA', '#A78BFA', '#F472B6', '#FB923C', '#4ADE80'];
const PARTICLE_COUNT = 10;
const PARTICLE_DISTANCE = 120;

/** Darken a hex colour by the given factor (0–1). */
function darken(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - factor));
  const g = Math.round(((n >> 8) & 255) * (1 - factor));
  const b = Math.round((n & 255) * (1 - factor));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

interface Props {
  visible: boolean;
  level: UserLevel;
  onClose: () => void;
}

export default function LevelUpModal({ visible, level, onClose }: Props) {
  const medalScale = useRef(new Animated.Value(0.2)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      tx: new Animated.Value(0),
      ty: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;
    medalScale.setValue(0.2);
    textOpacity.setValue(0);

    Animated.sequence([
      Animated.spring(medalScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();

    particles.forEach((p, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      p.tx.setValue(0);
      p.ty.setValue(0);
      p.opacity.setValue(0);
      Animated.sequence([
        Animated.delay(250),
        Animated.parallel([
          Animated.timing(p.opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(p.tx, { toValue: Math.cos(angle) * PARTICLE_DISTANCE, duration: 600, useNativeDriver: true }),
          Animated.timing(p.ty, { toValue: Math.sin(angle) * PARTICLE_DISTANCE, duration: 600, useNativeDriver: true }),
        ]),
        Animated.timing(p.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    });
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <LinearGradient
        colors={[level.color, darken(level.color, 0.45)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.centre}>
          <View style={styles.burstArea}>
            {particles.map((p, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
                    opacity: p.opacity,
                    transform: [{ translateX: p.tx }, { translateY: p.ty }],
                  },
                ]}
              />
            ))}
            <Animated.View style={[styles.medal, { transform: [{ scale: medalScale }] }]}>
              <Text style={styles.medalNum}>{level.level}</Text>
            </Animated.View>
          </View>

          <Animated.View style={[styles.textWrap, { opacity: textOpacity }]}>
            <Text style={styles.kicker}>LEVEL UP!</Text>
            <Text style={styles.title}>¡Nivel {level.level}!</Text>
            <Text style={styles.levelName}>{level.name}</Text>
          </Animated.View>
        </View>

        <PrimaryButton label="Continue" onPress={onClose} style={styles.btn} variant="indigo" />
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    paddingBottom: 48,
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burstArea: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  medal: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalNum: {
    fontSize: 56,
    fontFamily: fonts.display,
    color: '#FFFFFF',
  },
  textWrap: { alignItems: 'center', gap: 6 },
  kicker: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 3,
  },
  title: {
    fontSize: 38,
    fontFamily: fonts.display,
    color: '#FFFFFF',
  },
  levelName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: 'rgba(255,255,255,0.85)',
  },
  btn: { alignSelf: 'stretch' },
});
