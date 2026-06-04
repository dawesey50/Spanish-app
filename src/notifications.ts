import * as Notifications from 'expo-notifications';

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: current } = await Notifications.getPermissionsAsync();
  if (current === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to practice Spanish! 🇪🇸',
      body: "Keep your streak going — just 5 minutes counts.",
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as any,
  });
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
