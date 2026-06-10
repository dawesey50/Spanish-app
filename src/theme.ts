// Central design tokens (Phase 24). Import these instead of hard-coding
// colours, spacing, radii, shadows, or font styles in screens/components.
// Phase 31: light + dark palettes share the same token names — screens get
// the active palette via useTheme() from ThemeContext.
import type { TextStyle, ViewStyle } from 'react-native';

export const lightColors = {
  // Brand
  indigo: '#4F46E5',
  indigoDark: '#4338CA',
  indigoSoft: '#EEF2FF',
  indigoBorder: '#C7D2FE',
  indigoLight: '#6366F1',

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
};

export type ThemeColors = typeof lightColors;

export const darkColors: ThemeColors = {
  // Brand — slightly brighter accents read better on dark surfaces
  indigo: '#6366F1',
  indigoDark: '#4F46E5',
  indigoSoft: 'rgba(99,102,241,0.16)',
  indigoBorder: '#4338CA',
  indigoLight: '#818CF8',

  // Status
  green: '#34D399',
  greenSoft: 'rgba(16,185,129,0.14)',
  greenBorder: '#065F46',
  amber: '#FBBF24',
  amberSoft: 'rgba(245,158,11,0.14)',
  amberBorder: '#92400E',
  red: '#F87171',
  redSoft: 'rgba(239,68,68,0.16)',
  sky: '#38BDF8',
  skySoft: 'rgba(14,165,233,0.14)',

  // Neutrals
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  bg: '#0F172A',
  card: '#1E293B',
  border: '#334155',
  borderLight: '#28354B',
};

// Static export kept for code that hasn't been converted to useTheme().
export const colors = lightColors;

// Gradient stops (top-left → bottom-right) for hero headers and buttons
export const gradients = {
  hero: ['#6366F1', '#4F46E5', '#4338CA'] as const,
  button: ['#6366F1', '#4F46E5'] as const,
  green: ['#10B981', '#059669'] as const,
  amber: ['#F59E0B', '#D97706'] as const,
  locked: ['#9CA3AF', '#6B7280'] as const,
};

// Nunito for display text (titles, stat numbers, buttons); system for body.
// Loaded in App.tsx — these names are available once fonts resolve.
export const fonts = {
  display: 'Nunito_800ExtraBold',
  bold: 'Nunito_700Bold',
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
  display: { fontSize: 28, fontFamily: fonts.display, color: colors.text, letterSpacing: -0.5 } as TextStyle,
  title: { fontSize: 20, fontFamily: fonts.display, color: colors.text } as TextStyle,
  section: { fontSize: 17, fontFamily: fonts.bold, color: colors.text } as TextStyle,
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
