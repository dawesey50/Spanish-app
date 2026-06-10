import React from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PressableScale from './PressableScale';
import { fonts, gradients, radius, shadows, type ThemeColors } from '../theme';
import { useThemedStyles } from '../ThemeContext';

type Variant = 'indigo' | 'green' | 'amber';

const VARIANT_GRADIENT: Record<Variant, readonly [string, string, ...string[]]> = {
  indigo: gradients.button,
  green: gradients.green,
  amber: gradients.amber,
};
const VARIANT_GLOW: Record<Variant, string> = {
  indigo: '#4F46E5',
  green: '#059669',
  amber: '#D97706',
};

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export default function PrimaryButton({ label, onPress, variant = 'indigo', disabled = false, style, icon }: Props) {
  const styles = useThemedStyles(createStyles);
  if (disabled) {
    return (
      <View style={[styles.base, styles.disabled, style]}>
        {icon}
        <Text style={[styles.label, styles.labelDisabled]}>{label}</Text>
      </View>
    );
  }

  return (
    <PressableScale onPress={onPress} style={[shadows.glow(VARIANT_GLOW[variant]), style]}>
      <LinearGradient
        colors={VARIANT_GRADIENT[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.base}
      >
        {icon}
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </PressableScale>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.md,
  },
  disabled: {
    backgroundColor: c.border,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  labelDisabled: {
    color: c.textMuted,
  },
});
