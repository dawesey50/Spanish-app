import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type ThemeColors } from './theme';
import { updateThemeMode } from './database/db';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeValue {
  /** Active palette — same token names in light and dark. */
  c: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeValue>({
  c: lightColors,
  mode: 'system',
  isDark: false,
  setMode: () => {},
});

export function ThemeProvider({ initialMode, children }: { initialMode: ThemeMode; children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(initialMode);

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  const value = useMemo<ThemeValue>(() => ({
    c: isDark ? darkColors : lightColors,
    mode,
    isDark,
    setMode: (m: ThemeMode) => {
      setModeState(m);
      updateThemeMode(m).catch(() => {});
    },
  }), [mode, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}

/** Memoise a palette-dependent StyleSheet factory. */
export function useThemedStyles<T>(factory: (c: ThemeColors, isDark: boolean) => T): T {
  const { c, isDark } = useTheme();
  return useMemo(() => factory(c, isDark), [c, isDark]);
}
