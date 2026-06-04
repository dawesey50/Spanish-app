import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ReviewScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.icon}>🔄</Text>
        <Text style={styles.title}>Review Mode</Text>
        <Text style={styles.subtitle}>
          Practise vocabulary from all your completed lessons. Questions are weighted toward
          words you've previously struggled with.
        </Text>
        <Text style={styles.comingSoon}>Coming in Phase 7</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.btnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 12 },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  comingSoon: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 32,
  },
  btn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
