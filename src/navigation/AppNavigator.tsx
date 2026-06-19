import React, { useRef } from 'react';
import { View, PanResponder } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { RootStackParamList, MainTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import LessonScreen from '../screens/LessonScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import VocabScreen from '../screens/VocabScreen';
import PronunciationScreen from '../screens/PronunciationScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';
import TabBar from '../components/TabBar';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<MainTabParamList>();

const TAB_ORDER: (keyof MainTabParamList)[] = ['Home', 'Review', 'Vocab', 'Progress', 'Profile'];
const navRef = createNavigationContainerRef<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home"     component={HomeScreen}     />
      <Tab.Screen name="Review"   component={ReviewScreen}   />
      <Tab.Screen name="Vocab"    component={VocabScreen}    />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen}  />
    </Tab.Navigator>
  );
}

interface Props {
  hasCompletedOnboarding: boolean;
}

export default function AppNavigator({ hasCompletedOnboarding }: Props) {
  const currentTabRef = useRef(0);
  const isOnMainRef   = useRef(true);

  const panResponder = useRef(
    PanResponder.create({
      // Claim the gesture only when horizontal movement clearly dominates
      onMoveShouldSetPanResponder: (_, gs) => {
        if (!isOnMainRef.current) return false;
        return Math.abs(gs.dx) > 18 && Math.abs(gs.dx) > Math.abs(gs.dy) * 2.5;
      },
      onPanResponderRelease: (_, gs) => {
        if (!navRef.isReady() || !isOnMainRef.current) return;
        const idx = currentTabRef.current;
        if (gs.dx < -55 && gs.vx < -0.25) {
          const next = Math.min(idx + 1, TAB_ORDER.length - 1);
          navRef.navigate('Main' as never, { screen: TAB_ORDER[next] } as never);
        } else if (gs.dx > 55 && gs.vx > 0.25) {
          const prev = Math.max(idx - 1, 0);
          navRef.navigate('Main' as never, { screen: TAB_ORDER[prev] } as never);
        }
      },
    })
  ).current;

  const onStateChange = (state: any) => {
    if (!state) return;
    const active = state.routes[state.index];
    isOnMainRef.current = active?.name === 'Main';
    if (active?.state) {
      currentTabRef.current = (active.state as any).index ?? 0;
    }
  };

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <NavigationContainer ref={navRef} onStateChange={onStateChange}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={hasCompletedOnboarding ? 'Main' : 'Onboarding'}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Main"       component={MainTabs}         />
          <Stack.Screen name="Lesson"       component={LessonScreen}         options={{ animation: 'slide_from_right'  }} />
          <Stack.Screen name="Conversation" component={ConversationScreen}   options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="Results"      component={ResultsScreen}        options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="Achievements" component={AchievementsScreen}   options={{ animation: 'slide_from_right'  }} />
          <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="Settings"     component={SettingsScreen}       options={{ animation: 'slide_from_right'  }} />
          <Stack.Screen name="Pronunciation" component={PronunciationScreen} options={{ animation: 'slide_from_right'  }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
