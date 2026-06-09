// Central design tokens (Phase 24). Import these instead of hard-coding
// colours, spacing, radii, shadows, or font styles in screens/components.
import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  // Brand
  indigo: '#4F46E5',
  indigoDark: '#4338CA',
  indigoSoft: '#EEF2FF',
  indigoBorder: '#C7D2FE',

  // Status
  green: '#059669',
  greenSoft: '#ECFDF5',
  greenBorder: '#A7F3D0',
  amber: '#D97706',
  amberSoft: '#FEF3C7',
  amberBorder: '#FDE68A',
  red: '#DC2626',
  redSoft: '#FEE2E2',
  sky: '#0EA5E9',
  skySoft: '#E0F2FE',

  // Neutrals
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  bg: '#F8F9FC',
  card: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const shadows = {
  // Soft resting shadow for white cards
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  // Stronger shadow for elements that sit above content (modals, FABs)
  floating: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  } as ViewStyle,
  // Coloured glow for accent cards/buttons — pass the card's own colour
  glow: (color: string): ViewStyle => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  }),
};

export const typography = {
  display: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 } as TextStyle,
  title: { fontSize: 20, fontWeight: '700', color: colors.text } as TextStyle,
  section: { fontSize: 17, fontWeight: '700', color: colors.text } as TextStyle,
  body: { fontSize: 15, color: colors.text } as TextStyle,
  bodyMuted: { fontSize: 14, color: colors.textSecondary } as TextStyle,
  caption: { fontSize: 12, fontWeight: '600', color: colors.textMuted } as TextStyle,
  micro: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  } as TextStyle,
};
