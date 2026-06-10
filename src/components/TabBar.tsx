import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';

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
  const { c } = useTheme();
  const styles = useThemedStyles(createStyles);
  const scales = useRef(state.routes.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    // Pop the newly focused icon: 1 → 1.25 → 1 with a spring
    const anim = scales[state.index];
    if (!anim) return;
    anim.setValue(1);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true }),
    ]).start();
  }, [state.index]);

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
              <Animated.View style={{ transform: [{ scale: scales[index] }] }}>
                <Ionicons
                  name={focused ? tab.iconActive : tab.icon}
                  size={22}
                  color={focused ? c.indigo : c.textMuted}
                />
              </Animated.View>
              <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: c.card,
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
    backgroundColor: c.indigoSoft,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: c.textMuted,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: c.indigo,
    fontWeight: '700',
  },
});
