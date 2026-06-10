import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { type ThemeColors } from '../theme';
import { useThemedStyles } from '../ThemeContext';
import { normalize } from '../utils/questionGenerator';

interface TokenItem {
  key: string;
  value: string;
}

interface Props {
  english: string;
  correctAnswer: string;
  tokens: string[];
  onResult: (correct: boolean, assembled: string) => void;
}

export default function SentenceBuilder({ english, correctAnswer, tokens, onResult }: Props) {
  const styles = useThemedStyles(createStyles);
  const tokenItems: TokenItem[] = useMemo(
    () => tokens.map((value, i) => ({ key: `t_${i}`, value })),
    [tokens]
  );

  const targetCount = correctAnswer.split(' ').length;

  const [placedKeys, setPlacedKeys] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const poolItems = tokenItems.filter((t) => !placedKeys.includes(t.key));
  const placedItems = placedKeys
    .map((k) => tokenItems.find((t) => t.key === k))
    .filter((t): t is TokenItem => Boolean(t));

  const addToken = (key: string) => {
    if (checked) return;
    setPlacedKeys((prev) => [...prev, key]);
  };

  const removeToken = (key: string) => {
    if (checked) return;
    setPlacedKeys((prev) => prev.filter((k) => k !== key));
  };

  const checkAnswer = () => {
    const assembled = placedItems.map((t) => t.value).join(' ');
    const correct = normalize(assembled) === normalize(correctAnswer);
    setIsCorrect(correct);
    setChecked(true);
    onResult(correct, assembled);
  };

  const canCheck = placedKeys.length === targetCount;

  return (
    <View style={styles.container}>
      {/* Prompt card */}
      <View style={styles.promptCard}>
        <Text style={styles.promptLabel}>Build the sentence in Spanish:</Text>
        <Text style={styles.promptEnglish}>"{english}"</Text>
      </View>

      {/* Answer tray */}
      <View style={styles.tray}>
        {placedItems.length === 0 ? (
          <Text style={styles.trayPlaceholder}>Tap words below to build your sentence</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trayTokens}
          >
            {placedItems.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.tile,
                  styles.tilePlaced,
                  checked && isCorrect && styles.tilePlacedCorrect,
                  checked && !isCorrect && styles.tilePlacedWrong,
                ]}
                onPress={() => removeToken(t.key)}
                disabled={checked}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tileText,
                    checked && isCorrect && styles.tileTextCorrect,
                    checked && !isCorrect && styles.tileTextWrong,
                  ]}
                >
                  {t.value}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Token pool */}
      <View style={styles.pool}>
        {poolItems.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tile, styles.tilePool, checked && styles.tileDisabled]}
            onPress={() => addToken(t.key)}
            disabled={checked}
            activeOpacity={0.75}
          >
            <Text style={[styles.tileText, checked && styles.tileTextDisabled]}>{t.value}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Check button */}
      {!checked && (
        <TouchableOpacity
          style={[styles.checkBtn, !canCheck && styles.checkBtnDisabled]}
          onPress={checkAnswer}
          disabled={!canCheck}
          activeOpacity={0.85}
        >
          <Text style={styles.checkBtnText}>Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: { gap: 16 },

  promptCard: {
    backgroundColor: c.card,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: c.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  promptEnglish: {
    fontSize: 20,
    fontWeight: '700',
    color: c.text,
    textAlign: 'center',
    lineHeight: 28,
  },

  tray: {
    minHeight: 60,
    backgroundColor: c.borderLight,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: c.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  trayPlaceholder: {
    fontSize: 14,
    color: c.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  trayTokens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 4,
  },

  divider: {
    height: 1,
    backgroundColor: c.border,
  },

  pool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 4,
  },

  tile: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 2,
  },
  tilePlaced: {
    backgroundColor: c.indigoSoft,
    borderColor: c.indigo,
  },
  tilePlacedCorrect: {
    backgroundColor: c.greenSoft,
    borderColor: c.green,
  },
  tilePlacedWrong: {
    backgroundColor: c.redSoft,
    borderColor: c.red,
  },
  tilePool: {
    backgroundColor: c.card,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  tileDisabled: {
    opacity: 0.45,
  },

  tileText: {
    fontSize: 15,
    fontWeight: '600',
    color: c.text,
  },
  tileTextCorrect: { color: '#065F46' },
  tileTextWrong: { color: '#991B1B' },
  tileTextDisabled: { color: c.textMuted },

  checkBtn: {
    backgroundColor: c.indigo,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  checkBtnDisabled: {
    backgroundColor: c.indigoBorder,
  },
  checkBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
