import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, radius, spacing, type ThemeColors } from '../theme';
import { useThemedStyles } from '../ThemeContext';
import {
  AVATAR_CHARACTERS,
  AVATAR_CHARACTER_IDS,
  AvatarSvg,
  isCustomAvatar,
} from './AvatarCharacters';

export const AVATAR_PALETTE: {
  color: string;
  gradient: readonly [string, string, string];
}[] = [
  { color: '#4F46E5', gradient: ['#818CF8', '#4F46E5', '#3730A3'] },
  { color: '#059669', gradient: ['#34D399', '#059669', '#047857'] },
  { color: '#0EA5E9', gradient: ['#38BDF8', '#0EA5E9', '#0284C7'] },
  { color: '#D97706', gradient: ['#FBBF24', '#D97706', '#B45309'] },
  { color: '#E11D48', gradient: ['#FB7185', '#E11D48', '#BE185D'] },
  { color: '#7C3AED', gradient: ['#A78BFA', '#7C3AED', '#5B21B6'] },
  { color: '#EA580C', gradient: ['#FB923C', '#EA580C', '#C2410C'] },
  { color: '#475569', gradient: ['#94A3B8', '#475569', '#334155'] },
  { color: '#0F766E', gradient: ['#2DD4BF', '#0F766E', '#065F46'] },
  { color: '#B45309', gradient: ['#F59E0B', '#B45309', '#92400E'] },
  { color: '#BE185D', gradient: ['#F472B6', '#BE185D', '#9D174D'] },
  { color: '#1D4ED8', gradient: ['#60A5FA', '#1D4ED8', '#1E3A8A'] },
];

export const AVATAR_COLORS = AVATAR_PALETTE.map((p) => p.color);

export function getAvatarGradient(
  color: string
): readonly [string, string, string] {
  return (
    AVATAR_PALETTE.find((p) => p.color === color)?.gradient ??
    ([color, color, color] as const)
  );
}

// Kept for backward compatibility — new code uses AVATAR_CHARACTER_IDS
export const AVATAR_EMOJIS = AVATAR_CHARACTER_IDS;

interface Props {
  visible: boolean;
  currentEmoji: string;
  currentColor: string;
  onSave: (avatarId: string, color: string) => void;
  onClose: () => void;
}

export default function AvatarPickerModal({
  visible,
  currentEmoji,
  currentColor,
  onSave,
  onClose,
}: Props) {
  const styles = useThemedStyles(createStyles);

  const resolvedId = isCustomAvatar(currentEmoji) ? currentEmoji : AVATAR_CHARACTER_IDS[0];
  const [selId,    setSelId]    = useState(resolvedId);
  const [selColor, setSelColor] = useState(currentColor || AVATAR_COLORS[0]);

  const handleOpen = () => {
    setSelId(isCustomAvatar(currentEmoji) ? currentEmoji : AVATAR_CHARACTER_IDS[0]);
    setSelColor(currentColor || AVATAR_COLORS[0]);
  };

  const gradient = getAvatarGradient(selColor);

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

          {/* ── Live preview ─────────────────────────────────────── */}
          <View style={styles.previewWrap}>
            <LinearGradient
              colors={gradient as unknown as [string, string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.preview}
            >
              <AvatarSvg id={selId} size={84} />
            </LinearGradient>
          </View>

          {/* ── Character grid ───────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Character</Text>
          <View style={styles.characterGrid}>
            {AVATAR_CHARACTERS.map((char) => {
              const active = selId === char.id;
              return (
                <TouchableOpacity
                  key={char.id}
                  style={[
                    styles.charBtn,
                    active && {
                      borderColor: selColor,
                      backgroundColor: selColor + '1A',
                      transform: [{ scale: 1.06 }],
                    },
                  ]}
                  onPress={() => setSelId(char.id)}
                  activeOpacity={0.75}
                >
                  <AvatarSvg id={char.id} size={50} />
                  <Text style={[styles.charLabel, active && { color: selColor }]}>
                    {char.spanish}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Gradient palette ──────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Background</Text>
          <View style={styles.paletteGrid}>
            {AVATAR_PALETTE.map((p) => (
              <TouchableOpacity
                key={p.color}
                style={[
                  styles.paletteSwatch,
                  selColor === p.color && styles.paletteSwatchActive,
                ]}
                onPress={() => setSelColor(p.color)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={p.gradient as unknown as [string, string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.paletteGradient}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Save ─────────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => { onSave(selId, selColor); onClose(); }}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={gradient as unknown as [string, string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveBtnInner}
            >
              <Text style={styles.saveBtnText}>Save avatar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: c.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: c.border, marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18, fontWeight: '800', color: c.text,
    marginBottom: spacing.xl,
  },

  // Preview
  previewWrap: {
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
    borderRadius: 50,
  },
  preview: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },

  sectionLabel: {
    alignSelf: 'flex-start', fontSize: 12, fontWeight: '700',
    color: c.textMuted, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: spacing.sm,
  },

  // Character grid — 4 per row
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.xl,
    width: '100%',
    justifyContent: 'center',
  },
  charBtn: {
    width: 72,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 3,
  },
  charLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: c.textMuted,
    textAlign: 'center',
  },

  // Gradient palette
  paletteGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, marginBottom: spacing.xl, width: '100%',
    justifyContent: 'center',
  },
  paletteSwatch: {
    width: 38, height: 38, borderRadius: 19,
    overflow: 'hidden',
  },
  paletteSwatchActive: {
    borderWidth: 3, borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35, shadowRadius: 4, elevation: 5,
  },
  paletteGradient: { flex: 1 },

  // Save button
  saveBtn: { width: '100%', borderRadius: radius.md, overflow: 'hidden' },
  saveBtnInner: { paddingVertical: 16, alignItems: 'center' },
  saveBtnText: {
    fontSize: 16, fontFamily: fonts.display, color: '#FFFFFF', letterSpacing: 0.3,
  },
});
