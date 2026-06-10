import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';

const SCENARIO_IMAGES: Record<string, ReturnType<typeof require>> = {
  food: require('../../assets/scenarios/ordering_food.png'),
  directions: require('../../assets/scenarios/directions.png'),
  meeting: require('../../assets/scenarios/meeting.png'),
  shopping: require('../../assets/scenarios/shopping.png'),
  freeform: require('../../assets/scenarios/freeform.png'),
};
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PrimaryButton from '../components/PrimaryButton';
import type { RootStackParamList } from '../types';
import { awardXP, getUnlockedAchievements, unlockAchievement, getUserProgress } from '../database/db';
import { checkAchievements } from '../data/achievements';
import { fireAchievementToast } from '../utils/achievementEvents';
import { GROQ_API_KEY, GROQ_MODEL } from '../config';
import { LESSONS_BY_ID } from '../data/units';
import { WORDS_BY_ID } from '../data/words';
import { colors, radius, shadows } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type ChatPhase = 'picker' | 'chat' | 'summary';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
}

interface Scenario {
  id: string;
  emoji: string;
  label: string;
  description: string;
  aiName: string;
  systemPrompt: string;
  aiOpener: string;
}

let _msgId = 0;
const newId = () => String(++_msgId);

const SCENARIOS: Scenario[] = [
  {
    id: 'food',
    emoji: '🍽️',
    label: 'Ordering Food',
    description: 'Practice at a café or restaurant',
    aiName: 'Mesero',
    systemPrompt: `You are a friendly Spanish waiter at a restaurant in Madrid called "El Patio". You are talking to a Spanish learner. Strict rules:
1. ALWAYS respond in Spanish only — never English
2. Keep every response to 1–3 short sentences
3. If the learner makes a grammar or vocabulary error, add a brief correction in parentheses: (Corrección: "Quisiera una mesa para dos, por favor")
4. Ask natural follow-up questions a real waiter would ask (specials, drinks, dessert, bill, etc.)
5. Stay in character throughout the meal`,
    aiOpener: '¡Buenas tardes! Bienvenido a El Patio. ¿Para cuántas personas reservamos la mesa?',
  },
  {
    id: 'directions',
    emoji: '🗺️',
    label: 'Asking for Directions',
    description: 'Navigate the city in Spanish',
    aiName: 'Local',
    systemPrompt: `You are a helpful local person on the street in Barcelona. A Spanish learner needs help finding their way. Strict rules:
1. ALWAYS respond in Spanish only
2. Keep responses to 1–3 sentences
3. Add corrections in parentheses: (Corrección: "¿Dónde está la estación de metro?")
4. Give realistic directions — left/right, metro stops, landmarks, walking time
5. Be warm and patient, like a friendly local`,
    aiOpener: '¡Hola! ¿Te puedo ayudar con algo? ¿Estás perdido?',
  },
  {
    id: 'meeting',
    emoji: '🤝',
    label: 'Meeting Someone',
    description: 'Introduce yourself in Spanish',
    aiName: 'Carlos',
    systemPrompt: `You are Carlos, a 28-year-old Spanish person at a language exchange event in Seville. You are meeting a Spanish learner for the first time. Strict rules:
1. ALWAYS respond in Spanish only
2. Keep responses to 1–3 sentences
3. Add corrections in parentheses: (Corrección: "Me llamo...")
4. Ask natural get-to-know-you questions: name, hometown, job, hobbies, why they're learning Spanish
5. Be warm, enthusiastic, and encouraging`,
    aiOpener: '¡Hola! Qué bueno conocerte. Me llamo Carlos. ¿Y tú, cómo te llamas?',
  },
  {
    id: 'shopping',
    emoji: '🛍️',
    label: 'Shopping',
    description: 'Buy things in a Spanish shop',
    aiName: 'María',
    systemPrompt: `You are María, a friendly shopkeeper in a clothing boutique in Valencia called "Moda España". A Spanish learner is shopping. Strict rules:
1. ALWAYS respond in Spanish only
2. Keep responses to 1–3 sentences
3. Add corrections in parentheses: (Corrección: "¿Cuánto cuesta esta camisa?")
4. Help with sizes, colours, prices (realistic euros: €15–€120), fitting rooms, and payment
5. Mention occasional offers to make the conversation realistic`,
    aiOpener: '¡Buenos días! Bienvenido a Moda España. Hoy tenemos un 20% de descuento en ropa de verano. ¿En qué le puedo ayudar?',
  },
  {
    id: 'freeform',
    emoji: '💬',
    label: 'Free Conversation',
    description: 'Talk about anything in Spanish',
    aiName: 'Lucía',
    systemPrompt: `You are Lucía, a friendly and curious native Spanish speaker from Madrid. You are chatting with a Spanish learner who wants conversation practice. Strict rules:
1. ALWAYS respond in Spanish only — never English
2. Keep responses to 2–3 sentences
3. Add gentle corrections in parentheses: (Corrección: "...")
4. Bring up interesting topics: Spanish culture, travel, food, music, hobbies, films
5. Ask follow-up questions to keep the conversation flowing naturally`,
    aiOpener: '¡Hola! Me alegra hablar contigo. ¿Hace mucho tiempo que estudias español?',
  },
];

