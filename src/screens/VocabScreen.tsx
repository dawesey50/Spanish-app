import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Word } from '../types';
import { WORDS } from '../data/words';
import { LESSONS, LESSONS_BY_ID, UNITS_BY_ID } from '../data/units';
import { getFavourites, toggleFavourite, getWeakWordsWithCounts, getUserProgress } from '../database/db';
import WordCard from '../components/WordCard';
import AudioButton from '../components/AudioButton';

const STAR_ICON = require('../../assets/icons/star.png');
const WARNING_ICON = require('../../assets/icons/warning_sign.png');

type Nav = NativeStackNavigationProp<RootStackParamList>;
type FilterMode = 'all' | 'favourites' | 'weak';

const WORD_TO_LESSON_ID: Record<string, string> = {};
LESSONS.forEach((l) => l.wordIds.forEach((wid) => { WORD_TO_LESSON_ID[wid] = l.id; }));

export default function VocabScreen() {
  const navigation = useNavigation<Nav>();

  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [weakWordIds, setWeakWordIds] = useState<Set<string>>(new Set());
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [ttsRate, setTtsRate] = useState(0.8);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [favs, weakWords, progress] = await Promise.all([
          getFavourites(),
          getWeakWordsWithCounts(),
          getUserProgress(),
        ]);
        setFavourites(new Set(favs));
        setWeakWordIds(new Set(weakWords.map((w) => w.wordId)));
        setTtsRate(progress.ttsRate);
      })();
    }, [])
  );

  const filtered = useMemo(() => {
    let list = WORDS;
    if (filterMode === 'favourites') list = list.filter((w) => favourites.has(w.id));
    else if (filterMode === 'weak') list = list.filter((w) => weakWordIds.has(w.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (w) => w.spanish.toLowerCase().includes(q) || w.english.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, filterMode, favourites, weakWordIds]);

  const handleToggleFavourite = useCallback(async (wordId: string) => {
    await toggleFavourite(wordId);
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });
  }, []);

  const goToLesson = () => {
    if (!selectedWord) return;
    const lessonId = WORD_TO_LESSON_ID[selectedWord.id];
    setSelectedWord(null);
    if (lessonId) navigation.navigate('Lesson', { lessonId });
  };

  const weakCount = weakWordIds.size;
  const favCount = favourites.size;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Vocabulary</Text>
        <Text style={styles.subtitle}>{WORDS.length} words</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Spanish or English..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter chips */}
      <View style={styles.chipRow}>
        <FilterChip
          label="All"
          count={WORDS.length}
          active={filterMode === 'all'}
          onPress={() => setFilterMode('all')}
        />
        <FilterChip
          label="★ Saved"
          count={favCount}
          active={filterMode === 'favourites'}
          onPress={() => setFilterMode('favourites')}
        />
        <FilterChip
          label="⚠ Weak"
          count={weakCount}
          active={filterMode === 'weak'}
          onPress={() => setFilterMode('weak')}
        />
      </View>

      {/* Word list */}
      <FlatList
        data={filtered}
        keyExtractor={(w) => w.id}
        renderItem={({ item }) => (
          <WordCard
            word={item}
            isFavourite={favourites.has(item.id)}
            isWeak={weakWordIds.has(item.id)}
            onPress={() => setSelectedWord(item)}
            onToggleFavourite={() => handleToggleFavourite(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {filterMode === 'favourites'
              ? 'No saved words yet — tap the ★ on any word card.'
              : filterMode === 'weak'
              ? 'No weak words right now. Great work!'
              : 'No words match your search.'}
          </Text>
        }
      />

      {/* Word detail modal */}
      <Modal
        visible={selectedWord !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedWord(null)}
      >
        {selectedWord && (
          <WordDetailModal
            word={selectedWord}
            isFavourite={favourites.has(selectedWord.id)}
            isWeak={weakWordIds.has(selectedWord.id)}
            ttsRate={ttsRate}
            lessonId={WORD_TO_LESSON_ID[selectedWord.id]}
            onToggleFavourite={() => handleToggleFavourite(selectedWord.id)}
            onGoToLesson={goToLesson}
            onClose={() => setSelectedWord(null)}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
      <View style={[styles.chipBadge, active && styles.chipBadgeActive]}>
        <Text style={[styles.chipBadgeText, active && styles.chipBadgeTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function WordDetailModal({
  word,
  isFavourite,
  isWeak,
  ttsRate,
  lessonId,
  onToggleFavourite,
  onGoToLesson,
  onClose,
}: {
  word: Word;
  isFavourite: boolean;
  isWeak: boolean;
  ttsRate: number;
  lessonId: string | undefined;
  onToggleFavourite: () => void;
  onGoToLesson: () => void;
  onClose: () => void;
}) {
  const lesson = lessonId ? LESSONS_BY_ID[lessonId] : undefined;
  const unit = lesson ? UNITS_BY_ID[lesson.unitId] : undefined;

  return (
    <SafeAreaView style={styles.modalSafe}>
      <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
        {/* Close + star row */}
        <View style={styles.modalTopRow}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleFavourite} style={styles.modalStarBtn}>
            <Image
              source={STAR_ICON}
              style={[styles.modalStar, !isFavourite && styles.starInactive]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Audio + Spanish */}
        <View style={styles.modalWordRow}>
          <AudioButton text={word.spanish} rate={ttsRate} size="md" />
          <Text style={styles.modalSpanish}>{word.spanish}</Text>
        </View>

        <Text style={styles.modalEnglish}>{word.english}</Text>

        {/* Difficulty */}
        <View style={styles.diffRow}>
          <Text style={styles.diffLabel}>Difficulty:</Text>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[styles.modalDot, n <= word.difficulty && styles.modalDotFilled]}
            />
          ))}
          <Text style={styles.diffName}>
            {word.difficulty === 1 ? 'Beginner' : word.difficulty === 2 ? 'Intermediate' : 'Advanced'}
          </Text>
        </View>

        {/* Example sentence */}
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Example</Text>
          <Text style={styles.exampleText}>{word.example}</Text>
        </View>

        {/* Weak word warning */}
        {isWeak && (
          <View style={styles.weakBanner}>
            <Image source={WARNING_ICON} style={styles.weakBannerIcon} resizeMode="contain" />
            <Text style={styles.weakBannerText}>
              This word needs practice — it's appeared in your weak words list.
            </Text>
          </View>
        )}

        {/* Unit & Lesson info */}
        {unit && lesson && (
          <View style={styles.unitCard}>
            <View>
              <Text style={styles.unitCardLabel}>Unit</Text>
              <Text style={styles.unitCardName}>{unit.title}</Text>
              <Text style={styles.lessonCardName}>{lesson.title}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer button */}
      {lessonId && (
        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.goToLessonBtn} onPress={onGoToLesson} activeOpacity={0.85}>
            <Text style={styles.goToLessonText}>Go to Lesson →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },

  searchRow: { paddingHorizontal: 20, marginBottom: 12 },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },

  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  chipActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  chipTextActive: { color: '#4F46E5' },
  chipBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  chipBadgeActive: { backgroundColor: '#C7D2FE' },
  chipBadgeText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  chipBadgeTextActive: { color: '#4F46E5' },

  list: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Modal
  modalSafe: { flex: 1, backgroundColor: '#FFFFFF' },
  modalScroll: { padding: 24, paddingBottom: 16 },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalCloseBtn: { padding: 4 },
  modalCloseText: { fontSize: 18, color: '#9CA3AF' },
  modalStarBtn: { padding: 4 },
  modalStar: { width: 28, height: 28 },
  starInactive: { opacity: 0.2 },

  modalWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  modalSpanish: { fontSize: 32, fontWeight: '800', color: '#111827', flex: 1, flexWrap: 'wrap' },
  modalEnglish: { fontSize: 18, color: '#6B7280', marginBottom: 16 },

  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  diffLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  modalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  modalDotFilled: { backgroundColor: '#4F46E5' },
  diffName: { fontSize: 13, color: '#6B7280', marginLeft: 4 },

  exampleCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  weakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  weakBannerIcon: { width: 16, height: 16 },
  weakBannerText: { fontSize: 13, color: '#92400E', flex: 1, lineHeight: 18 },

  unitCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  unitCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#818CF8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  unitCardName: { fontSize: 15, fontWeight: '700', color: '#3730A3' },
  lessonCardName: { fontSize: 13, color: '#6366F1', marginTop: 2 },

  modalFooter: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  goToLessonBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  goToLessonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
