import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useFonts, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { initDatabase, getUserProgress, getSoundsEnabled } from './src/database/db';
import { initSounds } from './src/utils/sounds';
import { setupNotificationChannel } from './src/notifications';
import AppNavigator from './src/navigation/AppNavigator';
import AchievementToast from './src/components/AchievementToast';
import ErrorBoundary from './src/components/ErrorBoundary';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [fontsLoaded] = useFonts({ Nunito_700Bold, Nunito_800ExtraBold });

  useEffect(() => {
    (async () => {
      await setupNotificationChannel();
      await initDatabase();
      const progress = await getUserProgress();
      setOnboarded(progress.hasCompletedOnboarding);
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
        <StatusBar style="dark" />
        <AppNavigator hasCompletedOnboarding={onboarded} />
        <AchievementToast />
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
