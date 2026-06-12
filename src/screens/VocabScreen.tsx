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
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Word } from '../types';
import { radius, shadows, type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
import { WORDS } from '../data/words';
import { LESSONS, LESSONS_BY_ID, UNITS_BY_ID } from '../data/units';
import {
  getFavourites,
  toggleFavourite,
  getWeakWordsWithCounts,
  getUserProgress,
  markWordReviewed,
} from '../database/db';
import WordCard from '../components/WordCard';
import AudioButton from '../components/AudioButton';

const STAR_ICON = require('../../assets/icons/star.png');
const WARNING_ICON = require('../../assets/icons/warning_sign.png');
const TICK_ICON = require('../../assets/icons/green_tick.png');

type Nav = NativeStackNavigationProp<RootStackParamList>;
type FilterMode = 'all' | 'favourites' | 'weak';
type SortMode = 'default' | 'az' | 'difficulty_asc' | 'difficulty_desc';
type ListItem = { type: 'word'; word: Word } | { type: 'header'; letter: string };

const WORD_TO_LESSON_ID: Record<string, string> = {};
LESSONS.forEach((l) => l.wordIds.forEach((wid) => { WORD_TO_LESSON_ID[wid] = l.id; }));

const TOPIC_LABELS: Record<string, string> = {
  greetings: 'Greetings',
  food: 'Food & Drink',
  travel: 'Travel',
  people: 'People',
  shopping: 'Shopping',
  weather: 'Weather',
  health: 'Health',
  hobbies: 'Hobbies',
};

// Stable ordered list of unique topics that appear in the word data
const ALL_TOPICS = Object.keys(TOPIC_LABELS).filter(
  (t) => WORDS.some((w) => w.topic === t)
);

const SORT_OPTIONS: { mode: SortMode; label: string; desc: string }[] = [
  { mode: 'default', label: 'Default', desc: 'Lesson order' },
  { mode: 'az', label: 'A → Z', desc: 'Alphabetical' },
  { mode: 'difficulty_asc', label: 'Easiest first', desc: 'Beginner → Advanced' },
  { mode: 'difficulty_desc', label: 'Hardest first', desc: 'Advanced → Beginner' },
];

const SORT_LABELS: Record<SortMode, string> = {
  default: 'Sort',
  az: 'A → Z',
  difficulty_asc: 'Easiest',
  difficulty_desc: 'Hardest',
};

export default function VocabScreen() {
  const navigation = useNavigation<Nav>();
  const { c } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [showSortModal, setShowSortModal] = useState(false);
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

  const listData = useMemo((): ListItem[] => {
    let list = WORDS;

    // Status filter
    if (filterMode === 'favourites') list = list.filter((w) => favourites.has(w.id));
    else if (filterMode === 'weak') list = list.filter((w) => weakWordIds.has(w.id));

    // Topic filter
    if (topicFilter) list = list.filter((w) => w.topic === topicFilter);

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (w) => w.spanish.toLowerCase().includes(q) || w.english.toLowerCase().includes(q)
      );
    }

    // Sort + optional section headers
    if (sortMode === 'az') {
      const sorted = [...list].sort((a, b) =>
        a.spanish.localeCompare(b.spanish, 'es', { sensitivity: 'base' })
      );
      const items: ListItem[] = [];
      let lastLetter = '';
      sorted.forEach((word) => {
        const letter = word.spanish[0].toUpperCase();
        if (letter !== lastLetter) {
          items.push({ type: 'header', letter });
          lastLetter = letter;
        }
        items.push({ type: 'word', word });
      });
      return items;
    }

    if (sortMode === 'difficulty_asc') {
      list = [...list].sort((a, b) => a.difficulty - b.difficulty);
    } else if (sortMode === 'difficulty_desc') {
      list = [...list].sort((a, b) => b.difficulty - a.difficulty);
    }

    return list.map((word) => ({ type: 'word', word }));
  }, [query, filterMode, topicFilter, sortMode, favourites, weakWordIds]);

  const wordCount = listData.filter((i) => i.type === 'word').length;

  const handleToggleFavourite = useCallback(async (wordId: string) => {
    await toggleFavourite(wordId);
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });
  }, []);

  const handleMarkPractised = useCallback(async (wordId: string) => {
    await markWordReviewed(wordId);
    setWeakWordIds((prev) => {
      const next = new Set(prev);
      next.delete(wordId);
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
  const sortActive = sortMode !== 'default';

  const renderEmptyState = () => {
    if (filterMode === 'favourites') {
      return (
        <EmptyState
          ionicon="star-outline"
          tint={c.amber}
          title="No saved words yet"
          hint="Tap the star on any word to keep it here for quick access."
          ctaLabel="Browse all words"
          onCta={() => setFilterMode('all')}
        />
      );
    }
    if (filterMode === 'weak') {
      return (
        <EmptyState
          ionicon="checkmark-circle-outline"
          tint={c.green}
          title="No weak words — nice!"
          hint="Words you miss in lessons land here for extra practice."
          ctaLabel="Browse all words"
          onCta={() => setFilterMode('all')}
        />
      );
    }
    return (
      <EmptyState
        ionicon="search-outline"
        tint={c.indigo}
        title="No matches"
        hint={
          topicFilter
            ? `Nothing in ${TOPIC_LABELS[topicFilter] ?? topicFilter} matches your search.`
            : 'Try a different spelling or a shorter search.'
        }
        ctaLabel={topicFilter || query ? 'Clear filters' : undefined}
        onCta={() => { setTopicFilter(null); setQuery(''); }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Vocabulary</Text>
          <Text style={styles.subtitle}>{WORDS.length} words</Text>
        </View>
        <TouchableOpacity
          style={styles.soundsBtn}
          onPress={() => navigation.navigate('Pronunciation')}
          activeOpacity={0.8}
        >
          <Text style={styles.soundsBtnText}>🔊 Sounds</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={c.textMuted} />
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
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={c.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter chips + sort button */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRowScroll}
          contentContainerStyle={styles.chipScroll}
        >
          <FilterChip
            label="All"
            count={WORDS.length}
            active={filterMode === 'all'}
            onPress={() => setFilterMode('all')}
          />
          <FilterChip
            label="Saved"
            count={favCount}
            active={filterMode === 'favourites'}
            onPress={() => setFilterMode('favourites')}
            icon={STAR_ICON}
          />
          <FilterChip
            label="Weak"
            count={weakCount}
            active={filterMode === 'weak'}
            onPress={() => setFilterMode('weak')}
            icon={WARNING_ICON}
          />
        </ScrollView>
        <TouchableOpacity
          style={[styles.sortBtn, sortActive && styles.sortBtnActive]}
          onPress={() => setShowSortModal(true)}
          activeOpacity={0.75}
        >
          <Text style={[styles.sortBtnText, sortActive && styles.sortBtnTextActive]}>
            {SORT_LABELS[sortMode]}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Topic chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topicChipScroll}
        style={styles.topicChipRow}
      >
        <TopicChip
          label="All Topics"
          active={topicFilter === null}
          onPress={() => setTopicFilter(null)}
        />
        {ALL_TOPICS.map((topic) => (
          <TopicChip
            key={topic}
            label={TOPIC_LABELS[topic] ?? topic}
            active={topicFilter === topic}
            onPress={() => setTopicFilter(topicFilter === topic ? null : topic)}
          />
        ))}
      </ScrollView>

      {/* Word list */}
      <FlatList
        data={listData}
        keyExtractor={(item) =>
          item.type === 'header' ? `hdr_${item.letter}` : item.word.id
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.sectionHeader}>{item.letter}</Text>;
          }
          return (
            <WordCard
              word={item.word}
              isFavourite={favourites.has(item.word.id)}
              isWeak={weakWordIds.has(item.word.id)}
              topicLabel={TOPIC_LABELS[item.word.topic] ?? item.word.topic}
              onPress={() => setSelectedWord(item.word)}
              onToggleFavourite={() => handleToggleFavourite(item.word.id)}
            />
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          wordCount > 0 && (topicFilter || sortActive || query.trim()) ? (
            <Text style={styles.resultCount}>{wordCount} word{wordCount !== 1 ? 's' : ''}</Text>
          ) : null
        }
        ListEmptyComponent={renderEmptyState()}
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
            onMarkPractised={
              weakWordIds.has(selectedWord.id)
                ? () => handleMarkPractised(selectedWord.id)
                : undefined
            }
            onGoToLesson={goToLesson}
            onClose={() => setSelectedWord(null)}
          />
        )}
      </Modal>

      {/* Sort modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.sortModalBackdrop}
          onPress={() => setShowSortModal(false)}
          activeOpacity={1}
        >
          <View style={styles.sortModalSheet}>
            <View style={styles.sortModalHandle} />
            <Text style={styles.sortModalTitle}>Sort by</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.mode}
                style={[styles.sortOption, sortMode === opt.mode && styles.sortOptionActive]}
                onPress={() => { setSortMode(opt.mode); setShowSortModal(false); }}
                activeOpacity={0.75}
              >
                <View style={styles.sortOptionLeft}>
                  <Text style={[styles.sortOptionLabel, sortMode === opt.mode && styles.sortOptionLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.sortOptionDesc}>{opt.desc}</Text>
                </View>
                {sortMode === opt.mode && (
                  <Image source={TICK_ICON} style={styles.sortOptionTick} resizeMode="contain" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FilterChip({
  label, count, active, onPress, icon,
}: {
  label: string; count: number; active: boolean; onPress: () => void; icon?: ReturnType<typeof require>;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon && (
        <Image source={icon} style={[styles.chipIcon, active && styles.chipIconActive]} resizeMode="contain" />
      )}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      <View style={[styles.chipBadge, active && styles.chipBadgeActive]}>
        <Text style={[styles.chipBadgeText, active && styles.chipBadgeTextActive]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({
  ionicon, tint, title, hint, ctaLabel, onCta,
}: {
  ionicon: React.ComponentProps<typeof Ionicons>['name'];
  tint: string;
  title: string;
  hint: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.emptyWrap}>
      <View style={[styles.emptyIconCircle, { backgroundColor: `${tint}1A` }]}>
        <Ionicons name={ionicon} size={34} color={tint} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyHint}>{hint}</Text>
      {ctaLabel && onCta ? (
        <TouchableOpacity style={styles.emptyCta} onPress={onCta} activeOpacity={0.85}>
          <Text style={styles.emptyCtaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function TopicChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      style={[styles.topicChip, active && styles.topicChipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.topicChipText, active && styles.topicChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function WordDetailModal({
  word, isFavourite, isWeak, ttsRate, lessonId,
  onToggleFavourite, onMarkPractised, onGoToLesson, onClose,
}: {
  word: Word;
  isFavourite: boolean;
  isWeak: boolean;
  ttsRate: number;
  lessonId: string | undefined;
  onToggleFavourite: () => void;
  onMarkPractised?: () => void;
  onGoToLesson: () => void;
  onClose: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const lesson = lessonId ? LESSONS_BY_ID[lessonId] : undefined;
  const unit = lesson ? UNITS_BY_ID[lesson.unitId] : undefined;
  const topicLabel = TOPIC_LABELS[word.topic] ?? word.topic;

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

        {/* Topic badge */}
        <View style={styles.topicBadge}>
          <Text style={styles.topicBadgeText}>{topicLabel}</Text>
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
            <View key={n} style={[styles.modalDot, n <= word.difficulty && styles.modalDotFilled]} />
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

        {/* Weak word warning + practised button */}
        {isWeak && (
          <View style={styles.weakCard}>
            <View style={styles.weakBanner}>
              <Image source={WARNING_ICON} style={styles.weakBannerIcon} resizeMode="contain" />
              <Text style={styles.weakBannerText}>
                This word needs practice — it's appeared in your weak words list.
              </Text>
            </View>
            {onMarkPractised && (
              <TouchableOpacity style={styles.practisedBtn} onPress={onMarkPractised} activeOpacity={0.8}>
                <Image source={TICK_ICON} style={styles.practisedBtnIcon} resizeMode="contain" />
                <Text style={styles.practisedBtnText}>Mark as practised</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Unit & Lesson info */}
        {unit && lesson && (
          <View style={styles.unitCard}>
            <Text style={styles.unitCardLabel}>Unit</Text>
            <Text style={styles.unitCardName}>{unit.title}</Text>
            <Text style={styles.lessonCardName}>{lesson.title}</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
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

// ─── Styles ────────────────────────────────────────────────────────────────────

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: c.text },
  subtitle: { fontSize: 13, color: c.textMuted, fontWeight: '600' },
  soundsBtn: {
    backgroundColor: c.indigoSoft,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: c.indigoBorder,
  },
  soundsBtnText: { fontSize: 13, fontWeight: '700', color: c.indigo },

  searchRow: { paddingHorizontal: 20, marginBottom: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: c.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: c.border,
    paddingHorizontal: 14,
    height: 48,
    ...shadows.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: c.text,
    paddingVertical: 0,
  },

  // Filter row (chips + sort button)
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
    paddingRight: 20,
  },
  chipRowScroll: { flexGrow: 0 },
  chipScroll: { paddingLeft: 20, gap: 8, flexDirection: 'row', alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: c.card,
    borderWidth: 1.5,
    borderColor: c.border,
  },
  chipActive: { borderColor: c.indigo, backgroundColor: c.indigoSoft },
  chipIcon: { width: 12, height: 12, opacity: 0.5 },
  chipIconActive: { opacity: 1 },
  chipText: { fontSize: 13, fontWeight: '600', color: c.textSecondary },
  chipTextActive: { color: c.indigo },
  chipBadge: {
    backgroundColor: c.borderLight,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  chipBadgeActive: { backgroundColor: c.indigoBorder },
  chipBadgeText: { fontSize: 11, fontWeight: '700', color: c.textSecondary },
  chipBadgeTextActive: { color: c.indigo },

  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: c.card,
    borderWidth: 1.5,
    borderColor: c.border,
    flexShrink: 0,
  },
  sortBtnActive: { borderColor: c.indigo, backgroundColor: c.indigoSoft },
  sortBtnText: { fontSize: 12, fontWeight: '700', color: c.textSecondary },
  sortBtnTextActive: { color: c.indigo },

  // Topic chips row — flexGrow: 0 stops the ScrollView collapsing the chips
  topicChipRow: { flexGrow: 0, marginBottom: 12 },
  topicChipScroll: { paddingHorizontal: 20, paddingVertical: 4, gap: 8, flexDirection: 'row', alignItems: 'center' },
  topicChip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: c.card,
    borderWidth: 1.5,
    borderColor: c.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicChipActive: { backgroundColor: c.indigo, borderColor: c.indigo, ...shadows.glow(c.indigo) },
  topicChipText: { fontSize: 14, fontWeight: '600', color: c.textSecondary },
  topicChipTextActive: { color: '#FFFFFF', fontWeight: '700' },

  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: c.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultCount: {
    fontSize: 12,
    color: c.textMuted,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  list: { paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },

  // Empty states
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: c.text, marginBottom: 6 },
  emptyHint: {
    fontSize: 14,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  emptyCta: {
    backgroundColor: c.indigo,
    borderRadius: radius.md,
    paddingHorizontal: 24,
    paddingVertical: 12,
    ...shadows.glow(c.indigo),
  },
  emptyCtaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  // Sort modal
  sortModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sortModalSheet: {
    backgroundColor: c.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 4,
  },
  sortModalHandle: {
    width: 36,
    height: 4,
    backgroundColor: c.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sortModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: c.text,
    marginBottom: 12,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sortOptionActive: { backgroundColor: c.indigoSoft },
  sortOptionLeft: { gap: 2 },
  sortOptionLabel: { fontSize: 15, fontWeight: '600', color: c.text },
  sortOptionLabelActive: { color: c.indigo },
  sortOptionDesc: { fontSize: 12, color: c.textMuted },
  sortOptionTick: { width: 18, height: 18 },

  // Modal
  modalSafe: { flex: 1, backgroundColor: c.card },
  modalScroll: { padding: 24, paddingBottom: 16 },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCloseBtn: { padding: 4 },
  modalCloseText: { fontSize: 18, color: c.textMuted },
  modalStarBtn: { padding: 4 },
  modalStar: { width: 28, height: 28 },
  starInactive: { opacity: 0.2 },

  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: c.borderLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  topicBadgeText: { fontSize: 11, fontWeight: '700', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },

  modalWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  modalSpanish: { fontSize: 32, fontWeight: '800', color: c.text, flex: 1, flexWrap: 'wrap' },
  modalEnglish: { fontSize: 18, color: c.textSecondary, marginBottom: 16 },

  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  diffLabel: { fontSize: 13, color: c.textMuted, fontWeight: '600' },
  modalDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.border },
  modalDotFilled: { backgroundColor: c.indigo },
  diffName: { fontSize: 13, color: c.textSecondary, marginLeft: 4 },

  exampleCard: {
    backgroundColor: c.bg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.border,
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: c.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  exampleText: { fontSize: 16, color: c.text, lineHeight: 24, fontStyle: 'italic' },

  weakCard: { marginBottom: 16, gap: 8 },
  weakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: c.amberSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: c.amberBorder,
  },
  weakBannerIcon: { width: 16, height: 16 },
  weakBannerText: { fontSize: 13, color: '#92400E', flex: 1, lineHeight: 18 },
  practisedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: c.greenSoft,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: c.greenBorder,
  },
  practisedBtnIcon: { width: 16, height: 16 },
  practisedBtnText: { fontSize: 14, fontWeight: '700', color: '#065F46' },

  unitCard: {
    backgroundColor: c.indigoSoft,
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
    borderTopColor: c.borderLight,
  },
  goToLessonBtn: {
    backgroundColor: c.indigo,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  goToLessonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
