import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; label: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'Home',     label: 'Learn',    icon: 'book-outline',    iconActive: 'book' },
  { name: 'Review',   label: 'Review',   icon: 'sync-outline',    iconActive: 'sync' },
  { name: 'Vocab',    label: 'Vocab',    icon: 'library-outline', iconActive: 'library' },
  { name: 'Progress', label: 'Progress', icon: 'trophy-outline',  iconActive: 'trophy' },
  { name: 'Profile',  label: 'Profile',  icon: 'person-outline',  iconActive: 'person' },
];

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const tab = TABS.find((t) => t.name === route.name);
        if (!tab) return null;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.pill, focused && styles.pillActive]}>
              <Ionicons
                name={focused ? tab.iconActive : tab.icon}
                size={22}
                color={focused ? '#4F46E5' : '#9CA3AF'}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  pillActive: {
    backgroundColor: '#EEF2FF',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
