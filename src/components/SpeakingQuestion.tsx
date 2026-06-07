import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Image,
} from 'react-native';

const MIC_IDLE = require('../../assets/icons/blue_microphone.png');
const MIC_RECORDING = require('../../assets/icons/red_microphone.png');
const TICK_ICON = require('../../assets/icons/green_tick.png');
const CROSS_ICON = require('../../assets/icons/red_cross.png');
import { isCorrect } from '../utils/questionGenerator';
import { WORDS_BY_ID } from '../data/words';
import AudioButton from './AudioButton';

interface Props {
  wordId: string;
  correctAnswer: string;
  ttsRate: number;
  onResult: (correct: boolean, recognized: string) => void;
  onSkip: () => void;
}

// Lazily load Voice so the app doesn't crash in Expo Go where the native
// module doesn't exist.
function tryLoadVoice() {
  try {
    return require('@react-native-voice/voice').default;
  } catch {
    return null;
  }
}

type RecState = 'idle' | 'recording' | 'done';

export default function SpeakingQuestion({
  wordId,
  correctAnswer,
  ttsRate,
  onResult,
  onSkip,
}: Props) {
  const word = WORDS_BY_ID[wordId];
  const Voice = tryLoadVoice();

  const [recState, setRecState] = useState<RecState>('idle');
  const [recognized, setRecognized] = useState('');
  const [wasCorrect, setWasCorrect] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!Voice) return;

    Voice.onSpeechStart = () => setRecState('recording');
    Voice.onSpeechEnd = () => {};
    Voice.onSpeechResults = (e: { value?: string[] }) => {
      const text = (e.value?.[0] ?? '').toLowerCase().trim();
      setRecognized(text);
      const correct = isCorrect(text, correctAnswer);
      setWasCorrect(correct);
      setRecState('done');
      onResult(correct, text);
    };
    Voice.onSpeechError = () => setRecState('idle');

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, []);

  useEffect(() => {
    if (recState === 'recording') {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.28, duration: 550, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 550, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    }
  }, [recState]);

  const startRecording = async () => {
    if (recState !== 'idle' || !Voice) return;
    try {
      await Voice.start('es-ES');
    } catch (err) {
      console.warn('Voice start error:', err);
    }
  };

  const stopRecording = async () => {
    if (recState !== 'recording' || !Voice) return;
    try {
      await Voice.stop();
    } catch {}
  };

  // ─── Expo Go fallback ──────────────────────────────────────────────────────
  if (!Voice) {
    return (
      <View style={styles.fallbackBox}>
        <Image source={MIC_IDLE} style={styles.fallbackIcon} resizeMode="contain" />
        <Text style={styles.fallbackTitle}>Dev Build Required</Text>
        <Text style={styles.fallbackBody}>
          Speaking questions use native speech recognition, which isn't available in Expo Go.
          {'\n\n'}To unlock speaking practice, create a development build:
        </Text>
        <View style={styles.codeBox}>
          <Text style={styles.code}>npm install -g eas-cli</Text>
          <Text style={styles.code}>eas build --profile development</Text>
        </View>
        <Text style={styles.fallbackSub}>
          Install the resulting APK / IPA on your device and open it instead of Expo Go.
        </Text>
        <TouchableOpacity style={styles.skipBtnYellow} onPress={onSkip}>
          <Text style={styles.skipBtnText}>Skip This Question</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Mic state helpers ─────────────────────────────────────────────────────
  const micBg =
    recState === 'idle'
      ? '#4F46E5'
      : recState === 'recording'
      ? '#DC2626'
      : wasCorrect
      ? '#059669'
      : '#DC2626';

  const micIcon =
    recState === 'idle'
      ? MIC_IDLE
      : recState === 'recording'
      ? MIC_RECORDING
      : wasCorrect
      ? TICK_ICON
      : CROSS_ICON;

  const hintText =
    recState === 'idle'
      ? 'Tap the mic and say the word'
      : recState === 'recording'
      ? 'Listening… tap to stop'
      : recognized
      ? `You said: "${recognized}"`
      : 'No speech detected';

  // ─── Main UI ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Word card */}
      <View style={styles.wordCard}>
        <Text style={styles.wordCardLabel}>Say this in Spanish:</Text>
        <Text style={styles.wordEnglish}>"{word?.english}"</Text>
        <View style={styles.audioHintRow}>
          <AudioButton text={correctAnswer} rate={ttsRate} size="sm" />
          <Text style={styles.audioHint}>Hear the pronunciation first</Text>
        </View>
      </View>

      {/* Microphone */}
      <View style={styles.micArea}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.micBtn, { backgroundColor: micBg }]}
            onPress={recState === 'recording' ? stopRecording : startRecording}
            disabled={recState === 'done'}
            activeOpacity={0.82}
          >
            <Image source={micIcon} style={styles.micIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.micHint}>{hintText}</Text>
      </View>

      {recState === 'idle' && (
        <TouchableOpacity style={styles.skipLink} onPress={onSkip}>
          <Text style={styles.skipLinkText}>Skip this question</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },

  // Word card
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  wordCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  wordEnglish: { fontSize: 26, fontWeight: '800', color: '#111827' },
  audioHintRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  audioHint: { fontSize: 13, color: '#9CA3AF' },

  // Mic
  micArea: { alignItems: 'center', gap: 14 },
  micBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  micIcon: { width: 42, height: 42 },
  micHint: { fontSize: 15, color: '#6B7280', fontWeight: '500', textAlign: 'center' },

  // Skip
  skipLink: { alignSelf: 'center', padding: 8 },
  skipLinkText: { fontSize: 13, color: '#9CA3AF', textDecorationLine: 'underline' },

  // Expo Go fallback
  fallbackBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  fallbackIcon: { width: 52, height: 52 },
  fallbackTitle: { fontSize: 17, fontWeight: '700', color: '#92400E' },
  fallbackBody: { fontSize: 14, color: '#78350F', textAlign: 'center', lineHeight: 20 },
  codeBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    gap: 4,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#92400E',
  },
  fallbackSub: { fontSize: 12, color: '#92400E', textAlign: 'center', opacity: 0.8 },
  skipBtnYellow: {
    backgroundColor: '#D97706',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 4,
  },
  skipBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
