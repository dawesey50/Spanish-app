import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import * as Speech from 'expo-speech';

interface Props {
  text: string;
  language?: string;
  rate?: number;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

const SIZE = { sm: 34, md: 48, lg: 80 };
const FONT = { sm: 16, md: 22, lg: 38 };

export default function AudioButton({
  text,
  language = 'es-ES',
  rate = 0.8,
  size = 'md',
  style,
  autoPlay = false,
  autoPlayDelay = 600,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(() => play(), autoPlayDelay);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (playing) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.14, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 500, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
  }, [playing]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const play = () => {
    if (playing) {
      Speech.stop();
      setPlaying(false);
      return;
    }

    Animated.sequence([
      Animated.timing(pressAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(pressAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    setPlaying(true);
    Speech.speak(text, {
      language,
      rate,
      onDone: () => setPlaying(false),
      onStopped: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
  };

  const dim = SIZE[size];
  const fontSize = FONT[size];

  return (
    <Animated.View
      style={[
        { transform: [{ scale: Animated.multiply(pulseAnim, pressAnim) }] },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.btn,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            backgroundColor: playing ? '#4F46E5' : '#EEF2FF',
            borderColor: playing ? '#4F46E5' : '#C7D2FE',
          },
        ]}
        onPress={play}
        activeOpacity={0.85}
      >
        <Animated.Text style={{ fontSize, lineHeight: fontSize + 4 }}>
          {playing ? '🔊' : '🔈'}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
