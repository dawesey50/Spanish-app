import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useFonts, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { initDatabase, getUserProgress, getSoundsEnabled, getThemeMode } from './src/database/db';
import { initSounds } from './src/utils/sounds';
import { setupNotificationChannel } from './src/notifications';
import AppNavigator from './src/navigation/AppNavigator';
import AchievementToast from './src/components/AchievementToast';
import ErrorBoundary from './src/components/ErrorBoundary';
import { ThemeProvider, useTheme, type ThemeMode } from './src/ThemeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [fontsLoaded] = useFonts({ Nunito_700Bold, Nunito_800ExtraBold });

  useEffect(() => {
    (async () => {
      await setupNotificationChannel();
      await initDatabase();
      const progress = await getUserProgress();
      setOnboarded(progress.hasCompletedOnboarding);
      setThemeMode(await getThemeMode());
      setReady(true);
      // Non-blocking: preload sound effects with the persisted setting
      getSoundsEnabled().then(initSounds);
    })();
  }, []);

  if (!ready || !fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider initialMode={themeMode}>
          <ThemedStatusBar />
          <AppNavigator hasCompletedOnboarding={onboarded} />
          <AchievementToast />
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
});