const CONVERSATION_XP = 30;

interface Persona {
  id: string;
  emoji: string;
  label: string;
  modifier: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'amigo',
    emoji: '😎',
    label: 'Amigo',
    modifier: `\n\nTone: Be very casual and friendly. Use informal "tú". Speak like a fun friend — relaxed, encouraging, use some colloquial expressions. Only correct major errors.`,
  },
  {
    id: 'profesor',
    emoji: '📚',
    label: 'Profesor',
    modifier: `\n\nTone: Be a thorough language teacher. Correct ALL grammar and vocabulary errors. Briefly explain WHY something is wrong in parentheses. Be encouraging but precise and educational.`,
  },
  {
    id: 'guia',
    emoji: '✈️',
    label: 'Guía',
    modifier: `\n\nTone: Be an enthusiastic tourist guide. Focus on travel vocabulary, local landmarks, cultural tips, and practical tourist phrases. Weave in Spanish geography and culture naturally.`,
  },
];

async function callGroq(systemPrompt: string, history: Message[]): Promise<string> {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
  ];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: GROQ_MODEL, messages, max_tokens: 200, temperature: 0.75 }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Groq ${res.status}: ${body.slice(0, 120)}`);
  }

  const data = await res.json();
  return (data.choices?.[0]?.message?.content ?? '').trim();
}

async function getFeedback(scenario: Scenario, history: Message[]): Promise<string> {
  const transcript = history
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role === 'user' ? 'Learner' : scenario.aiName}: ${m.text}`)
    .join('\n');

  return callGroq(
    'You are an encouraging Spanish language teacher. Analyze this conversation transcript and give brief feedback in English (3–5 sentences). Mention: what the learner did well, 1–2 specific things to improve, and end with an encouraging sentence. Be specific and warm.',
    [{ id: 'f', role: 'user', text: `Transcript:\n${transcript}` }]
  );
}

