import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';

export const AVATAR_EMOJIS = ['🦊', '🐸', '🦉', '🐱', '🦁', '🐯', '🐧', '🚀', '⚡', '🌈', '🌺', '🎯', '🎸', '🌮', '☀️', '🧑‍🎓'];
export const AVATAR_COLORS = [
  '#4F46E5', '#059669', '#0EA5E9', '#D97706',
  '#E11D48', '#7C3AED', '#EA580C', '#475569',
];

interface Props {
  visible: boolean;
  currentEmoji: string;
  currentColor: string;
  onSave: (emoji: string, color: string) => void;
  onClose: () => void;
}

export default function AvatarPickerModal({ visible, currentEmoji, currentColor, onSave, onClose }: Props) {
  const [selEmoji, setSelEmoji] = useState(currentEmoji || AVATAR_EMOJIS[0]);
  const [selColor, setSelColor] = useState(currentColor || AVATAR_COLORS[0]);

  const handleOpen = () => {
    setSelEmoji(currentEmoji || AVATAR_EMOJIS[0]);
    setSelColor(currentColor || AVATAR_COLORS[0]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={handleOpen}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choose your character</Text>

          <View style={[styles.preview, { backgroundColor: selColor }]}>
            <Text style={styles.previewEmoji}>{selEmoji}</Text>
          </View>

          <Text style={styles.sectionLabel}>Character</Text>
          <View style={styles.emojiGrid}>
            {AVATAR_EMOJIS.map((e) => (
              <TouchableOpacity
                key={e}
                style={[styles.emojiBtn, selEmoji === e && { backgroundColor: selColor + '33', borderColor: selColor }]}
                onPress={() => setSelEmoji(e)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiItem}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Background colour</Text>
          <View style={styles.colorRow}>
            {AVATAR_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorSwatch, { backgroundColor: c }, selColor === c && styles.colorSwatchActive]}
                onPress={() => setSelColor(c)}
                activeOpacity={0.8}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: selColor }]}
            onPress={() => { onSave(selEmoji, selColor); onClose(); }}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>Save character</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  preview: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  previewEmoji: { fontSize: 44 },
  sectionLabel: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.xl,
    justifyContent: 'center',
  },
  emojiBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: colors.bg,
  },
  emojiItem: { fontSize: 26 },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xl,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
