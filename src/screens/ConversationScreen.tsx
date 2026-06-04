import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SCENARIOS = [
  { id: 'food', emoji: '🍽️', label: 'Ordering Food', description: 'Practice at a restaurant' },
  { id: 'directions', emoji: '🗺️', label: 'Asking for Directions', description: 'Navigate the city' },
  { id: 'meeting', emoji: '🤝', label: 'Meeting Someone', description: 'Introduce yourself' },
  { id: 'shopping', emoji: '🛍️', label: 'Shopping', description: 'Buy things in a shop' },
  { id: 'freeform', emoji: '💬', label: 'Free Conversation', description: 'Talk about anything' },
];

export default function ConversationScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Conversation Mode</Text>
        <Text style={styles.subtitle}>
          AI-powered conversation practice. Pick a scenario and practise speaking Spanish
          naturally. Groq/Gemini drives the AI side. Feedback after the conversation.
        </Text>

        <View style={styles.scenarios}>
          {SCENARIOS.map((s) => (
            <TouchableOpacity key={s.id} style={styles.scenarioCard} disabled>
              <Text style={styles.scenarioEmoji}>{s.emoji}</Text>
              <View>
                <Text style={styles.scenarioLabel}>{s.label}</Text>
                <Text style={styles.scenarioDesc}>{s.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.comingSoon}>Coming in Phase 6</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
    marginBottom: 24,
  },
  scenarios: { gap: 10 },
  scenarioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    opacity: 0.6,
  },
  scenarioEmoji: { fontSize: 32 },
  scenarioLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  scenarioDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  comingSoon: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 24,
  },
});
