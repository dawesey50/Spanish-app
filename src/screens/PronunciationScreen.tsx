import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AudioButton from '../components/AudioButton';
import { fonts, gradients, radius, shadows, type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
import { getUserProgress } from '../database/db';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

interface Sound {
  symbol: string;
  name: string;
  hint: string;
  like: string;
  examples: { word: string; meaning: string }[];
}

const VOWELS: Sound[] = [
  {
    symbol: 'a',
    name: 'A',
    hint: 'Always like "ah" in "father"',
    like: '"ah"',
    examples: [
      { word: 'casa', meaning: 'house' },
      { word: 'hablar', meaning: 'to speak' },
    ],
  },
  {
    symbol: 'e',
    name: 'E',
    hint: 'Always like "eh" in "bed"',
    like: '"eh"',
    examples: [
      { word: 'leche', meaning: 'milk' },
      { word: 'verde', meaning: 'green' },
    ],
  },
  {
    symbol: 'i',
    name: 'I',
    hint: 'Always like "ee" in "feet"',
    like: '"ee"',
    examples: [
      { word: 'sí', meaning: 'yes' },
      { word: 'vivir', meaning: 'to live' },
    ],
  },
  {
    symbol: 'o',
    name: 'O',
    hint: 'Always like "oh" in "go" — shorter and purer',
    like: '"oh"',
    examples: [
      { word: 'hola', meaning: 'hello' },
      { word: 'poco', meaning: 'a little' },
    ],
  },
  {
    symbol: 'u',
    name: 'U',
    hint: 'Always like "oo" in "food"',
    like: '"oo"',
    examples: [
      { word: 'mucho', meaning: 'much/many' },
      { word: 'gustar', meaning: 'to like' },
    ],
  },
];

const CONSONANTS: Sound[] = [
  {
    symbol: 'ñ',
    name: 'Ñ (eñe)',
    hint: 'Like "ny" in "canyon" — a nasal sound',
    like: '"ny"',
    examples: [
      { word: 'español', meaning: 'Spanish' },
      { word: 'mañana', meaning: 'tomorrow/morning' },
    ],
  },
  {
    symbol: 'll',
    name: 'LL',
    hint: 'In most of Spain, like "y" in "yes". In Argentina, like "sh" in "shoe"',
    like: '"y" (or "sh")',
    examples: [
      { word: 'llamar', meaning: 'to call' },
      { word: 'lluvia', meaning: 'rain' },
    ],
  },
  {
    symbol: 'rr',
    name: 'RR (rolled R)',
    hint: 'A trill — roll your tongue tip against the roof of your mouth',
    like: 'trilled "rrr"',
    examples: [
      { word: 'perro', meaning: 'dog' },
      { word: 'arroz', meaning: 'rice' },
    ],
  },
  {
    symbol: 'j',
    name: 'J',
    hint: 'Like a strong "h" in "hat" — comes from the back of the throat',
    like: 'guttural "h"',
    examples: [
      { word: 'jamón', meaning: 'ham' },
      { word: 'trabajar', meaning: 'to work' },
    ],
  },
  {
    symbol: 'h',
    name: 'H (silent)',
    hint: 'Always completely silent in Spanish — never pronounce it',
    like: '(silent)',
    examples: [
      { word: 'hablar', meaning: 'to speak' },
      { word: 'hay', meaning: 'there is/are' },
    ],
  },
  {
    symbol: 'c/z',
    name: 'C / Z',
    hint: 'Before e or i, C sounds like "th" in Spain, or "s" in Latin America. Z is always "th" (Spain) or "s" (LatAm)',
    like: '"th" or "s"',
    examples: [
      { word: 'cerveza', meaning: 'beer' },
      { word: 'zapato', meaning: 'shoe' },
    ],
  },
  {
    symbol: 'g',
    name: 'G before E or I',
    hint: 'Before e or i, G sounds like the Spanish J — a guttural "h". Before other vowels it is a soft "g" as in "go"',
    like: 'guttural "h"',
    examples: [
      { word: 'gente', meaning: 'people' },
      { word: 'gitano', meaning: 'gypsy' },
    ],
  },
  {
    symbol: 'v/b',
    name: 'V and B',
    hint: 'In Spanish, V and B sound identical — both make a soft "b" sound, especially between vowels',
    like: 'soft "b"',
    examples: [
      { word: 'vino', meaning: 'wine' },
      { word: 'hablar', meaning: 'to speak' },
    ],
  },
];

const TIPS = [
  { emoji: '✂️', title: 'Every letter counts', body: 'Spanish is phonetic — every letter is (almost always) pronounced. Unlike English, there are very few silent letters except H.' },
  { emoji: '🎵', title: 'Stress the right syllable', body: 'Words ending in a vowel, N, or S stress the second-to-last syllable. Words ending in other consonants stress the last. Accent marks override these rules.' },
  { emoji: '🔗', title: 'Link words together', body: 'When a word ends in a vowel and the next starts with a vowel, they link together smoothly: "me alegra" sounds like "me-a-le-gra" without a pause.' },
];

export default function PronunciationScreen() {
  const navigation = useNavigation();
  const { c } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [ttsRate, setTtsRate] = useState(0.8);
  const [activeTab, setActiveTab] = useState<'vowels' | 'consonants' | 'tips'>('vowels');

  useFocusEffect(
    useCallback(() => {
      getUserProgress().then((p) => setTtsRate(p.ttsRate));
    }, [])
  );

  const sounds = activeTab === 'vowels' ? VOWELS : activeTab === 'consonants' ? CONSONANTS : [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#4338CA' }]}>
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Pronunciation Guide</Text>
        <Text style={styles.heroSub}>Learn how Spanish sounds really work</Text>
      </LinearGradient>

      <View style={styles.contentWrapper}>
        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['vowels', 'consonants', 'tips'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'vowels' ? 'Vowels' : tab === 'consonants' ? 'Consonants' : 'Tips'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {activeTab === 'tips' ? (
            <>
              <Text style={styles.sectionBlurb}>
                General rules that apply across all Spanish pronunciation.
              </Text>
              {TIPS.map((tip, i) => (
                <View key={i} style={styles.tipCard}>
                  <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                  <View style={styles.tipBody}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipText}>{tip.body}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={styles.sectionBlurb}>
                {activeTab === 'vowels'
                  ? 'Spanish vowels are pure and consistent — they never change sound based on position.'
                  : 'These consonants behave differently from English — master them and your accent will improve dramatically.'}
              </Text>
              {sounds.map((s, i) => (
                <View key={i} style={styles.soundCard}>
                  <View style={styles.soundHeader}>
                    <View style={styles.symbolBadge}>
                      <Text style={styles.symbolText}>{s.symbol}</Text>
                    </View>
                    <View style={styles.soundMeta}>
                      <Text style={styles.soundName}>{s.name}</Text>
                      <Text style={styles.soundLike}>Sounds like {s.like}</Text>
                    </View>
                  </View>
                  <Text style={styles.soundHint}>{s.hint}</Text>
                  <View style={styles.examplesRow}>
                    {s.examples.map((ex, j) => (
                      <View key={j} style={styles.exampleChip}>
                        <AudioButton text={ex.word} rate={ttsRate} size="sm" />
                        <View style={styles.exampleText}>
                          <Text style={styles.exampleWord}>{ex.word}</Text>
                          <Text style={styles.exampleMeaning}>{ex.meaning}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  safe: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 4,
  },
  backBtn: { paddingBottom: 8 },
  backBtnText: { fontSize: 22, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  heroTitle: { fontSize: 28, fontFamily: fonts.display, color: '#FFFFFF' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.72)' },

  contentWrapper: {
    flex: 1,
    backgroundColor: c.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: c.borderLight,
  },
  tabActive: { backgroundColor: c.indigoSoft },
  tabText: { fontSize: 13, fontWeight: '600', color: c.textMuted },
  tabTextActive: { color: c.indigo },

  scroll: { padding: 20, paddingTop: 12, paddingBottom: 48 },
  sectionBlurb: {
    fontSize: 13,
    color: c.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },

  // Sound cards
  soundCard: {
    backgroundColor: c.card,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.border,
    ...shadows.card,
  },
  soundHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  symbolBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: c.indigoSoft,
    borderWidth: 2,
    borderColor: c.indigoBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: { fontSize: 26, fontFamily: fonts.display, color: c.indigo },
  soundMeta: { flex: 1 },
  soundName: { fontSize: 16, fontFamily: fonts.bold, color: c.text },
  soundLike: { fontSize: 12, color: c.textMuted, marginTop: 2 },
  soundHint: {
    fontSize: 13,
    color: c.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    backgroundColor: c.borderLight,
    borderRadius: 8,
    padding: 10,
  },
  examplesRow: { flexDirection: 'row', gap: 10 },
  exampleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: c.bg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: c.border,
  },
  exampleText: { flex: 1 },
  exampleWord: { fontSize: 14, fontFamily: fonts.bold, color: c.text },
  exampleMeaning: { fontSize: 11, color: c.textMuted, marginTop: 1 },

  // Tips
  tipCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: c.card,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.border,
    ...shadows.card,
  },
  tipEmoji: { fontSize: 26 },
  tipBody: { flex: 1 },
  tipTitle: { fontSize: 15, fontFamily: fonts.bold, color: c.text, marginBottom: 4 },
  tipText: { fontSize: 13, color: c.textSecondary, lineHeight: 20 },
});
