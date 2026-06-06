import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { initDatabase, getUserProgress } from './src/database/db';
import { setupNotificationChannel } from './src/notifications';
import AppNavigator from './src/navigation/AppNavigator';
import AchievementToast from './src/components/AchievementToast';

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

  useEffect(() => {
    (async () => {
      await setupNotificationChannel();
      await initDatabase();
      const progress = await getUserProgress();
      setOnboarded(progress.hasCompletedOnboarding);
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator hasCompletedOnboarding={onboarded} />
      <AchievementToast />
    </SafeAreaProvider>
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
