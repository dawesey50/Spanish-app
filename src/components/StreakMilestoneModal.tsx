import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from './PrimaryButton';
import PulseImage from './PulseImage';
import { fonts } from '../theme';

const FIRE_ICON = require('../../assets/icons/fire.png');

const MILESTONE_LINES: Record<number, string> = {
  3: "Three days in a row — you're building a habit!",
  7: 'A full week of Spanish. ¡Increíble!',
  14: 'Two weeks strong. Nothing can stop you now.',
  30: 'A whole month! You\'re officially dedicated.',
  50: 'Fifty days. This is who you are now.',
  100: 'One hundred days. Legendary. 🏆',
};

interface Props {
  visible: boolean;
  streak: number;
  onClose: () => void;
}

export default function StreakMilestoneModal({ visible, streak, onClose }: Props) {
  const numScale = useRef(new Animated.Value(0.2)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    numScale.setValue(0.2);
    textOpacity.setValue(0);
    Animated.sequence([
      Animated.spring(numScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  const line = MILESTONE_LINES[streak] ?? `${streak} days of Spanish — keep the fire burning!`;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <LinearGradient
        colors={['#F59E0B', '#EA580C', '#C2410C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.centre}>
          <PulseImage source={FIRE_ICON} style={styles.flame} to={1.12} />
          <Animated.View style={[styles.numWrap, { transform: [{ scale: numScale }] }]}>
            <Text style={styles.num}>{streak}</Text>
            <Text style={styles.numLabel}>DAY STREAK</Text>
          </Animated.View>
          <Animated.Text style={[styles.line, { opacity: textOpacity }]}>{line}</Animated.Text>
        </View>

        <PrimaryButton label="Keep it going" onPress={onClose} style={styles.btn} variant="amber" />
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
    gap: 18,
  },
  flame: { width: 110, height: 110 },
  numWrap: { alignItems: 'center' },
  num: {
    fontSize: 84,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    lineHeight: 92,
  },
  numLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 4,
  },
  line: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  btn: { alignSelf: 'stretch' },
});
