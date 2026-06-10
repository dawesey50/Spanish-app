import React from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PressableScale from './PressableScale';
import { colors, fonts, gradients, radius, shadows } from '../theme';

type Variant = 'indigo' | 'green' | 'amber';

const VARIANT_GRADIENT: Record<Variant, readonly [string, string, ...string[]]> = {
  indigo: gradients.button,
  green: gradients.green,
  amber: gradients.amber,
};
const VARIANT_GLOW: Record<Variant, string> = {
  indigo: colors.indigo,
  green: colors.green,
  amber: colors.amber,
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

const styles = StyleSheet.create({
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
    backgroundColor: colors.border,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.display,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