export default function ConversationScreen() {
  const navigation = useNavigation<Nav>();

  const [phase, setPhase] = useState<ChatPhase>('picker');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>('amigo');
  const [recentVocab, setRecentVocab] = useState<string[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      try {
        const progress = await getUserProgress();
        const recentLessons = progress.completedLessons.slice(-3);
        const wordIds = recentLessons.flatMap(id => LESSONS_BY_ID[id]?.wordIds ?? []);
        const uniqueIds = [...new Set(wordIds)].slice(0, 12);
        const words = uniqueIds.map(id => WORDS_BY_ID[id]).filter(Boolean);
        setRecentVocab(words.map(w => `${w.spanish} (${w.english})`));
      } catch {}
    })();
  }, []);

  const scrollToBottom = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);

  const buildSystemPrompt = (s: Scenario): string => {
    const personaMod = PERSONAS.find(p => p.id === selectedPersona)?.modifier ?? '';
    const vocabMod = recentVocab.length > 0
      ? `\n\nVocabulary context: The learner recently studied these words: ${recentVocab.slice(0, 10).join(', ')}. Naturally weave some into conversation where appropriate.`
      : '';
    return s.systemPrompt + personaMod + vocabMod;
  };

  const startScenario = (s: Scenario) => {
    const enriched: Scenario = { ...s, systemPrompt: buildSystemPrompt(s) };
    setScenario(enriched);
    setMessages([{ id: newId(), role: 'assistant', text: s.aiOpener }]);
    setPhase('chat');
    setInputText('');
    scrollToBottom();
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || loading || !scenario) return;

    const userMsg: Message = { id: newId(), role: 'user', text };
    const withUser = [...messages, userMsg];
    setMessages(withUser);
    setInputText('');
    setLoading(true);
    scrollToBottom();

    if (!GROQ_API_KEY) {
      setMessages([
        ...withUser,
        {
          id: newId(),
          role: 'assistant',
          text: '⚠️ Demo mode — add your free Groq API key to src/config.ts to get real AI responses. Visit console.groq.com/keys',
        },
      ]);
      setLoading(false);
      scrollToBottom();
      return;
    }

    try {
      const reply = await callGroq(scenario.systemPrompt, withUser);
      setMessages((prev) => [...prev, { id: newId(), role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'system', text: `❌ ${(err as Error).message}` },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const endConversation = () => {
    const userCount = messages.filter((m) => m.role === 'user').length;
    if (userCount === 0) {
      Alert.alert('No messages yet', 'Send at least one message before ending the conversation.');
      return;
    }
    Alert.alert('End Conversation?', 'This will finish the chat and show your results.', [
      { text: 'Keep chatting', style: 'cancel' },
      {
        text: 'End & Review',
        onPress: async () => {
          setPhase('summary');
          await awardXP(CONVERSATION_XP);
          const alreadyUnlocked = await getUnlockedAchievements();
          const newBadges = checkAchievements(
            { type: 'conversation' },
            alreadyUnlocked.map((b) => b.badgeId)
          );
          await Promise.all(newBadges.map((id) => unlockAchievement(id)));
          if (newBadges.length > 0) fireAchievementToast(newBadges);
          if (GROQ_API_KEY && scenario) {
            setLoadingFeedback(true);
            try {
              setFeedback(await getFeedback(scenario, messages));
            } catch {
              setFeedback('Could not load feedback. Check your API key and network, then try again.');
            } finally {
              setLoadingFeedback(false);
            }
          }
        },
      },
    ]);
  };

  const newConversation = () => {
    setPhase('picker');
    setScenario(null);
    setMessages([]);
    setFeedback('');
    setInputText('');
  };

  // ─── Picker ───────────────────────────────────────────────────────────────
  if (phase === 'picker') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.pickerHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.pickerTitle}>AI Conversation</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.pickerScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.pickerSubtitle}>
            Choose a persona and scenario, then practice Spanish with your AI tutor. Mistakes are corrected inline — just keep talking!
          </Text>

          <Text style={styles.personaTitle}>AI Persona</Text>
          <View style={styles.personaRow}>
            {PERSONAS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.personaChip, selectedPersona === p.id && styles.personaChipActive]}
                onPress={() => setSelectedPersona(p.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.personaEmoji}>{p.emoji}</Text>
                <Text style={[styles.personaLabel, selectedPersona === p.id && styles.personaLabelActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!GROQ_API_KEY && (
            <View style={styles.noKeyBanner}>
              <Text style={styles.noKeyTitle}>⚠️ API Key Not Set</Text>
              <Text style={styles.noKeyBody}>
                Get a free key at console.groq.com/keys then add it to{' '}
                <Text style={styles.noKeyCode}>src/config.ts</Text> and restart Expo.
                {'\n'}You can still tap a scenario to preview the chat UI.
              </Text>
            </View>
          )}

          {SCENARIOS.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.scenarioCard}
              onPress={() => startScenario(s)}
              activeOpacity={0.8}
            >
              <Image source={SCENARIO_IMAGES[s.id]} style={styles.scenarioEmoji} resizeMode="contain" />
              <View style={styles.scenarioText}>
                <Text style={styles.scenarioLabel}>{s.label}</Text>
                <Text style={styles.scenarioDesc}>{s.description}</Text>
              </View>
              <Text style={styles.scenarioArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Summary ──────────────────────────────────────────────────────────────
  if (phase === 'summary') {
    const userCount = messages.filter((m) => m.role === 'user').length;
    const aiCount = messages.filter((m) => m.role === 'assistant').length;
    const corrections = messages.filter(m => m.role === 'assistant' && m.text.includes('(Corrección:')).length;
    const rawScore = userCount > 0 ? Math.max(0, Math.round(100 - (corrections / userCount) * 100)) : null;
    const scoreLabel =
      rawScore === null ? null
      : rawScore >= 90 ? '¡Excelente! 🌟'
      : rawScore >= 70 ? '¡Muy bien! ✅'
      : rawScore >= 50 ? '¡Bien! 👍'
      : '¡Sigue practicando! 📖';

    const conversationText = messages.map(m => m.text.toLowerCase()).join(' ');
    const vocabUsed = recentVocab.filter(entry => {
      const sp = entry.split(' (')[0].toLowerCase();
      return sp.length > 2 && conversationText.includes(sp);
    }).slice(0, 6);

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.summaryScroll} showsVerticalScrollIndicator={false}>
          {scenario && <Image source={SCENARIO_IMAGES[scenario.id]} style={styles.summaryEmoji} resizeMode="contain" />}
          <Text style={styles.summaryTitle}>Conversation Complete!</Text>
          <Text style={styles.summaryMeta}>{scenario?.label}</Text>

          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>+{CONVERSATION_XP} XP</Text>
          </View>

          {rawScore !== null && (
            <View style={styles.scoreBanner}>
              <Text style={styles.scoreNum}>{rawScore}%</Text>
              <Text style={styles.scoreLabel}>{scoreLabel}</Text>
              {corrections > 0 && (
                <Text style={styles.correctionCount}>{corrections} correction{corrections !== 1 ? 's' : ''} received</Text>
              )}
            </View>
          )}

          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{userCount}</Text>
              <Text style={styles.statLabel}>Messages sent</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{aiCount}</Text>
              <Text style={styles.statLabel}>AI responses</Text>
            </View>
          </View>

          {vocabUsed.length > 0 && (
            <View style={styles.vocabCard}>
              <Text style={styles.vocabTitle}>Vocab in this conversation</Text>
              <View style={styles.vocabChips}>
                {vocabUsed.map((v, i) => (
                  <View key={i} style={styles.vocabChip}>
                    <Text style={styles.vocabChipText}>{v}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Teacher's Feedback</Text>
            {!GROQ_API_KEY ? (
              <Text style={styles.feedbackPlaceholder}>
                Add your Groq API key to src/config.ts to get personalised AI feedback on your conversation.
              </Text>
            ) : loadingFeedback ? (
              <ActivityIndicator color="#4F46E5" style={{ marginVertical: 16 }} />
            ) : (
              <Text style={styles.feedbackBody}>{feedback || 'No feedback available.'}</Text>
            )}
          </View>

          <PrimaryButton label="New Scenario" onPress={newConversation} style={{ alignSelf: 'stretch' }} />
          <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.ghostBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Chat ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={newConversation} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.chatHeaderCenter}>
          <View style={styles.chatHeaderTitleRow}>
            {scenario && <Image source={SCENARIO_IMAGES[scenario.id]} style={styles.chatHeaderIcon} resizeMode="contain" />}
            <Text style={styles.chatHeaderTitle}>{scenario?.label}</Text>
          </View>
          <Text style={styles.chatHeaderSub}>with {scenario?.aiName}</Text>
        </View>
        <TouchableOpacity onPress={endConversation} style={styles.endBtn}>
          <Text style={styles.endBtnText}>End</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((msg) => {
            if (msg.role === 'system') {
              return (
                <View key={msg.id} style={styles.systemRow}>
                  <Text style={styles.systemText}>{msg.text}</Text>
                </View>
              );
            }
            const isUser = msg.role === 'user';
            return (
              <View
                key={msg.id}
                style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}
              >
                {!isUser && (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{scenario?.aiName?.[0] ?? 'A'}</Text>
                  </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                  <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}

          {loading && (
            <View style={[styles.bubbleRow, styles.bubbleRowAI]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{scenario?.aiName?.[0] ?? 'A'}</Text>
              </View>
              <View style={[styles.bubble, styles.bubbleAI, { paddingVertical: 14 }]}>
                <ActivityIndicator size="small" color="#9CA3AF" />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe en español..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            editable={!loading}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnOff]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },

  // ─── Picker ───────────────────────────────────────────────────────────────
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  pickerTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: '#111827', textAlign: 'center' },
  pickerScroll: { padding: 20, paddingBottom: 40 },
  pickerSubtitle: { fontSize: 14, color: '#6B7280', lineHeight: 21, marginBottom: 20 },

  noKeyBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noKeyTitle: { fontSize: 14, fontWeight: '700', color: '#92400E', marginBottom: 4 },
  noKeyBody: { fontSize: 13, color: '#78350F', lineHeight: 19 },
  noKeyCode: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '700' },

  scenarioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    ...shadows.card,
  },
  scenarioEmoji: { width: 40, height: 40 },
  scenarioText: { flex: 1 },
  scenarioLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  scenarioDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  scenarioArrow: { fontSize: 18, color: '#C7D2FE' },

  // ─── Chat header ──────────────────────────────────────────────────────────
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  chatHeaderCenter: { flex: 1, alignItems: 'center' },
  chatHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chatHeaderIcon: { width: 18, height: 18 },
  chatHeaderTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  chatHeaderSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  endBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  endBtnText: { fontSize: 13, fontWeight: '700', color: '#DC2626' },

  // ─── Messages ─────────────────────────────────────────────────────────────
  messageList: { flex: 1 },
  messageListContent: { padding: 14, gap: 10 },

  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' },
  bubbleRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  bubbleRowAI: { alignSelf: 'flex-start' },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },

  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, flexShrink: 1 },
  bubbleUser: { backgroundColor: '#4F46E5', borderBottomRightRadius: 4 },
  bubbleAI: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: '#FFFFFF' },
  bubbleTextAI: { color: '#111827' },

  systemRow: { alignSelf: 'center', maxWidth: '90%' },
  systemText: {
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  // ─── Input ────────────────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    maxHeight: 110,
    lineHeight: 20,
  },
  sendBtn: {
    backgroundColor: '#4F46E5',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnOff: { backgroundColor: '#C7D2FE' },
  sendBtnText: { fontSize: 22, color: '#FFFFFF', lineHeight: 26 },

  // ─── Summary ──────────────────────────────────────────────────────────────
  summaryScroll: { padding: 24, alignItems: 'center', paddingBottom: 48 },
  summaryEmoji: { width: 80, height: 80, marginBottom: 12 },
  summaryTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  summaryMeta: { fontSize: 14, color: '#6B7280', marginBottom: 20 },

  xpBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginBottom: 20,
  },
  xpBadgeText: { fontSize: 20, fontWeight: '800', color: '#059669' },

  statRow: { flexDirection: 'row', gap: 14, marginBottom: 20, width: '100%' },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    ...shadows.card,
  },
  statNum: { fontSize: 30, fontWeight: '800', color: '#4F46E5' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 18,
    width: '100%',
    marginBottom: 24,
    ...shadows.card,
  },
  feedbackTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 10 },
  feedbackBody: { fontSize: 14, color: '#374151', lineHeight: 22 },
  feedbackPlaceholder: { fontSize: 13, color: '#9CA3AF', lineHeight: 20, fontStyle: 'italic' },

  primaryBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    ...shadows.glow(colors.indigo),
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  ghostBtn: { padding: 12 },
  ghostBtnText: { fontSize: 14, color: '#6B7280', textDecorationLine: 'underline' },

  // Persona picker
  personaTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  personaRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  personaChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 5,
    ...shadows.card,
  },
  personaChipActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  personaEmoji: { fontSize: 24 },
  personaLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  personaLabelActive: { color: '#4F46E5' },

  // Score banner
  scoreBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 4,
  },
  scoreNum: { fontSize: 36, fontWeight: '800', color: '#059669' },
  scoreLabel: { fontSize: 15, fontWeight: '700', color: '#065F46' },
  correctionCount: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  // Vocab card
  vocabCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vocabTitle: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10 },
  vocabChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  vocabChip: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  vocabChipText: { fontSize: 12, color: '#4F46E5', fontWeight: '600' },

  // Shared
  backBtn: { padding: 8, width: 40, alignItems: 'center' },
  backBtnText: { fontSize: 22, color: '#4F46E5', fontWeight: '600' },
});
