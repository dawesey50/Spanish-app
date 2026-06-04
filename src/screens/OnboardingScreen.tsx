import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { setOnboardingComplete } from '../database/db';
import { UNITS } from '../data/units';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface PlacementQuestion {
  prompt: string;
  options: string[];
  correct: string;
  unitIndex: number;
}

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    prompt: 'What does "hola" mean?',
    options: ['goodbye', 'hello', 'please', 'thank you'],
    correct: 'hello',
    unitIndex: 0,
  },
  {
    prompt: 'How do you say "thank you" in Spanish?',
    options: ['por favor', 'de nada', 'gracias', 'adiós'],
    correct: 'gracias',
    unitIndex: 0,
  },
  {
    prompt: 'What does "querer" mean?',
    options: ['to eat', 'to want', 'to go', 'to have'],
    correct: 'to want',
    unitIndex: 1,
  },
  {
    prompt: 'What is "el agua"?',
    options: ['fire', 'earth', 'water', 'air'],
    correct: 'water',
    unitIndex: 1,
  },
  {
    prompt: 'What does "a la izquierda" mean?',
    options: ['to the right', 'straight ahead', 'turn around', 'to the left'],
    correct: 'to the left',
    unitIndex: 2,
  },
  {
    prompt: '"El billete" refers to:',
    options: ['a suitcase', 'a ticket', 'a passport', 'a map'],
    correct: 'a ticket',
    unitIndex: 2,
  },
  {
    prompt: 'Which is the correct verb for "to speak"?',
    options: ['comer', 'beber', 'hablar', 'ir'],
    correct: 'hablar',
    unitIndex: 1,
  },
  {
    prompt: 'What does "cerca" mean?',
    options: ['far', 'lost', 'near', 'slow'],
    correct: 'near',
    unitIndex: 2,
  },
  {
    prompt: 'How do you say "good morning"?',
    options: ['buenas noches', 'buenas tardes', 'buenos días', 'hasta luego'],
    correct: 'buenos días',
    unitIndex: 0,
  },
  {
    prompt: 'What is "estar"?',
    options: [
      'to be (permanent)',
      'to be (temporary)',
      'to have',
      'to want',
    ],
    correct: 'to be (temporary)',
    unitIndex: 1,
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const [step, setStep] = useState<'welcome' | 'test' | 'result'>('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [unitScores, setUnitScores] = useState([0, 0, 0]);

  const current = PLACEMENT_QUESTIONS[questionIndex];

  const pick = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    if (option === current.correct) {
      setUnitScores((prev) => {
        const next = [...prev];
        next[current.unitIndex] += 1;
        return next;
      });
    }
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    if (questionIndex + 1 >= PLACEMENT_QUESTIONS.length) {
      setStep('result');
    } else {
      setQuestionIndex((i) => i + 1);
    }
  };

  const determineStartUnit = (): number => {
    const maxPossible = [3, 4, 3];
    const thresholds = maxPossible.map((m, i) => unitScores[i] / m >= 0.7);
    if (thresholds[0] && thresholds[1] && thresholds[2]) return 2;
    if (thresholds[0] && thresholds[1]) return 2;
    if (thresholds[0]) return 1;
    return 0;
  };

  const finish = async () => {
    const unitIndex = determineStartUnit();
    const startingUnitId = UNITS[unitIndex].id;
    await setOnboardingComplete(startingUnitId);
    navigation.replace('Main');
  };

  if (step === 'welcome') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>🇪🇸</Text>
          <Text style={styles.welcomeTitle}>Learn Spanish</Text>
          <Text style={styles.welcomeSubtitle}>
            Build real vocabulary and conversation skills through mixed question types, spaced
            repetition, and AI-powered conversation practice.
          </Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => setStep('test')}>
            <Text style={styles.startBtnText}>Take Placement Test →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={async () => {
              await setOnboardingComplete('unit_01');
              navigation.replace('Main');
            }}
          >
            <Text style={styles.skipBtnText}>Start from the beginning</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'result') {
    const unitIndex = determineStartUnit();
    const unit = UNITS[unitIndex];
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>✅</Text>
          <Text style={styles.welcomeTitle}>Placement Complete!</Text>
          <Text style={styles.welcomeSubtitle}>
            Based on your answers, you'll start at:
          </Text>
          <View style={styles.placementCard}>
            <Text style={styles.placementEmoji}>{unit.icon}</Text>
            <Text style={styles.placementTitle}>{unit.title}</Text>
            <Text style={styles.placementDesc}>{unit.description}</Text>
          </View>
          <TouchableOpacity style={styles.startBtn} onPress={finish}>
            <Text style={styles.startBtnText}>Let's Go! →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.testContainer}>
        <View style={styles.testProgress}>
          <Text style={styles.testCounter}>
            Question {questionIndex + 1} of {PLACEMENT_QUESTIONS.length}
          </Text>
          <View style={styles.testTrack}>
            <View
              style={[
                styles.testFill,
                { width: `${((questionIndex + 1) / PLACEMENT_QUESTIONS.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        <Text style={styles.testPrompt}>{current.prompt}</Text>

        <View style={styles.testOptions}>
          {current.options.map((opt) => {
            const isSelected = selected === opt;
            const isRight = opt === current.correct;
            let bg = '#FFFFFF';
            if (revealed && isSelected && isRight) bg = '#D1FAE5';
            if (revealed && isSelected && !isRight) bg = '#FEE2E2';
            if (revealed && !isSelected && isRight) bg = '#D1FAE5';

            return (
              <TouchableOpacity
                key={opt}
                style={[styles.testOption, { backgroundColor: bg }]}
                onPress={() => pick(opt)}
                disabled={revealed}
                activeOpacity={0.7}
              >
                <Text style={styles.testOptionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {revealed && (
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextBtnText}>
              {questionIndex + 1 >= PLACEMENT_QUESTIONS.length ? 'See Results →' : 'Next →'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  bigEmoji: { fontSize: 72, marginBottom: 20 },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  startBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 16,
    marginBottom: 14,
  },
  startBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  skipBtn: { padding: 12 },
  skipBtnText: { fontSize: 15, color: '#6B7280', textDecorationLine: 'underline' },
  placementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  placementEmoji: { fontSize: 40, marginBottom: 8 },
  placementTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 6 },
  placementDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  testContainer: { flex: 1, padding: 20 },
  testProgress: { marginBottom: 32 },
  testCounter: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 8 },
  testTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  testFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  testPrompt: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 28,
    lineHeight: 30,
  },
  testOptions: { gap: 10 },
  testOption: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  testOptionText: { fontSize: 16, color: '#111827', fontWeight: '500' },
  nextBtn: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
    backgroundColor: '#059669',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  nextBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
