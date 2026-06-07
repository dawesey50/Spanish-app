import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import type { RootStackParamList, MainTabParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import LessonScreen from '../screens/LessonScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import VocabScreen from '../screens/VocabScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS = {
  Home: {
    active: require('../../assets/tabs/learning_active.png'),
    inactive: require('../../assets/tabs/learning_inactive.png'),
  },
  Review: {
    active: require('../../assets/tabs/review_active.png'),
    inactive: require('../../assets/tabs/review_inactive.png'),
  },
  Vocab: {
    active: require('../../assets/icons/blue_icon_book.png'),
    inactive: require('../../assets/icons/blue_icon_book.png'),
  },
  Progress: {
    active: require('../../assets/tabs/progress_active.png'),
    inactive: require('../../assets/tabs/progress_inactive.png'),
  },
  Settings: {
    active: require('../../assets/tabs/settings_active.png'),
    inactive: require('../../assets/tabs/settings_inacitve.png'),
  },
} as const;

function TabIcon({ name, focused }: { name: keyof typeof TAB_ICONS; focused: boolean }) {
  return (
    <Image
      source={TAB_ICONS[name][focused ? 'active' : 'inactive']}
      style={{ width: 24, height: 24, opacity: focused ? 1 : 0.65 }}
      resizeMode="contain"
    />
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          tabBarLabel: 'Review',
          tabBarIcon: ({ focused }) => <TabIcon name="Review" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Vocab"
        component={VocabScreen}
        options={{
          tabBarLabel: 'Vocab',
          tabBarIcon: ({ focused }) => <TabIcon name="Vocab" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ focused }) => <TabIcon name="Progress" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

interface Props {
  hasCompletedOnboarding: boolean;
}

export default function AppNavigator({ hasCompletedOnboarding }: Props) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={hasCompletedOnboarding ? 'Main' : 'Onboarding'}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Lesson"
          component={LessonScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="Achievements"
          component={AchievementsScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
